# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: classmysql.engr.oregonstate.edu (MySQL 5.5.5-10.1.22-MariaDB)
# Database: cs340_perkinsn
# Generation Time: 2018-07-18 05:19:40 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# Dump of table users
# ------------------------------------------------------------

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `dt_created`, `dt_updated`)
VALUES
	(58,'Kailee','Crist','kailee.crist@oberbrunnerkutchandlockman.com','0pT5zaP0YLY37pJ','user','2018-07-15 14:59:14','2018-07-15 14:59:14'),
	(59,'Brian','Dibbert','brian.dibbert@lakin-carter.com','krGxyMbrYJgaaUP','user','2018-07-15 14:59:16','2018-07-15 14:59:16'),
	(60,'Adelbert','Heidenreich','adelbert.heidenreich@mertzbergeandbarton.com','cNRbRKEr_gdST09','user','2018-07-15 14:59:17','2018-07-15 14:59:17'),
	(61,'George','Abshire','george.abshire@walshmorissetteandkihn.com','QjLzjsHFBON_suk','user','2018-07-15 14:59:17','2018-07-15 14:59:17'),
	(62,'Jerrold','Rau','jerrold.rau@leuschke-frami.com','s6i8Vf493nxMoQh','user','2018-07-15 14:59:18','2018-07-15 14:59:18'),
	(63,'eafwfeawf','eafwef','blahefafwe@gmail.com','$2b$10$HDzG9qDT1.mSAqlbT.GYierQ7tMrhku4KDL3Vz.ZOgxN/jl1WNEhu','user','2018-07-17 00:19:35','2018-07-17 00:19:35');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table game_platforms
# ------------------------------------------------------------

LOCK TABLES `game_platforms` WRITE;
/*!40000 ALTER TABLE `game_platforms` DISABLE KEYS */;

INSERT INTO `game_platforms` (`id`, `name`, `manufacturer`, `release_date`, `dt_created`, `dt_updated`)
VALUES
	(1,'Switch','Nintendo','2017-03-03','2018-07-15 15:01:07','2018-07-15 15:01:56'),
	(2,'Wii U','Nintendo','2012-11-18','2018-07-15 15:01:13','2018-07-15 15:02:12'),
	(3,'3DS','Nintendo','2011-02-26','2018-07-15 15:05:08','2018-07-15 15:05:29'),
	(4,'PS4','Sony','2013-11-15','2018-07-15 15:09:18','2018-07-15 15:09:35'),
	(5,'Xbox One','Microsoft','2013-11-22','2018-07-17 21:24:24','2018-07-17 21:24:24');

/*!40000 ALTER TABLE `game_platforms` ENABLE KEYS */;
UNLOCK TABLES;

# Dump of table game_titles
# ------------------------------------------------------------

LOCK TABLES `game_titles` WRITE;
/*!40000 ALTER TABLE `game_titles` DISABLE KEYS */;

INSERT INTO `game_titles` (`id`, `name`, `description`, `genre`, `developer`, `producer`, `dt_created`, `dt_updated`)
VALUES
	(1,'The Legend of Zelda: Breath of the Wild','Forget everything you know about The Legend of Zelda games. Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series. Travel across vast fields, through forests, and to mountain peaks as you discover what has become of the kingdom of Hyrule In this stunning Open-Air Adventure. Now on Nintendo Switch, your journey is freer and more open than ever. Take your system anywhere, and adventure as Link any way you like.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.','Action','Nintendo','Nintendo','2018-07-15 14:59:56','2018-07-17 22:13:45'),
	(2,'Stardew Valley','Stardew Valley is an RPG inspired by the Harvest Moon games where you play as the inheritor of an old farm in a small town called Stardew Valley. Leaving the taxing big city life behind, you embark upon a quest to restore the neglected tract through dedication and hard work.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.','RPG','Eric Barone','Chucklefish','2018-07-15 15:00:06','2018-07-17 22:14:32'),
	(3,'Mario Kart 8 Deluxe','Race along walls and upside-down on twisting anti-gravity racetracks! Share highlight videos of your greatest moments with friends via the Mario Kart TV feature and Miiverse. Race and battle with friends locally or connect online to play with random players from around the world. Fan favorite features from past Mario Kart games include gliders, underwater racing, motorbikes, mid-air tricks, and more. Crisp HD graphics and fluid animation offers players the most visually stunning Mario Kart yet!','Racing','Nintendo','Nintendo','2018-07-15 15:00:23','2018-07-17 22:15:42'),
	(4,'Super Smash Bros. 4','Super Smash Bros. 4 features dozens of characters from across Nintendo\'s catalog, along with a few special guests. The basic formula is unchanged since the previous title: up to eight characters, controlled by either human players or the computer, duke it out in arenas based on Nintendo games; the list of available stages on the Wii U largely differs from the 3DS game\'s offerings. As characters take damage, they are sent flying further by attacks, and if they fly -- or fall -- out of the arena, then they\'re out!','Fighting','Nintendo','Nintendo','2018-07-15 15:00:42','2018-07-17 22:16:58'),
	(5,'South Park: The Fractured But Whole','From the creators of South Park, Trey Parker and Matt Stone, comes South Park: The Fractured But Whole, a sequel to 2014\'s award-winning South Park: The Stick of Truth. Players will once again assume the role of the New Kid and join South Park favorites Stan, Kyle, Kenny and Cartman in a new hilarious and outrageous RPG adventure.','RPG','Ubisoft','Ubisoft','2018-07-15 15:09:13','2018-07-17 22:16:20');

