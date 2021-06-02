(() => {
    if(!localStorage.getItem("keyboard")) localStorage.setItem("keyboard", JSON.stringify({}));
    document.addEventListener('keydown', e => {
        if(e.keyCode == 17) {
            var keyboard = JSON.parse(localStorage.getItem("keyboard"));
            keyboard["ctrl"] = true;
            localStorage.setItem("keyboard", JSON.stringify(keyboard));
        }
    });
    document.addEventListener('keyup', e => {
        if(e.keyCode == 17) {
            var keyboard = JSON.parse(localStorage.getItem("keyboard"));
            keyboard["ctrl"] = false;
            localStorage.setItem("keyboard", JSON.stringify(keyboard));
        }
    })
})();