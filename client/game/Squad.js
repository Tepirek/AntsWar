class Squad extends Minion {
    constructor(data, game) {
        super(data, game);
        this.attack = data.stats.attack;
        this.defense = data.stats.defense;
        this.gameObject.onclick = () => {
            // reset wyboru budynku ze sklepu
            this.showOptions();
            localStorage.setItem('action', JSON.stringify({ type: 'move', target: 'squad', object: this }));
        };
    };
};

Squad.prototype.initOptions = function() {
    const options = document.querySelector('.objectOptions');
    options.innerHTML = `
        <div style="text-transform:capitalize">
            ${this.type}
        </div>    
        <table>
            <tr>
                <td>Soldiers</td>
                <td id="soldiersCapacity">${this.workers}/${this.capacity}</td>
                <td><img id="addSoldier" src="../src/img/plus00.png" alt="plus" style="cursor:pointer"></td>
            </tr>
            <tr>
                <td>Life</td>
                <td id="lifeBar_${this.id}">${this.currentLife}/${this.life}</td>
            </tr>
        </table>
    `;
}

Squad.prototype.updateOptions = function() {
   const lifeBar = document.querySelector(`#lifeBar_${this.id}`);
   if(lifeBar != undefined) {
       lifeBar.innerHTML = `${this.currentLife}/${this.life}`;
   }
}

/**
 * Shows squad options.
 */
Squad.prototype.showOptions = function() {
    this.initOptions();
    document.querySelector('#addSoldier').onclick = () => {
        this.game.addNewSoldier(this);
    }
}
