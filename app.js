const port = process.env.PORT || 3000;
const app = require("express")();
const http = require("http").createServer(app);
const socketio = require("socket.io")(http);
const msg = "Welcome to Mind Merge!";
// import game from './game.js';

let users = [];

const userJoin = (id, username) => {
    const user = { id, username };
    users.push(user);
    return user;
}

const userReset = () => {
    users = [];
}

/* Game */
const MAX_LIVES = 5;
const MAX_THROWING_STARS = 3;
var numOfPlayers = users.length;
var level = 1;
var MAX_LEVEL = 8;
var lives = 0;
var throwingStar = 0;
var playedCards = [];
var dealtCards = [];

/* Cards */
var random;
var cards = new Set();
var players;

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
        evaluateOrder(this.playerCards.shift());
    }
}

class Game {
    // beginning of game
    players = [numOfPlayers];
    createPlayers() {
        numOfPlayers = users.length;
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
            // put up fail message
            loseLives();
            addAllCardsBelowCurrentCard(cardValue);
        } else {
            playedCards.push(cardValue);
            dealtCards.shift();
        }

        if (this.endOfRound()) {
            this.nextLevel();
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

    activateThrowingStar(playersArray) {
        if (throwingStar == 0) {
            return;
        }
        throwingStar--;
        for (var i = 0; i < playersArray.length; i++) {
            var currentPlayer = playersArray[i];
            var lowestCard = currentPlayer.playerCards.shift();
            currentPlayer.throwingStarCards.push(lowestCard);
        }
    }

    // end of round
    endOfRound() {
        if (!dealtCards.isEmpty()) {
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
        if (level < MAX_LEVEL) {
            this.clearAllHands();
            this.clearAllThrowingStars();
            level = level + 1;

            if (level == 2 && throwingStar < MAX_THROWING_STARS) {
                throwingStar++;
            }
            if (level == 3 && lives < MAX_LIVES) {
                lives++;
            }
            if (level == 5 && throwingStar < MAX_THROWING_STARS) {
                throwingStar++;
            }
            if (level == 6 && lives < MAX_LIVES) {
                lives++;
            }
            if (level == 8 && throwingStar < MAX_THROWING_STARS) {
                throwingStar++;
            }
            if (level == 9 && lives < MAX_LIVES) {
                lives++;
            }
        }
    }

    endGame() {
        level = 1;
        cards.clear();
        playedCards.length = 0;
        dealtCards.length = 0;
        // return to lobby
    }

}

app.get("/", (req, res) => {
    res.send(msg);
})

setInterval(userReset, 300000);

socketio.on("connection", (userSocket) => {

    // numOfPlayers++;
    // let name = "player";
    // userSocket.userName = name;
    // socketio.emit('user_joined', {
    //     user: socketio.userName,
    //     numOfUsers: numOfPlayers
    // });

    // console.log('Number of players:', numOfPlayers);
    userSocket.on("createRoom", (data) => {
        userJoin(userSocket.id, data);
        userSocket.emit("initRoom", {roomCode: "ABCD", players: users});
        userSocket.emit("newPlayer", {roomCode: "ABCD", players: users});
    });

    userSocket.on("joinRoom", (data) => {
        userJoin(userSocket.id, data);
        userSocket.emit("confirmRoom", {roomCode: "ABCD", players: users});
        userSocket.emit("newPlayer", {roomCode: "ABCD", players: users});
    });

    userSocket.on("createOtherPlayers", () => {
        const otherUsers = users.filter((user) => userSocket.id !== user.id);
        userSocket.emit("createOtherPlayers", {players: otherUsers});
        createPlayers();
        generateCards();
        initializeGame();
        dealCards();
    });
    userSocket.on("playCard", (data) => {
        evaluateOrder(data);
    })
    
    // var socket = socketio.connect('http://localhost');
    // socket.emit('game.js-event');

    socketio.emit('disconnect', { user: userSocket.userName, numOfUsers: numOfPlayers });
    userSocket.on('disconnect', function (data) {
        numOfPlayers--;
        socketio.emit('Player_Left', {
            user: data.userName,
            numOfUsers: data.numOfPlayers
        });
        console.log('Connected Players:', numOfPlayers);
    });
    
})

http.listen(port, function () {
    console.log('Listening on port ' + port + '!');
});