<?php

set_time_limit(300);
ini_set('memory_limit', '4048M');
mb_internal_encoding("UTF-8");
echo mb_internal_encoding();

function uOrd($char)
{
    return unpack('N', mb_convert_encoding($char, 'UCS-4BE', 'UTF-8'))[1];
}

try {
	$pdo = new PDO();
	$pdo->query("SET NAMES utf8;");

	$sql = "
		SELECT label, image FROM images
		WHERE checked = 1
	";
	$stmt = $pdo->prepare($sql);
	$stmt->execute();
	$rows = $stmt->fetchAll();
	shuffle($rows);

	$all_pixels = array();
	$labels = array();
	$tmp_images = array();
	$stack_limit = 40 * 40 * 3 * 1500;

	foreach ($rows as $idx => $row) {
		// 画素データを配列として取得する
		$imagick = new Imagick();
		$imagick->readImageBlob($row["image"]);
		$pixels = $imagick->exportImagePixels(0, 0, 40, 40, "RGB", Imagick::PIXEL_CHAR);
		$imagick->clear();
		foreach ($pixels as $pixel) {
			$all_pixels[] = $pixel;
		}
		// 1000枚ごとに画像化する
		if ($stack_limit <= count($all_pixels) || $idx == (count($rows) - 1)) {
			$tmp_image = new Imagick();
			$tmp_image->addImage(create_image($all_pixels));
			$tmp_path = "train_data/tmp/tmp-" . (string)count($tmp_images) . ".png";
			$tmp_images[] = $tmp_path;
			save_image($tmp_image, $tmp_path);
			$tmp_image->clear();

			$all_pixels = null;
			$all_pixels = array();
		}

		// 教師ラベルの配列を作る（1 hot vector）
		$label = $row["label"];
		$ord = uOrd($label);
		/*
		if (65 <= $ord && $ord <= 90 || 97 <= $ord && $ord <= 122) {
			true;
		} else {
			print($ord);
			print("<br>");
		}
		*/
		if ($ord == 39)       $ord = 52;	// ' (シングルクオート)
		else if ($ord == 45)  $ord = 53;	// - (ハイフン
		else if ($ord == 46)  $ord = 54;	// . (ピリオド)
		else if ($ord == 47)  $ord = 55;	// / (スラッシュ)
		else if ($ord == 124) $ord = 56;	// | (パイプ)
		else if ($ord == 880) $ord = 57;	// Ͱ (ヘータ)
		else if ($ord == 915) $ord = 58;	// Γ (ガンマ)
		else if ($ord == 923) $ord = 59;	// Λ (ラムダ)
		else if ($ord == 947) $ord = 60;	// γ (ガンマ)
		else if ($ord <= 90)  $ord -= 65;	// アルファベット(大文字)
		else if ($ord <= 122) $ord -= 71;	// アルファベット(小文字)
		for ($i = 0; $i < 61; $i++) {
			$labels[] = ($i == $ord) ? pack("C", 1) : pack("C", 0);
		}
	}

	// 教師データ（ラベル）
	file_put_contents("train_data/labels_uint8_bin", $labels);
	$labels = null;

	sleep(3);
	// 全ての画像を繋げて一枚の画像を生成する
	$image = new Imagick();
	foreach ($tmp_images as $path) {
		$im = new Imagick($path);
		$image->addImage($im);
	}
	save_image($image, "train_data/train.png");
	$image->clear();

	print("finish!");

} catch (PDOException $e) {
	exit($e->getMessage());
}



function create_image($imageData) {
	$im = new Imagick();
	$width = 40 * 40;
	$height = count($imageData) / (40 * 40 * 3);
	$im->newImage($width, $height, 'gray');
	$im->importImagePixels(0, 0, $width, $height, "RGB", Imagick::PIXEL_CHAR, $imageData);
	$im->setImageFormat('png');
	return $im;
}


function save_image($image, $path) {
	$image->setImageIndex(0);
	$image = $image->appendImages(true);
	$image->setImageFormat('png');
	$image->writeImage($path);
}