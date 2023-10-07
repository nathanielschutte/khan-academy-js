var startx, starty, endx, endy, xv, yv, dx, dy, collided, press;
var length, bounce, gravity, friction, weight, wallfriction;

/** HIT RESTART IF THE SPRING IS STUCK AT FIRST! */

/** The project uses Hooke's law for springs: F = -kx, where F is the force of a particle, k is a constant representing the bounciness of the spring, and x represents the relative distance between the two particles on either end of the spring currently and their distance from each other when sitting naturally.  
 * 
 * Basically, as the two ends of the spring stretch out further than their natural sitting length, their force towards each other will increase. */





// sizes of the ellipses on either end of the spring
var startSize = 10;
var endSize = round(weight * 5);

// slider setup
var sHeight = 11;
var sWidth = 7;
var sLength = -10;
var sXPos = 186;
var sYPos = 36;
var sSpacing = 18;

// set up slider position array
var s = [
    {x: sXPos, y: sYPos + (sSpacing * 0)},
    {x: sXPos, y: sYPos + (sSpacing * 1)},
    {x: sXPos, y: sYPos + (sSpacing * 2)},
    {x: sXPos, y: sYPos + (sSpacing * 3)},
    {x: sXPos, y: sYPos + (sSpacing * 4)}
];

var highlight = null;

// if mouse is hovering over a slider, set highlight to slider ID, otherwise set highlight to null
var mouseMoved = function() {
    highlight = null;
    for (var k = 0; k < 5; k++) {
        if (dist(mouseX, mouseY, s[k].x, s[k].y) < (max(sHeight, sWidth))) {
            highlight = k;
        }
    }
};

// find proper position of slider based on min and max of two ranges
var translatePos = function(min1, max1, min2, max2, pos){
    
    return (pos * ((max2 - min2) / ((max1 - min1) + min1)));
};

// change slider position if mouse is dragging the slider
// COMPLETELY BUGGED OUT
var mouseDragged = function() {
    if (highlight !== null) {
        s[highlight].x = mouseX;
        if (s[highlight].x < sXPos){
            s[highlight].x = sXPos;
        }
        if (s[highlight].x > sXPos + sLength){
            s[highlight].x = sXPos + sLength;
        }
        
        if (highlight === 0){
            length = translatePos(sXPos, sXPos + sLength, 5, 200, s[highlight].x) - 111;
        }
        else if (highlight === 1){
            bounce = translatePos(sXPos, sXPos + sLength, 0.05, 0.4, s[highlight].x);
        }
        else if (highlight === 2){
            gravity = translatePos(sXPos, sXPos + sLength, 0.1, 3, s[highlight].x);
        }
        else if (highlight === 3){
            friction = translatePos(sXPos, sXPos + sLength, 0.5, 0.99, s[highlight].x);
        }
        else if (highlight === 4){
            weight = translatePos(sXPos, sXPos + sLength, 0.1, 8, s[highlight].x);
        }
    }
};

// initialize variables
var init = function(){
    startx = 200;
    starty = 200;
    endx = startx + 1;
    endy = starty - length;
    xv = 0;
    yv = 0;
    
    /** CHANGE THESE */
    length = 40;
    bounce = 0.2;
    gravity = 1;
    friction = 0.91;
    weight = 2.4;
    wallfriction = 0.6;
    /** ============ */
};

// find direction based on delta x and delta y
var direction = function(dx, dy){
    var dir = atan(dx/dy);
    if (dy < 0){
        if (dx > 0){
            dir += 180;
        }
        else if (dx < 0){
            dir -= 180;
        }
        else{
            dir = 180;
        }
    }
    return dir * -1;
};

// find distance based on delta x and delta y
var distance = function(dx, dy){
    return sqrt(pow(dx, 2) + pow(dy, 2));
};

// apply collisions to the end of the spring
var collision = function(x, y){
    if (x - (endSize / 2) < 0 || x + (endSize / 2) > 400){
        endx += -xv;
        xv = -0.5 * xv;
        return true;
    }
    if (y - (endSize / 2) < 0 || y + (endSize / 2) > 400){
        endy += yv;
        yv = -0.5 * yv;
        return true;
    }
    else{
        return false;
    }
};

