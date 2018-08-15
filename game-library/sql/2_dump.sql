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


# Dump of table game_copies
# ------------------------------------------------------------

LOCK TABLES `game_copies` WRITE;
/*!40000 ALTER TABLE `game_copies` DISABLE KEYS */;

INSERT INTO `game_copies` (`id`, `status`, `release_id`, `library_tag`, `dt_procured`, `dt_created`, `dt_updated`)
VALUES
	(4,'available',3,'00001','2018-07-01','2018-07-15 15:08:21','2018-07-15 15:14:32'),
	(7,'checked_out',9,'00002','2018-07-01','2018-07-15 15:11:15','2018-07-15 15:14:39'),
	(8,'available',8,'00003','2018-07-01','2018-07-15 15:11:50','2018-07-15 15:14:45'),
	(9,'checked_out',3,'00004','2018-06-13','2018-08-13 19:57:08','2018-08-13 21:36:41'),
	(11,'checked_out',3,'00005','2018-08-04','2018-08-13 19:59:10','2018-08-13 21:36:44'),
	(17,'available',7,'00018','2017-06-06','2018-08-13 21:18:33','2018-08-13 21:18:33'),
	(18,'lost',6,'00089','2017-01-11','2018-08-13 21:19:03','2018-08-13 21:36:46'),
	(19,'checked_out',10,'00067','2016-11-24','2018-08-13 21:33:11','2018-08-13 21:37:01'),
	(20,'available',11,'00099','2018-06-06','2018-08-13 21:33:29','2018-08-13 21:33:29'),
	(21,'lost',11,'00098','2018-08-02','2018-08-13 21:33:43','2018-08-13 21:36:47'),
	(22,'checked_out',14,'00044','2018-03-06','2018-08-13 21:33:58','2018-08-13 21:37:03'),
	(23,'available',17,'00022','2018-08-08','2018-08-13 21:34:12','2018-08-13 21:34:12'),
	(24,'checked_out',21,'00033','2010-02-09','2018-08-13 21:34:37','2018-08-13 21:36:49'),
	(25,'available',19,'00055','2017-10-24','2018-08-13 21:34:57','2018-08-13 21:34:57'),
	(26,'checked_out',19,'00054','2018-07-31','2018-08-13 21:35:10','2018-08-13 21:36:53'),
	(27,'available',20,'00053','2017-09-17','2018-08-13 21:35:25','2018-08-13 21:35:25');

/*!40000 ALTER TABLE `game_copies` ENABLE KEYS */;
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
	(5,'Xbox One','Microsoft','2013-11-22','2018-07-17 21:24:24','2018-07-17 21:24:24'),
	(11,'Xbox 360','Microsoft','2005-11-24','2018-08-13 16:58:19','2018-08-13 16:58:19'),
	(12,'SNES','Nintendo','1990-11-21','2018-08-13 17:02:45','2018-08-13 17:02:45'),
	(13,'N64','Nintendo','1996-06-23','2018-08-13 17:03:07','2018-08-13 17:03:07'),
	(15,'Wii','Nintendo','2006-11-19','2018-08-13 17:04:15','2018-08-13 17:04:15'),
	(16,'Playstation','Sony','1994-12-03','2018-08-13 17:05:41','2018-08-13 17:05:41');

/*!40000 ALTER TABLE `game_platforms` ENABLE KEYS */;
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
	(12,5,5,9.99,'https://www.mobygames.com/images/covers/l/432188-south-park-the-fractured-but-whole-playstation-4-front-cover.jpg','2018-04-24','2018-07-15 15:09:49','2018-07-17 21:23:43'),
	(14,9,15,5.00,'http://www.mobygames.com/images/covers/l/73793-the-legend-of-zelda-twilight-princess-wii-front-cover.jpg','2006-11-19','2018-08-13 18:14:53','2018-08-13 18:14:53'),
	(16,10,13,5.00,'http://www.mobygames.com/images/covers/l/6901-the-legend-of-zelda-majora-s-mask-nintendo-64-front-cover.jpg','2010-10-26','2018-08-13 18:17:56','2018-08-13 18:17:56'),
	(17,11,12,5.00,'http://www.mobygames.com/images/covers/l/56093-harvest-moon-snes-front-cover.jpg','1997-06-17','2018-08-13 18:20:52','2018-08-13 18:20:52'),
	(18,12,16,4.60,'http://www.mobygames.com/images/covers/l/11114-harvest-moon-back-to-nature-playstation-front-cover.jpg','1999-12-16','2018-08-13 18:22:33','2018-08-13 18:22:33'),
	(19,13,3,5.00,'http://www.mobygames.com/images/covers/l/370905-pokemon-sun-nintendo-3ds-front-cover.png','2016-11-18','2018-08-13 18:25:23','2018-08-13 18:25:23'),
	(20,14,3,4.90,'http://www.mobygames.com/images/covers/l/370904-pokemon-moon-nintendo-3ds-front-cover.png','2016-11-18','2018-08-13 18:27:30','2018-08-13 18:27:30'),
	(21,15,11,5.00,'http://www.mobygames.com/images/covers/l/260473-super-street-fighter-iv-xbox-360-front-cover.jpg','2010-04-27','2018-08-13 18:31:22','2018-08-13 18:31:22');

