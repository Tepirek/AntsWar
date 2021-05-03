class Squad extends Minion {
    constructor(config) {
        super(config.id, config.owner, config.x, config.y, config.size, 'Squad', config.color, config.game, 50, config.costs);
        this.workers = 0;
        this.capacity = 10;
        this.gameObject.onclick = () => {
            // reset wyboru budynku ze sklepu
            this.showOptions();
            localStorage.setItem('action', JSON.stringify({ type: 'move', target: 'squad', object: this }));
        };
    };
};

/**
 * Shows squad options.
 */
Squad.prototype.showOptions = function() {
    const options = document.querySelector('.objectOptions');
    options.innerHTML = `
            ${this.name}
        <table>
            <tr>
                <td>Soldiers</td>
                <td>${this.workers}/${this.capacity}</td>
                <td><img id="addSoldier" src="../src/img/plus.png" alt="plus" style="cursor:pointer"></td>
            </tr>
            <tr>
                <td>Life</td>
                <td>${this.currentLife}/${this.life}</td>
            </tr>
        </table>
    `;
    document.querySelector('#addSoldier').onclick = () => {
        this.game.addNewSoldier(this);
    }
}
