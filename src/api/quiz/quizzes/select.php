<?php

include('../../db.php');
include('../../functions.php');

$sql = "
    SELECT Quizzes.id,
           Quizzes.question,
           Quizzes.answer1,
           Quizzes.answer2,
           Quizzes.press_point AS pressPoint,
           GROUP_CONCAT(Relations.quiz_tag_id) AS tagIds
      FROM `quizzes` Quizzes
 LEFT JOIN `quizzes_quizzes_tags_relations` Relations
        ON Quizzes.id = Relations.quiz_id
     WHERE %s
  GROUP BY Quizzes.id
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);

  $queryString = isset($_GET['query_string']) ? $_GET['query_string'] : NULL;
  $quizTagIds  = isset($_GET['quiz_tag_ids']) ? explode(',', $_GET['quiz_tag_ids']) : NULL;

  if ($queryString) {
    $clauseA = '
      (question LIKE ? OR
       answer1  LIKE ? OR
       answer2  LIKE ?)
    ';
    $likeClause = '%' . addcslashes($queryString, '\_%') . '%';
    $likeClauses = [ $likeClause, $likeClause, $likeClause ];
  }
  if ($quizTagIds) {
    $clauseB = 'quiz_tag_id' . getInClause($quizTagIds);
  }

  // 文字列の指定と、タグの指定が、両方あるとき
  if ($queryString && $quizTagIds):
    $sql1 = sprintf($sql, $clauseA.' AND '.$clauseB);
    $stmt = $dbh->prepare($sql1);
    $stmt->execute(array_merge($likeClauses, $quizTagIds));
  // 文字列の指定だけがあるとき
  elseif ($queryString):
    $sql2 = sprintf($sql, $clauseA);
    $stmt = $dbh->prepare($sql2);
    $stmt->execute($likeClauses);
  // タグの指定だけがあるとき
  elseif ($quizTagIds):
    $sql3 = sprintf($sql, $clauseB);
    $stmt = $dbh->prepare($sql3);
    $stmt->execute($quizTagIds);
  // 何の指定もないとき
  else:
    $sql4 = sprintf($sql, '1');
    $stmt = $dbh->prepare($sql4);
    $stmt->execute();
  endif;

  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($result as &$value) {
    if ($value['tagIds'] === NULL)
      $value['tagIds'] = [];
    else
      $value['tagIds'] = array_map('str2Int', explode(',', $value['tagIds']));
  }
  echo json_encode($result);

} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;