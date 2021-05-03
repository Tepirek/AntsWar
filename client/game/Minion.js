class Minion extends Building {
    constructor(id, owner, posX, posY, tileSize, name, color, game, life, costs, capacity) {
        super(id, owner, posX, posY, tileSize, name, color, game, life, costs);
        this.workers = 0;
        this.capacity = capacity;
        this.gameObject.onclick = (res) => {
            // reset wyboru budynku ze sklepu
            localStorage.setItem('action', JSON.stringify({ type: '', target: '' }));
            this.showOptions(res);
        };
    };
};

/**
 * Shows options and start adding an soldier, support for sending a request to be added in the game class.
 */
 Minion.prototype.showOptions = function() {
    const options = document.querySelector('.objectOptions');
    options.innerHTML = `
            ${this.name}
        <table>
            <tr>
                <td>Workers</td>
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
        this.game.addNewWorker(this);
        this.gameObject.click();
    }
}

/**
 * Movement of minions
 */
Minion.prototype.move = function(position) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.gameObject.style.top = `${this.position.x * this.size}px`;
    this.gameObject.style.left = `${this.position.y * this.size}px`;
}