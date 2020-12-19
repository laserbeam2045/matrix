<?php

include('../../db.php');
include('../../functions.php');

// 指定されたidのタグが包含する(自身を含む)、全てのタグのidをカンマ区切り文字列として取得するSQL
$getTagIdsSQL = "
    SELECT GROUP_CONCAT(id) AS ids
      FROM `quizzes_tags`
     WHERE lft BETWEEN (SELECT lft FROM `quizzes_tags` WHERE id = ?)
                   AND (SELECT rgt FROM `quizzes_tags` WHERE id = ?)
FOR UPDATE;
";

// 包含される複数のタグと関連性を持つ、関係テーブルのレコードを削除するSQL
$deleteRelationsSQL = "
  DELETE
    FROM `quizzes_quizzes_tags_relations`
   WHERE quiz_tag_id %s;
";

// 包含される複数のタグを削除するSQL
$deleteTagsSQL = "
  DELETE
    FROM `quizzes_tags`
   WHERE id %s;
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $postData = getPostData();
  $tagId = $postData['quiz_tag_id'];

  // トランザクション処理を開始
  $dbh->beginTransaction();
  try {
    // 包含される全てのタグのidを取得する
    $stmt_1 = $dbh->prepare($getTagIdsSQL);
    $stmt_1->execute([$tagId, $tagId]);

    $result = $stmt_1->fetchAll(PDO::FETCH_ASSOC);
    $tagIds = csv2Array($result[0]['ids']);
    $inClause = getInClause($tagIds);

    // quizzes_quizzes_tags_relationsテーブルのレコードを削除
    $stmt_2 = $dbh->prepare(sprintf($deleteRelationsSQL, $inClause));
    $stmt_2->execute($tagIds);

    // quizzes_tagsテーブルのレコードを削除
    $stmt_3 = $dbh->prepare(sprintf($deleteTagsSQL, $inClause));
    $stmt_3->execute($tagIds);

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