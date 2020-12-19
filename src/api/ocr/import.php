<?php

if (!is_uploaded_file($_FILES["image"]["tmp_name"])) die();

try {
  $pdo = new PDO(
    "mysql:host=mysql101.phy.lolipop.lan;dbname=LAA0723421-database;",
    "LAA0723421",
    "hide2631"
  );
  $pdo->query("SET NAMES utf8;");

  $sql = "
    INSERT INTO `images`
    (label, image, before_size, after_size, brush_width) VALUES
    (:label, :image, :before_size, :after_size, :brush_width)
  ";
  $images_stmt = $pdo->prepare($sql);

  // トランザクション開始
  $pdo->beginTransaction();
  try {
    $fp = fopen($_FILES["image"]["tmp_name"], "rb");
    $images_stmt->bindParam(":label", $_POST["label"]);
    $images_stmt->bindParam(":image", $fp, PDO::PARAM_LOB);
    $images_stmt->bindParam(":before_size", $_POST["before_size"], PDO::PARAM_INT);
    $images_stmt->bindParam(":after_size", $_POST["after_size"], PDO::PARAM_INT);
    $images_stmt->bindParam(":brush_width", $_POST["brush_width"]);
    $images_stmt->execute();
    fclose($fp);

    // トランザクション完了
    $pdo->commit();
  } catch (Exeption $e) {
    // トランザクション取り消し
    $pdo->rollBack();
    throw $e;
  }

} catch (PDOException $e) {
  exit($e->getMessage());
}
