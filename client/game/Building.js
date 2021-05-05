class Building extends GameObject {
    constructor(data, game) {
        super(data, game);
        this.currentLife = data.stats.life;
        this.life = data.stats.life;
        this. visibilityRange = data.stats.visibilityRange;
        this.costs = data.costs;
    };
};