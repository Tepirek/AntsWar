const config = require("../config").config;

class Player {
    /**
     * 
     * @param {id} id 
     * @param {username} username 
     */
    constructor(id, username) {
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
    }
}

Player.prototype.init = function(color) {
    this.color = color;
    this.initCoords = config.player.baseLocations[this.color];
    this.resources = config.player.resources;
}

Player.prototype.updateStats = function() {

}

module.exports = {
    Player: Player
}