/*
Contains all of the queries used by the app.
Accessed from app.js by calling queries.<query_name>
*/

const get_all_game_releases_with_search = `
SELECT GR.id as rid, GT.name AS title, GP.name AS platform,
  GR.boxart_url, GT.description
FROM game_releases AS GR
JOIN game_titles AS GT
  ON GT.id = GR.title_id
JOIN game_platforms AS GP
  ON GP.id = GR.platform_id
WHERE GT.name LIKE ?
 OR GP.name LIKE ?
ORDER BY title, platform ASC
;`

const get_game_requests_by_status = `
SELECT Request.id, Title.name AS title, Platform.name AS platform, Request.dt_completed,
  CONCAT(User.first_name, ' ', User.last_name) AS user, Copy.library_tag
FROM game_requests AS Request
JOIN game_releases AS GRelease
  ON GRelease.id = Request.release_id
JOIN game_titles AS Title
  ON Title.id = GRelease.title_id
JOIN game_platforms AS Platform
  ON Platform.id = GRelease.platform_id
JOIN users AS User
  ON User.id = Request.user_id
LEFT JOIN game_copies AS Copy
  ON Copy.id = Request.copy_id
WHERE Request.status = ?
ORDER BY User.last_name, User.first_name ASC
;`

const get_game_requests_by_user = `
SELECT Request.status, Title.name AS title, Platform.name AS platform, Request.dt_completed
FROM game_requests AS Request
JOIN game_releases AS GRelease
  ON GRelease.id = Request.release_id
JOIN game_titles AS Title
  ON Title.id = GRelease.title_id
JOIN game_platforms AS Platform
  ON Platform.id = GRelease.platform_id
WHERE Request.user_id = ?
ORDER BY Request.status
;`

const get_user_by_id = `
SELECT User.last_name, User.first_name, User.email, User.role
FROM users AS User
WHERE User.id = ?
;`

const insert_new_user = `
INSERT INTO users
(first_name, last_name, email, password)
VALUES
(?,?,?,?)
;`

const insert_new_request = `
INSERT INTO game_requests
(user_id, release_id)
VALUES
(?, ?)
;`

const insert_new_platform = `
INSERT INTO game_platforms
(name, manufacturer, release_date)
VALUES
(?, ?, ?)
;`


const insert_new_release = `
INSERT INTO game_releases
(title_id, platform_id, rating, boxart_url, release_date)
VALUES
(?, ?, ?, ?, ?)
;` 

const insert_new_title = `
INSERT INTO game_titles
(name, description, genre, developer, producer)
VALUES
(?, ?, ?, ?, ?)
;`

const insert_new_copy = `
INSERT INTO game_copies
(release_id, library_tag, dt_procured)
VALUES
(?, ?, ?)
;`

const get_all_users = `
SELECT User.id, User.last_name, User.first_name, User.email, User.role
FROM users AS User
ORDER BY User.last_name, User.first_name DESC
;`

const get_user_by_email = `
SELECT User.id, User.last_name, User.first_name, User.email, User.password, User.role
FROM users AS User
WHERE User.email = ?
;`

const get_all_game_titles = `
SELECT Title.id, Title.name, Title.genre, Title.developer, Title.producer
FROM game_titles AS Title
ORDER BY name DESC
;`

const get_all_game_platforms = `
SELECT Platform.id, Platform.name, Platform.manufacturer, Platform.release_date
FROM game_platforms AS Platform
ORDER BY release_date DESC
;`

const get_all_game_releases = `
SELECT GRelease.id, Title.name as title, Platform.name as platform, GRelease.release_date
FROM game_releases AS GRelease
JOIN game_titles AS Title
ON Title.id = GRelease.title_id
JOIN game_platforms AS Platform
ON Platform.id = GRelease.platform_id
ORDER BY release_date DESC
;`

const get_all_game_copies = `
SELECT Title.name AS title, Platform.name AS platform, Copy.library_tag
FROM game_copies AS Copy
JOIN game_releases AS GRelease
ON GRelease.id = Copy.release_id
JOIN game_platforms AS Platform
ON Platform.id = GRelease.platform_id
JOIN game_titles AS Title
ON Title.id = GRelease.title_id
ORDER BY library_tag ASC
;`


module.exports = {
    get_all_users,
    get_all_game_titles,
    get_all_game_platforms,
    insert_new_platform,
    insert_new_release,
    insert_new_title,
    insert_new_copy,
    get_all_game_releases,
    get_all_game_copies,
    get_user_by_id,
    get_user_by_email,
    insert_new_user,
    get_all_game_releases_with_search,
    get_game_requests_by_status,
    get_game_requests_by_user,
    insert_new_request,
}