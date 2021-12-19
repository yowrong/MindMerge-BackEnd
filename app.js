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

    numOfPlayers++;
    let name = "player";
    userSocket.userName = name;
    socketio.emit('user_joined', {
        user: socketio.userName,
        numOfUsers: numOfPlayers
    });

    console.log('Number of players:', numOfPlayers);
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
    });
    userSocket.on("playCard", () => {

    })

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