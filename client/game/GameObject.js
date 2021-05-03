class GameObject {
    constructor(id, owner, posX, posY, areaSize, name, color, game) {
        this.id = id;
        this.owner = owner;
        this.position = {
            x: posX,
            y: posY
        };
        this.size = areaSize;
        this.name = name;
        GameObject.prototype.color = color;
        GameObject.prototype.game = game;
        this.gameObject = document.createElement('div');
        this.setStyle();
    };
};

/**
 * Sets the style for the gameObject.
 */
GameObject.prototype.setStyle = function() {
    this.gameObject.style = `
        position:absolute;
        width:${this.size}px;
        height:${this.size}px;
        top:${this.position.x * this.size}px;
        left:${this.position.y * this.size}px;
        background-image:url('../src/img/${this.name}0${this.color}.png');
        cursor:pointer;
    `;
}

/**
 * Displays the object
 */
GameObject.prototype.draw = function() {
    document.querySelector('.gameBoard').appendChild(this.gameObject);
};

GameObject.prototype.remove = function() {
    this.gameObject.parentElement.removeChild(this.gameObject);
}