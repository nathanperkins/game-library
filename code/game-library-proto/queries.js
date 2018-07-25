/*
Contains all of the queries used by the app.
Accessed from app.js by calling queries.<query_name>
*/

const get_all_game_releases = `
SELECT GR.id, GT.name AS title, GP.name AS platform,
  GR.boxart_url AS boxart_url, GT.description AS description
FROM game_releases AS GR
JOIN game_titles AS GT
  ON GT.id = GR.title_id
JOIN game_platforms AS GP
  ON GP.id = GR.platform_id
ORDER BY title, platform ASC
;`

const get_all_game_releases_with_search = `
SELECT GR.id as rid, GT.name AS title, GP.name AS platform,
  GR.boxart_url AS boxart_url, GT.description AS description
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
  CONCAT(User.first_name, ' ', User.last_name) AS user, Copy.library_tag AS library_tag
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

const get_all_users = `
SELECT User.id, User.last_name, User.first_name, User.email, User.role
FROM users AS User
ORDER BY User.last_name, User.first_name DESC
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

module.exports = {
    get_all_game_releases,
    get_all_users,
    insert_new_user,
    get_all_game_releases_with_search,
    get_game_requests_by_status,
    insert_new_request,
}