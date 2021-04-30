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
    const resources = document.querySelector('.resources');
    resources.innerHTML = `
        <ul>
            <li>
                Gold
            <span id="gold">
                ${this.resources.gold} (+${this.workers.gold})
            </span>
            </li>
            <li>
                Wood
            <span id="wood">
                ${this.resources.wood} (+${this.workers.wood})
            </span>
            </li>
            <li>
                Stone
            <span id="stone">
                ${this.resources.stone} (+${this.workers.stone})
            </span>
            </li>
            <li>
                Food
            <span id="food">
                ${this.resources.food} (+${this.workers.food})
            </span
            </li>
        </ul>
    `;
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

Player.prototype.__setResources = function(response) {
    this.resources = response.resources;
    this.printResources();
}

Player.prototype.__setWorkers = function(response) {
    this.workers = response.workers;
}