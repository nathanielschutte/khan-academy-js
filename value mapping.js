var min1 = -10;
var max1 = 257;

var value = 160;

var min2 = 33;
var max2 = 237;

var mapV = function(v, x1, x2, y1, y2) {
    var diff = (y2 - y1) / (x2 - x1);
    return (v - x1) * diff + y1;
};


var drawValueRange = function(x, y, val, min, max) {
    noStroke();
    fill(255, 0, 0);
    rect(x, y + min, 50, val - min);
    
    noFill();
    stroke(0, 0, 0);
    rect(x, y + min, 50, max - min);
    
    fill(0, 0, 0);
    textAlign(RIGHT);
    text(min, x - 5, y + min + 10);
    text(max, x - 5, y + max);
    
    fill(158, 0, 0);
    text(val, x - 5, y + val);
};


var value2 = floor(mapV(value, min1, max1, min2, max2));
drawValueRange(50, 50, value, min1, max1);
drawValueRange(200, 50, value2, min2, max2);

// noStroke();
// fill(255, 0, 0);
// if(value / (max1 - min1) - value2 / (max2 - min2) < 0.5) {
//     fill(0, 173, 17);
// }
// rect(350, 350, 50, 50);