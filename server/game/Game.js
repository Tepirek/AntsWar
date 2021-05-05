const uniqueID = require("uuid").v4;
const { PathFinder } = require("../PathFinder");
const getDate = require("../functions").getDate;
const config = require("../config").config;
const costs = config.costs;
const stats = config.stats;

class Game {
    constructor(io) {
        this.io = io;
        /**
         * 3D Array containing game objects.
         */
        this.gameObjects;
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
    this.initGameObjects();
    let color = 0;
    Object.values(this.players).forEach(player => {
        player.init(color);
        color++;
    });
    Object.values(this.players).forEach(player => {
        this.io.to(player.id).emit('game__init', {
            config: config.params,
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

Game.prototype.initGameObjects = function() {
    this.gameObjects = Array.apply(null, new Array(config.params.height)).map(
        () => Array.apply(null, new Array(config.params.width)).map(
            () => Array.apply(null, new Array(1)).map(
                () => {
                    return {
                        id: uniqueID(),
                        type: 'area',
                        owner: 'default'
                    };
                }
            )
        )
    );
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
        console.log(`Added new player {${player.username}} to the game!`);
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
    const p = request.position;
    if(canBuy.value === true && canBuild.value === true) {
        const gameObject = this.createGameObject(owner, request.type, request.position);
        owner.buy(request.type);
        this.gameObjects[p.x][p.y].push(gameObject);
        owner.addGameObject(gameObject);
        const data = Object.assign({}, gameObject);
        data['position'] = request.position,
        data['type'] = request.type;
        data['color'] = owner.color;
        Object.values(this.players).forEach(player => {
            this.io.to(player.id).emit('game__addNewBuilding', data);
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
        let gameObject = this.getGameObject(request.object.id);
        const canBuy = this.canBuy(player, 'workers');
        if(gameObject != null && gameObject.workers + 1 <= gameObject.stats.capacity && canBuy.value === true) {
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

/**
 * Adds a new soldier to a given squad.
 * @param {request} request Request from the client.
 */
Game.prototype.__addNewSoldier = function(request) {
    const player = this.players[`${request.object.owner}`];
    if(this.players[`${request.player}`].gameObjects.some(o => o.id === request.object.id)) {
        let gameObject = this.getGameObject(request.object.id);
        const canBuy = this.canBuy(player, 'squad');
        if(gameObject != null && gameObject.workers + 1 <= gameObject.stats.capacity && canBuy.value === true && player.force + 1 <= player.forceLimit) {
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


/**
 * Adds a new defender to a given wall.
 * @param {request} request Request from the client.
 */
 Game.prototype.__addNewDefender = function(request) {
    const player = this.players[`${request.object.owner}`];
    if(this.players[`${request.player}`].gameObjects.some(o => o.id === request.object.id)) {
        let gameObject = this.getGameObject(request.object.id);
        const canBuy = this.canBuy(player, 'workers');
        if(gameObject != null && gameObject.workers + 1 <= gameObject.stats.capacity && canBuy.value === true) {
            player.buy('workers');
            gameObject.workers += 1;
            gameObject.stats.life += 10;
            player.addNewWorker(gameObject.type);
            this.io.to(request.object.owner).emit('game__addNewDefender', {
                id: request.object.id,
                workers: gameObject['workers'],
                life: 10
            });
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
        let gameObject = this.getGameObject(request.object.id);
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
        if(gameObject != null && gameObject.workers + 1 <= gameObject.stats.capacity && canBuy.value === true) {
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
    if(this.gameObjects[position.x][position.y].length < 2) return { value: true };
    return { value: false, message: `Can't build at { x: ${position.x}, y: ${position.y} }` };
}

/**
 * Checks if the object can move on the given position.
 * @param {position} position Target position.
 */
Game.prototype.canMove = function(position) {
    const index = position.x * config.params.width + position.y;
    if(this.gameObjects[position.x][position.y].length < 2) return { value: true };
    return { value: false, message: `Can't move to { x: ${position.x}, y: ${position.y} }` };
}

/**
 * Returns an object of the given type.
 * @param {Player} player Player object.
 * @param {String} type Type of the object being purchased.
 * @param {position} position Position of the object.
 */
Game.prototype.createGameObject =  function(player, type, position) {
    const index = position.x * config.params.width + position.y;
    const gameObject = {
        id: uniqueID(),
        owner: player.id,
        type: type,
        workers: 1,
        costs: costs[`${type}`],
        stats: Object.assign({}, stats[`${type}`])
    };
    switch(type) {
        case 'tower':
            player.addNewWorker(type);
            break;
        case 'mine':
            player.addNewWorker(type);
            break;
        case 'sawmill':
            player.addNewWorker(type);
            break;
        case 'quarry':
            player.addNewWorker(type);
            break;
        case 'farm':
            player.addNewWorker(type);
            break;
        case 'wall':
            player.addNewWorker(type);
            break;    
        case 'base':
            player.addForceLimit(stats.base.forceLimit);
            break;
        case 'squad':
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
        let timers = [];
        for(let i = 1; i < path.length; i++) {
            const previous = path[i - 1];
            const current = path[i];
            let previousElements = this.gameObjects[previous.x][previous.y];
            let currentElements = this.gameObjects[current.x][current.y];
            timers[i] = setTimeout(() => {
                if(this.gameObjects[current.x][current.y].length > 1) {
                    timers.forEach(t => clearTimeout(t));
                    return;
                }
                let gameObject = this.getGameObject(request.object.id);
                currentElements.push(gameObject);
                this.gameObjects[previous.x][previous.y] = previousElements.filter(o => o.id != request.object.id);
                this.io.emit('game__moveSquad', {
                    id: request.object.id,
                    previous: previous,
                    current: current
                });
            }, delay);
            delay += 500;
        }
    }
}

module.exports = {
    Game: Game
}

Game.prototype.getGameObject = function(id) {
    let gameObject;
    this.gameObjects.every(
        vi => vi.every(
            vj => vj.every(
                vk => {
                    if(vk.id === id) {
                        gameObject = vk;
                        return false;
                    }
                    return true;
                }
            )
        )
    )
    return gameObject;
}