<?php

include('../../db.php');
include('../../functions.php');

$sql = "
  UPDATE `quizzes`
     SET question = :question,
         answer1  = :answer1,
         answer2  = :answer2
   WHERE id = :id
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);
  $postData = getPostData();

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->bindParam(':question', $postData['question']);
    $stmt->bindParam(':answer1',  $postData['answer1']);
    $stmt->bindParam(':answer2',  $postData['answer2']);
    $stmt->bindParam(':id',       $postData['quiz_id']);
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