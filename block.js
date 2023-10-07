var guyX = 0;
var guyY = 0;
var guyXV = 0;
var guyYV = 0;
var guyW = 24;
var guyH = 24;

var moveSpeed = 1;
var moveDist = 0;

var guyJump = 10;
var jumpTime = 0;
var canJump = false;

var floorY = 320;
var gravity = 0.5;

var BGCount = 3;

var keys = [200];
var bg = [BGCount*3];

for(var i = 0; i < 200; i++) {
    keys[i] = false;
}

keyPressed = function() {
    keys[keyCode] = true;
};

keyReleased = function() {
    keys[keyCode] = false;
};

var getRand = function(a, b) {
    return a + random() * (b - a);
};

var makeBG = function() {
    for(var i = 0; i < BGCount; i++) {
        bg[i] = {x: i*(400/BGCount), y: getRand(7)};
    }
};

var reset = function() {
    guyX = 50;
    guyY = 260;
    guyXV = 0;
    guyYV = 0;
    
    moveDist = 0;
};

var drawGuy = function() {
    fill(57, 115, 64);
    noStroke();
    
    angleMode = "degrees";
    
    pushMatrix();
    translate(guyX + guyW/2, guyY + guyH/2);
    rotate(jumpTime*guyJump*0.70);
    rect(-guyW/2, -guyH/2, guyW, guyH);
    popMatrix();
};

var drawBackdrop = function() {
    
};

var update = function() {
    
    moveDist += moveSpeed;
    
    if(guyY === floorY - guyH) {
        canJump = false;
        jumpTime = 0;
        if(keys[32] === true) {
            guyYV = guyJump;
            canJump = true;
        }
    }
    
    if(canJump) {
        jumpTime++;
    }
    
    
    guyYV -= gravity;
    guyY -= guyYV;
    if(guyY + guyH >= floorY) {
        guyY = floorY - guyH;
        guyYV = 0;
    }
};

frameRate(60);
reset();

draw = function() {
    background(10, 163, 125);
    
    update();
    drawGuy();
    
    noStroke();
    fill(6, 71, 15);
    rect(0, floorY, 400, 400);
    
    fill(255, 0, 0);
    text(moveDist, 0, 0);
};