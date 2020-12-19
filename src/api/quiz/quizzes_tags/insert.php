<?php

include('../../db.php');
include('../../functions.php');

$sql = "
  CALL get_space(:pID, -1, @L, @R);

  INSERT INTO `quizzes_tags`
  ( label, lft, rgt) VALUES
  (:label,  @L,  @R);
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);
  $postData = getPostData();

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->bindParam(':pID',   $postData['pID']);
    $stmt->bindParam(':label', $postData['label']);
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