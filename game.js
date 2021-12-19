const { listeners } = require("process");

const port = process.env.PORT || 3000;
const app = require("express")();
const http = require("http").createServer(app);
const socketio = require("socket.io")(http);
// const WebSocket = require("ws");
const msg = "Welcome to Mind Merge!";

// let enterNameButton = // name button

/* Game */
var numOfPlayers = 4;
var level = 1;
var MAX_LEVEL = 8;
var lives;
var throwingStar;
var roundNumber = 1;
var playedCards = [];
var dealtCards = [];


/* Cards */
const random = Math.floor(Math.random() * 100) + 1;
var cardValue;
var cards = new Set();
var players = [numOfPlayers];


/* Player */

class Player {
    constructor(name) {
        this.playerCards = [];
        this.throwingStarCards = [];
        this.name = name;
    }

    sortCards() {
        this.playerCards.sort;
        this.playerCards.reverse();
    }

    playCard() {
        cardValue = this.playerCards.pop();
        if (cardValue != dealtCards[0]) {
            loseLives();
        } else {
            playedCards.push(cardValue);
            dealtCards.shift();
        }
    }
}

class Game {

    createPlayers(players) {
        for (var i = 0; i < numOfPlayers; i++) {
            players[i] = new Player();
        }
    }

    // beginning of round
    dealCards(level, players) {
        for (var i = 0; i < players.length; i++) {
            for (let j = 0; j < level; j++) {
                let randomCard = random;

                while (cards.has(randomCard)) {
                    randomCard = Math.floor(Math.random() * 100) + 1;
                }

                players[i].playerCards.push(randomCard);
                dealtCards.push(randomCard);
                cards.delete(randomCard);
            }
        }
        dealtCards.sort;
        dealtCards.reverse();
    }

    initializeGame() {
        switch (numOfPlayers) {
            case 2:
                lives = 2;
                throwingStar = 1;
                break;
            case 3:
                lives = 3;
                throwingStar = 1;
                break;
            default:
                lives = 4;
                throwingStar = 1;
        }
    }

    generateCards() {
        for (let i = 1; i < 101; i++) {
            cards.add(i);
        }
        return cards;
    }

    endOfRound() {
        while (!dealtCards.isEmpty()) {
            return false;
        }
        return true; 
    }

    nextLevel() {
        if (endOfRound && level < MAX_LEVEL) {
            level++;
        }
    }

    // end of round
    clearAllHands(players) {
        for (var i = 0; i < players.length; i++) {
            players[i].playerCards.clear();
        }

    }

    clearAllThrowingStars(players) {
        for (var i = 0; i < players.length; i++) {
            players[i].throwingStarCards.clear();
        }
    }

    loseLives() {
        if (lives > 0) {
            lives--;
        }
        if (lives == 0) {
            endGame();
        }
    }

    endGame() {
        // return to lobby
    }

}

app.get("/", (req, res) => {
    res.send(msg);
})

// const server = new WebSocket.Server(
//     {
//       port: port,
//     }
// );

socketio.on("connection", (userSocket) => {
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data);
    }),
        userSocket.on("receive_message", "Successfully connected to server!");
})

http.listen(port);
