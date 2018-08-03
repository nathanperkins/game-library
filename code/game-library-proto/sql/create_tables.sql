-- Database Creation Queries
-- Game Library Project
--
-- Nathan Perkins
-- Heather Godsell
-- 7/10/2018

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `game_copies`;
DROP TABLE IF EXISTS `game_titles`;
DROP TABLE IF EXISTS `game_platforms`;
DROP TABLE IF EXISTS `game_releases`;
DROP TABLE IF EXISTS `game_requests`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` enum('user', 'admin', 'root') NOT NULL,
    `dt_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

CREATE TABLE `game_titles` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` text,
    `genre` varchar(255),
    `developer` varchar(255),
    `producer` varchar(255),
    `dt_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB;

CREATE TABLE `game_platforms` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `manufacturer` varchar(255),
    `release_date` date,
    `dt_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB;

CREATE TABLE `game_releases` (
    `id`            int(11) NOT NULL AUTO_INCREMENT,
    `title_id`      int(11) NOT NULL,
    `platform_id`   int(11) NOT NULL,
    `rating`        DECIMAL(5,2),
    `boxart_url`    varchar(255),
    `release_date`  date,
    `dt_created`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt_updated`    datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`title_id`) REFERENCES `game_titles` (`id`),
    FOREIGN KEY (`platform_id`) REFERENCES `game_platforms` (`id`),
    UNIQUE KEY (`platform_id`, `title_id`)
) ENGINE=InnoDB;

CREATE TABLE `game_copies` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `status` enum('available', 'checked_out', 'lost') NOT NULL,
    `release_id` int(11) NOT NULL,
    `library_tag` varchar(255) NOT NULL,
    `dt_procured` date,
    `dt_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`release_id`) REFERENCES `game_releases` (`id`),
    UNIQUE KEY `library_tag` (`library_tag`)
) ENGINE=InnoDB;

CREATE TABLE `game_requests` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `release_id` int(11) NOT NULL,
    `copy_id` int(11),
    
    `dt_requested` datetime,
    `dt_delivered` datetime,
    `dt_completed` datetime,
    `status` enum('pending', 'checked_out', 'completed') NOT NULL,

    `dt_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`release_id`) REFERENCES `game_releases` (`id`),
    FOREIGN KEY (`copy_id`) REFERENCES `game_copies` (`id`)
) ENGINE=InnoDB;