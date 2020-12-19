
/* 入れ子集合モデル */

/* 必要な操作
1: データ取得（親が誰であるか）
2: データ挿入（親としてOR子として）
3: データ移動（子孫ごと子として）
4: データ削除（子孫ごと）
*/

# 2020/11/18
# レンタルサーバーで権限の問題でFUNCTIONが作成できない
# そのため全てのFUNCTIONをPROCEDUREに書き直す。


# ルートを求めるSQL
SELECT *
  FROM `quizzes_tags` Root
 WHERE NOT EXISTS (
         SELECT *
           FROM `quizzes_tags` Nodes
          WHERE Root.lft > Nodes.lft
            AND Root.lft < Nodes.rgt
       );



# リーフを求めるSQL
SELECT *
  FROM `quizzes_tags` Parents
 WHERE NOT EXISTS (
         SELECT *
           FROM `quizzes_tags` Children
          WHERE Children.lft > Parents.lft
            AND Children.lft < Parents.rgt
       );



# ノードの深さを計算するSQL
  SELECT Children.label, COUNT(Parents.id) AS level
    FROM `quizzes_tags` Parents, `quizzes_tags` Children
   WHERE Children.lft BETWEEN Parents.lft AND Parents.rgt
GROUP BY Children.id;



# 木の高さを計算するSQL
SELECT MAX(level) AS height
  FROM (
    SELECT Children.label, COUNT(Parents.id) AS level
      FROM `quizzes_tags` Parents, `quizzes_tags` Children
     WHERE Children.lft BETWEEN Parents.lft AND Parents.rgt
  GROUP BY Children.id
  ) TMP;



# 特定の集合の子孫要素のidを取得するビューを作成するSQL(自身を含む)
  DROP VIEW IF EXISTS progeny_ids;
CREATE VIEW progeny_ids AS
  SELECT id FROM `quizzes_tags`
   WHERE lft BETWEEN (SELECT lft FROM `quizzes_tags` WHERE id = ?)
                 AND (SELECT rgt FROM `quizzes_tags` WHERE id = ?);



# 特定の集合の子孫要素のidを取得するビューを作成するSQL(自身を含まない)
  DROP VIEW IF EXISTS progeny_ids;
CREATE VIEW progeny_ids AS
  SELECT id FROM `quizzes_tags`
   WHERE lft > (SELECT lft FROM `quizzes_tags` WHERE id = ?)
     AND lft < (SELECT rgt FROM `quizzes_tags` WHERE id = ?);



# 親のid、子の数も含めて取得するSELECT句
SELECT Tag.id,
       Tag.label,
       Parent.id AS parentId,
       COUNT(Children.id) AS childrenCnt,
       Tag.lft
  FROM `quizzes_tags` Tag
       LEFT OUTER JOIN `quizzes_tags` Parent
         ON Parent.lft = (SELECT MAX(lft)
                            FROM `quizzes_tags`
                           WHERE Tag.lft > lft
                             AND Tag.lft < rgt)
       LEFT OUTER JOIN `quizzes_tags` Children
         ON Tag.lft = (SELECT MAX(lft)
                         FROM `quizzes_tags`
                        WHERE Children.lft > lft
                          AND Children.lft < rgt)
 GROUP BY id
 ORDER BY lft;



# 指定した親集合の直下に存在する、子集合の数を返すストアドファンクション
# 第1引数(入力)：pID：検索対象の親集合のid
# 戻り値：子集合の数(存在しなければ0)
DELIMITER //
  DROP PROCEDURE IF EXISTS get_children_count//
CREATE PROCEDURE get_children_count (IN pID INT, OUT cnt INT)
BEGIN
  SELECT COUNT(Children.id)
    INTO cnt
    FROM `quizzes_tags` Parent
    LEFT OUTER JOIN `quizzes_tags` Children
      ON Parent.lft = (
           SELECT MAX(lft)
             FROM `quizzes_tags`
            WHERE Children.lft > lft
              AND Children.lft < rgt
         )
   WHERE Parent.id = pID;
