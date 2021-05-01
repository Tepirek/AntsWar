class Player {
    constructor(sock) {
        this.id;
        this.color;
        this.resources;
        this.workers;
        this.gameObjects;
        this.socket = sock;
        this.socket.on('player__init', response => this.init(response));
        this.socket.on('player__setResources', response => this.__setResources(response));
        this.socket.on('player__setWorkers', response => this.__setWorkers(response));
    }
}

Player.prototype.init = function(response) {       
    this.id = response.id;
    this.color = response.color;
    this.resources = response.resources;
    this.workers = response.workers;
    this.gameObjects = response.gameObjects;
    this.createBuilding('Tower');
    this.createBuilding('Mine');
    this.createBuilding('Sawmill');
    this.createBuilding('Quarry');
    this.createBuilding('Farm');
    this.createBuilding('Base');
};

Player.prototype.printResources = function() {
    document.querySelector('#gold').innerHTML = `${this.resources.gold} (+${this.workers.gold})`;
    document.querySelector('#wood').innerHTML = `${this.resources.wood} (+${this.workers.wood})`;
    document.querySelector('#stone').innerHTML = `${this.resources.stone} (+${this.workers.stone})`;
    document.querySelector('#food').innerHTML = `${this.resources.food} (+${this.workers.food})`;
};

Player.prototype.createBuilding = function(name) {
    const buildings = document.querySelector('.buildings');
    const building = document.createElement('div');
    building.id = `create${name}`;
    building.className = `buildingPrototype`;
    building.innerHTML = `
        <div class="buildingBox">
            <img src="../src/img/${name}0${this.color}.png" alt="">
            ${name}
        </div>
    `;
    building.addEventListener('click', () => {
        localStorage.setItem('action', JSON.stringify({ type: 'drag', target: `${name.toLowerCase()}` }));
    });
    buildings.appendChild(building);
};

Player.prototype.addNewWorker = function(type) {
    switch(type.toLowerCase()) {
        case 'mine':
            type = 'gold';
            break;
        case 'sawmill':
            type = 'wood';
            break;
        case 'quarry':
            type = 'stone';
            break;
        case 'farm': 
            type = 'food';
            break;
    }
    this.workers[`${type}`] += 1;
}

Player.prototype.__setResources = function(response) {
    this.resources = response.resources;
    this.printResources();
}

Player.prototype.__setWorkers = function(response) {
    this.workers = response.workers;
}

/**
 * Adds gameObject
 */
Player.prototype.addGameObject = function(gameObject) {
    this.gameObjects.push(gameObject);
}