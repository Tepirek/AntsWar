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
     * JSON containing costs of all buildings and logs.
     */
    costs: {
        tower: {
            gold: 20,
            wood: 20,
            stone: 20,
            food: 20
        },
        mine: {
            gold: 20,
            wood: 20,
            stone: 20,
            food: 20
        },
        sawmill: {
            gold: 20,
            wood: 20,
            stone: 20,
            food: 20
        },
        quarry: {
            gold: 20,
            wood: 20,
            stone: 20,
            food: 20
        },
        farm: {
            gold: 20,
            wood: 20,
            stone: 20,
            food: 20
        },
        base: {
            gold: 100,
            wood: 100,
            stone: 100,
            food: 100
        },
        workers: {
            gold: 10,
            wood: 10,
            stone: 10,
            food: 10
        },
        squad: {
            gold: 20,
            wood: 20,
            stone: 20,
            food: 20
        }
    },
    capacities: {
        tower: 10,
        mine: 10,
        sawmill: 10,
        quarry: 10,
        farm: 10,
        base: 10
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
         },
         workers: {
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