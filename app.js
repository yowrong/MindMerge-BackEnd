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

/* Cards */
const random = Math.floor(Math.random() * 100) + 1;
var cardValue;
var cards = [];
var players = [numOfPlayers];

/* Player */
class Player {
    constructor(name) {
        this.playerCards = [];
        this.name = name;
    }

    sortCards() {
        this.playerCards.sort;
        this.playerCards.reverse();
    }

    playCard() {
        this.playerCards.pop();
    }
}

function generateCards() {
    for (let i = 0; i < 101; i++) {
        cards.push(i);
    }
    return cards;   
}

function dealCards(level, players) {
    for (var i = 0; i < players.length; i++) {
        for (let i = 0; i <= level; i++) {
            let randomCard = random;
            this.playerCards.push(randomCard);
            cards.splice(randomCard, 1);
        }
    }
}

void function initializeGame() {
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

const player1 = new Set();
const player1Star = new Set();

const player2 = new Set();
const player2Star = new Set();

const player3 = new Set();
const player3Star = new Set();

const player4 = new Set();
const player4Star = new Set();

// beginning of round
void function initializeHand() {
    for (let i = 0; i < roundNumber; i++) {
        player1.add(Math.random() * 100);
        player2.add(Math.random() * 100);
        player3.add(Math.random() * 100);
        player4.add(Math.random() * 100);
    }
}

// end of round
void function clearHand() {
    player1.clear;
    player2.clear;
    player3.clear;
    player4.clear;
}

void function clearThrowingStars() {
    player1Star.clear;
    player2Star.clear;
    player3Star.clear;
    player4Star.clear;
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




