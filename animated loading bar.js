var c = 0;
var w = 182;
var h = 20;
var x = 200-w/2;
var y = 200-h/2;
var chunkW = 25;
var chunkTip = 2;
var speed = 1.25;
var def = 2;
var slide = w;
var m = true;

draw = function() {
    background(255, 255, 255);
    
    stroke(0, 0, 0);
    strokeWeight(1);
    rect(x-1, y-1, w+1, h+1);
    
    var xx = min(max(mouseX, x), x+w);
    slide = xx - x;
    if(!m) {
        slide = w;
    }
    
    for(var i = x; i < x+slide; i += def) {
        for(var k = y; k<y+h; k += def) {
            var fill = false;
            if(floor((i-x+c/speed+k/chunkTip)/chunkW)%2 === 0) {
                fill = true;
            }
            if(fill) {
                stroke(120, 133, 194);
            }
            else {
                stroke(230, 230, 230);
            }
            strokeWeight(def+1);
            point(i+def/4, k+def/4);
        }
    }
    
    c++;
};


mouseOut = function() {
    m = false;
};

mouseOver = function() {
    m = true;
};
