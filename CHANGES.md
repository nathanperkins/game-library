# Changelog

## 2018-07-28
- Add Query
  - get_user_by_email (for login)
  
## 2018-07-25
- Add Queries
  - get_game_requests_by_user
  - get_all_users
  - get_user_by_id
  - get_all_titles
  - get_all_releases
  - get_all_platforms
  - get_all_copies
- Remove Query
  - get_all_game_requests

## 2018-07-16
- Schema Change
  - Changed game_request.game_id to game_request.copy_id (for consistency)
  - Remove password_salt (not needed when using bcrypt)
  - Change game_releases.rating to DECIMAL(5,2)
