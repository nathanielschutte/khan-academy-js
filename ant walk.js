var dim = 200;
var updates = 10;
var expandFactor = 20;

var step = 400/dim;
var frame = 0;
var running = 1;

var ant = {
    x: dim/2,
    y: dim/2,
    dir: 2
};

var grid = [];

var setGrid = function(n) {
    grid = [];
    for(var i = 0; i < n*n; i++) {
        grid.push(0);
    }
};


var getCellID = function(x, y) {
    return y*dim + x;
};

var getCell = function(x, y) {
    return grid[getCellID(x, y)];
};

var setCell = function(x, y, k) {
    grid[getCellID(x, y)] = k;
};


var drawCell = function(x, y) {
        noStroke();
        if(getCell(x, y) === 0) {
            fill(255, 255, 255);
        }
        else {
            fill(66, 66, 66);
        }
        rect(x*step, y*step, step, step);
};


var drawGrid = function() {
    background(255, 255, 255);
    for(var i = 0; i < dim; i++) {
        for(var k = 0; k < dim; k++) {
            drawCell(i, k);
        }
    }
};


var copyArray = function(a) {
    var arr = [];
    for(var i = 0; i < a.length; i++) {
        arr[i] = a[i];
    }
    return arr;
};


var expandGrid = function(n) {
    if(dim > 149) {
        running = 0;
        return;
    }
    
    if(n % 2 === 1) {
        n++;
    }
    if(n < 2) {
        n = 2;
    }
    var offset = n/2;
    
    var oldGrid = copyArray(grid);
    var oldDim = dim;
    dim += n;
    step = 400/dim;
    setGrid(dim);
    
    for(var i = 0; i < oldDim; i++) {
        for(var k = 0; k < oldDim; k++) {
            var id = k*oldDim + i;
            if(oldGrid[id] > 0) {
                setCell(i+offset, k+offset, oldGrid[id]);
            }
        }
    }
    
    ant.x += offset;
    ant.y += offset;
    
    drawGrid();
};


var moveAnt = function() {
    if(ant.dir === 0) {
        if(ant.y === 0) {
            expandGrid(expandFactor);
        }
        ant.y--;
    }
    else if(ant.dir === 1) {
        if(ant.x === dim) {
            expandGrid(expandFactor);
        }
        ant.x++;
    }
    else if(ant.dir === 2) {
        if(ant.y === dim) {
            expandGrid(expandFactor);
        }
        ant.y++;
    }
    else if(ant.dir === 3) {
        if(ant.x === 0) {
            expandGrid(expandFactor);
        }
        ant.x--;
    }
};


var drawAnt = function() {
    fill(36, 52, 133);
    noStroke();
    ellipse(ant.x*step + step/2, ant.y*step + step/2, step-3, step-3);
};


var updateGrid = function() {
    if(getCell(ant.x, ant.y) === 0) {
        ant.dir = (ant.dir + 1) % 4;
        setCell(ant.x, ant.y, 1);
        drawCell(ant.x, ant.y);
        moveAnt();
    }
    else {
        ant.dir = ant.dir - 1;
        if(ant.dir < 0) {
            ant.dir = 3;
        }
        setCell(ant.x, ant.y, 0);
        drawCell(ant.x, ant.y);
        moveAnt();
    }
};


var doAll = function() {
    for(var i = 0; i < updates; i++) {
        updateGrid();
    }
    drawAnt();
    frame++;
};


setGrid(dim);
drawGrid();


var draw = function() {
    if(running === 1) {
        doAll();
    }
};
