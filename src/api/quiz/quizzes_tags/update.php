<?php

include('../../db.php');
include('../../functions.php');

$sql = "
  UPDATE `quizzes_tags`
     SET label = :label
   WHERE id = :id
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);
  $postData = getPostData();

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->bindParam(':label', $postData['label']);
    $stmt->bindParam(':id',    $postData['id']);
    $stmt->execute();
    $dbh->commit();
  } catch(PDOException $e) {
    $dbh->rollback();
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;