<?php

include('../../db.php');
include('../../functions.php');

$sql = "
  INSERT INTO `quizzes_quizzes_tags_relations`
  ( quiz_id,  quiz_tag_id) VALUES
  (:quiz_id, :quiz_tag_id)
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);
  $postData = getPostData();

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->bindParam(':quiz_id',     $postData['quiz_id']);
    $stmt->bindParam(':quiz_tag_id', $postData['quiz_tag_id']);
    $stmt->execute();
    // コミット
    $dbh->commit();

  } catch(PDOException $e) {
    // ロールバック
    $dbh->rollback();
    throw $e;
  }
} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;