/*!40000 ALTER TABLE `game_releases` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table game_requests
# ------------------------------------------------------------

LOCK TABLES `game_requests` WRITE;
/*!40000 ALTER TABLE `game_requests` DISABLE KEYS */;

INSERT INTO `game_requests` (`id`, `user_id`, `release_id`, `copy_id`, `dt_requested`, `dt_delivered`, `dt_completed`, `status`, `dt_created`, `dt_updated`)
VALUES
	(2,58,9,7,'2018-07-10 00:00:00','2018-07-15 00:00:00',NULL,'checked_out','2018-07-15 15:14:17','2018-07-15 15:15:46'),
	(3,60,9,NULL,'2018-07-11 00:00:00',NULL,NULL,'pending','2018-07-15 15:14:17','2018-07-15 15:18:21'),
	(4,59,9,7,'2018-07-09 00:00:00','2018-07-10 00:00:00','2018-07-14 00:00:00','completed','2018-07-15 15:14:17','2018-07-15 15:18:18'),
	(5,66,6,NULL,'2018-08-09 00:00:00',NULL,NULL,'pending','2018-08-09 00:00:00','2018-08-09 00:00:00'),
	(6,65,17,NULL,'2018-08-09 00:00:00',NULL,NULL,'pending','2018-08-09 00:00:00','2018-08-09 00:00:00'),
	(7,65,10,19,'2018-08-06 00:00:00','2018-08-09 00:00:00',NULL,'checked_out','2018-08-09 00:00:00','2018-08-09 00:00:00'),
	(8,61,19,25,'2018-05-09 00:00:00','2018-05-10 00:00:00','2018-06-01 00:00:00','completed','2018-05-09 00:00:00','2018-06-01 00:00:00');

/*!40000 ALTER TABLE `game_requests` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table game_titles
# ------------------------------------------------------------

LOCK TABLES `game_titles` WRITE;
/*!40000 ALTER TABLE `game_titles` DISABLE KEYS */;

