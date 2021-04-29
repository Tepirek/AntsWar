const config = {
    params: {
        /**
         * Defines size of a single area in pixel.
         */
        areaSize: 24,
        /**
         * Defines width of the map.
         */
        width: 64,
        /**
         * Defines height of the map.
         */
        height: 32
    },
    /**
     * JSON containing costs of all buildings and units.
     */
    costs: {

    },
    lobby: {
        capacity: 1,
        delay: 0
    },
    player: {
        /**
         * Array containing initial coordinates of the every player's base. 
         */
         baseLocations: [
            { x: 1, y: 1 },
            { x: 30, y: 62 },
            { x: 30, y: 1 },
            { x: 1, y: 62 }
         ],
         resources: {
             gold: 100,
             wood: 100,
             stone: 100,
             food: 100
         }
    }
}

module.exports = {
    config: config
}