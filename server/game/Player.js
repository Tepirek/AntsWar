const config = require("../config").config;
const costs = config.costs;

class Player {
    /**
     * @param {id} id 
     * @param {username} username 
     * @param {socket} socket 
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
        * JSON containing initial amount of soldiers. 
        */
        this.force;
        /**
         * JSON containing maximal amount of soldier. 
         */
        this.forceLimit;
        /**
         * Array containing player's game objects.
         */
        this.gameObjects = [];
    }
}

/**
 * Initializes the player.  
 * @param {color} color Color of the player.
 */
Player.prototype.init = function(color) {
    this.color = color;
    this.initCoords = config.player.baseLocations[this.color];
    this.resources = Object.assign({}, config.player.resources);
    this.workers = Object.assign({}, config.player.workers);
    this.force = 0;
    this.forceLimit = 0;
    this.socket.emit('player__init', {
        id: this.id,
        color: this.color,
        resources: this.resources,
        workers: this.workers,
        gameObjects: this.gameObjects,
        costs: costs,
        force: this.force,
        forceLimit: this.forceLimit
    });
}

/**
 * Update resources.
 */
Player.prototype.updateResources = function() {
    Object.entries(this.resources).forEach(resource => {
        const [key, value] = resource;
        this.resources[key] += this.workers[key];
    });
    this.socket.emit('player__setResources', {
       resources: this.resources 
    });
}

/**
 * Update workers.
 */
Player.prototype.updateWorkers = function() {
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

/**
 * Adds new worker.
 * @param {type} type Type of building.
 */
Player.prototype.addNewWorker = function(type) {
    switch(type) {
        case 'mine':
            type = 'gold';
            break;
        case 'sawmill':
            type = 'wood';
            break;
        case 'quarry':
            type = 'stone';
            break;
        case 'farm': 
            type = 'food';
            break;
    }
    this.socket.emit('player__setWorkers', {
        workers: this.workers
    });
    this.workers[`${type}`] += 1;
}

/**
 * Adds new soldier.
 */
Player.prototype.addNewSoldier = function() {
    this.force += 1;
    this.socket.emit('player__setForce', {
        force: this.force
    });
}

/**
 * Adds force limit.
 * @param {force} force Force to increase.
 */
Player.prototype.addForceLimit = function(force) {
    this.forceLimit += force;
    this.socket.emit('player__setForceLimit', {
        forceLimit: this.forceLimit
    });
}

/**
 * Adds gameObject
 * @param {gameObject} gameObject GameObject to add.
 */
Player.prototype.addGameObject = function(gameObject) {
    this.gameObjects.push(gameObject);
    this.socket.emit('player__addGameObject', {
        gameObject: gameObject
    });
}

/**
 * Removes gameObejct.
 * @param {id} id Game object ID to be deleted 
 */
Player.prototype.removeGameObject = function(id) {
    this.gameObjects = this.gameObjects.filter(gameObject => gameObject.id !== id);
}

module.exports = {
    Player: Player
}