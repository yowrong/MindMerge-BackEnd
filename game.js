const { listeners } = require("process");
const port = process.env.PORT || 3000;
const app = require("express")();
const http = require("http").createServer(app);
const socketio = require("socket.io")(http);
// const WebSocket = require("ws");
const msg = "Welcome to Mind Merge!";

// let enterNameButton = // name button

/* Game */
var numOfPlayers = 0;
var level = 1;
var MAX_LEVEL = 8;
var lives = 0;
var throwingStar = 0;
var playedCards = [];
var dealtCards = [];

/* Cards */
var random;
var cards = new Set();
var players = [numOfPlayers];

/* Player */

class Player {

    constructor(name) {
        this.playerCards = [];
        this.throwingStarCards = new Set();
        this.name = name;
    }

    sortCards() {
        this.playerCards.sort;
        this.playerCards.reverse();
    }

    playCard() {
        return this.playerCards.shift();
    }
}

class Game {

    // beginning of game
    createPlayers() {
        for (var i = 0; i < numOfPlayers; i++) {
            players[i] = new Player();
        }
    }

    generateCards() {
        for (let i = 1; i < 101; i++) {
            cards.add(i);
        }
        return cards;
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

    // beginning of round
    dealCards() {
        for (var i = 0; i < players.length; i++) {
            for (let j = 0; j < level; j++) {
                random = Math.floor(Math.random() * 100) + 1;
                while (!cards.includes(random)) {
                    random = Math.floor(Math.random() * 100) + 1;
                }

                players[i].playerCards.push(random);
                dealtCards.push(random);
                cards.splice(random, 1);
            }
        }
        dealtCards.sort;
    }

    // during round
    loseLives() {
        if (lives > 0) {
            lives--;
        }
        if (lives == 0) {
            endGame();
        }
    }

    evaluateOrder(cardValue) {
        if (cardValue != dealtCards[0]) {
            loseLives();
            addAllCardsBelowCurrentCard(cardValue);
        } else {
            playedCards.push(cardValue);
            dealtCards.shift();
        }
    }

    addAllCardsBelowCurrentCard(cardValue) {
        while (dealtCards[0] < cardValue) {
            for (var i = 0; i < numOfPlayers; i++) {
                if (players[i].playerCards[0] == dealtCards[0]) {
                    players[i].playerCards.splice(0, 1);
                }
            }
            playedCards.push(dealtCards.shift);
        }
        playedCards.push(cardValue);
    }

    // end of round
    endOfRound() {
        while (!dealtCards.isEmpty()) {
            return false;
        }
        return true;
    }

    clearAllHands() {
        for (var i = 0; i < players.length; i++) {
            players[i].playerCards = {};
        }

    }

    clearAllThrowingStars() {
        for (var i = 0; i < players.length; i++) {
            players[i].throwingStarCards.clear();
        }
    }

    nextLevel() {
        if (endOfRound && level < MAX_LEVEL) {
            level++;
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
//     {port: port,}
// );

socketio.on('connect', function (userSocket) {
    numOfPlayers++;
    let name = "player" + numOfPlayers;
    userSocket.user = name;
    socketio.emit('New_Player_Added', { user: socketio.userName, numOfUsers: numOfPlayers });
    console.log('Number of players:', numOfPlayers);


    userSocket.on('disconnect', function (data) {
        numOfPlayers--;
        socketio.emit('Player_Left', { user: userSocket.userName, numOfUsers: numOfPlayers });
        console.log('Connected Players:', numOfPlayers);
    });


    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data);
    }),
        userSocket.on("receive_message", "Successfully connected to server!");
})

http.listen(port, function () {
    console.log('Listening on port ' + port + '!');
});


