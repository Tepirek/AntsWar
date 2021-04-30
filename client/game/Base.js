class Base extends Building {
    constructor(config) {
        super(config.id, config.owner, config.x, config.y, config.size, 'Base', config.color, config.game, 50, config.costs);
        this.workers = 0;
        this.capacity = 5;
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
        this.game.addNewWorker(this);
    }

    document.querySelector('#addSquad').onclick = () => {
        if(this.workers + 1 <= this.capacity) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: `squad` }));
        }
    }
}