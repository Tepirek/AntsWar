class Base extends Building {
    constructor(data, game) {
        super(data, game);
        this.workers = data.workers;
        this.capacity = data.stats.capacity;
        this.gameObject.onclick = (res) => {
            // reset wyboru budynku ze sklepu
            localStorage.setItem('action', JSON.stringify({ type: '', target: '' }));
            this.showOptions();
        };
    };
};

/**
 * Shows options and start adding an squad, support for sending a request to be added in the game class.
 */
Base.prototype.showOptions = function() {
    console.log(this);
    const buildings = document.querySelector('.objectOptions');
 
    buildings.innerHTML = `
        <div style="text-transform:capitalize">
            ${this.type}
        </div>
    <table>
        <tr>
            <td>Force limit</td>
            <td>${this.workers}/${this.capacity}</td>
            <td><img id="addForceLimit" src="../src/img/plus00.png" alt="plus" style="cursor:pointer"></td>
        </tr>
        <tr>
            <td>Life</td>
            <td>${this.currentLife}/${this.life}</td>
        </tr>
    </table>    
    `;
    document.querySelector('#addForceLimit').onclick = () => {
        this.game.addForceLimit(this);
    }
}