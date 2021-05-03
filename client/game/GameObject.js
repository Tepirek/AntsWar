class GameObject {
    constructor(id, owner, x, y, areaSize, name, color, game) {
        this.id = id;
        this.owner = owner;
        this.position = {
            x: x,
            y: y
        };
        this.size = areaSize;
        this.name = name;
        this.color = color;
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
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: #ffffff;
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