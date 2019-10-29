-- User
CREATE TABLE `csce_608_1`.`tt_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `nickname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(256) NOT NULL,
  `description` VARCHAR(300) NULL,
  `avatar` VARCHAR(300) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_username` (`username` ASC),
  UNIQUE INDEX `uk_email` (`email` ASC))
DEFAULT CHARACTER SET = utf8
COMMENT = 'User Table';

-- Article
CREATE TABLE `csce_608_1`.`tt_article` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `body` BLOB NOT NULL,
  `created_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
DEFAULT CHARACTER SET = utf8
COMMENT = 'Article Table';


-- Comment
CREATE TABLE `csce_608_1`.`tt_comment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `article_id` BIGINT NOT NULL,
  `content` VARCHAR(1024) NOT NULL,
  `created_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
DEFAULT CHARACTER SET = utf8
COMMENT = 'Comment Table';


-- Category
CREATE TABLE `csce_608_1`.`tt_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
DEFAULT CHARACTER SET = utf8
COMMENT = 'Category Table';

-- BelongsTo
CREATE TABLE `csce_608_1`.`tt_article_to_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`id`))
DEFAULT CHARACTER SET = utf8
COMMENT = 'A table for storing the “belongs to” relationship for articles and categories';
