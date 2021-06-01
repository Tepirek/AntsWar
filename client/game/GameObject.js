class GameObject {
    constructor(data, game) {
        this.id = data.id;
        this.owner = data.owner;
        this.position = data.position;
        this.type = data.type;
        this.color = data.color;
        GameObject.prototype.game = game;
        this.size = this.game.config.areaSize;
        this.visibilityRange = 1;
        this.gameObject = document.createElement('div');
        this.lifeBar = document.createElement('div');
        this.setStyle();
        this.createLifeBar();
    };
};

/**
 * Sets the style for the gameObject.
 */
GameObject.prototype.setStyle = function() {
    this.gameObject.style = `
        position:absolute;
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
    if(this.gameObject.parentElement) {
        this.gameObject.parentElement.removeChild(this.gameObject);
    }
}

GameObject.prototype.createLifeBar = function() {
    this.lifeBar.style = `
        box-sizing: border-box;
        position: relative;
        bottom: 0px;
        left: 0px;
        width: 24px;
        height: 8px;
        border: 1px solid #000000;
        background-color: #000000;
        z-index: 1999;
        display: none;
    `;
    this.gameObject.appendChild(this.lifeBar);
}