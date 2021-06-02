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
            gold: 1000,
            wood: 1000,
            stone: 1000,
            food: 1000
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
            gold: 10,
            wood: 10,
            stone: 10,
            food: 10
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
            currentLife: 10,
            life: 10,
            visibilityRange: 1,
            attack: 15,
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