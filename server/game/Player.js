const config = require("../config").config;
const costs = config.costs;

class Player {
    /**
     * 
     * @param {id} id 
     * @param {username} username 
     */
    constructor(socket, id, username) {
        /**
         * Player's socket.
         */
        this.socket = socket;
        /**
         * Player's ID.
         */
        this.id = id;
        /**
         * Defines the name of the player.
         */
        this.username = username;
        /**
         * Numerical representation of players color.
         */
        this.color;
        /**
         * JSON containing initial amount of resources. 
         */
        this.resources;
        /**
         * JSON containing initial amount of workers. 
         */
        this.workers;
        /**
         * Array containing player's game objects.
         */
        this.gameObjects = [];
    }
}

Player.prototype.init = function(color) {
    this.color = color;
    this.initCoords = config.player.baseLocations[this.color];
    this.resources = Object.assign({}, config.player.resources);
    this.workers = Object.assign({}, config.player.workers);
    this.socket.emit('player__init', {
        id: this.id,
        color: this.color,
        resources: this.resources,
        workers: this.workers,
        gameObjects: this.gameObjects
    });
}

Player.prototype.updateResources = function() {
    Object.entries(this.resources).forEach(resource => {
        const [key, value] = resource;
        this.resources[key] += this.workers[key];
    });
    this.socket.emit('player__setResources', {
       resources: this.resources 
    });
    this.socket.emit('player__setWorkers', {
        workers: this.workers
    });
}

/**
 * Buys an object.
 * @param {String} type Type of the object being purchased.
 */
Player.prototype.buy = function(type) {
    Object.entries(this.resources).forEach(resource => {
        const [key, value] = resource;
        this.resources[`${key}`] -= costs[`${type}`][`${key}`];
    });
}

Player.prototype.addNewWorker = function(type) {
    switch(type.toLowerCase()) {
        case 'farm': 
            type = 'food';
            break;
    }
    this.workers[`${type}`] += 1;
} 

Player.prototype.addGameObject = function(gameObject) {
    this.gameObjects.push(gameObject);
}

Player.prototype.removeGameObject = function(id) {
    this.gameObjects = this.gameObjects.filter(gameObject => gameObject.id !== id);
}

module.exports = {
    Player: Player
}