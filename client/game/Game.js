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
        this.socket.on('game__addNewSoldier', response => this.__addNewSoldier(response));
        this.socket.on('game__moveSquad', response => this.__moveSquad(response));
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
    document.querySelector('.resources').style.visibility = "visible";
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
            const index = i * this.config.width + j;
            let area = new Area(-1, 'default', i, j, this.config.areaSize, 'grass', 0, this);
            this.map[index] = area;
            this.map[index].draw();
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
    // this.map[index].setFree(false);
    this.map[index].setObject(building);
    delete this.map[index];
    this.map[index] = building;
    this.map[index].draw();
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
 * Sends a request to add a new soldier to the server.
 * @param {object} object Object to be modified.
 */
Game.prototype.addNewSoldier = function(object) {
    console.log("[CLIENT -> SERVER] addNewSoldier");
    this.socket.emit('game_addNewSoldier', {
        object: object,
        player: this.player.id
    });
}

/**
 * Handles of responses from the server about adding a new soldier.
 * @param {response} response Server response in the form: 
 */
Game.prototype.__addNewSoldier = function(response) {
    for(let i = 0; i < this.map.length; i++) {
        if(this.map[i].id === response.id) {
            this.map[i].workers = response.workers;
            console.log(this.map[i]);
            this.map[i].showOptions();
            this.player.printResources();
            break;
        }
    }
}

/**
 * Sends a request to add a force limit to the server.
 * @param {object} object Object to be modified
 */
Game.prototype.addForceLimit = function(object) {
    this.socket.emit('game_addForceLimit', {
        object: object,
        player: this.player.id
    });
}

/**
 * Sends a request to add a new squad to the server.
 * @param {position} position Position of the squad.
 */
Game.prototype.addNewSquad = function(position) {
    this.socket.emit('game_addNewSquad', {
        id: this.player.id,
        position: position
    });
}

/**
 * Handles of responses from the server about adding a new squad.
 * @param {response} response Server response in the form: 
 */
Game.prototype.__addNewSquad = function(response) {
    const index = response.position.x * this.config.width + response.position.y;
    const building = this.getBuilding(response);
    // this.map[index].setFree(false);
    this.map[index].setObject(building);
    delete this.map[index];
    this.map[index] = building;
    this.map[index].draw();
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
            building.workers = response.workers;
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

Game.prototype.moveSquad = function(object, position) {
    this.socket.emit('game_moveSquad', {
        object: object,
        position: position,
        player: this.player.id
    });
}

Game.prototype.__moveSquad = function(response) {
    const previous = response.previous;
    const current = response.current;
    const gameObject = Object.create(Object.getPrototypeOf(this.map[previous]), Object.getOwnPropertyDescriptors(this.map[previous]));
    this.map[current].setObject(gameObject);
    delete this.map[current];
    this.map[current] = gameObject;
    gameObject.move(response.currentPosition);
    this.map[previous] = new Area(-1, 'default', response.previousPosition.x, response.previousPosition.y, this.config.areaSize, 'grass', 0, this);
}

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