class Area extends GameObject {
    /**
     * @param {id} id
     * @param {owner} owner 
     * @param {x} x
     * @param {y} y
     * @param {titleSize} titleSize
     * @param {name} name 
     * @param {color} color
     * @param {game} game 
     */
    constructor(data, game) {
        super(data, game);
        this.free = true;
        this.object = undefined;
        this.type = 'grass';
        this.gameObject.onclick = (e) => this.click(); 
        this.gameObject.onmouseenter = (e) => this.mouseenter();
        this.gameObject.onmouseleave = (e) => this.mouseleave();
        this.gameObject.onclick = (e) => this.click();
    };
};

/**
 * Supports clicking on a field.
 */
Area.prototype.click = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(!this.free && action.type == 'select') {
        this.gameObject.style.border = '3px solid #ffffff';
    }
};

/**
 * Removes an item from the field.
 */
Area.prototype.clear = function() {
    this.gameObject.parentElement.removeChild(this.gameObject);
};

/**
 * Returns the div in the field.
 */
Area.prototype.getArea = function() {
    return this.gameObject;
};

/**
 * Returns information about whether the field is free.
 */
Area.prototype.isFree = function() {
    return this.free;
};

/**
 * Sets the field to free.
 */
Area.prototype.setFree = function(value) {
    this.free = value;
};

/**
 * Puts an object on the field.
 */
Area.prototype.setObject = function(object) {
    this.object = object;
    this.gameObject.style.border = '';
};

/**
 * Adds a check mark in the field.
 */
Area.prototype.mouseenter = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type == 'drag' && this.free) {
        this.gameObject.style.border = '3px solid #ff1f1f';
    }
    else if(action.type == 'move') {
        this.gameObject.innerHTML = `X`;
    }
};

/**
 * Clears the check mark from the field.
 */
Area.prototype.mouseleave = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type == 'move') {
        this.gameObject.innerHTML = "";
    }
    else if(action.type != 'select' && this.free) {
        this.gameObject.style.border = '';
    }
};

/**
 * Supports adding objects to the map
 */
Area.prototype.click = function() {
    if(this.type = 'grass') {
        if(this.free) {
            let action = JSON.parse(localStorage.getItem('action'));
            if(action.type == 'drag') {
                this.game.addNewBuilding(this.position, action.target);
            }
            else if(action.type == 'move') {
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
    } else if(this instanceof Building) {
        console.log("Clicked on building");
    }
}