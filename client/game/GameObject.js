class GameObject {
    constructor(data, game) {
        this.id = data.id;
        this.owner = data.owner;
        this.position = data.position;
        this.type = data.type;
        this.color = data.color;
        GameObject.prototype.game = game;
        this.size = this.game.config.areaSize;
        this.foggy = 1;
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
        background-image:url('../src/img/${this.type}0${this.color}.png');
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

GameObject.prototype.checkFog = function() {
    if(this.foggy > 0) {
        this.gameObject.style.opacity = 0.1;
    } else {
        this.gameObject.style.opacity = 0.8;
    }
}

GameObject.prototype.addFog = function(value) {
    this.foggy += value;
}

