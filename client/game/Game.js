class Game {
    constructor(sock, player) {
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
    }
};

Game.prototype.init = function(response) {
    document.body.style.backgroundColor = '#333333';
    const antBg = document.querySelector('.backgroundImage');
    const footer = document.querySelector('.footer');
    const lobby = document.querySelector('.lobby');
    document.querySelector('.container').removeChild(antBg);
    document.querySelector('.container').removeChild(footer);
    document.querySelector('.container').removeChild(lobby);
    this.config = response.config;
    this.map = response.map;
    this.cost = response.costs;
    this.gameBoard.style.width = `${this.config.width * this.config.areaSize}px`;
    this.gameBoard.style.height = `${this.config.height * this.config.areaSize}px`;
    this.gameOptions.style.width = `${this.config.width * this.config.areaSize}px`;
    for(let i = 0; i < this.config.height; i++) {
        for(let j = 0; j < this.config.width; j++) {
            const index = i*this.config.width + j;
            let area = new Area(i, j, this.config.areaSize, 'grass', 1, this);
            this.map[index] = area;
        }
    }
};

Game.prototype.sendData = function(event) {

};

Game.prototype.handleData = function(event) {

};

Game.prototype.addNewBuilding = function(response) {

};

Game.prototype.__addNewBuilding = function(response) {
    const index = response.position.x*this.config.width + response.position.y;
    console.log(response);
    const building = this.getBuilding(response.position, response.target, response.color);
    console.log(building);
    this.map[index].setFree(false);
    this.map[index].setObject(building);
    delete this.map[index];
    this.map[index] = building;
};

Game.prototype.addNewWorker = function(object) {
    
};

Game.prototype.getBuilding = function(position, target, color) {
    let config = { 
        x: position.x, 
        y: position.y, 
        size: this.config.areaSize, 
        game: this,
        color: color
    };
    let building;
    if(target == 'tower') building = new Tower(config);
    else if(target == 'mine') building = new Mine(config);
    else if(target == 'sawmill') building = new Sawmill(config);
    else if(target == 'quarry') building = new Quarry(config);
    else if(target == 'farm') building = new Farm(config);
    else if(target == 'base') building = new Base(config);
    else if(target == 'squad') building = new Squad(config);
    return building;
};