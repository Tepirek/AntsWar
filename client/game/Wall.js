class Wall extends Business {
    constructor(data, game) {
        super(data, game);

        this.game.socket.on('building__addWorker', response => __addWorker(response));
    };
};

Building.prototype.addWorker = function(response) {
    this.worker = response.worker;
    this.life += response.life;
}