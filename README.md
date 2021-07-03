# Game-Library [![Build Status](https://app.travis-ci.com/nathanperkins/game-library.svg?branch=master)](https://travis-ci.com/nathanperkins/game-library)

Game-Library is a node/react app for managing inventory and requests for a real-world video game lending library.

## Creators

- Nathan Perkins (nperkins487@gmail.com)
- Heather Godsell (godsellh@oregonstate.com)

## Technologies Used

- node.js
- express
- ejs
- MySQL (for MariaDB 10.1)
- HTML/CSS
- Docker
- Chai/Mocha

## Installation Instructions

1. Install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/)
1. Clone this repo.
1. Navigate to the `game-library` folder.
1. Install all node modules - `npm install`
1. `cp config/default.json.template config/default.json` and edit as needed. If you're using the docker databases and you change the DB usernames/passwords, the credentials will need to be changed in the `docker-compose.yml` file as well.
1. Repeat the above step for the `production.json.template`, if running for production.

## Run Instructions

1. Start the dev and test databases - `npm run docker-dev`
1. Start the dev server - `npm start`
1. Run all tests - `npm test`
1. Run specific directory or file of tests - `npm test test/dir_name/`, `npm test test/dir/test_name.test.js`
1. Start the prod server and database - `npm run docker-prod`
1. Shutdown all containers - `npm run docker-stop`
1. Check container status - `docker ps`

## Tips

- To reset the databases entirely: shut the containers down and delete the `game-libary/data/` folder.