END//
DELIMITER ;



# 指定した親集合の、直下かつ指定位置の子集合の、lftとrgtを取得するストアドプロシージャ
# MEMO: 出力変数をL,Rとしているのは、同名カラムとの混同を避けるため
# 第1引数(入力)：pID：親集合のid
# 第2引数(入力)：idx：親集合の中で、何番目の子集合か(0-origin)
# 第3引数(出力)：L  ：対象となる集合のlft(該当する集合が存在しない場合はNULL)
# 第4引数(出力)：R  ：対象となる集合のrgt(該当する集合が存在しない場合はNULL)
DELIMITER //
  DROP PROCEDURE IF EXISTS get_child_place//
CREATE PROCEDURE get_child_place (IN pID INT, IN idx INT, OUT L DOUBLE, OUT R DOUBLE)
BEGIN
  SELECT Child.lft, Child.rgt
    INTO L, R
    FROM `quizzes_tags` Parent
    LEFT OUTER JOIN `quizzes_tags` Child
      ON Parent.lft = (
           SELECT MAX(lft)
             FROM `quizzes_tags`
            WHERE Child.lft > lft
              AND Child.lft < rgt
         )
   WHERE Parent.id = pID
ORDER BY Child.lft
   LIMIT idx, 1;
END//
DELIMITER ;



# 親集合と位置を指定し、挿入できる空間を求めるストアドプロシージャ
# MEMO: 出力変数をL,Rとしているのは、同名カラムとの混同を避けるため
# 第1引数(入力)：pID：親集合のid
# 第2引数(入力)：idx：親集合の中の、何番目に挿入するか(0-origin。負の値を指定した場合は末尾に追加)
# 第4引数(出力)：L  ：対象となる集合のlft(該当する集合が存在しない場合はNULL)
# 第5引数(出力)：R  ：対象となる集合のrgt(該当する集合が存在しない場合はNULL)
DELIMITER //
  DROP PROCEDURE IF EXISTS get_space//
CREATE PROCEDURE get_space (IN pID INT, IN idx INT, OUT L DOUBLE, OUT R DOUBLE)
BEGIN
  DECLARE ____ DOUBLE;   # 使用しない値用の変数
  DECLARE tmpL DOUBLE;
  DECLARE tmpR DOUBLE;
  DECLARE childrenCnt INT;

  # 指定された親集合の中に存在する、子集合の数を取得する
  CALL get_children_count(pID, childrenCnt);

  # 指定されたidxが、負の数であるか、または、
  # 子集合の数を上回るときは、子集合の数で置き換える
  IF idx < 0 OR childrenCnt < idx THEN
    SET idx = childrenCnt;
  END IF;

  # 指定位置の左の集合のrgtと、指定位置の集合のlftを取得する
  CALL get_child_place(pID, idx - 1, ____, tmpL);
  CALL get_child_place(pID, idx,     tmpR, ____);

  # 指定位置の左に集合が存在しない場合は、親のlftを代入する
  IF tmpL IS NULL THEN
    SELECT lft INTO tmpL FROM `quizzes_tags` WHERE id = pID;
  END IF;

  # 指定位置に集合が存在しない場合は、親のrgtを代入する
  IF tmpR IS NULL THEN
    SELECT rgt INTO tmpR FROM `quizzes_tags` WHERE id = pID;
  END IF;

  # 挿入可能な座標を算出する
  SET L = (tmpL * 2 + tmpR) / 3;
  SET R = (tmpL + tmpR * 2) / 3;
END//
DELIMITER ;



# 集合(id=outsideId)の中に存在する、集合(id=insideID)の数を返すストアドファンクション
# (引数のidが等しいときもカウントされる)
# 第1引数：outsideID => 外側にあたる集合のid
# 第2引数： insideID => 内側にあたる集合のid
# 戻り値：0以上の整数
DELIMITER //
  DROP PROCEDURE IF EXISTS get_include_count//
