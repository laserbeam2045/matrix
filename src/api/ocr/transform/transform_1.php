<?php

try {
  $pdo = new PDO(
    "mysql:host=mysql101.phy.lolipop.lan;dbname=LAA0723421-database;",
    "LAA0723421",
    "hide2631"
  );
  $pdo->query("SET NAMES utf8;");

  $sql = "
    SELECT id FROM `images`
    WHERE transformed = 0
    LIMIT 1000
  ";
  $stmt = $pdo->prepare($sql);

  // トランザクション開始
  $pdo->beginTransaction();
  try {
    $stmt->execute();

    $result = $stmt->fetchAll();
    $array = Array();
    echo "[";
    foreach ($result as $loop) {
      $array[] = $loop["id"];
    }
    echo join(",", $array);
    echo "]";

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
