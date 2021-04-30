const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { Game } = require('./game/Game');
const { Lobby } = require('./game/Lobby');
const { Chat } = require('./game/Chat');

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

server.on('error', (err) => {
    console.error(err);
});

server.listen(8080, () => {
    console.log('Listening on port 8080!');
});

const game = new Game(io);
const lobby = new Lobby(io);
const chat = new Chat(io);

io.on('connection', (sock) => {
    console.log("Someone connected to the server! [" + sock.id + "]");

    // LOBBY EVENTS
    sock.on('lobby_join', (request) => lobby.join(game, sock, request));

    // CHAT EVENTS
    sock.on('chat_init', () => chat.init(game, sock));
    sock.on('chat_message', (request) => chat.sendMessage(game, sock, request));

    // GAME EVENTS
    sock.on('game_addNewBuilding', (request) => game.__addNewBuilding(request));
    sock.on('game_addNewWorker', (request) => game.__addNewWorker(request));
});