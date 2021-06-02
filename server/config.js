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
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        },
        mine: {
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        },
        sawmill: {
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        },
        quarry: {
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        },
        farm: {
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        },
        base: {
            gold: 5000,
            wood: 5000,
            stone: 5000,
            food: 5000
        },
        squad: {
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        },
        wall: {
            gold: 200,
            wood: 200,
            stone: 200,
            food: 200
        },
        workers: {
            gold: 100,
            wood: 100,
            stone: 100,
            food: 100
        },
        forceLimit: {
            gold: 2000,
            wood: 2000,
            stone: 2000,
            food: 2000
        }
    },
    capacities: {
         /**
         * Array containing initial capacities of the every building. 
         */
        tower: 10,
        mine: 10,
        sawmill: 10,
        quarry: 10,
        farm: 10,
        base: 10,
        squad: 10
    },
    stats: {
        tower: {
            capacity: 10,
            currentLife: 500,
            life: 500,
            visibilityRange: 3,
            attack: 15,
            defense: 10
        },
        mine: {
            capacity: 10,
            currentLife: 200,
            life: 200,
            visibilityRange: 2
        },
        sawmill: {
            capacity: 10,
            currentLife: 200,
            life: 200,
            visibilityRange: 2
        },
        quarry: {
            capacity: 10,
            currentLife: 200,
            life: 200,
            visibilityRange: 2
        },
        farm: {
            capacity: 10,
            currentLife: 200,
            life: 200,
            visibilityRange: 2
        },
        base: {
            capacity: 10,
            currentLife: 2000,
            life: 2000,
            forceLimit: 100,
            visibilityRange: 200
        },
        squad: {
            capacity: 10,
            currentLife: 50,
            life: 50,
            visibilityRange: 1,
            attack: 10,
            defense: 10
        },
        wall: {
            capacity: 10,
            currentLife: 1000,
            life: 1000,
            visibilityRange: 1
        }
    },
    lobby: {
        capacity: 1,
        delay: 500
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
             gold: 10000,
             wood: 10000,
             stone: 10000,
             food: 10000
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