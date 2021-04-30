class Building extends GameObject {
    constructor(posX, posY, tileSize, name, color, game, life, costs) {
        super(posX, posY, tileSize, name, color, game);
        this.currentLife = life;
        this.life = life;
        this.costs = costs;
    };
};



