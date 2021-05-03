class Base extends Building {
    constructor(config) {
        super(config.id, config.owner, config.x, config.y, config.size, 'Base', config.color, config.game, 50, config.costs);
        this.workers = 0;
        this.capacity = 5;
        this.squadCosts = {
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        };
        this.gameObject.onclick = (res) => {
            // reset wyboru budynku ze sklepu
            localStorage.setItem('action', JSON.stringify({ type: '', target: '' }));
            this.showOptions(res);
        };
    };
};

/**
 * Shows options and start adding an squad, support for sending a request to be added in the game class.
 */
Base.prototype.showOptions = function() {
    const buildings = document.querySelector('.objectOptions');
 
    buildings.innerHTML = `
    ${this.name}
    <table>
        <tr>
            <td>Create squad</td>
            <td><img id="addSquad" src="../src/img/squad0${this.color}.png" alt=""></td>
        </tr>
        <tr>
            <td>Force limit</td>
            <td>${this.workers}/${this.capacity}</td>
            <td><img id="addWorker" src="../src/img/plus.png" alt="plus" style="cursor:pointer"></td>
        </tr>
        <tr>
            <td>Life</td>
            <td>${this.currentLife}/${this.life}</td>
        </tr>
    </table>    
    `;

    document.querySelector('#addWorker').onclick = () => {
        this.game.addForceLimit(this);
    }

    const addSquad = document.querySelector('#addSquad');

    addSquad.onclick = () => {
        if(this.workers + 1 <= this.capacity) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: `squad` }));
        }
    }

    const buildingsTip = document.createElement('div');
    buildingsTip.id = this.id;
    buildingsTip.className = 'buildingsTip';

    addSquad.addEventListener('mouseenter', () => {
        buildingsTip.innerHTML = `
            <div class="buildingsTip">
                <div class="buildingsTipResource">
                    <img src="src/img/gold.png" alt="gold"> ${this.squadCosts.gold}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/wood.png" alt="wood"> ${this.squadCosts.wood}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/stone.png" alt="stone"> ${this.squadCosts.stone}
                </div>
                <div class="buildingsTipResource">
                    <img src="src/img/food.png" alt="food"> ${this.squadCosts.food}
                </div>
            </div>
        `;
        const position = addSquad.getBoundingClientRect();
        buildingsTip.style.top = `${position.top - 10 - buildingsTip.offsetHeight * 2}px`;
        buildingsTip.style.left = `${position.left - 10 + (addSquad.offsetWidth - 10) / 2}px`;
        buildingsTip.style.visibility = "visible";
    });
    addSquad.addEventListener('mouseleave', () => {
        buildingsTip.innerHTML = "";
        buildingsTip.style.visibility = "hidden";
    });
    document.body.appendChild(buildingsTip);
}