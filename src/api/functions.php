<?php

// PDOを作成する関数
function getPDO($dsn, $usr, $pas, $option) {
  $pdo = new PDO($dsn, $usr, $pas, $option);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->query("SET NAMES utf8;");
  return $pdo;
}

// Int型に変換するだけの関数
function str2Int($str) {
  return (int)$str;
}

// 不要なキーを削除する関数
function filtering(&$arr) {
  foreach($arr as &$node) {
    unset($node['lft']);
    unset($node['parentId']);
    unset($node['childrenCnt']);
  }
}

// csv文字列を配列として取得する関数
function csv2Array($data, $prop = null) {
  if (is_string($data))
    return explode(',', $data);
  else
  if (is_array($data) && isset($data[$prop]))
    return explode(',', $data[$prop]);
}

// SQLのIN句を生成する関数
function getInClause($data) {
  if (is_array($data))
    return ' IN (' . substr(str_repeat(',?', count($data)), 1) . ')';
  else
    return ' IN (' . $data . ')';
}

// SQLを実行してデータを取得する関数
function getData($stmt, $params = null) {
  if (is_null($params)) {
    $stmt->execute();
  } else {
    $stmt->execute($params);
  }
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// SQLで取得されたデータを木構造に起こす関数
function assemble(&$parentNode, &$arr, $idx = 1) {
  if (array_key_exists('children', $parentNode)) {
    return;
  }
  $parentNode['children'] = [];

  while (count($parentNode['children']) < $parentNode['childrenCnt']) {
    $node =& $arr[$idx];

    if ($node['parentId'] === $parentNode['id']) {
      $parentNode['children'][] =& $node;
    }
    $idx++;
    assemble($node, $arr, $idx);
  }
}