// update physics
var update = function(){
    dx = startx - endx;
    dy = starty - endy;
    
    var dist = distance(dx, dy);
    var dir = direction(dx, dy);
    
    yv -= gravity * weight;
    
    xv += ((length - dist) * bounce) * sin(dir);
    yv += ((length - dist) * bounce) * cos(dir);
    xv *= friction;
    yv *= friction;
    if (collided){
        xv *= wallfriction;
        yv *= wallfriction;
    }
    
    endx += xv;
    endy -= yv;
    
    collided = collision(endx, endy);
};

// round to the hundreths place
var roundNum = function(num){
    return round(num * 100) / 100;
};

// drag the spring if the mouse is down
var doMouse = function(){
    if (mouseIsPressed && highlight === null){
        startx = mouseX;
        starty = mouseY;
        press = true;
    }
    else{
        press = false;
    }
    if (starty < 156){
        starty = 156;
    }
};

init();
frameRate(30);

// render everything
var draw = function() {
    var diff = abs(roundNum(distance(dx, dy) - length));
    endSize = round(weight * 5);
    background(235, 245, 245);
    
    // perform the physics and mouse updates
    doMouse();
    update();
    
    // draw the line
    stroke(49, 47, 120);
    strokeWeight(2);
    line(startx, starty, endx, endy);
    
    // draw the ellipse at the start coords of the spring
    stroke(56, 10, 10);
    strokeWeight(1);
    if(press){
        fill(214, 113, 113);
        startSize = 12;
    }
    else{
        fill(150, 45, 45);
        startSize = 10;
    }
    ellipse(startx, starty, startSize, startSize);
    
    // draw the ellipse at the end coords of the spring
    stroke(62, 102, 163);
    fill(134, 188, 224);
    ellipse(endx, endy, endSize, endSize);
    
    // draw the sliders
    // COMPLETELY BUGGED OUT
    /* for (var k = 0; k < 5; k++) {
        fill(161, 214, 255);
        rect(sXPos, sYPos + (sSpacing * k) - 1, sLength, 5);
        
        if (highlight === k){
            fill(178, 250, 255);
        }
        else{
            fill(44, 131, 163);
        }
        
        rect(s[k].x - (sWidth / 2), s[k].y - (sHeight / 2), sWidth, sHeight);
    } */
    
    // slider numbers
    fill(143, 53, 43);
    text("" + roundNum(length), sXPos + sLength + 5, sYPos + (sSpacing * 0) + 6);
    text("" + roundNum(bounce), sXPos + sLength + 5, sYPos + (sSpacing * 1) + 6);
    text("" + roundNum(gravity), sXPos + sLength + 5, sYPos + (sSpacing * 2) + 6);
    text("" + roundNum(friction), sXPos + sLength + 5, sYPos + (sSpacing * 3) + 6);
    text("" + roundNum(weight), sXPos + sLength + 5, sYPos + (sSpacing * 4) + 6);
    
    // dynamic properties
    fill(82, 0, 0);
    textSize(14);
    text("Dynamic:", 17, 20);
    
    fill(143, 53, 43);
    textSize(12);
    text("End X: " + roundNum(endx), 10, 40);
    text("End Y: " + roundNum(endy), 10, 54);
    text("Velocity X: " + roundNum(xv), 10, 75);
    text("Velocity Y: " + roundNum(yv), 10, 89);
    text("Direction: " + roundNum(direction(dx, dy)), 10, 110);
    
    text("Distance: " + roundNum(distance(dx, dy)), 10, 124);
    text("Colliding: " + collided, 10, 148);
    
    // static properties
    fill(82, 0, 0);
    textSize(14);
    text("Static:", 145, 20);
    
    fill(143, 53, 43);
    textSize(12);
    text("Length:", 130, 40 + (sSpacing * 0));
    text("Bounce:", 130, 40 + (sSpacing * 1));
    text("Gravity:", 130, 40 + (sSpacing * 2));
    text("Friction:", 130, 40 + (sSpacing * 3));
    text("Weight:", 130, 40 + (sSpacing * 4));
    
    // show the mouse's coordinates
    text("Mouse   x: " + mouseX, 5, 394);
    text("y: " + mouseY, 90, 394);
};