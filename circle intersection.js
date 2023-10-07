var hover = -1;
var hold = -1;
var grabRange = 0;

var offX = 0;
var offY = 0;

var c1 = {
    id: 0,
    x: 140,
    y: 200,
    r: 100
};

var c2 = {
    id: 1,
    x: 280,
    y: 200,
    r: 75
};


var control = function() {
    if(!mouseIsPressed) {
        hold = -1;
        hover = -1;
        if(dist(mouseX, mouseY, c1.x, c1.y) < c1.r+grabRange) {
            hover = 0;
        }
        else if(dist(mouseX, mouseY, c2.x, c2.y) < c2.r+grabRange) {
            hover = 1;
        }
    }
    else {
        if(hover === 0) {
            if(hold === -1) {
                offX = mouseX - c1.x;
                offY = mouseY - c1.y;
                hold = 0;
            }
            c1.x = mouseX - offX;
            c1.y = mouseY - offY;
        }
        else if(hover === 1) {
            if(hold === -1) {
                offX = mouseX - c2.x;
                offY = mouseY - c2.y;
                hold = 0;
            }
            c2.x = mouseX - offX;
            c2.y = mouseY - offY;
        }
    }
};


var drawCircle = function(c) {
    strokeWeight(1);
    noFill();
    stroke(207, 12, 12);
    
    ellipse(c.x, c.y, c.r*2, c.r*2);
    
    strokeWeight(4);
    if(hover === c.id) {
        strokeWeight(6);
    }
    point(c.x, c.y);
};

var drawUtil = function() {
    strokeWeight(1);
    stroke(56, 73, 224);
    line(c1.x, c1.y, c2.x, c2.y);
};

var chordLength = function() {
    var d = c2.x-c1.x;
    return (1/d)*sqrt((-d+c2.r-c1.r)*
            (-d-c2.r+c1.r)*
            (-d+c2.r+c1.r)*
            (d+c2.r+c1.r));
};


draw = function() {
    
    control();
    
    background(255, 255, 255);
    drawCircle(c1);
    drawCircle(c2);
    drawUtil();
};

