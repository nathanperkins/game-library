# Game-Library [![Build Status](https://travis-ci.com/nathanperkins/cs340-project.svg?token=gmW9Hgyz1H6baCbwVtL3&branch=master)](https://travis-ci.com/nathanperkins/cs340-project)

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
1. Connect to your DB server.
1. Create a database.
1. Import `game_library_create_tables.sql` from the queries folder to initialize the DB tables.
1. Import `game_library_insert_dummy_data.sql` to add the dummy data.

## Docker Instructions

1. Docker can be used to install a local MariaDB dev server.
1. Install Docker via `brew install docker` or by following the instructions [here.](https://docs.docker.com/install/)
1. Navigate to the base of this repo.
1. `cd mariadb`
1. To start in detached mode: `docker-compose up -d`.
1. To check status: `docker ps`.
1. To stop: `docker-compose down` (from inside the `mariadb` folder).

## Prototype Webserver Instructions

1. `cd code/game-library-proto`
1. `cp config.js.template config.js`.
1. Modify `config.js` with the proper hostname, user, password and database name.
1. `npm install` to install all required node modules.
1. `npm start` to run the dev server.

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