CREATE PROCEDURE get_include_count (IN outsideID INT, IN insideID INT, OUT includeCount INT)
BEGIN
  SELECT COUNT(*)
    INTO includeCount
    FROM `quizzes_tags` Inside
   WHERE Inside.id = insideID
     AND Inside.lft >= (SELECT lft FROM `quizzes_tags` WHERE id = outsideID)
     AND Inside.rgt <= (SELECT rgt FROM `quizzes_tags` WHERE id = outsideID);
END//
DELIMITER ;



# 集合(id=cID)を、集合(id=pID)の中の、idx(+1)番目に移動させるストアドファンクション
# 第1引数: cID => 移動させる集合のid
# 第2引数: pID => 移動先となる集合のid
# 第3引数: idx => 移動先での位置(0-origin。負の値を指定した場合は末尾に追加)
# 戻り値: 0(=成功)または1(=失敗)
DELIMITER //
  DROP PROCEDURE IF EXISTS move_set//
CREATE PROCEDURE move_set (IN cID INT, IN pID INT, IN idx INT)
BEGIN
  DECLARE includeCount INT DEFAULT 0;

  CALL get_include_count(cID, pID, includeCount);
  # 集合(id=cID)の中に、集合(id=pID)が存在しない場合のみ更新する
  IF 0 = includeCount THEN
    # 挿入可能な位置を取得する
    CALL get_space(pID, idx, @L, @R);
    # 更新処理を実行
    UPDATE `quizzes_tags`
       SET lft = @L,
           rgt = @R
     WHERE id = cID;
  END IF;
END//
DELIMITER ;



# 親と位置を指定し、集合(子孫を含む)を移動させるストアドファンクション
# 第1引数: cID => 移動させる集合のid
# 第2引数: pID => 移動先となる集合のid
# 第3引数: idx => 移動先での位置(0-origin。負の値を指定した場合は末尾に追加)
# 戻り値: 0(=成功)または1(=失敗)
DELIMITER //
  DROP PROCEDURE IF EXISTS move_sets//
CREATE PROCEDURE move_sets (IN cID INT, IN pID INT, IN idx INT)
BEGIN
  DECLARE done   INT DEFAULT FALSE;
  # ただの代入の数合わせ用の変数(lftはORDER BY句に必要なだけ)
  DECLARE _ DOUBLE;
  # 集合(=cID)の子孫要素(自身は含まない)のidと親のidを取得するカーソル
  DECLARE cur CURSOR FOR (
    SELECT Parent.id AS pID,
           Children.id AS cID,
           Children.lft
      FROM `quizzes_tags` Children
      LEFT OUTER JOIN `quizzes_tags` Parent
        ON Parent.lft = (
             SELECT MAX(lft)
               FROM `quizzes_tags`
              WHERE Children.lft > lft
                AND Children.lft < rgt
           )
     WHERE Children.lft > (SELECT lft FROM `quizzes_tags` WHERE id = cID)
       AND Children.lft < (SELECT rgt FROM `quizzes_tags` WHERE id = cID)
  ORDER BY Children.lft
  );
  # 行が見つからなかった場合のハンドラ宣言
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  # SQLの結果が変わらないように、集合の移動前にカーソルを開く必要がある
  OPEN cur;

  # 最初に指定要素だけ移動させる
  CALL move_set(cID, pID, idx);

  # ループ処理を開始
  read_loop: LOOP
    FETCH cur INTO pID, cID, _;
    IF done THEN
      LEAVE read_loop;
    END IF;
    # 子孫要素を逐次移動させる
    CALL move_set(cID, pID, -1);
  END LOOP;

  # カーソルありがとう
  CLOSE cur;
END//
DELIMITER ;