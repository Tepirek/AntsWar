class Game {
    constructor(sock, player) {
        this.map = [];
        this.player = player;
        this.gameBoard = document.querySelector('.gameBoard');
        this.gameOptions = document.querySelector('.gameOptions');
        this.socket = sock;
        this.socket.on('game__init', (response) => {
            this.init(response);
            this.initGUI();
        });
        this.socket.on('game__updateStats', (response) => {
            this.__updateStats(response);
        });
        this.socket.on('game__addNewBuilding', (response) => {
            this.__addNewBuilding(response);
        });
        this.socket.on('game__addNewWorker', response => this.__addNewWorker(response));
        this.socket.on('game__addNewSquad', response => this.__addNewSquad(response));
        this.socket.on('game__error', response => this.__error(response));
    }
};

/**
 * Initializes the GUI.  
 */
Game.prototype.initGUI = function() {
    document.body.style.backgroundColor = '#333333';
    const antBg = document.querySelector('.backgroundImage');
    const footer = document.querySelector('.footer');
    const lobby = document.querySelector('.lobby');
    document.querySelector('.container').removeChild(antBg);
    document.querySelector('.container').removeChild(footer);
    document.querySelector('.container').removeChild(lobby);
    document.querySelector('.gameOptions').style.visibility = "visible";
    this.gameBoard.style.width = `${this.config.width * this.config.areaSize}px`;
    this.gameBoard.style.height = `${this.config.height * this.config.areaSize}px`;
    this.gameOptions.style.width = `${this.config.width * this.config.areaSize}px`;
}

/**
 * Initializes the game. 
 * @param {response} response Server message in the form: 
 */
Game.prototype.init = function(response) {
    this.config = response.config;
    this.map = response.map;
    this.costs = response.costs;
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
 */
Game.prototype.__addNewBuilding = function(response) {
    const index = response.position.x * this.config.width + response.position.y;
    const building = this.getBuilding(response);
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
        object: object,
        player: this.player.id
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
            this.map[i].gameObject.click();
            this.player.addNewWorker(this.map[i].name);
            this.player.printResources();
            break;
        }
    }
};

/**
 * Sends a request to add a new squad to the server.
 */
Game.prototype.addNewSquad = function(position) {
    this.socket.emit('game_addNewSquad', {
        id: this.player.id,
        position: position
    });
}

Game.prototype.__addNewSquad = function(response) {
    const index = response.position.x * this.config.width + response.position.y;
    const building = this.getBuilding(response);
    this.map[index].setFree(false);
    this.map[index].setObject(building);
    delete this.map[index];
    this.map[index] = building;
}

/**
 * Returns the desired building.
 * @param {position} position Position of the building.
 * @param {type} type Type of the building.
 * @param {color} color Color of the building.
 */
Game.prototype.getBuilding = function(response) {
    let config = {
        id: response.id,
        owner: response.owner,
        x: response.position.x, 
        y: response.position.y, 
        size: this.config.areaSize, 
        game: this,
        color: response.color,
        costs: this.costs[`${response.type}`]
    };
    let building;
    switch(response.type) {
        case 'tower':
            building = new Tower(config);
            break;
        case 'mine': 
            building = new Mine(config);
            building.workers = response.workers;
            break;
        case 'sawmill': 
            building = new Sawmill(config);
            building.workers = response.workers;
            break;
        case 'quarry': 
            building = new Quarry(config);
            building.workers = response.workers;
            break;
        case 'farm': 
            building = new Farm(config);
            building.workers = response.workers;
            break;
        case 'base': 
            building = new Base(config);
            break;
        case 'squad': 
            building = new Squad(config);
            building.workers = response.workers;
            break;
        default:
            break;
    }
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