<?php

if (!is_uploaded_file($_FILES["image"]["tmp_name"])) die();

try {
  $pdo = new PDO();
  $pdo->query("SET NAMES utf8;");

  $sql = "
    UPDATE `images`
    SET image = :image, transformed = 1
    WHERE id = :id
  ";
  $images_stmt = $pdo->prepare($sql);

  // トランザクション開始
  $pdo->beginTransaction();
  try {
    $fp = fopen($_FILES["image"]["tmp_name"], "rb");
    $images_stmt->bindParam(":image", $fp, PDO::PARAM_LOB);
    $images_stmt->bindParam(":id", $_POST["id"]);
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
