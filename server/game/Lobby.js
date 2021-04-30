const config = require("../config").config;
const getDate = require("../functions").getDate;
const { Player } = require("../game/Player");

class Lobby {
    constructor(io) {
        this.io = io;
        /**
         * Defines the maximum amount of players in the lobby.
         */
        this.capacity;
        /**
         * 
         */
        this.lobby = [];
    }
}

Lobby.prototype.init = function() {
    /**
     * Initialization of the lobby.
     */
    this.capacity = config.lobby.capacity;
}

Lobby.prototype.join = function(game, sock, request) {
    if(this.lobby.filter(player => player.username == request.username).length) {
        sock.emit('lobby__error', {
            message: "Name is already taken!"
        });
        return;
    }
    const data = {
        id: sock.id,
        username: request.username,
        date: getDate()
    };
    const player = new Player(
        sock,
        sock.id,
        request.username
    );
    this.lobby.push(data);
    game.addNewPlayer(player);
    sock.emit('lobby__connected', data);
    Object.keys(game.players).forEach(key => {
        this.io.to(key).emit('lobby__players', {
            lobby: this.lobby,
            capacity: config.lobby.capacity
        });
    });
    if(this.isFull()) {
        this.io.emit('game__prepare', {});
        setTimeout(() => {
            game.init();
            game.update();
        }, config.lobby.delay);
    }
}

Lobby.prototype.isFull = function() {
    return Object.keys(this.lobby).length == config.lobby.capacity;
}

module.exports = {
    Lobby: Lobby
}