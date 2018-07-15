# Game-Library

Game-Library is a node/react app for managing inventory and requests for a real-world video game lending library.

## Creators

- Nathan Perkins (nperkins487@gmail.com)
- Heather Godsell (godsellh@oregonstate.com)

## Technologies Used

- node.js
- Native MySQL queries (for MariaDB 10.1)
- React
- HTML/CSS

## Database Instructions

1. Install MariaDB 10.1 or later.
1. Create a DB.
1. Connect to your DB.
1. Run the data-definition queries from the queries folder to initialize the DB tables.

## Dev Webserver Instructions

1. Clone this repo.
1. Edit the database config file with the proper hostname, user, password and database name.
1. `cd code/game-library`
1. `npm install` to install all required node modules.
1. `npm start` to run the dev server.

## Production Webserver Instructions

1. `npm install -g serve` to install `serve`.
1. `npm run build` to build the production server.
1. `serve -s build` to run the production server.
