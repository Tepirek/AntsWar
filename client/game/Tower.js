class Tower extends Business {
    constructor(data, game) {
        super(data, game);
    };
};
    
/**
 * Shows options and start adding an employee, support for sending a request to be added in the game class.
 */
Tower.prototype.showOptions = function(res) {
    const options = document.querySelector('.objectOptions');
    options.innerHTML = `
        <div style="text-transform:capitalize">
            ${this.type}
        </div>
        <table>
            <tr>
                <td>Soldiers</td>
                <td>${this.workers}/${this.capacity}</td>
                <td><img id="addSoldier" src="../src/img/plus00.png" alt="plus" style="cursor:pointer"></td>
            </tr>
            <tr>
                <td>Life</td>
                <td>${this.currentLife}/${this.life}</td>
            </tr>
        </table>
    `;
    document.querySelector('#addSoldier').onclick = () => {
        this.game.addNewWorker(this);
    }
}

