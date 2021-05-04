(() => {

    return

    let index = 0;
    const test2 = Array.apply(null, new Array(20)).map(() =>  {
        let i = Math.floor(index / 10);
        let j = index - (i * 10)
        index++;
        return new Object({x: i, y: j});
    });

    console.log(test2);

    const test = Array.apply(null, new Array(3)).map(() => new Object({x: 10, y: 10}))

    test.forEach(e => e.x = 15)
    
    console.log(test);

    const gameObjects = Array.apply(null, new Array(3)).map(() => Array.apply(null, new Array(3)).map(() => Array.apply(null, new Array(3)).map(() => 0)))

    console.log(gameObjects);

    var delay = 0;
    var timers = [];
    for(let i = 0; i < 10; i++) {
        timers[i] = setTimeout(() => {
            if(i == 5) {
                timers.forEach(t => clearTimeout(t))
                return
            }
            console.log(i);
        }, delay)
        delay += 500
    }

})();