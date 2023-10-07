var orbs = [];
var grid = [];
var combo = [];

var WIDTH = 6;
var HEIGHT = 5;
var SIZE = 40;
var SPACE = 4;
var HIT = SIZE/2;
var DIST = SPACE+SIZE;

var OFFX = 200-(WIDTH-1)*DIST/2;
var OFFY = 200-(HEIGHT-1)*DIST/2;

var HIGH_BRIGHT = 82;
var GRAB_SIZE = 5;
var SHIFT_SPEED = 5;

var high = -1;
var grab = -1;
var last = grab;
var replaceX;
var replaceY;

var resetBuffer = 10;
var lastReset = frameCount;

var colors = [
2, 156, 81, 41, 197, 214
];

var keys = [];

keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};

for(var i = 0; i < WIDTH*HEIGHT; i++) {
    var k = floor(random(0, 6));
    var xx = (i%WIDTH)*DIST;
    var yy = floor(i/WIDTH)*DIST;
    orbs.push({t: k, x: xx, y: yy, tx: 0, ty: 0});
    grid.push(k);
}

var padReset = function() {
    for(var i = 0; i < WIDTH*HEIGHT; i++) {
        var k = floor(random(0, 6));
        var xx = (i%WIDTH)*DIST;
        var yy = floor(i/WIDTH)*DIST;
        orbs.push({t: k, x: xx, y: yy, tx: 0, ty: 0});
        grid.push(k);
    }
};


var keypress = function() {
    if(frameCount > lastReset + resetBuffer) {
        if(keys[49]) {
            WIDTH = 6;
            HEIGHT = 5;
            SIZE = 40;
            SPACE = 4;
            
        }
    }
};


var check = function() {
    
};


var update = function() {
    if(grab === -1 && !mouseIsPressed) {
        high = -1;
        for(i = 0; i < orbs.length; i++) {
            var x = orbs[i].x+OFFX;
            var y = orbs[i].y+OFFY;
            var d = DIST/2;
            if(mouseX < x+d && mouseX > x-d && mouseY < y+d && mouseY > y-d) {
                high = i;
            }
        }
    }
    if(mouseIsPressed && high !== -1) {
        grab = high;
        if(last !== grab) {
            orbs[grab].tx = orbs[grab].x;
            orbs[grab].ty = orbs[grab].y;
            replaceX = orbs[grab].x;
            replaceY = orbs[grab].y;
        }
        last = grab;
        var x = orbs[grab].x;
        var y = orbs[grab].y;
        x = mouseX-OFFX;
        y = mouseY-OFFY;
        
        if(x < 0) {
            x = 0;
        }
        if(x > (WIDTH-1)*DIST) {
            x = (WIDTH-1)*DIST;
        }
        if(y < 0) {
            y = 0;
        }
        if(y > (HEIGHT-1)*DIST) {
            y = (HEIGHT-1)*DIST;
        }
        
        for(i = 0; i < orbs.length; i++) {
            if(i !== grab) {
                var xx = orbs[i].x;
                var yy = orbs[i].y;
                if(x < xx+HIT && x > xx-HIT && y < yy+HIT && y > yy-HIT) {
                    orbs[i].tx = xx-orbs[grab].tx;
                    orbs[i].ty = yy-orbs[grab].ty;
                    replaceX = orbs[i].x;
                    replaceY = orbs[i].y;
                    orbs[i].x = orbs[grab].tx;
                    orbs[i].y = orbs[grab].ty;
                    grid[orbs[i].x/DIST+(orbs[i].y/DIST*WIDTH)] = orbs[i].t;
                    orbs[grab].tx = xx;
                    orbs[grab].ty = yy;
                }
            }
        }
        orbs[grab].x = x;
        orbs[grab].y = y;
    }
    else {
        if(grab !== -1) {
            orbs[grab].tx = 0;
            orbs[grab].ty = 0;
            orbs[grab].x = replaceX;
            orbs[grab].y = replaceY;
            grid[orbs[grab].x/DIST+(orbs[grab].y/DIST*WIDTH)] = orbs[grab].t;
        }
        grab = -1;
        last = -1;
    }
    
    for(var i = 0; i < orbs.length; i++) {
        if(i !== grab) {
            if(orbs[i].tx > 0) {
                orbs[i].tx -= DIST/SHIFT_SPEED;
            }
            if(orbs[i].tx < -1) {
                orbs[i].tx += DIST/SHIFT_SPEED;
            }
            if(orbs[i].ty > 0) {
                orbs[i].ty -= DIST/SHIFT_SPEED;
            }
            if(orbs[i].ty < -1) {
                orbs[i].ty += DIST/SHIFT_SPEED;
            }
            if(abs(orbs[i].tx) < DIST/SHIFT_SPEED) {
                orbs[i].tx = 0;
            }
            if(abs(orbs[i].ty) < DIST/SHIFT_SPEED) {
                orbs[i].ty = 0;
            }
        }
    }
};


var drawOrb = function(t, x, y, bright, size) {
    noStroke();
    colorMode(HSB);
    if(t !== 5) {    
        fill(colors[t], 255, bright);
        ellipse(x, y, size, size);
        fill(colors[t], 255, bright+(255-bright)/3);
        ellipse(x, y-size/7, size/1.3, size/1.5);
    }
    else {
        fill(colors[t], 255, bright);
        rect(x-size/2, y-size/2, size, size);
        fill(colors[t], 255, bright+(255-bright)/3);
        rect(x-size/2, y-size/2, size, size/2);
    }
};



var render = function() {
    for(var i = 0; i < WIDTH*HEIGHT; i++) {
        var bright = 255-HIGH_BRIGHT;
        if(high === i) {
            bright = 255-HIGH_BRIGHT/2;
        }
        if(grab !== i) {
            drawOrb(orbs[i].t, OFFX+orbs[i].x+orbs[i].tx, OFFY+orbs[i].y+orbs[i].ty, bright, SIZE);
        }
    }
    if(grab !== -1) {
        drawOrb(orbs[grab].t, OFFX+orbs[grab].x, OFFY+orbs[grab].y, 255-HIGH_BRIGHT/2, SIZE+GRAB_SIZE);
        //println(orbs[grab].tx + "   " + orbs[grab].ty);
    }
    
    /*for(var i = 0; i < WIDTH*HEIGHT; i++) {
        colorMode(HSB);
        stroke(colors[grid[i]], 255, 255);
        strokeWeight(5);
        point(OFFX+(i%WIDTH)*DIST, OFFY+floor(i/WIDTH)*DIST);
    }*/
};



frameRate(60);
draw = function() {
    colorMode(RGB);
    background(106, 118, 163);
    keypress();
    update();
    render();
};
