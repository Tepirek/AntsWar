class Player {
    constructor(sock) {
        this.id;
        this.color;
        this.resources;
        this.workers;
        this.gameObjects;
        this.socket = sock;
        this.force;
        this.forceLimit;
        this.socket.on('player__init', response => this.init(response));
        this.socket.on('player__setResources', response => this.__setResources(response));
        this.socket.on('player__setWorkers', response => this.__setWorkers(response));
        this.socket.on('player__setForce', response => this.__setForce(response));
        this.socket.on('player__setForceLimit', response => this.__setForceLimit(response));
    }
}

/**
 * Initializes the player.
 * @param {response} response Response from the server in the form: 
 */
Player.prototype.init = function(response) {       
    this.id = response.id;
    this.color = response.color;
    this.resources = response.resources;
    this.workers = response.workers;
    this.gameObjects = response.gameObjects;
    this.costs = response.costs;
    this.force = response.force;
    this.forceLimit = response.forceLimit;
    this.createBuilding('Tower');
    this.createBuilding('Mine');
    this.createBuilding('Sawmill');
    this.createBuilding('Quarry');
    this.createBuilding('Farm');
    this.createBuilding('Base');
    this.createBuilding('Squad');
    this.createBuilding('Wall');
};

/**
 * Shows the player's available resources.
 */
Player.prototype.printResources = function() {
    document.querySelector('#gold').innerHTML = `${this.resources.gold} (+${this.workers.gold})`;
    document.querySelector('#wood').innerHTML = `${this.resources.wood} (+${this.workers.wood})`;
    document.querySelector('#stone').innerHTML = `${this.resources.stone} (+${this.workers.stone})`;
    document.querySelector('#food').innerHTML = `${this.resources.food} (+${this.workers.food})`;
    document.querySelector('#force').innerHTML = `${this.force} / ${this.forceLimit}`;
};

/**
 * Creates a building.
 * @param {name} name Name of the building.
 */
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
    const costs = this.costs[`${name.toLowerCase()}`];
    const buildingsTip = document.createElement('div');
    buildingsTip.className = 'buildingsTip';
    building.addEventListener('click', () => {
        localStorage.setItem('action', JSON.stringify({ type: 'drag', target: `${name.toLowerCase()}` }));
    });
    building.addEventListener('mouseenter', () => {
        buildingsTip.innerHTML = `
            <div class="buildingsTip">
                <div class="buildingsTipResource">
                    <img src="src/img/gold.png" alt="gold"> ${costs.gold}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/wood.png" alt="wood"> ${costs.wood}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/stone.png" alt="stone"> ${costs.stone}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/food.png" alt="food"> ${costs.food}
                </div>
            </div>
        `;
        buildingsTip.style.top = `${building.offsetTop - 20 - buildingsTip.offsetHeight}px`;
        buildingsTip.style.left = `${building.offsetLeft - 5 + ((building.offsetWidth - 20) / 2)}px`;
        buildingsTip.style.visibility = "visible";
    });
    building.addEventListener('mouseleave', () => {
        buildingsTip.innerHTML = "";
        buildingsTip.style.visibility = "hidden";
    });
    document.body.appendChild(buildingsTip);
    buildings.appendChild(building);
};

/**
 * Adds new worker to the building.
 * @param {type} type Type of the building.
 */
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

/**
 * Setter for resources.
 * @param {response} response Response from the server in the form:
 */
Player.prototype.__setResources = function(response) {
    this.resources = response.resources;
    this.printResources();
}

/**
 * Setter for workers.
 * @param {response} response Response from the server in the form:
 */
Player.prototype.__setWorkers = function(response) {
    this.workers = response.workers;
}

/**
 * Setter for force.
 * @param {response} response Response from the server in the form:
 */
Player.prototype.__setForce = function(response) {
    this.force = response.force;
}

/**
 * Setter for force limit.
 * @param {response} response Response from the server in the form:
 */
Player.prototype.__setForceLimit = function(response) {
    this.forceLimit = response.forceLimit;
}

/**
 * Adds gameObject.
 */
Player.prototype.addGameObject = function(gameObject) {
    this.gameObjects.push(gameObject);
}