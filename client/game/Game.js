class Game {
    constructor(sock, player) {
        this.map = [];
        this.player = player;
        this.gameBoard = document.querySelector('.gameBoard');
        this.gameOptions = document.querySelector('.gameOptions');
        this.socket = sock;
        this.socket.on('game__init', (response) => {
            this.init(response);
        });
        this.socket.on('game__updateStats', (response) => {
            this.__updateStats(response);
        });
        this.socket.on('game__addNewBuilding', (response) => {
            this.__addNewBuilding(response);
        });
        this.socket.on('game__addNewWorker', response => this.__addNewWorker(response));
        this.socket.on('game__error', response => this.__error(response));
    }
};

/**
 * Initializes the game. 
 * @param {response} response Server message in the form: 
 */
Game.prototype.init = function(response) {
    document.body.style.backgroundColor = '#333333';
    const antBg = document.querySelector('.backgroundImage');
    const footer = document.querySelector('.footer');
    const lobby = document.querySelector('.lobby');
    document.querySelector('.container').removeChild(antBg);
    document.querySelector('.container').removeChild(footer);
    document.querySelector('.container').removeChild(lobby);
    document.querySelector('.gameOptions').style.visibility = "visible";
    this.config = response.config;
    this.map = response.map;
    this.costs = response.costs;
    this.gameBoard.style.width = `${this.config.width * this.config.areaSize}px`;
    this.gameBoard.style.height = `${this.config.height * this.config.areaSize}px`;
    this.gameOptions.style.width = `${this.config.width * this.config.areaSize}px`;
    for(let i = 0; i < this.config.height; i++) {
        for(let j = 0; j < this.config.width; j++) {
            const index = i*this.config.width + j;
            let area = new Area(-1, 'default', i, j, this.config.areaSize, 'grass', 0, this);
            this.map[index] = area;
        }
    }
};

/**
 * Sends a request to add a building to the server
 * @param {position} position Position of the building.
 * @param {type} type Type of the building.
 */
Game.prototype.addNewBuilding = function(position, type) {
    this.socket.emit('game_addNewBuilding', {
        id: this.player.id,
        type: type,
        position: position
    });
};

/**
 * Handles responses from the server to a request to add a building.
 * @param {response} response Server response in the form: 
 * 
 */
Game.prototype.__addNewBuilding = function(response) {
    const index = response.position.x * this.config.width + response.position.y;
    const building = this.getBuilding(response.id, response.owner, response.position, response.type, response.color, response.costs);
    this.map[index].setFree(false);
    this.map[index].setObject(building);
    delete this.map[index];
    this.map[index] = building;
};

/**
 * Sends a request to add a new employee to the server.
 * @param {object} object Object to be modified.
 */
Game.prototype.addNewWorker = function(object) {
    this.socket.emit('game_addNewWorker', {
        object: object
    });
}

/**
 * Handles of responses from the server about adding a new employee.
 * @param {response} response Server response in the form: 
 */
Game.prototype.__addNewWorker = function(response) {
    for(let i = 0; i < this.map.length; i++) {
        if(this.map[i].id === response.id) {
            this.map[i].workers = response.workers;
            this.player.addNewWorker(this.map[i].name);
            break;
        }
    }
};

Game.prototype.addNewSquad = function(position) {

}

/**
 * Returns the desired building.
 * @param {position} position Position of the building.
 * @param {type} type Type of the building.
 * @param {color} color Color of the building.
 */
Game.prototype.getBuilding = function(id, owner, position, type, color) {
    let config = {
        id: id,
        owner: owner,
        x: position.x, 
        y: position.y, 
        size: this.config.areaSize, 
        game: this,
        color: color,
        costs: this.costs[`${type}`]
    };
    let building;
    if(type == 'tower') building = new Tower(config);
    else if(type == 'mine') building = new Mine(config);
    else if(type == 'sawmill') building = new Sawmill(config);
    else if(type == 'quarry') building = new Quarry(config);
    else if(type == 'farm') building = new Farm(config);
    else if(type == 'base') building = new Base(config);
    else if(type == 'squad') building = new Squad(config);
    return building;
};

/**
 * Informs player about error
 * @param {response} response Server response in the form: 
 */
Game.prototype.__error = function(response) {
    const logs = document.querySelector('#logsList');
    
    const li = document.createElement('li');
    const author = (response.author) ? `[${response.author}]` : '';
    li.innerHTML = `<small>${response.date} ${author}</small> - ${response.message}`;
    logs.appendChild(li);
    logs.scrollTop = logs.scrollHeight;
}