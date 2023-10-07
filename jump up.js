var x;
var y;
var xv;
var yv;
var guy_w = 24;
var guy_h = 36;

var current_max = 0;
var jump_max = 120;

var camUp = 0;

var plat_w = 64;
var plat_h = 12;
var plat_edge_pad = 20;
var plat_vary = 16;

var gravity = 0.3;
var air_damp = 0.95;
var plat_damp = 0.85;
var move_accel = 0.5;
var jump_accel = 8.0;

var difficulty = 0;
var max_difficulty = 10;

var hard = max_difficulty - difficulty;
var plat = [];
var keys = [];

var keyPressed = function() {
    keys[keyCode] = true;
};

var keyReleased = function() {
    keys[keyCode] = false;
};

var translateY = function(y) {
    return 400 - y - camUp;
};

var getRand = function(a, b) {
    return a + random()*(b-a);
};


var addPlat = function(x, y, t) {
    plat.push({x: x, y: y, t: t});
};

var newPlats = function(y, t) {
    var c = hard;
    if(t === 0) {
        for(var i = 0; i < c; i++) {
            addPlat(getRand(plat_edge_pad, 400-plat_edge_pad-plat_w), y + (400/c)*i + getRand(-plat_vary, plat_vary), 0);
            
            if(i === 0) {
                if(plat[plat.length - 1].y - current_max < jump_max) {
                    
                }
            }
        }
    }
};

var startPlats = function() {
    plat = [];
    var plat_dist = 360/5;
    
    current_max = 0;
    for(var i = 0; i < 5; i++) {
        addPlat(20+(plat_dist)*i, 40+getRand(-10, 10), 0);
        
        if(plat[plat.length - 1].y > current_max) {
            current_max = plat[plat.length - 1].y;
        }
    } 
    
    newPlats(200, 0);
    
};

var startOver = function() {
    x = 200-guy_w/2;
    y = 290-guy_h/2;
    xv = 0;
    yv = 0;
    camUp = 0;
    
    startPlats();
};

var drawGuy = function(x, y) {
    noStroke();
    fill(191, 0, 0);
    rect(x, translateY(y), guy_w, guy_h);
};

var drawPlat = function(x, y) {
    noStroke();
    fill(134, 155, 186);
    rect(x, translateY(y), plat_w, plat_h);
};

var drawGame = function() {
    for(var i = 0; i < plat.length; i++) {
        drawPlat(plat[i].x, plat[i].y);
    }
};

var update = function() {
    var collide = false;
    yv -= gravity;
    if(keys[39]) {
        xv += move_accel;
    }
    if(keys[37]) {
        xv -= move_accel;
    }
    xv *= air_damp;
    if(yv <= 0) {
        for(var i = 0; i < plat.length; i++) {
            if(x < plat[i].x+plat_w && x+guy_w > plat[i].x &&
                    y-guy_h < plat[i].y && y+guy_h+(yv+gravity) >= plat[i].y) {
                y = plat[i].y+guy_h;
                yv = jump_accel;
                xv *= plat_damp;
                break;
            }
        }
    }
    
    x += xv;
    y += yv;
    
    if(translateY(y) > 400) {
        startOver();
    }
    if(x+guy_w < 0) {
        x = 400;
    }
    if(x > 400) {
        x = -guy_w;
    }
};

frameRate(60);

startOver();

draw = function() {
    background(255, 255, 255);
    
    update();
    drawGame();
    drawGuy(x, y);
    
    //println(y);
};
