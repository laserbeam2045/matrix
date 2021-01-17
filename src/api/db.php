<?php

define('TEST_MODE', true);

if (TEST_MODE):
  define('DSN', 'mysql:dbname=Matrix;host=localhost');
  define('USERNAME', 'root');
  define('PASSWORD', '');
  define('PDO_OPTION', [
    // エラー発生時に例外を投げる
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    // エミュレートモードをOFFにする(数値型を文字列型にさせないため)
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
endif;