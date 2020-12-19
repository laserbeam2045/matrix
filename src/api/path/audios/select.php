<?php

include('../../db.php');
include('../../functions.php');

$sql = "
    SELECT Paths.path,
           Audios.file_name AS fileName,
           Audios.extension,
           Audios.volume,
           Audios.label
      FROM `audios` Audios
 LEFT JOIN `paths` Paths
        ON Audios.path_id = Paths.id
     WHERE %s
";

try {
  $dbh = getPDO(DSN, USERNAME, PASSWORD, PDO_OPTION);

  $labels = isset($_GET['audioLabels']) ? explode(',', $_GET['audioLabels']) : NULL;

  $inClause = 'label' . getInClause($labels);

  $_sql = sprintf($sql, $inClause);
  $stmt = $dbh->prepare($_sql);
  $stmt->execute($labels);

  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($result);

} catch(PDOException $e) {
  echo $e->getMessage();
}

$dbh = null;