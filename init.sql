/* Author: Ritchie Yapp, Singapore Polytechnic
https://github.com/speckly
SP Games Backend assignement 1

MySQL Initialization script
Date Created: 1 June 2023

TODO: Make sure to validate all input, length included, as they raise exceptions
during query
*/

CREATE DATABASE IF NOT EXISTS `sp_games`;
USE `sp_games`;

-- Release constraints if database has been initialized and this script is being run again
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `gamepricing`;
DROP TABLE IF EXISTS `games`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `platforms`;

-- Table `user` --
CREATE TABLE `user` (
    `userid` int NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `email` varchar(100) NOT NULL UNIQUE,
    `password` varchar(64) NOT NULL,
    `profile_pic_url` varchar(300) NOT NULL,
    `type` varchar(45) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`userid`)
);

-- Table `categories` --
CREATE TABLE `categories` (
    `categoryid` int NOT NULL AUTO_INCREMENT,
    `catname` varchar(100) NOT NULL UNIQUE,
    `description` varchar(500) NOT NULL,
    PRIMARY KEY (`categoryid`)
);

-- Table `platforms` -- 
CREATE TABLE `platforms` (
    `platformid` int NOT NULL AUTO_INCREMENT,
    `platform_name` varchar(100) NOT NULL UNIQUE,
    `description` varchar(500) NOT NULL,
    PRIMARY KEY (`platformid`)
);


-- Table `games` --
-- Game can be sold for multiple platforms but each game has one category
-- platformid column is now in another table that is created by the Javascript models
-- Table name is game${id}platforms
CREATE TABLE `games` (
    `gameid` int NOT NULL AUTO_INCREMENT,
    `title` varchar(45) NOT NULL,
    `description` varchar(500) DEFAULT NULL,
    -- `price` varchar(60) NOT NULL,
    `categoryid` int DEFAULT NULL,
    `year` int DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `image` MEDIUMBLOB DEFAULT NULL,
    PRIMARY KEY (`gameid`),
    -- `platformid` int NOT NULL,
    KEY `fk_categoryid_idx` (`categoryid`),
    -- KEY `fk_platformid_idx` (`platformid`),
    -- CONSTRAINT `fk_platformid` FOREIGN KEY (`platformid`) REFERENCES `platforms` (`platformid`),
    CONSTRAINT `fk_categoryid` FOREIGN KEY (`categoryid`) REFERENCES `categories` (`categoryid`)
);

CREATE TABLE `gamepricing` (
    `id` int NOT NULL AUTO_INCREMENT,
    `platformid` int NOT NULL,
    `gameid` int NOT NULL, 
    `price` varchar(60) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_platformid_idx` (`platformid`),
    CONSTRAINT `fk_platformid` FOREIGN KEY (`platformid`) REFERENCES `platforms` (`platformid`),
    KEY `fk_gameid_pricing_idx` (`gameid`),
    CONSTRAINT `fk_gameid_pricing` FOREIGN KEY (`gameid`) REFERENCES `games` (`gameid`)
);


-- Table `reviews` --
CREATE TABLE `reviews` (
    `reviewid` int NOT NULL AUTO_INCREMENT,
    `userid` int NOT NULL,
    `gameid` int NOT NULL,
    `content` varchar(500) NOT NULL,
    `rating` int NOT NULL, 
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `fk_userid_idx` (`userid`),
    KEY `fk_gameid_idx` (`gameid`),
    CONSTRAINT `fk_userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`),
    CONSTRAINT `fk_gameid` FOREIGN KEY (`gameid`) REFERENCES `games` (`gameid`) ON DELETE CASCADE,
    PRIMARY KEY (`reviewid`)
);
