class PathFinder {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.openSet = [];
        this.closedSet = [];
        this.path = [];
        this.start;
        this.end;
        this.grid = new Array(this.cols);
    }
}

PathFinder.prototype.init = function(gameObjects) {
    for(var i = 0; i < this.cols; i++) {
        this.grid[i] = new Array(this.rows);
    }
    for(var i = 0; i < this.cols; i++) {
        for(var j = 0; j < this.rows; j++) {
            if(gameObjects[i * this.rows + j].type != 'area') {
                this.grid[i][j] = new Spot(i, j, true);
            }
            else {
                this.grid[i][j] = new Spot(i, j, false);
            }
        }
    }
    for(var i = 0; i < this.cols; i++) {
        for(var j = 0; j < this.rows; j++) {
            this.grid[i][j].addNeighbors(this.cols, this.rows, this.grid);
        }
    }
}

PathFinder.prototype.find = function(start, end) {
    this.start = this.grid[start.x][start.y];
    this.end = this.grid[end.x][end.y];

    this.openSet.push(this.start);

    while (true) {
        if(this.openSet.length > 0) {
            var winner = 0;
            for(var i = 0; i < this.openSet.length; i++) {
                if(this.openSet[i].f < this.openSet[winner].f) {
                    winner = i;
                }
            }

            var current = this.openSet[winner];

            if(current == this.end) {
                var tmp = current;
                this.path.push({ x: tmp.i, y: tmp.j });
                while(tmp.prev) {
                    this.path.push({ x: tmp.prev.i, y: tmp.prev.j });
                    tmp = tmp.prev;
                }
                return this.path.reverse();
            }
            this.openSet = this.openSet.filter(e => e != current);
            this.closedSet.push(current);

            var neighbors = current.n;

            for(var i = 0; i < neighbors.length; i++) {
                var n = neighbors[i];
                if(!this.closedSet.includes(n) && !n.wall) {  
                    var tmpG = current.g + 1;
                    if(this.openSet.includes(n)) {
                        if(tmpG < n.g) {
                            n.g = tmpG;
                        }
                    } else {
                        n.g = tmpG;
                        this.openSet.push(n);
                    }
                    n.h = heuristic(n, end);
                    n.f = n.g + n.h;
                    n.prev = current;
                }
            }

        }
        else {
            return null;
        }
    }
}

function Spot(i, j, wall) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.n = [];
    this.prev = undefined;
    this.wall = wall;

    this.addNeighbors = function(cols, rows, grid) {
        var i = this.i;
        var j = this.j;
        if(i < cols - 1) {
            this.n.push(grid[i + 1][j]);
        }
        if(i > 0) {
            this.n.push(grid[i - 1][j]);
        }
        if(j < rows - 1) {
            this.n.push(grid[i][j + 1]);
        }
        if(j > 0) {
            this.n.push(grid[i][j - 1]);
        }
    }
}

function heuristic(a, b) {
    var d = Math.sqrt(Math.pow(a.i - b.i, 2) + Math.pow(a.j - b.j, 2));
    return d;
}

module.exports = {
    PathFinder: PathFinder
}