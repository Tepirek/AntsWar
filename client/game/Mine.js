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
            50, //life 
            config.costs, 
            10); //workers limit 
    };
};
    