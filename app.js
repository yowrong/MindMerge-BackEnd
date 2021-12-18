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

socketio.on("connection", (userSocket) => {
    userSocket.emit("welcome", "Hi");
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data);
    });
})

http.listen(port);