/*!40000 ALTER TABLE `game_titles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table game_releases
# ------------------------------------------------------------

LOCK TABLES `game_releases` WRITE;
/*!40000 ALTER TABLE `game_releases` DISABLE KEYS */;

INSERT INTO `game_releases` (`id`, `title_id`, `platform_id`, `rating`, `boxart_url`, `release_date`, `dt_created`, `dt_updated`)
VALUES
	(3,1,1,8.00,'https://www.mobygames.com/images/covers/l/383716-the-legend-of-zelda-breath-of-the-wild-nintendo-switch-front-cover.png','2017-03-03','2018-07-15 15:03:23','2018-07-17 20:35:28'),
	(5,1,2,9.00,'https://www.mobygames.com/images/covers/l/383716-the-legend-of-zelda-breath-of-the-wild-nintendo-switch-front-cover.png','2017-03-03','2018-07-15 15:03:23','2018-07-17 20:35:32'),
	(6,4,2,6.00,'https://www.mobygames.com/images/covers/l/306821-super-smash-bros-for-wii-u-wii-u-front-cover.png','2014-09-13','2018-07-15 15:04:43','2018-07-17 21:22:58'),
	(7,4,3,4.00,'https://www.mobygames.com/images/covers/l/307340-super-smash-bros-for-nintendo-3ds-nintendo-3ds-front-cover.png','2014-09-13','2018-07-15 15:04:43','2018-07-17 21:23:15'),
	(8,5,4,2.00,'https://www.mobygames.com/images/covers/l/432188-south-park-the-fractured-but-whole-playstation-4-front-cover.jpg','2017-10-17','2018-07-15 15:09:49','2018-07-17 21:23:41'),
	(9,5,1,9.99,'https://www.mobygames.com/images/covers/l/432188-south-park-the-fractured-but-whole-playstation-4-front-cover.jpg','2018-04-24','2018-07-15 15:09:49','2018-07-17 21:23:43'),
	(10,2,1,1.00,'https://www.mobygames.com/images/covers/l/372092-stardew-valley-playstation-4-front-cover.jpg','2016-02-26','2018-07-17 21:21:08','2018-07-17 22:17:25'),
	(11,3,1,1.00,'https://www.mobygames.com/images/covers/l/398969-mario-kart-8-deluxe-nintendo-switch-front-cover.png','2017-04-28','2018-07-17 21:22:08','2018-07-17 22:17:41'),
	(12,5,5,9.99,'https://www.mobygames.com/images/covers/l/432188-south-park-the-fractured-but-whole-playstation-4-front-cover.jpg','2018-04-24','2018-07-15 15:09:49','2018-07-17 21:23:43');

/*!40000 ALTER TABLE `game_releases` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table game_copies
# ------------------------------------------------------------

LOCK TABLES `game_copies` WRITE;
/*!40000 ALTER TABLE `game_copies` DISABLE KEYS */;

INSERT INTO `game_copies` (`id`, `status`, `release_id`, `library_tag`, `dt_procured`, `dt_created`, `dt_updated`)
VALUES
	(4,'available',3,'00001','2018-07-01','2018-07-15 15:08:21','2018-07-15 15:14:32'),
	(7,'checked_out',9,'00002','2018-07-01','2018-07-15 15:11:15','2018-07-15 15:14:39'),
	(8,'available',8,'00003','2018-07-01','2018-07-15 15:11:50','2018-07-15 15:14:45');

/*!40000 ALTER TABLE `game_copies` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table game_requests
# ------------------------------------------------------------

LOCK TABLES `game_requests` WRITE;
/*!40000 ALTER TABLE `game_requests` DISABLE KEYS */;

INSERT INTO `game_requests` (`id`, `user_id`, `release_id`, `copy_id`, `dt_requested`, `dt_delivered`, `dt_completed`, `status`, `dt_created`, `dt_updated`)
VALUES
	(2,58,9,7,'2018-07-10 00:00:00','2018-07-15 00:00:00',NULL,'checked_out','2018-07-15 15:14:17','2018-07-15 15:15:46'),
	(3,60,9,NULL,'2018-07-11 00:00:00',NULL,NULL,'pending','2018-07-15 15:14:17','2018-07-15 15:18:21'),
	(4,59,9,7,'2018-07-09 00:00:00','2018-07-10 00:00:00','2018-07-14 00:00:00','completed','2018-07-15 15:14:17','2018-07-15 15:18:18');

/*!40000 ALTER TABLE `game_requests` ENABLE KEYS */;
UNLOCK TABLES;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
