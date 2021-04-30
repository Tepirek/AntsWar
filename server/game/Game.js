const config = require("../config").config;
const costs = config.costs;

class Game {
    constructor(io) {
        this.io = io;
        /**
         * Array containing game objects.
         */
        this.map = [];
        /**
         * Array containing players.
         */
        this.players = [];
    }
}

/**
 * Initialization of the game. Creating array of default objects and bases at initial positions.
 */
Game.prototype.init = function() {
    for(let i = 0; i < config.params.width; i++) {
        for(let j = 0; j < config.params.width; j++) {
            this.map[i * config.params.width + j] = 0;
        }
    }
    let color = 0;
    Object.values(this.players).forEach(player => {
        player.init(color);
        console.log(player);
        color++;
    })
    color = 0;
    Object.values(this.players).forEach(player => {
        this.io.to(player.id).emit('game__init', {
            config: config.params,
            map: this.map
        });
        this.__addNewBuilding({
            id: player.id,
            target: 'base',
            color: color,
            position: player.initCoords
        });
        color++;
    })
}

/**
 * Updates game parameters every second.
 */
Game.prototype.update = function() {
    setInterval(() => {
        Object.values(this.players).forEach(player => {
            player.updateStats();
        })
    })
}

/**
 * Adds a new player to the game.
 */
Game.prototype.addNewPlayer = function(player) {
    if(!Object.keys(this.players).includes(player.id)) {
        this.players[`${player.id}`] = player;
        console.log("Added new player to the game!");
    }
}

/**
 * 
 */

Game.prototype.getPlayer = function(id) {
    if(Object.keys(this.players).includes(id)) {
        return this.players[`${id}`];
    }
};

/**
 * 
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
    Object.values(this.players).forEach(player => {
        this.io.to(player.id).emit('game__addNewBuilding', {
            owner: request.id,
            target: request.target,
            color: request.color,
            position: request.position
        })
    })
}

/**
 * Adds a new worker to a given building.
 */
Game.prototype.__addNewWorker = function() {

}

module.exports = {
    Game: Game
}