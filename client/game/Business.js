class Business extends Building {
    constructor(data, game) {
        super(data, game);
        this.workers = data.workers;
        this.capacity = data.stats.capacity;
        this.gameObject.onclick = (res) => {
            // reset wyboru budynku ze sklepu
            localStorage.setItem('action', JSON.stringify({ type: '', target: '' }));
            this.showOptions(res);
        };
    };
};

/**
 * Shows options and start adding an employee, support for sending a request to be added in the game class.
 */
Business.prototype.showOptions = function() {
    const tip = document.getElementById(`${this.id}`);
    if(tip) {
        tip.parentElement.removeChild(tip);
    }
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
                <td>${this.currentLife}/${this.life}</td>
            </tr>
        </table>
    `;
    const buildingsTip = document.createElement('div');
    buildingsTip.id = this.id;
    buildingsTip.className = 'buildingsTip';
    const button = document.querySelector('#addWorker');
    button.onclick = () => {
        this.game.addNewWorker(this);
        this.gameObject.click();
    }
    button.addEventListener('mouseenter', () => {
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
        const position = button.getBoundingClientRect();
        buildingsTip.style.top = `${position.top - 10 - buildingsTip.offsetHeight * 2}px`;
        buildingsTip.style.left = `${position.left - 10 + (button.offsetWidth - 10) / 2}px`;
        buildingsTip.style.visibility = "visible";
    });
    button.addEventListener('mouseleave', () => {
        buildingsTip.innerHTML = "";
        buildingsTip.style.visibility = "hidden";
    });
    document.body.appendChild(buildingsTip);
}