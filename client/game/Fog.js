class Fog extends GameObject {
    constructor(data, game) {
        super(data, game);
        this.type = 'fog';  
        this.foggy = 1;
        this.gameObject.style.zIndex = 2000;
        this.gameObject.style.backgroundImage = "";
        this.gameObject.style.backgroundColor = "#111111";
        this.gameObject.onclick = (e) => this.click();
        this.gameObject.onmouseenter = (e) => this.mouseenter();
        this.gameObject.onmouseleave = (e) => this.mouseleave();
    };
}

Fog.prototype.click = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type == 'move') {
        this.gameObject.innerHTML = "";
        if(Array.isArray(action.object)) {
            action.object.forEach(o => {
                Object.assign(o, Squad.prototype);
                o.unselect();
            });
            this.game.moveHerd(action.object, this.position);
        }
        else this.game.moveSquad(action.object, this.position);
    }
    action = { type: '', target: '', object: null };
    localStorage.setItem('action', JSON.stringify(action));
}

Fog.prototype.mouseenter = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type == 'drag' && this.free) {
        this.gameObject.style.border = '3px solid #ff1f1f';
    }
    else if(action.type == 'move') {
        this.gameObject.innerHTML = `X`;
    }
};

Fog.prototype.mouseleave = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type == 'move') {
        this.gameObject.innerHTML = "";
    }
    else if(action.type != 'select' && this.free) {
        this.gameObject.style.border = '';
    }
};

GameObject.prototype.checkFog = function() {
    if(this.foggy > 0) {
        this.draw();
    } else {
        this.remove();
    }
}

GameObject.prototype.addFog = function(value) {
    this.foggy += value;
}