class Area extends GameObject {
    constructor(id, owner, posX, posY, tileSize, name, color, game) {
        super(id, owner, posX, posY, tileSize, name, color, game);
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
};

/**
 * Clears the check mark from the field.
 */
Area.prototype.mouseleave = function() {
    let action = JSON.parse(localStorage.getItem('action'));
    if(action.type != 'select' && this.free) {
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
                if(action.target == 'squad') {
                    this.game.addNewSquad(this.position);
                }
                else {
                    this.game.addNewBuilding(this.position, action.target);
                }
            }
            action = { type: '', target: '' };
            localStorage.setItem('action', JSON.stringify(action));
        }
    }
}