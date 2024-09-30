# Traffic Trouble 🚙
<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)

Traffic trouble is a top-down car game where you dodge potholes, featuring multiple difficulty modes and lobbies to log and track your scores. 

<hr>

## Table of Contents
- [Introduction](#traffic-trouble-)
- [Core Technologies](#core-technologies)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Codebase Overview](#codebase-overview)
- [Technical Features](#technical-features)
- [Future Improvements](#future-improvements)
- [License](#license)

## Core Technologies

- **Frontend**
  - JavaScript - _handle game logic (e.g. score tracking, movement, and difficulty levels)_
  - HTML / CSS - _structure static game control cards and stylize in 1-bit art style_
- **Backend**
  - Node.js - _runtime environment which enables JavaScript on server side_
  - Express.js - _manages logic for score, leaderboard, and party endpoints_
- **Database**
  - Supabase - _host PostgreSQL database on Supabase's free plan_
  - PostgreSQL - _RDBMS which supports SQL for querying data_
  - SQL - _create leaderboard table and query user scores_
- **Deployment**
  - Render - _deploy client (i.e. HTML, CSS, JavaScript) on Render's free plan_  
  - Railway - _deploy backend on Railway to avoid Render's free plan server downtimes_ 

## Installation

As a reminder, this game is available to play on [render](https://traffic-browser-game.onrender.com/).

Before installing, you will need to create an account with NeonDB and deploy your own DB [here](https://console.neon.tech/app/projects). Copy the connection details provided in the dashboard section of NeonDB to your clipboard, as these will be used to establish your own DB for the project.

Below are the steps to install and build upon this game:

**1. Clone the respository to your IDE:**
```
git clone https://github.com/jordaz14/car-browser-game.git
```
**2. Navigate to the project directory:**
```
cd car-browser-game.git
```
**3. Install npm in the `./server` directory to get dependencies:**
```
cd ./server && npm install
```
**4. Create a `.env` file in the `./server` directory in the following format to configure your database:**
```
PGHOST="<neon_db_host>"
PGDATABASE="<neon_db_name>"
PGUSER="<neon_db_owner>"
PGPASSWORD="<neon-db-password>"
ENDPOINT_ID="<neon-db-endpoint>"
```
**5. Run the following SQL queries in NeonDB's SQL editor to create your tables:**

This table records all scores and establishes a many-to-one relationship on party_id's:
```
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  party_id INT NOT NULL REFERENCES party(party_id),
  score INTEGER NOT NULL)
```
This table tracks all parties (i.e. lobbies) created:
```
CREATE TABLE party (
  party_id SERIAL PRIMARY KEY,
  party_name VARCHAR(50))
```
**6. Use LiveServer to run your `./client` and the following command to run your `./server`:**
```
node server.js
```
**7. Ready to Use!**

## How to Use

## Codebase Overview

- **CLIENT**
  - [main.js](./client/main.js) - starts game, runs game loops, and ends game
  - [gameState.js](./client/gameState.js) - contains core game settings which are dynamically updated across app
  - **modules**
    - [audio.js](./client/modules/audio.js) - toggles mute status, handles audio player, and updates playback speed
    - [difficulty.js](./client/modules/difficulty.js) - handles state and UI for difficulty levels
    - [environment.js](./client/modules/environment.js) - constructs environment objects, creates obstacles and environment
    - [leaderboard.js](./client/modules/leaderboard.js) - displays leaderboard, submit scores to backend, create & join parties
    - [motion.js](./client/modules/motion.js) - establishes keyboard and touch user input, collision detection, and obstacle/scenery movement
    - [score.js](./client/modules/score.js) - tracks active and high scores, caches high score in browser
    - [helper.js](./client/modules/helper.js) - misc. helper functions
  - **rc-tv**  
- **SERVER**
  - [server.js](./server/server.js) - handles party creation/joining, leaderboard fetching, and score submissions

## Technical Features

- **Object-Oriented Programming**

- **RESTful API Design**

- **Game Loops, Collision Detection, and Dynamic State Management**

- **Keyboard and Touch Control Input Methods**

- **Responsive Design**

## Future Improvements
- [ ] Correct bug where initial obstacle loads too soon
- [ ] Add leaderboard UI to mobile version
- [ ] Create different obstacle and terrain elements
- [ ] Prevent users from editing scores and posting to endpoint
- [ ] Allow users to search for existing parties

## License
This project is licensed under the GNU General Public License (GPL) - see the [LICENSE](./LICENSE) file for details.
