var resolution = 36;
var pixels = [];

var w = 400/resolution;

var updateDelay = 3;

var setGrid = function() {
    for(var i = 0; i < resolution; i++) {
        pixels[i] = [];
        for(var k = 0; k< resolution; k++) {
            pixels[i][k] = random(0, 1);
        }
    }
};


var drawGrid = function() {
    for(var i = 0; i < resolution; i++) {
        for(var k = 0; k < resolution; k++) {
            noStroke();
            fill(255*pixels[i][k], 255*pixels[i][k], 255*pixels[i][k]);
            rect(i*w-0.5, k*w-0.5, w+1, w+1);
        }
    }
};


frameRate(30);
setGrid();

var t = 0;
draw = function() {
    if(t % updateDelay === 0) {
        setGrid();
    }
    
    drawGrid();
    
    t++;
};