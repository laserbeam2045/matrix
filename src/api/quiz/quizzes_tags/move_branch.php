<?php

include('../../db.php');
include('../../functions.php');

$sql = " CALL move_sets(:cID, :pID, :idx); ";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);
  $postData = getPostData();

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    $stmt->bindParam(':cID', $postData['cID']);
    $stmt->bindParam(':pID', $postData['pID']);
    $stmt->bindParam(':idx', $postData['idx']);
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