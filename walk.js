background(255, 255, 255);

var light = 10;
var step = 1;
var speed = 800;
var lit = 1;


var x = 200-step/2;
var y = 200-step/2;

var bar = function() {
    return dist(200-step/2, 200-step/2, x, y);    
};

var bar2 = function() {
    return 80+50*sin(bar()*3);
};

var moveNext = function(n) {
    for(var i = 0; i < n; i++) {
        if(lit === 0) {
            fill(0, 0, 0, light);
        }
        else if (lit === 1){
            colorMode(HSB);
            fill(bar(), 200, 200, light);
        }
        else if(lit === 2) {
            colorMode(RGB);
            fill(bar2(), bar2()*2, bar2(), light);
        }
        rect(x, y, step, step);
        if(floor(random(2)) === 1) {
            if(floor(random(2)) === 1) {
                x += step;
            }
            else {
                x -= step;
            }
        }
        else {
            if(floor(random(2)) === 1) {
                y += step;
            }
            else {
                y -= step;
            }
        }
        if(x > 500 || x < -100 || y > 500 || y < -100) {
            x = 200-step/2;
            y = 200-step/2;
        }
    }
};
noStroke();
fill(0, 0, 0, light);
background(255, 255, 255);
draw = function() {
    moveNext(speed);
};
