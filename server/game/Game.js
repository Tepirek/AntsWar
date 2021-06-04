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
    pos = 0;
    this.gameObjects = Array.apply(null, new Array(config.params.height)).map(
        () => Array.apply(null, new Array(config.params.width)).map(
            () => Array.apply(null, new Array(1)).map(
                () => {
                    let x = Math.floor(pos / config.params.width);
                    let y = pos - (x * config.params.width)
                    pos++;
                    return {
                        id: uniqueID(),
                        type: 'area',
                        owner: 'default',
                        position: {
                            x: x,
                            y: y
                        }
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
            gameObject.stats.currentLife += stats[gameObject.type].life;
            gameObject.stats.life += stats[gameObject.type].life;
            player.addNewWorker(gameObject.type);
            this.io.to(request.object.owner).emit('game__addNewWorker', {
                id: request.object.id,
                workers: gameObject['workers'],
                currentLife: gameObject.stats.currentLife,
                life: gameObject.stats.life
            });
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
            gameObject.stats.currentLife += stats.squad.life;
            gameObject.stats.life += stats.squad.life;
            gameObject.stats.attack += stats.squad.attack;
            gameObject.stats.defense += stats.squad.defense;
            player.addNewSoldier();
            this.io.to(request.object.owner).emit('game__addNewSoldier', {
                id: request.object.id,
                workers: gameObject['workers'],
                currentLife: gameObject.stats.currentLife,
                life: gameObject.stats.life,
                attack: gameObject.stats.attack,
                defense: gameObject.stats.defense
            });
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
            gameObject.stats.currentLife += stats.wall.life;
            gameObject.stats.life += stats.wall.life;
            player.addNewWorker(gameObject.type);
            this.io.to(request.object.owner).emit('game__addNewDefender', {
                id: request.object.id,
                workers: gameObject['workers'],
                currentLife: gameObject.stats.currentLife,
                life: gameObject.stats.life
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
        stats: Object.assign({}, stats[`${type}`]),
        position: {
            x: position.x,
            y: position.y
        }
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
        var start = request.object.position;
        const end = request.position;
        let interval = setInterval(() => {
            var i = 1;
            const pathFinder = new PathFinder(config.params.height, config.params.width);
            pathFinder.init(this.gameObjects);
            var path = pathFinder.find(start, end, undefined);
            if(!path) {
                console.log("No path");
                clearInterval(interval);
                return;
            }
            if(i >= path.length) {
                clearInterval(interval);
                return;
            }
            var previous = path[i - 1];
            var current = path[i];
            let previousElements = this.gameObjects[previous.x][previous.y];
            let currentElements = this.gameObjects[current.x][current.y];
            let gameObject = this.getGameObject(request.object.id);
            if(this.gameObjects[current.x][current.y].length > 1) {
                let defender = this.gameObjects[current.x][current.y].filter(o => o.type != "area")[0];
                this.__battle({
                    attacker: gameObject,
                    defender: defender
                });
            } else {
                currentElements.push(gameObject);
                this.updatePosition(gameObject, current);
                this.gameObjects[previous.x][previous.y] = previousElements.filter(o => o.id != request.object.id);
                this.io.emit('game__moveSquad', {
                    id: request.object.id,
                    previous: previous,
                    current: current
                });
            }
            start = current;
            i++;
        }, stats.squad.movementSpeed);
    }
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
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

/**
 * 
 */
Game.prototype.__battle = function(request) {       
    const a = this.getGameObject(request.attacker.id);
    const d = this.getGameObject(request.defender.id);
    let interval = setInterval(() => {
        if(a == undefined || d == undefined || !this.checkIfNeighbors(a, d)) {
            clearInterval(interval);
            return;
        }
        if(a.stats.currentLife <= 0 || d.stats.currentLife <= 0) {
            this.io.emit("game__destroyGameObject", {
                id: d.id,
                x: d.position.x,
                y: d.position.y
            });
            if(a.stats.currentLife <= 0) removeGameObject(a);
            if(d.stats.currentLife <= 0) this.removeGameObject(d);
            clearInterval(interval);
            return;
        }
        d.stats.currentLife -= a.stats.attack;
        if(d.stats.currentLife < 0) d.stats.currentLife = 0;
        this.io.emit("game__battle", {
            attacker: {
                id: a.id,
                currentLife: a.stats.currentLife
            },
            defender: {
                id: d.id,
                currentLife: d.stats.currentLife
            }
        });
    }, 1000);
}

/**
 * 
 * @param {*} o1 
 * @param {*} o2 
 * @returns 
 */
Game.prototype.checkIfNeighbors = function(o1, o2) {
    for(var i = o1.position.x - 1; i < o1.position.x + 2; i++) {
        for(var j = o1.position.y - 1; j < o1.position.y + 2; j++) {
            if(i < 0 || j < 0 || i > 31 || j > 63) continue;
            if(this.gameObjects[i][j].filter(o => o.id == o2.id).length > 0) return true;
        }
    }
    return false;
}

/**
 * 
 * @param {*} object 
 * @param {*} position 
 */
Game.prototype.updatePosition = function(object, position) {
    object.position = position;
}

/**
 * 
 * @param {*} object 
 */
Game.prototype.removeGameObject = function(object) {
    const x = object.position.x;
    const y = object.position.y;
    this.players.forEach(p => p.removeGameObject(object.id));
    this.gameObjects[x][y] = this.gameObjects[x][y].filter(o => o.id != object.id);
}

/**
 * 
 */
module.exports = {
    Game: Game
}