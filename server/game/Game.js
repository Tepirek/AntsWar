const uniqueID = require("uuid").v4;
const getDate = require("../functions").getDate;
const config = require("../config").config;
const costs = config.costs;

class Game {
    constructor(io) {
        this.io = io;
        /**
         * Array containing game objects.
         */
        this.gameObjects = [];
        /**
         * Array containing players.
         */
        this.players = [];
        this.updateInterval;
    }
}

/**
 * Initialization of the game. Creating array of default objects and bases at initial positions.
 */
Game.prototype.init = function() {
    const map = [];
    for(let i = 0; i < config.params.width; i++) {
        for(let j = 0; j < config.params.width; j++) {
            let index = i * config.params.width + j; 
            map[index] = 0;
            this.gameObjects[index] = {
                id: uniqueID(),
                type: 'area',
                owner: 'default'
            };
        }
    }
    let color = 0;
    Object.values(this.players).forEach(player => {
        player.init(color);
        color++;
    });
    Object.values(this.players).forEach(player => {
        this.io.to(player.id).emit('game__init', {
            config: config.params,
            map: map,
            costs: config.costs
        });
    });
    Object.values(this.players).forEach(player => {
        this.__addNewBuilding({
            id: player.id,
            type: 'base',
            position: player.initCoords
        });
    });
}

/**
 * Updates game parameters every second.
 */
Game.prototype.update = function() {
    this.updateInterval = setInterval(() => {
        Object.values(this.players).forEach(player => {
            player.updateResources();
        });
    }, 1000);
}

/**
 * Adds a new player to the game.
 * @param {player} player
 */
Game.prototype.addNewPlayer = function(player) {
    if(!Object.keys(this.players).includes(player.id)) {
        this.players[`${player.id}`] = player;
        console.log("Added new player to the game!");
    }
}

/**
 * Removes a player from the game.
 * @param {id} id 
 */
Game.prototype.removePlayer = function(id) {
    if(Object.keys(this.players).includes(id)) {
        this.players = this.players.filter(p => p.id != id);
    }
}

/**
 * Returns player object that has the given id.
 * @param {id} id 
 */
Game.prototype.getPlayer = function(id) {
    if(Object.keys(this.players).includes(id)) {
        return this.players[`${id}`];
    }
};

/**
 * Displays all players.
 */
Game.prototype.displayPlayers = function() {
    Object.entries(this.players).forEach(player => {
        const [key, value] = player;
        console.log(this.players);
    })
}

/**
 * Adds a new building to the map.
 */
Game.prototype.__addNewBuilding = function(request) {
    const owner = this.players[`${request.id}`];
    const canBuy = this.canBuy(owner, request.type);
    const canBuild = this.canBuild(request.position);
    if(canBuy.value === true && canBuild.value === true) {
        const index = request.position.x * config.params.width + request.position.y;
        const gameObject = this.getGameObject(owner, request.type, request.position);
        owner.buy(request.type);
        owner.addGameObject(gameObject);
        this.gameObjects[index] = gameObject;
        Object.values(this.players).forEach(player => {
            this.io.to(player.id).emit('game__addNewBuilding', {
                id: this.gameObjects[index].id,
                owner: player.id,
                type: request.type,
                color: owner.color,
                position: request.position
            });
        });
    }
    else {
        this.io.to(request.id).emit('game__error', {
            date: getDate(),
            author: owner.username,
            type: 'error',
            message: 'Unable to build this structure!'
        });
    }
}

/**
 * Adds a new worker to a given building.
 */
Game.prototype.__addNewWorker = function(request) {
    let gameObject;
    for(let i = 0; i < this.gameObjects.length; i++) {
        gameObject = this.gameObjects[i];
        if(gameObject.id === request.object.id && gameObject.workers + 1 <= gameObject.capacity) {
            gameObject['workers'] += 1;
            this.players[`${request.object.owner}`].addNewWorker(request.object.name);
            this.io.to(request.object.owner).emit('game__addNewWorker', {
                id: request.object.id,
                workers: gameObject['workers']
            });
        }
    }
}

/**
 * Checks if player can buy an object of the given type.
 * @param {Player} player Player object.
 * @param {String} type Type of the object being purchased.
 */
Game.prototype.canBuy = function(player, type) {
    let ret = { value: true };
    Object.entries(player.resources).forEach(resource => {
        const [key, value] = resource;
        if(value < costs[`${type}`][`${key}`]) ret = { value: false, message: 'Not enough resources to build this structure!' };
    });
    return ret;
}
/**
 * Checks if an object can be placed at the given position.
 */
Game.prototype.canBuild = function(position) {
    const index = position.x * config.params.width + position.y;
    if(this.gameObjects[index].type === 'area') return { value: true };
    return { value: false, message: `Can't build at { x: ${position.x}, y: ${position.y} }` };
}

/**
 * Returns an object of the given type.
 * @param {Player} player Player object.
 * @param {String} type Type of the object being purchased.
 * @param {position} position Position of the object.
 */
Game.prototype.getGameObject = function(player, type, position) {
    const index = position.x * config.params.width + position.y;
    const gameObject = {
        id: uniqueID(),
        owner: player.id,
        type: type
    };
    switch(type) {
        case 'base':
            gameObject['capacity'] = 0;
            break;
        case 'farm':
            gameObject['workers'] = 1;
            player.addNewWorker('farm');
            gameObject['capacity'] = config.capacities[`${type}`];
        default:
            break;
    }
    return gameObject;
}

module.exports = {
    Game: Game
}