<?php

try {
  $pdo = new PDO();
  $pdo->query("SET NAMES utf8;");


  // ラベルのリストを取得
  $sql = "
    SELECT label FROM images
    GROUP BY label
  ";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $labels = $stmt->fetchAll();

  // 線の太さのリストを取得
  $sql = "
    SELECT brush_width FROM images
    GROUP BY brush_width
  ";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $brush_widths = $stmt->fetchAll();


  echo <<<EOF
<link rel='stylesheet' href='style.css'>
<form method='POST' name='edit'>
  <fieldset>
    <legend>label</legend>
EOF;

  // ラベルコントロールの出力
  foreach ($labels as $data) {
    $label = htmlspecialchars($data["label"], ENT_QUOTES, 'UTF-8');
    if ($_POST["label"] && in_array($data["label"], $_POST["label"])) {
      $checked = "checked";
    } else {
      $checked = "";
    }
    echo "<label><input type='checkbox' name='label[]' value='{$label}' {$checked}>{$label}</label>";
    if ($data['label'] == "'" || $label == "Z") echo "<br>";
  }
  $checked = $_POST["allCheck"] && $_POST["allCheck"] === "label" ? "checked" : "";

  echo <<<EOF
    <label><input type='checkbox' name='allCheck' value='label' {$checked}>全てチェック</label>
  </fieldset><br>
  <fieldset>
    <legend>brush_width</legend>
EOF;

  // 線の太さコントロールの出力
  foreach ($brush_widths as $data) {
    $brush_width = $data["brush_width"];
    if ($_POST["brush_width"] && in_array($brush_width, $_POST["brush_width"])) {
      $checked = "checked";
    } else {
      $checked = "";
    }
    echo "<label><input type='checkbox' name='brush_width[]' value='{$brush_width}' {$checked}>{$brush_width}</label>";
  }

  $checked1 = $_POST["checked"] && in_array("0", $_POST["checked"]) ? "checked" : "";
  $checked2 = $_POST["checked"] && in_array("1", $_POST["checked"]) ? "checked" : "";

  echo <<<EOF
  </fieldset>
  <fieldset>
    <legend>checked</legend>
    <label><input type="checkbox" name="checked[]" value="0" {$checked1}>未確認</label>
    <label><input type="checkbox" name="checked[]" value="1" {$checked2}>確認済み</label>
  </fieldset>
  <label id='limit'>limit: <input type='text' name='limit' value='30'></label>
  <button type='submit' name='search'>Search</button>
  <button type='submit' name='test'>Dump</button>
EOF;

  echo "<pre>";
  //var_dump($_POST);
  echo "</pre>";

  // checkedフラグ変更の指定があった場合
  if ($_POST["changeChecked"]) {
    $ids = $_POST["changeChecked"];
    $sql = "
      UPDATE images
      set checked = if(checked=1,0,1)
      WHERE id IN ({$ids})
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
  }


  // ラベル変更の指定があった場合
  if ($_POST["change"]) {
    $sql = "
      UPDATE images
      SET label = :newLabel
      WHERE id = :id
      AND label = :label
    ";
    $stmt = $pdo->prepare($sql);
    foreach ($_POST["change"] as $id => $thing) {
      foreach ($thing as $label => $newLabel) {
        if ($newLabel === "") continue;
        //if ($label === "'") $label = "\'";
        //if ($newLabel === "'") $newLabel = "\'";
        $stmt->bindParam(":newLabel", $newLabel);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":label", $label);
        $stmt->execute();
      }
    }
  }


  // 削除の指定があった場合
  if ($_POST["remove"]) {
    $stmt_delete = $pdo->prepare("
      DELETE FROM images
      WHERE id = :id
    ");
 
    foreach ($_POST["remove"] as $id) {
      $stmt_delete->bindParam(":id", $id);
      $stmt_delete->execute();
    }
  }


  // ラベルの指定があった場合
  if ($_POST["label"]) {
    $brush_widths = implode(",", $_POST["brush_width"]);
    $checked_flag = implode(",", $_POST["checked"]);
    $sql = "
      SELECT id, checked
      FROM images
      WHERE label = (:label)
      AND brush_width IN ({$brush_widths})
      AND checked IN ({$checked_flag})
      LIMIT 0, {$_POST['limit']}
    ";
    $stmt = $pdo->prepare($sql);
    $file_num_all = 0;
    $file_elements = "";

    // 指定されたラベルの種類だけ繰り返し
    foreach ($_POST["label"] as $label) {
      $stmt->bindParam(':label', $label);
      $stmt->execute();
      $files = $stmt->fetchAll();
      $file_num = count($files);
      $file_num_all += $file_num;
      $file_elements .= <<<EOD
\n<div class="files">
  <table>
    <tr>
      <th>ラベル</th><th>:</th><td>{$label}</td>
    </tr>
    <tr>
      <th>一致件数</th><th>:</th><td>{$file_num}</td>
    </tr>
  </table>
EOD;
      if ($file_num) {
        $file_elements .= "\n  <label style='margin-bottom:10px;'><input type='checkbox' name='allCheck'>全て確認済みにする</label><br>";
      }
      // 取得されたファイルの数だけ繰り返し
      foreach ($files as $idx => $file) {
        $id = $file["id"];
        $checked = $file["checked"] === "1" ? "checked" : "";
        $file_elements .= <<<EOD

  <div class="file">
    <div><img src='image?id={$id}'></div>
    <label><input type='checkbox' name='remove[]' value='{$id}'>削除</label><br>
    <label class="checked"><input type='checkbox' value='{$id}' data-checked='{$checked}' {$checked}>確認済み</label><br>
    <label class="change"><input type="text" name="change[{$id}][{$label}]">ラベル変更</label>
  </div>
EOD;
        //if (!(($idx + 1) % 10)) $file_elements .= "<br>";
      }
      $file_elements .= "</div>";
    }
    echo "<p>{$file_num_all}件のファイルが取得されました。</p>".$file_elements;
  }
  echo "</form>";

  echo <<<EOD
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="ui.js"></script>
EOD;

} catch (PDOException $e) {
  exit($e->getMessage());
}
