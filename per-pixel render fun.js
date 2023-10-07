var t = 0;
var gridW = 42; // <-- Change
var gridH = 42; // <-- Change

var tileW = 400 / gridW;
var tileH = 400 / gridH;

var mode = 1; // set to 1 or 2
var n = 6;
var p = 50;



var render = function() {
    noStroke();
    
    for(var i = 0; i < gridH; i++) {
        for(var k = 0; k < gridW; k++) {
            var realX = (k * tileW) + tileW / 2;
            var realY = (i * tileH) + tileH / 2;
            
            if(mode === 1) {
                fill(i%n*p, k%n*p, sqrt(k*i)*10);
            }
            else if(mode === 2) {
                fill((i+t&n)*16, (k-t&n)*8, sqrt(k*i)*4);
            }
            
            rect(k * tileW, i * tileH, tileW, tileH);
        }
    }
};



draw = function() {
    background(255, 255, 255);
    render();
    t++;
};