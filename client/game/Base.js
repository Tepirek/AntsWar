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

Base.prototype.initOptions = function() {
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
           <td id="lifeBar_${this.id}">${this.currentLife}/${this.life}</td>
       </tr>
   </table>    
   `;
}

Base.prototype.updateOptions = function() {
   const lifeBar = document.querySelector(`#lifeBar_${this.id}`);
   if(lifeBar != undefined) {
       lifeBar.innerHTML = `${this.currentLife}/${this.life}`;
   }
}

/**
 * Shows options and start adding an squad, support for sending a request to be added in the game class.
 */
Base.prototype.showOptions = function() {
    this.initOptions();
    document.querySelector('#addForceLimit').onclick = () => {
        this.game.addForceLimit(this);
    }
}