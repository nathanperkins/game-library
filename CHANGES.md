# Changelog

## 2018-07-16
- Schema Change
- Changed game_request.game_id to game_request.copy_id (for consistency)
- Remove password_salt (not needed when using bcrypt)
- Change game_releases.rating to DECIMAL(5,2)