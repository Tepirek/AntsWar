(() => {

    return


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