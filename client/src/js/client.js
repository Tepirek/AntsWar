(() => {
    const sock = io();
    sock.on('connect', () => {

        const lobby = new Lobby(sock);
        const chat = new Chat(sock);
        const game = new Game(sock);
        lobby.init();
    });
})();