INSERT INTO `game_titles` (`id`, `name`, `description`, `genre`, `developer`, `producer`, `dt_created`, `dt_updated`)
VALUES
	(1,'The Legend of Zelda: Breath of the Wild','Forget everything you know about The Legend of Zelda games. Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series. Travel across vast fields, through forests, and to mountain peaks as you discover what has become of the kingdom of Hyrule In this stunning Open-Air Adventure. Now on Nintendo Switch, your journey is freer and more open than ever. Take your system anywhere, and adventure as Link any way you like.','Action','Nintendo','Nintendo','2018-07-15 14:59:56','2018-07-17 22:13:45'),
	(2,'Stardew Valley','Stardew Valley is an RPG inspired by the Harvest Moon games where you play as the inheritor of an old farm in a small town called Stardew Valley. Leaving the taxing big city life behind, you embark upon a quest to restore the neglected tract through dedication and hard work.','RPG','Eric Barone','Chucklefish','2018-07-15 15:00:06','2018-07-17 22:14:32'),
	(3,'Mario Kart 8 Deluxe','Race along walls and upside-down on twisting anti-gravity racetracks! Share highlight videos of your greatest moments with friends via the Mario Kart TV feature and Miiverse. Race and battle with friends locally or connect online to play with random players from around the world. Fan favorite features from past Mario Kart games include gliders, underwater racing, motorbikes, mid-air tricks, and more. Crisp HD graphics and fluid animation offers players the most visually stunning Mario Kart yet!','Racing','Nintendo','Nintendo','2018-07-15 15:00:23','2018-07-17 22:15:42'),
	(4,'Super Smash Bros. 4','Super Smash Bros. 4 features dozens of characters from across Nintendo\'s catalog, along with a few special guests. The basic formula is unchanged since the previous title: up to eight characters, controlled by either human players or the computer, duke it out in arenas based on Nintendo games; the list of available stages on the Wii U largely differs from the 3DS game\'s offerings. As characters take damage, they are sent flying further by attacks, and if they fly -- or fall -- out of the arena, then they\'re out!','Fighting','Nintendo','Nintendo','2018-07-15 15:00:42','2018-07-17 22:16:58'),
	(5,'South Park: The Fractured But Whole','From the creators of South Park, Trey Parker and Matt Stone, comes South Park: The Fractured But Whole, a sequel to 2014\'s award-winning South Park: The Stick of Truth. Players will once again assume the role of the New Kid and join South Park favorites Stan, Kyle, Kenny and Cartman in a new hilarious and outrageous RPG adventure.','RPG','Ubisoft','Ubisoft','2018-07-15 15:09:13','2018-07-17 22:16:20'),
	(9,'The Legend of Zelda: Twilight Princess','When an evil darkness enshrouds the land of Hyrule, a young farm boy named Link must awaken the hero - and the animal - within. When Link travels to the Twilight Realm, he transforms into a wolf and must scour the land with the help of a mysterious girl named Midna. Besides his trusty sword and shield, Link will use his bow and arrows, fight while on horseback and use a wealth of other items, both new and old.','Action','Nintendo','Nintendo','2018-08-13 17:34:20','2018-08-13 17:34:20'),
	(10,'The Legend of Zelda: Majora\'s Mask','Upon landing in the mystical world of Termina, Link must embark on an urgent quest to solve the mystery of the moon, save the world from destruction, and find his way back to the peaceful land of Hyrule in just three days! Use the Ocarina\'s power to manipulate time, and plan your schedule as you solve mind-boggling puzzles and dungeons!','Action','Nintendo','Nintendo','2018-08-13 17:37:35','2018-08-13 17:37:35'),
	(11,'Harvest Moon','The game follows a young boy charged with maintaining his absent father\'s farm. The primary objective of the Harvest Moon video game series is to restore and maintain a farm that has fallen into disrepair. The player decides how to allocate time between daily tasks, such as farming, raising livestock, fishing, and foraging.','Role-playing','Amccus','Natsume','2018-08-13 17:44:40','2018-08-13 17:44:40'),
	(12,'Harvest Moon: Back to Nature','As a young boy, the main character went to his grandfather\'s farm for the summer. His grandfather was too busy taking care of the farm to spend much time with him, so the boy explored the town and countryside on his own. The boy befriended his grandfather\'s puppy and met a little girl his own age with whom he became close friends. When the summer was over the boy had to go back home, but he promised the little girl that he would return someday. Ten years later, years after his grandfather\'s death, the boy, now a grown man, returns to the town to take over the farm. Upon meeting the main character, mayor and other villagers decide that he would be allowed to stay as the rightful owner if he restored the farm to its original state within three years. Otherwise, he would have to leave.','Role-playing','Victor','Natsume','2018-08-13 17:47:15','2018-08-13 17:47:15'),
	(13,'Pokemon Sun','Your journey in Pokemon Sun and Pokemon Moon will take you across the beautiful islands of the Alola region, where you\'ll encounter newly discovered Pokemon, as well as Pokemon that have taken on a new Alolan style. You may even encounter powerful Legendary Pokemon and other special Pokemon, such as the mysterious guardian deities. Keep track of all the Pokemon you\'ve seen and caught with the new Rotom Pokedex.','Role-playing','Game Freak','Nintendo','2018-08-13 17:54:53','2018-08-13 17:54:53'),
	(14,'Pokemon Moon','Your journey in Pokemon Sun and Pokemon Moon will take you across the beautiful islands of the Alola region, where you\'ll encounter newly discovered Pokemon, as well as Pokemon that have taken on a new Alolan style. You may even encounter powerful Legendary Pokemon and other special Pokemon, such as the mysterious guardian deities. Keep track of all the Pokemon you\'ve seen and caught with the new Rotom Pokedex.','Role-playing','Game Freak','Nintendo','2018-08-13 17:55:10','2018-08-13 17:55:10'),
	(15,'Super Street Fighter IV','Street Fighter IV takes place several months after the events of Street Fighter II. After Seth\'s escape, the S.I.N. corporation began another fighting tournament in order to draw out the most powerful fighters on Earth to complete the BLECE project. Each character has their own reasons for entering this tournament, but S.I.N.\'s real desire is to lure Ryu to them in order to analyze the Satsui no Hado, believed to be the last piece of data needed to complete BLECE.','Action','Capcom','Capcom','2018-08-13 18:03:44','2018-08-13 18:03:44');

/*!40000 ALTER TABLE `game_titles` ENABLE KEYS */;
UNLOCK TABLES;


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
	(64,'Blake','Murphey','bmurphey@email.com','$2b$10$84NZwTnwJS7ImjdbRJFnZuiQxLY9iWWeUmYv0zoARtjN0bHVAVone','user','2018-08-13 17:07:29','2018-08-13 17:07:29'),
	(65,'Heather','Murphey','hmurphey@email.com','$2b$10$aTWW3aoOM4wFp2uGxl/tWOeVEv7SwH.zW37Thimp74NRA67bzGxV.','user','2018-08-13 17:09:17','2018-08-13 17:09:17'),
	(66,'Jane','Doe','jd123@email.com','$2b$10$KGFTa5Xr5992RT0jXO1mE.FK18Yhvqd8C7DH8RVYGEQRuQi7SL.Cm','admin','2018-08-13 17:09:36','2018-08-13 17:11:17'),
	(67,'John','Smith','admin@email.com','$2b$10$dgmfZkl/qg8ejqqHaFl9MOy3hPHvFgnh.ZA20bVmDCDvF79MAAsHK','admin','2018-08-13 21:57:34','2018-08-13 21:57:40');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
