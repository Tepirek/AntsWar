(() => {
    if(!localStorage.getItem("keyboard")) localStorage.setItem("keyboard", JSON.stringify({}));
    document.addEventListener('keydown', e => {
        if(e.keyCode == 17) {
            var keyboard = JSON.parse(localStorage.getItem("keyboard"));
            keyboard["ctrl"] = true;
            localStorage.setItem("keyboard", JSON.stringify(keyboard));
        } else if(e.keyCode == 81) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'mine' }));
        } else if(e.keyCode == 87) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'sawmill' }));
        } else if(e.keyCode == 69) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'quarry' }));
        } else if(e.keyCode == 82) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'farm' }));
        } else if(e.keyCode == 65) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'tower' }));
        } else if(e.keyCode == 83) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'wall' }));
        } else if(e.keyCode == 68) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'squad' }));
        } else if(e.keyCode == 70) {
            localStorage.setItem('action', JSON.stringify({ type: 'drag', target: 'base' }));
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