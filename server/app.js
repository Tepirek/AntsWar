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
    updateCurrentConnections();
    console.log("Someone connected to the server! [" + sock.id + "]");

    // LOBBY EVENTS
    sock.on('lobby_join', (request) => lobby.join(game, sock, request));

    // CHAT EVENTS
    sock.on('chat_init', () => chat.init(game, sock));
    sock.on('chat_message', (request) => chat.sendMessage(game, sock, request));

    // GAME EVENTS
    sock.on('game_addNewBuilding', (request) => game.__addNewBuilding(request));
    sock.on('game_addNewWorker', (request) => game.__addNewWorker(request));
    sock.on('game_addNewSquad', request => game.__addNewSquad(request));
    sock.on('game_addNewSoldier', request => game.__addNewSoldier(request));
    sock.on('game_addForceLimit', request => game.__addForceLimit(request));
    sock.on('game_moveSquad', request => game.__moveSquad(request))
});

/**
 * Updates current connections.
 */
const updateCurrentConnections = async () => {
    const clients = await io.fetchSockets();
    const players = [];
    Object.entries(game.players).forEach(player => {
        const [key, value] = player;
        Object.values(clients).forEach(client => {
            if(client.id == key) players.push(value);
        });
    });
    game.players = [];
    lobby.lobby = [];
    clearInterval(game.updateInterval);
}