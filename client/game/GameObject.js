class GameObject {
    constructor(posX, posY, tileSize, name, color, game) {
        this.position = {
            x: posX,
            y: posY
        };
        this.size = tileSize;
        this.name = name;
        GameObject.prototype.color = color;
        GameObject.prototype.game = game;
        this.gameObject = document.createElement('div');   
        this.draw();
    };
};

GameObject.prototype.draw = function() {
    this.gameObject.style = `
        position:absolute;
        width:${this.size}px;
        height:${this.size}px;
        top:${this.position.x * this.size}px;
        left:${this.position.y * this.size}px;
        display:flex;
        align-items:center;
        justify-content:space-evenly;
        background-image:url('../src/img/${this.name}0${this.color}.png');
        cursor:pointer;
    `;
    document.querySelector('.gameBoard').appendChild(this.gameObject);
};