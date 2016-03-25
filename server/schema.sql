/* 
  May need to do a DROP DATABASE chat first to clean up if we have an error and need to re-run
  */
DROP DATABASE IF EXISTS chat;



CREATE DATABASE chat;

USE chat;

-- CREATE TABLE messages (
--   /* Describe your table here.*/
--   name varchar(20)
-- );

-- /* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

 -- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table message
-- 
-- ---

DROP TABLE IF EXISTS message;
    
CREATE TABLE message (
  id INTEGER NULL AUTO_INCREMENT DEFAULT NULL COMMENT 'Map to objectId of message',
  text CHAR(255) NULL DEFAULT NULL COMMENT 'Chat message text',
  createdAt DATETIME NULL DEFAULT NULL,
  updatedAt DATETIME NULL DEFAULT NULL,
  id_room INTEGER NULL DEFAULT NULL,
  id_user INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table room
-- 
-- ---

DROP TABLE IF EXISTS room;
    
CREATE TABLE room (
  id INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  name VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table user
-- 
-- ---

DROP TABLE IF EXISTS user;
    
CREATE TABLE user (
  id INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  name VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE message ADD FOREIGN KEY (id_room) REFERENCES room (id);
ALTER TABLE message ADD FOREIGN KEY (id_user) REFERENCES user (id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE message ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE room ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE user ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO message (id,text,createdAt,updatedAt,id_room,id_user) VALUES
-- (,,,,,);
-- INSERT INTO room (id,name) VALUES
-- (,);
-- INSERT INTO user (id,name) VALUES
-- (,);

