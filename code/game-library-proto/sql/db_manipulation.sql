/*
Contains all of the queries used by the app.
Accessed from app.js by calling queries.<query_name>
*/

----------------------------------------------------------------------
-- It should be possible to add entries to every table individually --
-- it should be possible to add things to all relationships.        --
----------------------------------------------------------------------

-- users
INSERT INTO users
(first_name, last_name, email, password)
VALUES
(:first_name_input, :last_name_input, :email_input, :password_input)
;

-- game_titles
INSERT INTO game_titles
(name, description, genre, developer, producer)
VALUES
(:name_input, :description_input, :genre_input, :developer_input, :producer_input)
;

-- game_platforms
INSERT INTO game_platforms
(name, manufacturer, release_date)
VALUES
(name_input, :manufacturer_input, :release_date_input)
;

-- game_releases
INSERT INTO game_releases
(title_id, platform_id, rating, boxart_url, release_date)
VALUES
(:title_id_input, :platform_id_input, :rating_input, :boxart_url_input, :release_date_input)
;

-- game_copies
INSERT INTO game_copies
(release_id, library_tag, dt_procured, status)
VALUES
(:release_id, :library_tag, :dt_procured, 'available')
;

-- game_requests
INSERT INTO game_requests
(user_id, release_id, dt_requested)
VALUES
(:user_id, :release_id, NOW() )
;

-------------------------------------------------------------
-- Every table should be used in at least one select query --
-------------------------------------------------------------

-- get_all_game_releases for library index
-- √ game_releases
-- √ game_titles
-- √ game_platforms

SELECT GR.id as rid, GT.name AS title, GP.name AS platform,
  GR.boxart_url, GT.description
FROM game_releases AS GR
JOIN game_titles AS GT
  ON GT.id = GR.title_id
JOIN game_platforms AS GP
  ON GP.id = GR.platform_id
WHERE GT.name LIKE :search_term
 OR GP.name LIKE :search_term
ORDER BY title, platform ASC
;

-- get all users for users index
-- √ users

SELECT User.id, User.last_name, User.first_name, User.email, User.role
FROM users AS User
ORDER BY User.last_name, User.first_name DESC
;

-- get all game requests for admin page
-- √ game_requests
-- √ game_copies

SELECT Request.id, Title.name AS title, Platform.name AS platform,
  Request.status AS status, Copy.library_tag AS tag,
  GRelease.boxart_url AS boxart_url, Title.description AS description
FROM game_requests AS Request
JOIN game_releases AS GRelease
  ON GRelease.id = Request.release_id
JOIN game_titles AS Title
  ON Title.id = GRelease.title_id
JOIN game_platforms AS Platform
  ON Platform.id = GRelease.platform_id
LEFT JOIN game_copies AS Copy
  ON Copy.id = Request.copy_id
;

-- get all game requests for profile page

SELECT Request.status, Title.name AS title, Platform.name AS platform, Request.dt_completed
FROM game_requests AS Request
JOIN game_releases AS GRelease
  ON GRelease.id = Request.release_id
JOIN game_titles AS Title
  ON Title.id = GRelease.title_id
JOIN game_platforms AS Platform
  ON Platform.id = GRelease.platform_id
WHERE Request.user_id = :user_id
ORDER BY Request.status;

-- get all users for admin page

SELECT User.id, User.last_name, User.first_name, User.email, User.role
FROM users AS User
ORDER BY User.last_name, User.first_name DESC
;

-- get user by id for profile page

SELECT User.last_name, User.first_name, User.email, User.role
FROM users AS User
WHERE User.id = :user_id
;


-- get all users for admin page

SELECT User.id, User.last_name, User.first_name, User.email, User.role
FROM users AS User
ORDER BY User.last_name, User.first_name DESC
;

-- get all game_titles for admin page

SELECT Title.id, Title.name, Title.genre, Title.developer, Title.producer
FROM game_titles AS Title
ORDER BY name DESC
;

-- get all game_platforms for admin page

SELECT Platform.id, Platform.name, Platform.manufacturer, Platform.release_date
FROM game_platforms AS Platform
ORDER BY release_date DESC
;

-- get all game_releases for admin page

SELECT Title.name as title, Platform.name as platform, GRelease.release_date
FROM game_releases AS GRelease
JOIN game_titles AS Title
ON Title.id = GRelease.title_id
JOIN game_platforms AS Platform
ON Platform.id = GRelease.platform_id
ORDER BY release_date DESC
;

-- get all game_copies for admin page

SELECT Title.name AS title, Platform.name AS platform, Copy.library_tag
FROM game_copies AS Copy
JOIN game_releases AS GRelease
ON GRelease.id = Copy.release_id
JOIN game_platforms AS Platform
ON Platform.id = GRelease.platform_id
JOIN game_titles AS Title
ON Title.id = GRelease.title_id
ORDER BY library_tag ASC
;

-- get user by id for profile page

SELECT User.last_name, User.first_name, User.email, User.role
FROM users AS User
WHERE User.id = :user_id
;


----------------------------------------------------
-- your website needs at least one dynamic search --
----------------------------------------------------

-- get all game releases with search for library
-- searches on game title or game platform

SELECT GR.id as rid, GT.name AS title, GP.name AS platform,
  GR.boxart_url AS boxart_url, GT.description AS description
FROM game_releases AS GR
JOIN game_titles AS GT
  ON GT.id = GR.title_id
JOIN game_platforms AS GP
  ON GP.id = GR.platform_id
WHERE GT.name LIKE :search_term_input
 OR GP.name LIKE :search_term_input
ORDER BY title, platform ASC
;

------------------------------------
-- You need to include one delete --
------------------------------------

-- delete a user (on admin page)

DELETE FROM users
WHERE users.id = :user_id_input
;

---------------------------------------------
-- and one update function in your website --
---------------------------------------------

-- update a user's password

UPDATE users
SET password = :new_password_input
WHERE users.id = :logged_in_user
;

-- assign game_copy to game_request

UPDATE game_requests
SET copy_id = :copy_id_input, dt_delivered = NOW()
WHERE id = :game_request_id_input
;

-- mark a game as returned

UPDATE game_requests
SET dt_completed = NOW()
WHERE id = :game_request_id_input
;

---------------------------------------------------------------
-- remove things from at least one many-to-many relationship --
---------------------------------------------------------------

-- delete a request that a user no longer wants

DELETE FROM game_requests
WHERE user_id = :user_id_input
  AND release_id = :release_id_input
;

-- remove a game copy from a request

UPDATE game_requests
SET copy_id = NULL, dt_delivered = NULL
WHERE id = :game_request_id_input
;