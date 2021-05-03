class Mine extends Business {
    constructor(config) {
        super(config.id, 
            config.owner, 
            config.x, 
            config.y, 
            config.size, 
            'Mine', 
            config.color, 
            config.game, 
            config.stats.life, //life 
            config.costs, 
            config.stats.capacity); //workers limit 
    };
};
    