// #### CHANGE THESE ###
// #####################
var waveFrequency = 46;
var waveHeight = 83;
var waveThickness = 14;
// #####################


colorMode("HSB", 100);
var t = 0;
strokeWeight(waveThickness);

var draw = function() {
    background(255, 255, 255);
    for(var k = 0; k < 400; k++){
        stroke((k + t) % 100, 100, 100);
        
        point(k, sin(k * waveFrequency) * waveHeight + 200);
    }
    t += 3;
};
