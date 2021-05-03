class Farm extends Business {
    constructor(config) {
        super(config.id, 
            config.owner, 
            config.x, 
            config.y, 
            config.size, 
            'Farm', 
            config.color, 
            config.game, 
            config.stats.life, 
            config.costs, 
            config.stats.capacity); 
    };
};
    