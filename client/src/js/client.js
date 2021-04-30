(() => {
    
    if(!localStorage.getItem('config')) localStorage.setItem('config', JSON.stringify({
        chat: false,
    }));
    if(!localStorage.getItem('action')) localStorage.setItem('action', JSON.stringify({
        type: '',
        target: ''
    }));

    const sock = io();
    sock.on('connect', () => {

        const lobby = new Lobby(sock);
        const chat = new Chat(sock);
        const player = new Player(sock);
        const game = new Game(sock, player);
        lobby.init();
    });
})();