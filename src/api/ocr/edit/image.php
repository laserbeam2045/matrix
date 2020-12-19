<?php

try {
	$pdo = new PDO(
		"mysql:host=mysql101.phy.lolipop.lan;dbname=LAA0723421-database;",
		"LAA0723421",
		"hide2631"
	);
	$pdo->query("SET NAMES utf8;");

	$sql = "SELECT * FROM images WHERE id = '" . $_GET["id"] . "'";
	$stmt = $pdo->prepare($sql);
	$stmt->execute();
	$image = $stmt->fetchAll();

	if (count($image)) {
		header("Content-Type: image/png");
		echo $image[0]['image'];
	} else {
		die("要求されたファイルは存在しません。");
	}
} catch (PDOException $e) {
	exit($e->getMessage());
}
