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
    document.querySelector('.container').removeChild(antBg);
    document.querySelector('.container').removeChild(footer);
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
            if(this.map[index]) {
                this.map[index] = area;
                const position = { x: i, y: j };
                area = this.addNewBuilding(position, 'base');
            }
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
    
};

Game.prototype.addNewWorker = function(object) {
    
};