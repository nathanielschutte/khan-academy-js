var sc = 2;
var cur = 0;

var xm = 2;
var a = 0;

stroke(255, 0, 0);
strokeWeight(sc);


var func = function(x) {
    return (x/xm)^a;
};

frameRate(30);
draw = function() {
    background(255, 255, 255);
    
    a = a > 500 ? 0 : a + 1;
    
    for(var i = xm; i < 399; i += sc) {
        point(i, func(i));
    }
};