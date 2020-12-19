<?php

include('../../db.php');
include('../../functions.php');

$sql = "
  INSERT INTO `quizzes`
  ( question,  answer1,  answer2) VALUES
  (:question, :answer1, :answer2)
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
    $stmt->execute();
    // コミット
    $dbh->commit();

  } catch(PDOException $e) {
    // ロールバック
    $dbh->rollback();
    throw $e;
  }
} catch (PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;