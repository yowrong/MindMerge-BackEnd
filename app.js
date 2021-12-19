// const { listeners } = require("process");

const port = process.env.PORT || 3000;
const app = require("express")();
const http = require("http").createServer(app);
const socketio = require("socket.io")(http);
// const WebSocket = require("ws");
const msg = "Welcome to Mind Merge!";

// let enterNameButton = // name button

app.get("/", (req, res) => {
    res.send(msg);
})

// const server = new WebSocket.Server(
//     {
//       port: port,
//     }
// );

let users = [];

const userJoin = (id, username) => {
    const user = { id, username };
    users.push(user);
    return user;
}

socketio.on("connection", (userSocket) => {
    userSocket.emit("welcome", {message: "Donna is the best <3"});
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data);
    });
    userSocket.on("createRoom", (data) => {
        userSocket.emit("initRoom", {roomCode: "ABCD"});
        const user = userJoin(userSocket.id, data);
    });
    userSocket.on("joinRoom", (data) => {
        if (data == "ABCD") {
            const user = userJoin(userSocket.id, data);
        }
        userSocket.emit("confirmRoom", {roomCode: "ABCD"});
    })
})

http.listen(port);
