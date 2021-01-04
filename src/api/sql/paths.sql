-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 
-- サーバのバージョン： 10.1.37-MariaDB
-- PHP Version: 7.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `problems`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `paths`
--

CREATE TABLE `paths` (
  `id` int(11) NOT NULL,
  `path` varchar(50) COLLATE utf8_bin NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- テーブルのデータのダンプ `paths`
--

INSERT INTO `paths` (`id`, `path`, `created_at`, `updated_at`) VALUES
(1, 'avalon/', '2020-11-30 16:37:44', '2020-12-21 11:34:25'),
(2, 'avalon/combo/', '2020-11-30 16:38:28', '2020-12-21 11:34:25'),
(3, 'quiz/correct/', '2020-11-30 16:39:45', '2020-12-21 11:34:25'),
(4, 'quiz/countdown/', '2020-11-30 16:39:45', '2020-12-21 11:34:25'),
(5, 'quiz/question/', '2020-11-30 16:40:12', '2020-12-21 11:34:25'),
(6, 'quiz/wrong/', '2020-11-30 16:40:12', '2020-12-21 11:34:25'),
(7, 'etc/', '2020-11-30 16:41:42', '2020-12-21 11:34:25'),
(8, 'etc/cyber/', '2020-11-30 16:41:42', '2020-12-21 11:34:25'),
(9, 'etc/decision/', '2020-11-30 16:41:42', '2020-12-21 11:34:25'),
(10, 'voice/a/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(11, 'voice/b/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(12, 'voice/c/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(13, 'voice/d/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(14, 'voice/e/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(15, 'voice/f/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(16, 'voice/g/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(17, 'voice/h/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(18, 'voice/i/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(19, 'voice/j/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(20, 'voice/k/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(21, 'voice/l/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(22, 'voice/m/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(23, 'voice/n/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(24, 'voice/o/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(25, 'voice/p/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(26, 'voice/q/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(27, 'voice/r/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(28, 'voice/s/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(29, 'voice/t/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(30, 'voice/u/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(31, 'voice/v/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(32, 'voice/w/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(33, 'voice/x/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(34, 'voice/y/', '2020-11-30 16:48:39', '2020-12-21 11:34:25'),
(35, 'voice/z/', '2020-11-30 16:48:39', '2020-12-21 11:34:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `paths`
--
ALTER TABLE `paths`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `paths`
--
ALTER TABLE `paths`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
