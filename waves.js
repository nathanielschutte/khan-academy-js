var waveLength = 16;
var waveHeight = 4;
var waveSpeed = 3;
var waveLevel = 287;

var i = 0;

draw = function() {
    background(214, 249, 255);
    
    strokeWeight(4);
    stroke(0, 196, 255);
    for(var k = 0; k < 100; k++){
        line(k * 4, (waveLevel + 1 * min(waveLength / 2, 15)) + sin(k * waveLength) * (waveHeight * (sin(i))), k * 4, 400);
    }
    
    i += waveSpeed;
};