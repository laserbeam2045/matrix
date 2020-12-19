<?php

header("Access-Control-Allow-Origin: *");

// ファイルのパス
$filepath = 'model_weights_bin';
 
// リネーム後のファイル名
$filename = 'model.weights.bin';
 
header('Content-Type: application/force-download');
header('Content-Length: ' . filesize($filepath));
header('Content-Disposition: attachment; filename="' . $filename . '"');
 
// ファイルを読み込みダウンロードを実行
readfile($filepath);
