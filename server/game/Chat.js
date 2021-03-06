const getDate = require("../functions").getDate;

class Chat {
    constructor(io) {
        this.io = io;
        /**
         * Array containing messages.
         */
        this.messages = [];
    }
}

/**
 * Initializes the chat.
 * @param {game} game Game.
 * @param sock sock Sock.
 */
Chat.prototype.init = function(game, sock) {
    sock.emit('chat__message', {
        date: getDate(),
        text: `Witaj! Połączono jako <span style="color:#1be393">${game.getPlayer(sock.id).username}</span>`
    });
    this.messages.forEach(message => {
        sock.emit('chat__message', message);
    })
}

/**
 * Sends a message.
 * @param {game} game Game.
 * @param {sock} sock Sock.
 * @param {request} request Request.
 */
Chat.prototype.sendMessage = function(game, sock, request) {
    const message = { 
        date: getDate(), 
        text: request.message,
        author: game.getPlayer(sock.id).username
    };
    this.messages.push(message);
    this.io.emit('chat__message', message);
    console.log(this.messages);
}

module.exports = {
    Chat: Chat
}