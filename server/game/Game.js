const uniqueID = require("uuid").v4;
const { PathFinder } = require("../PathFinder");
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
    for(let i = 0; i < config.params.height; i++) {
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
            player.updateWorkers();
        });
    }, 1000);
}

/**
 * Adds a new player to the game.
 * @param {player} player Player to add.
 */
Game.prototype.addNewPlayer = function(player) {
    if(!Object.keys(this.players).includes(player.id)) {
        this.players[`${player.id}`] = player;
        console.log("Added new player to the game!");
    }
}

/**
 * Removes a player from the game.
 * @param {id} id Player's id.
 */
Game.prototype.removePlayer = function(id) {
    if(Object.keys(this.players).includes(id)) {
        this.players = this.players.filter(p => p.id != id);
    }
}

/**
 * Returns player object that has the given id.
 * @param {id} id Player's id.
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
 * @param {request} request Request from the client.
 */
Game.prototype.__addNewBuilding = function(request) {
    const owner = this.players[`${request.id}`];
    const canBuy = this.canBuy(owner, request.type);
    const canBuild = this.canBuild(request.position);
    if(canBuy.value === true && canBuild.value === true) {
        const index = request.position.x * config.params.width + request.position.y;
        const gameObject = this.getGameObject(owner, request.type, request.position);
        owner.buy(request.type);
        this.gameObjects[index] = gameObject;
        owner.addGameObject(gameObject);
        Object.values(this.players).forEach(player => {
            this.io.to(player.id).emit('game__addNewBuilding', {
                id: gameObject.id,
                owner: player.id,
                type: request.type,
                color: owner.color,
                position: request.position,
                workers: gameObject.workers
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
 * @param {request} request Request from the client.
 */
Game.prototype.__addNewWorker = function(request) {
    const player = this.players[`${request.object.owner}`];
    if(this.players[`${request.player}`].gameObjects.some(o => o.id === request.object.id)) {
        let gameObject;
        for(let i = 0; i < this.gameObjects.length; i++) {
            gameObject = this.gameObjects[i];
            const canBuy = this.canBuy(player, 'workers');
            if(gameObject.id === request.object.id && gameObject.workers + 1 <= gameObject.capacity && canBuy.value === true) {
                player.buy('workers');
                gameObject.workers += 1;
                player.addNewWorker(gameObject.type);
                this.io.to(request.object.owner).emit('game__addNewWorker', {
                    id: request.object.id,
                    workers: gameObject['workers']
                });
            }
        }
    }   
}

/**
 * Adds a new squad.
 * @param {request} request Request from the client.
 */
Game.prototype.__addNewSquad = function(request) {
    const owner = this.players[`${request.id}`];
    const canBuy = this.canBuy(owner, 'squad');
    const canMove = this.canMove(request.position);
    if(canBuy.value === true && canMove.value === true && owner.force + 1 <= owner.forceLimit) {
        const index = request.position.x * config.params.width + request.position.y;
        const gameObject = this.getGameObject(owner, 'squad', request.position);
        owner.buy('squad');
        this.gameObjects[index] = gameObject;
        owner.addGameObject(gameObject);
        Object.values(this.players).forEach(player => {
            this.io.to(player.id).emit('game__addNewSquad', {
                id: gameObject.id,
                owner: player.id,
                type: request.type,
                color: owner.color,
                position: request.position,
                type: 'squad',
                workers: gameObject.workers,
                attack: 10,
                defense: 10,
                life: 100
            });
        });
    }
}

/**
 * Adds a new worker to a given squad.
 * @param {request} request Request from the client.
 */
Game.prototype.__addNewSoldier = function(request) {
    const player = this.players[`${request.object.owner}`];
    if(this.players[`${request.player}`].gameObjects.some(o => o.id === request.object.id)) {
        let gameObject;
        for(let i = 0; i < this.gameObjects.length; i++) {
            gameObject = this.gameObjects[i];
            const canBuy = this.canBuy(player, 'squad');
            if(gameObject.id === request.object.id && gameObject.workers + 1 <= gameObject.capacity && canBuy.value === true && player.force + 1 <= player.forceLimit) {
                player.buy('squad');
                gameObject.workers += 1;
                player.addNewSoldier();
                this.io.to(request.object.owner).emit('game__addNewSoldier', {
                    id: request.object.id,
                    workers: gameObject['workers']
                });
                console.log("[SERVER -> CLIENT] __addNewSoldier");
            }
            else {
                this.io.to(request.id).emit('game__error', {
                    date: getDate(),
                    author: player.username,
                    type: 'error',
                    message: 'Unable to build this structure!'
                });
            }
        }
    }   
}

/**
 * Adds a force limit.
 * @param {request} request Request from the client.
 */
Game.prototype.__addForceLimit = function(request) {
    const player = this.players[`${request.object.owner}`];
    if(this.players[`${request.player}`].gameObjects.some(o => o.id === request.object.id)) {
        let gameObject;
        for(let i = 0; i < this.gameObjects.length; i++) {
            gameObject = this.gameObjects[i];
            const canBuy = this.canBuy(player, 'forceLimit');
            if (canBuy.value === false) {
                this.io.to(player.id).emit('game__error', {
                    date: getDate(),
                    author: player.username,
                    type: 'error',
                    message: 'Unable to upgrade force limit!'
                });
                return;
            }
            if(gameObject.id === request.object.id && gameObject.workers + 1 <= gameObject.capacity && canBuy.value === true) {
                player.buy('forceLimit');
                gameObject.workers += 1;
                player.addNewWorker(gameObject.type);
                player.addForceLimit(5);
                this.io.to(request.object.owner).emit('game__addNewWorker', {
                    id: request.object.id,
                    workers: gameObject['workers']
                });
                return;
            }
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
 * @param {position} position Position of the object.
 */
Game.prototype.canBuild = function(position) {
    const index = position.x * config.params.width + position.y;
    if(this.gameObjects[index].type === 'area') return { value: true };
    return { value: false, message: `Can't build at { x: ${position.x}, y: ${position.y} }` };
}

/**
 * Checks if the object can move on the given position.
 * @param {position} position Target position.
 */
Game.prototype.canMove = function(position) {
    const index = position.x * config.params.width + position.y;
    if(this.gameObjects[index].type === 'area') return { value: true };
    return { value: false, message: `Can't move to { x: ${position.x}, y: ${position.y} }` };
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
        case 'tower':
            break;
        case 'mine':
        case 'sawmill':
        case 'quarry':
        case 'farm':
            gameObject['workers'] = 1;
            gameObject['capacity'] = config.capacities[`${type}`];
            player.addNewWorker(type);
            break;
        case 'base':
            gameObject['workers'] = 1;
            gameObject['capacity'] = 5;
            player.addForceLimit(5);
            break;
        case 'squad':
            gameObject['workers'] = 1;
            gameObject['capacity'] = config.capacities[`${type}`];
            player.addNewSoldier();
            break;
        default:
            break;
    }
    return gameObject;
}

/**
 * Support for the movement of the ant squad.
 * @param {request} request Request from client.
 */
Game.prototype.__moveSquad = function(request) {
    const player = this.players[`${request.object.owner}`];
    if(this.players[`${request.player}`].gameObjects.some(o => o.id === request.object.id)) {
        const start = request.object.position;
        const end = request.position;
        const pathFinder = new PathFinder(config.params.height, config.params.width);
        pathFinder.init(this.gameObjects);
        const path = pathFinder.find(start, end);
        if(!path) {
            console.log("No path");
            return;
        }
        let delay = 0;
        for(var i = 1; i < path.length; i++) {
            let previous = path[i - 1].x * config.params.width + path[i - 1].y;
            let current = path[i].x * config.params.width + path[i].y;
            const previousPosition = path[i - 1];
            const currentPosition = path[i];
            const gameObject = Object.assign({}, this.gameObjects[previous]);
            this.gameObjects[previous] = {
                id: uniqueID(),
                type: 'area',
                owner: 'default'
            };
            this.gameObjects[current] = gameObject;
            setTimeout(() => {
                this.io.emit('game__moveSquad', {
                    id: request.object.id,
                    previous: previous,
                    current: current,
                    previousPosition: previousPosition,
                    currentPosition: currentPosition
                });
            }, delay);
            delay += 300;
        }
    }
}

module.exports = {
    Game: Game
}