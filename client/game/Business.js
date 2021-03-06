class Business extends Building {
    constructor(data, game) {
        super(data, game);
        this.workers = data.workers;
        this.capacity = data.stats.capacity;
        this.gameObject.onclick = (e) => this.click();
    };
};

/**
 * 
 */
Business.prototype.initOptions = function() {
    let options = document.querySelector('.objectOptions');
    options.innerHTML = `
        <div style="text-transform:capitalize">
            ${this.type}
        </div>
        <table>
            <tr>
                <td>Workers</td>
                <td>${this.workers}/${this.capacity}</td>
                <td><img id="addWorker" src="../src/img/plus00.png" alt="plus" style="cursor:pointer"></td>
            </tr>
            <tr>
                <td>Life</td>
                <td id="lifeBar_${this.id}">${this.currentLife}/${this.life}</td>
            </tr>
        </table>
    `;
    var addButton = document.querySelector('#addWorker');
    addButton.addEventListener('click', () => {
        if(this.type === 'wall') {
            this.game.addNewDefender(this);
        } else {
            this.game.addNewWorker(this);
        }
    });
    var tip = document.querySelectorAll('.buildingTipRemovable');
    if(tip != undefined) tip.forEach(t => t.parentNode.removeChild(t));
    const buildingsTip = document.createElement('div');
    buildingsTip.id = this.id;
    buildingsTip.className = 'buildingsTip buildingTipRemovable';
    addButton.addEventListener('mouseenter', () => {
        buildingsTip.innerHTML = `
            <div class="buildingsTip">
                <div class="buildingsTipResource">
                    <img src="src/img/gold.png" alt="gold"> ${this.costs.gold}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/wood.png" alt="wood"> ${this.costs.wood}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/stone.png" alt="stone"> ${this.costs.stone}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/food.png" alt="food"> ${this.costs.food}
                </div>
            </div>
        `;
        const position = addButton.getBoundingClientRect();
        buildingsTip.style.top = `${position.top - 10 - buildingsTip.offsetHeight * 2}px`;
        buildingsTip.style.left = `${position.left - 10 + (addButton.offsetWidth - 10) / 2}px`;
        buildingsTip.style.visibility = "visible";
    });
    addButton.addEventListener('mouseleave', () => {
        buildingsTip.innerHTML = "";
        buildingsTip.style.visibility = "hidden";
    });
    document.body.appendChild(buildingsTip);
}

/**
 * 
 */
Business.prototype.updateOptions = function() {
    const lifeBar = document.querySelector(`#lifeBar_${this.id}`);
    if(lifeBar != undefined) {
        lifeBar.innerHTML = `${this.currentLife}/${this.life}`;
    }
}

/**
 * Shows options and start adding an employee, support for sending a request to be added in the game class.
 */
Business.prototype.showOptions = function() {
    const tip = document.getElementById(`${this.id}`);
    if(tip) {
        tip.parentElement.removeChild(tip);
    }
    this.initOptions();
}

/**
 * 
 */
Business.prototype.click = function() {
    var action = JSON.parse(localStorage.getItem('action'));
    if(action.type == "move") {
        if(Array.isArray(action.object)) {
            action.object.forEach(o => {
                Object.assign(o, Squad.prototype);
                o.unselect();
            });
        }
        if(this.game.player.gameObjects.filter(o => o.id == this.id).length > 0) {
            localStorage.setItem('action', JSON.stringify({ type: '', target: '' })); 
            this.showOptions();
        } else {
            if(Array.isArray(action.object)) {
                this.game.moveHerd(action.object, this.position);
            }
            else this.game.moveSquad(action.object, this.position);
        }
        action = { type: '', target: '', object: null };
        localStorage.setItem('action', JSON.stringify(action));
    } else {
        var action = JSON.parse(localStorage.getItem('action'));
        if(Array.isArray(action.object)) {
            console.log(action.object);
            action.object.forEach(o => {
                Object.assign(o, Squad.prototype);
                o.unselect();
            });
        }
        this.initOptions();
    }
}