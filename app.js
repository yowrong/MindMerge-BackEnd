const port = process.env.PORT || 3000;
const app = require("express")();
const http = require("http").createServer(app);
const socketio = require("socket.io")(http);
const msg = "Welcome to Mind Merge!";

app.get("/", (req, res) => {
    res.send(msg);
})

let users = [];

const userJoin = (id, username) => {
    const user = { id, username };
    users.push(user);
    return user;
}

const userReset = () => {
    users = [];
}

setInterval(userReset, 300000);

socketio.on("connection", (userSocket) => {
    userSocket.on("createRoom", (data) => {
        const user = userJoin(userSocket.id, data);
        userSocket.emit("initRoom", {roomCode: "ABCD", players: users});
    });
    userSocket.on("joinRoom", (data) => {
        if (data.roomCode === "ABCD") {
            const user = userJoin(userSocket.id, data);
        }
        userSocket.emit("confirmRoom", {roomCode: "ABCD", players: users});
    })
})

http.listen(port);
