class Squad extends Minion {
    constructor(data, game) {
        super(data, game);
        this.attack = data.stats.attack;
        this.defense = data.stats.defense;
        this.gameObject.onclick = e => this.click(e);
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
            <tr>
                <td>attack</td>
                <td id="attack_${this.id}">${this.attack}</td>
            </tr>
            <tr>
                <td>defense</td>
                <td id="defense_${this.id}">${this.defense}</td>
            </tr>
        </table>
    `;
}

Squad.prototype.updateOptions = function() {
   const lifeBar = document.querySelector(`#lifeBar_${this.id}`);
   if(lifeBar != undefined) {
       lifeBar.innerHTML = `${this.currentLife}/${this.life}`;
   }
   const attack = document.querySelector(`#attack_${this.id}`);
   if(attack != undefined) attack.innerHTML = `${this.attack}`;
   const defense = document.querySelector(`#defense_${this.id}`);
   if(defense != undefined) defense.innerHTML = `${this.defense}`;
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

Squad.prototype.click = function(e) {
    var action = JSON.parse(localStorage.getItem('action'));
    if(action.type == "move") {
        if(this.game.player.gameObjects.filter(o => o.id == this.id).length > 0) {
            var ctrlHold = JSON.parse(localStorage.getItem("keyboard"))['ctrl'];
            if(ctrlHold != undefined && ctrlHold) {
                var action = JSON.parse(localStorage.getItem('action'));
                if(action.object == null || !Array.isArray(action.object)) {
                    action['object'] = new Array();
                    action['object'].push(this);
                } else {
                    if(action['object'].filter(o => o.id == this.id).length == 0) {
                        action['object'].push(this);
                    }
                }
                this.select();
                action.type = 'move';
                action.target = 'squad';
                localStorage.setItem('action', JSON.stringify(action));
            } else {
                var action = JSON.parse(localStorage.getItem('action'));
                if(Array.isArray(action.object)) {
                    action.object.forEach(o => {
                        Object.assign(o, Squad.prototype);
                        o.unselect();
                    });
                }
                this.showOptions();
                localStorage.setItem('action', JSON.stringify({ type: 'move', target: 'squad', object: this }));
            }
        } else {
            if(Array.isArray(action.object)) {
                action.object.forEach(o => {
                    Object.assign(o, Squad.prototype);
                    o.unselect();
                });
                this.game.moveHerd(action.object, this.position);
            }
            else this.game.moveSquad(action.object, this.position);
            action = { type: '', target: '', object: null };
            localStorage.setItem('action', JSON.stringify(action));
        }
    } else {
        var ctrlHold = JSON.parse(localStorage.getItem("keyboard"))['ctrl'];
        if(ctrlHold != undefined && ctrlHold) {
            var action = JSON.parse(localStorage.getItem('action'));
            if(action.object == null || !Array.isArray(action.object)) {
                action['object'] = new Array();
                action['object'].push(this);
            } else {
                if(action['object'].filter(o => o.id == this.id).length == 0) {
                    action['object'].push(this);
                }
            }
            this.select();
            action.type = 'move';
            action.target = 'squad';
            localStorage.setItem('action', JSON.stringify(action));
        } else {
            var action = JSON.parse(localStorage.getItem('action'));
            if(Array.isArray(action.object)) {
                action.object.forEach(o => {
                    Object.assign(o, Squad.prototype);
                    o.unselect();
                });
            }
            this.showOptions();
            localStorage.setItem('action', JSON.stringify({ type: 'move', target: 'squad', object: this }));
        }
    }
}

Squad.prototype.select = function() {
    const marker = document.createElement('div');
    marker.id = `marker_${this.id}`;
    marker.style = `
        position: absolute;
        top: 1px;
        left: 1px;
        width: 4px;
        height: 4px;
        color: #ffffff;
    `;
    marker.innerHTML = '*';
    this.gameObject.appendChild(marker);
}

Squad.prototype.unselect = function() {
    const marker = document.querySelector(`#marker_${this.id}`);
    if(marker.parentNode) marker.parentNode.removeChild(marker);
}