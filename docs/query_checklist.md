# Requirements

## 4 Entities

- √
- GameTitle
- GamePlatform
- GameCopy
- User

## 4 Relationships

- √
- GameTitle <= GameRelease => GamePlatform (many-to-many)
- User <= GameRequest => GameRelease (many-to-many)
- GameCopy <= is instance of => GameRelease (many-to-one)
- GameCopy <= is lended out for => GameRequest (one-to-many)

## All tables involved in at least one SELECT query

- √ GameTitle
- √ GamePlatform
- √ GameRelease
- √ GameCopy
- √ GameRequest
- √ User

## Dynamic Filter

- Need to implement

## Delete/Update for at least one entity

- Delete (need to implement)
- Update (need to implement)

## Possible to add to all relationships

## Possible to delete at least one many-to-many relationship