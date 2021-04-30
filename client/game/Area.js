class Area extends GameObject {
    constructor(posX, posY, tileSize, name, color, game) {
        super(posX, posY, tileSize, name, color, game);
        this.free = true;
        this.object = undefined;
        this.type = 'grass';
        this.gameObject.onclick = (e) => this.click(); 
        this.gameObject.onmouseenter = (e) => this.mouseenter();
        this.gameObject.onmouseleave = (e) => this.mouseleave();
        this.gameObject.addEventListener('click', () => {
            if(this.type = 'grass') {
                if(this.free) {
                    let action = JSON.parse(localStorage.getItem('action'));
                    if(action.type == 'drag') {
                        this.game.addNewBuilding(this.position, action.target);
                    }
                    action = { type: '', target: '' };
                    localStorage.setItem('action', JSON.stringify(action));
                }
            }
        });
    };
};

Area.prototype.click = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(!this.free && action.type == 'select') {
        this.gameObject.style.border = '3px solid #ffffff';
    }
};

Area.prototype.clear = function() {
    this.gameObject.parentElement.removeChild(this.gameObject);
};

Area.prototype.getArea = function() {
    return this.gameObject;
};

Area.prototype.isFree = function() {
    return this.free;
};

Area.prototype.setFree = function(value) {
    this.free = value;
};

Area.prototype.setObject = function(object) {
    this.object = object;
    this.gameObject.style.border = '';
};

Area.prototype.mouseenter = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type == 'drag' && this.free) {
        this.gameObject.style.border = '3px solid #ff1f1f';
    }
};

Area.prototype.mouseleave = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type != 'select' && this.free) {
        this.gameObject.style.border = '';
    }
};
