class Building extends GameObject {
    constructor(id, owner, x, y, tileSize, name, color, game, life, costs) {
        super(id, owner, x, y, tileSize, name, color, game);
        this.currentLife = life;
        this.life = life;
        this.costs = costs;
    };
};