<?php

include('../../db.php');
include('../../functions.php');

// 親のid、関連する問題の数を含めて、`quizzes_tags`テーブルのレコードを取得するSELECT句
$sql = "
    SELECT Tags.*, COUNT(Relations.id) AS quizCount
      FROM (
             SELECT Master.id,
                    Master.label,
                    Master.lft,
                    Parent.id AS parentId
               FROM `quizzes_tags` Master
          LEFT JOIN `quizzes_tags` Parent
                 ON Parent.lft = (
                      SELECT MAX(lft)
                        FROM `quizzes_tags`
                       WHERE Master.lft > lft
                         AND Master.lft < rgt
                    )
           GROUP BY Master.id
           ) Tags
 LEFT JOIN `quizzes_quizzes_tags_relations` Relations
        ON Tags.id = Relations.quiz_tag_id
  GROUP BY Tags.id
  ORDER BY Tags.lft
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);
  $stmt = $dbh->prepare($sql);

  $stmt->execute();
  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;