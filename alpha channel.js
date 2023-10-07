var blockSize = 10;
var blockCount = 400/blockSize;

var pixel = [];
for(var i = 0; i < blockCount; i++) {
    pixel[i] = [];
    for(var k = 0; k < blockCount; k++) {
        pixel[i][k] = {r: 125, g: 255, b: 220};
    }
}

var addColors = function(c1, c2, mode) {
    var alpha1 = c2.a/255;
    var alpha2 = 1-(c2.a/255);
    if(mode === 0) {
        return {r: c1.r*alpha2+c2.r*alpha1, g: c1.g*alpha2+c2.g*alpha1, b: c1.b*alpha2+c2.b*alpha1};
    }
};


var addRect = function(x, y, w, h, c) {
    if(x < 0) {x = 0;}
    if(y < 0) {x = 0;}
    if(x >= blockCount) {x = blockCount-1;}
    if(y >= blockCount) {y = blockCount-1;}
    if(x+w > blockCount) {w = blockCount-x;}
    if(y+h > blockCount) {h = blockCount-y;}
    for(var i = x; i < x+w; i++) {
        for(var k = y; k < y+h; k++) {
            pixel[i][k] = addColors(pixel[i][k], c, 0);
        }
    }
};


var drawAll = function() {
    stroke(0, 0, 0, 100);
    strokeWeight(0.3);
    for(var i = 0; i < blockCount; i++) {
        for(var k = 0; k < blockCount; k++) {
            fill(pixel[i][k].r, pixel[i][k].g, pixel[i][k].b);
            rect(i*blockSize, k*blockSize, blockSize, blockSize);
        }
    }
};


background(224, 130, 224);
addRect(6, 3, 18, 12, {r: 180, g: 0, b: 100, a: 150});
addRect(20, 9, 4, 20, {r: 167, g: 255, b: 0, a: 132});
addRect(9, 10, 18, 12, {r: 255, g: 0, b: 0, a: 78});
addRect(2, 6, 8, 8, {r: 0, g: 255, b: 20, a: 100});
drawAll();