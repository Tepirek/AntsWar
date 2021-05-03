class Base extends Building {
    constructor(config) {
        super(config.id,
            config.owner,
            config.x,
            config.y, 
            config.size, 
            'Base', 
            config.color, 
            config.game,
            config.stats.life, 
            config.costs);
            
        this.workers = 0;
        this.capacity = config.stats.capacity;
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
    ${this.name}
    <table>
        <tr>
            <td>Force limit</td>
            <td>${this.workers}/${this.capacity}</td>
            <td><img id="addForceLimit" src="../src/img/plus.png" alt="plus" style="cursor:pointer"></td>
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