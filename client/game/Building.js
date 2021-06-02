class Building extends GameObject {
    constructor(data, game) {
        super(data, game);
        this.currentLife = data.stats.life;
        this.life = data.stats.life;
        this. visibilityRange = data.stats.visibilityRange;
        this.costs = data.costs;
    };
};

Building.prototype.showLifeBar = function(display) {
    if(display) {
        this.lifeBar.style.display = "none";
    } else {
        this.updateLifeBar();
        this.lifeBar.style.display = "block";
    }
}

Building.prototype.updateLifeBar = function() {
    this.lifeBar.innerHTML = ``;
    const amount = Math.ceil(this.currentLife * 11 / this.life);
    for (var i = 0; i < amount; i++) {
        const lifeBlock = document.createElement('div');
        lifeBlock.style = `
            box-sizing: border-box;
            position: absolute;
            top: 0px;
            left: ${i * 2}px;
            height: 6px;
            width: 2px;
            background-color: #1be393;
        `;
        this.lifeBar.appendChild(lifeBlock);
    }
}

Building.prototype.setCurrentLife = function(currentLife) {
    this.currentLife = currentLife;
}