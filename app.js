const { listeners } = require("process");

const port = process.env.PORT || 3000;
const app = require("express")();
const http = require("http").createServer(app);
const socketio = require("socket.io")(http);
// const WebSocket = require("ws");
const msg = "Welcome to Mind Merge!";

// let enterNameButton = // name button

/* Game */
const numOfPlayers = 4;
var level = 1;
const MAX_LEVEL = 8;


/* Cards */
const random = Math.floor(Math.random() * 100) + 1;
const cardValue;

var cards = [];
for (let i = 0; i < 101; i++) {
    cards.push(i);
}
return cards;

function dealCards() {

}

/* Player */
class Player{
    constructor(name) {
        this.playerCards = [];
        this.name = name;
    }

    dealCards(level) {
        for (let i = 0; i <= level; i++) {
            let randomCard = random;
            this.playerCards.push(randomCard);
            cards.splice(randomCard, 1);
        }
    }

    sortCards() {
        this.playerCards.sort.reverse();
    }

    playCard() {
        this.playerCards.pop();
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




