class Game {
    constructor(sock, player) {
        /**
         * 3D array containing game objects
         */
        this.gameObjects;
        this.visibility;
        this.lifeBarVisible = false;
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
        this.socket.on('game__addNewSoldier', response => this.__addNewSoldier(response));
        this.socket.on('game__addNewDefender', response => this.__addNewDefender(response));
        this.socket.on('game__moveSquad', response => this.__moveSquad(response));
        this.socket.on('game__error', response => this.__error(response));
        
        document.addEventListener('keydown', e => {
            if(e.keyCode === 9) {
                e.preventDefault();
                if(this.gameObjects != undefined && this.gameObjects.length > 0) {
                    this.gameObjects.forEach(row => {
                        row.forEach(column => {
                            column.forEach(elem => {
                                if (elem.id != -1) {
                                    elem.showLifeBar(this.lifeBarVisible);
                                }
                            });
                        });
                    });
                    this.lifeBarVisible = !this.lifeBarVisible;
                }
            }
        }, false);
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
    this.costs = response.costs;
    // creating 3D array (height x width x 1) of area objects
    let index = 0;
    this.gameObjects = Array.apply(null, new Array(this.config.height)).map(
        () => Array.apply(null, new Array(this.config.width)).map(
            () => Array.apply(null, new Array(1)).map(
                () => {
                    let i = Math.floor(index / this.config.width);
                    let j = index - (i * this.config.width);
                    index++;
                    const data = {
                        id: -1,
                        owner: 'default',
                        position: { x: i, y: j },
                        type: 'grass',
                        color: 0
                    }
                    const gameObject = new Area(data, this);
                    gameObject.draw();
                    return gameObject;
                }
            )
        )
    );
    this.initFog();
};

Game.prototype.initFog = function() {
    let index = 0;
    this.visibility = Array.apply(null, new Array(this.config.height)).map(() => Array.apply(null, new Array(this.config.width)).map(() => {
        let i = Math.floor(index / this.config.width);
        let j = index - (i * this.config.width);
        index++;
        const data = {
            id: -1,
            owner: 'default',
            position: { x: i, y: j },
            type: 'fog',
            color: 0
        }
        const gameObject = new Fog(data, this);
        gameObject.draw();
        return gameObject;
    }));
}

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
    const p = response.position;
    const building = this.getBuilding(response);
    this.gameObjects[p.x][p.y].push(building);
    this.gameObjects[p.x][p.y].forEach(o => o.draw());
    if(response.owner == this.player.id) {
        this.visibility[p.x][p.y].addFog(-1);
        this.gameObjects[p.x][p.y].forEach(o => this.setFog(o, -1));
    }
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
    let gameObject = this.getGameObject(response.id);
    gameObject.workers = response.workers;
    gameObject.gameObject.click();
    this.player.addNewWorker(gameObject.type);
    this.player.printResources();
};

/**
 * Sends a request to add a new soldier to the server.
 * @param {object} object Object to be modified.
 */
Game.prototype.addNewSoldier = function(object) {
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
    let gameObject = this.getGameObject(response.id);
    gameObject.workers = response.workers;
    gameObject.showOptions();
    this.player.printResources();
};

/**
 * Sends a request to add a new soldier to the server.
 * @param {object} object Object to be modified.
 */
 Game.prototype.addNewDefender = function(object) {
    this.socket.emit('game_addNewDefender', {
        object: object,
        player: this.player.id
    });
}

/**
 * Handles of responses from the server about adding a new defender.
 * @param {response} response Server response in the form: 
 */
Game.prototype.__addNewDefender = function(response) {
    let gameObject = this.getGameObject(response.id);
    gameObject.workers = response.workers;
    gameObject.life += response.life;
    gameObject.currentLife += response.life;
    gameObject.showOptions();
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
 * Returns the desired building.
 * @param {position} position Position of the building.
 * @param {type} type Type of the building.
 * @param {color} color Color of the building.
 */
Game.prototype.getBuilding = function(data) {
    const constructors = {
        tower: Tower,
        mine: Mine,
        sawmill: Sawmill,
        quarry: Quarry,
        farm: Farm,
        wall: Wall,
        base: Base,
        squad: Squad
    };
    const building = new constructors[`${data.type}`](data, this);
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
    let previousElements = this.gameObjects[previous.x][previous.y];
    let currentElements = this.gameObjects[current.x][current.y];
    let gameObject = this.getGameObject(response.id);
    currentElements.push(gameObject);
    previousElements = previousElements.filter(o => o.id != gameObject.id);
    this.gameObjects[previous.x][previous.y] = previousElements;
    gameObject.move(current);
    if(gameObject.owner == this.player.id) {
        previousElements.forEach(o => this.setFog(o, 2));
        currentElements.forEach(o => this.setFog(o, -1));
    }
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

/**
 * 
 * @param {GameObject} o gameObject
 * @param {boolean} v value
 */
Game.prototype.setFog = function(o, v) {
    let radius = o.visibilityRange;
    var x = 0, y = 0;
    for(let i = o.position.x - radius; i < o.position.x + radius + 1; i++) {
        x++;
        for(let j = o.position.y - radius; j < o.position.y + radius + 1; j++) {
            y++
            if(i < 0 || j < 0 || i > this.config.height - 1 || j > this.config.width - 1) continue;
            if(radius > 1 && (x == y && (x == 1 || x == radius * 2 + 1))) {
                continue;
            }
            if(radius > 1 && ((x == 1 && y == radius * 2 + 1) || x == radius * 2 + 1 && y == 1)) continue;
            this.visibility[i][j].addFog(v);
            this.visibility[i][j].checkFog();   
        }
        y = 0;
    }
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