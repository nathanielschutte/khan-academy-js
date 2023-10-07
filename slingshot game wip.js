// properties for the ball
var xp, yp, zp, xv, yv, zv;

// properties for the sling
var slingX, slingY, slingZ, slingWidth, slingHeight, slingColor;

// properties for the targets
var targetRate, targetSize, targetSpeed, targetDist;

// offset properties
var xOff, yOff;

// properties for the world
var camX, camY, camVx, camVy, zoom, zoomVel, panSpeed, zoomSpeed, mouseRange, borderWidth, borderHeight, borderZoom, floorStroke, floorFill;


var debugMode = true;


/** Set initial values */

var init = function(){
    slingX = 0;
    slingY = 0;
    slingZ = 1;
    slingWidth = 65;
    slingHeight = 106;
    slingColor = color(107, 78, 27);
    
    xp = slingX;
    yp = slingY + slingHeight;
    zp = slingZ;
    xv = 0;
    yv = 0;
    zv = 0;
    
    targetRate = 3;
    targetSize = 30;
    targetSpeed = 0.35;
    targetDist = 100;
    
    xOff = 200;
    yOff = 375;
    
    camX = 0;
    camY = 0;
    camVx = 0;
    camVy = 0;
    zoom = 1;
    zoomVel = 0;
    panSpeed = 0.75;
    zoomSpeed = 0.01;
    mouseRange = 30;
    borderWidth = 400;
    borderHeight = 80;
    borderZoom = 3;
    floorStroke = color(98, 117, 21);
    floorFill = color(62, 135, 38);
}; // ==================

/** Move the world based on the mouse's position */

var getMovement = function(){
    var moveX = 200 - mouseX;
    var moveY = 200 - mouseY;
    
    // position change
    if (moveX > mouseRange || moveX < -mouseRange){
        camVx -= (moveX / (100 / panSpeed));
    }
    if (moveY > mouseRange || moveY < -mouseRange){
        camVy -= (moveY / (100 / panSpeed));
    }
    
    // zoom change
    if (keyIsPressed && keyCode === UP){
        zoomVel += zoomSpeed;
    }
    else if (keyIsPressed && keyCode === DOWN){
        zoomVel -= zoomSpeed;
    }
    
    // movement drag
    camVx *= 0.9;
    camVy *= 0.9;
    zoomVel *= 0.9;
    
    // movement from velocities
    camX += camVx;
    camY += camVy;
    zoom += zoomVel;
    
    // borderline corrections
    if(camX > borderWidth  * zoom / 2){
        camX = borderWidth  * zoom / 2;
    }
    if(camX < borderWidth * zoom / -2){
        camX = borderWidth * zoom / -2;
    }
    if(camY > borderHeight){
        camY = borderHeight;
    }
    if(camY < 0){
        camY = 0;
    }
    if(zoom > borderZoom){
        zoom = borderZoom;
    }
    if(zoom < 1){
        zoom = 1;
    }
}; // ==================

/** Round number to nearest tenth */

var r = function(num){
    return round(num * 10) / 10;
}; // ==================

/** Draw transformed point */

var drawPoint = function(x, y, z, s, str){
    stroke(str);
    strokeWeight(s * (zoom / z));
    point((x - camX) * (zoom / z), (y - camY) * (zoom / z));
};

/** Draw transformed line */

var drawLine = function(x1, y1, x2, y2, z, s, str){
    stroke(str);
    strokeWeight(s * (zoom / z));
    line(((x1 - camX) * (zoom / z)) + xOff, ((y1 - camY) * (zoom / z)) + yOff, ((x2 - camX) * (zoom / z)) + xOff, ((y2 - camY) * (zoom / z)) + yOff);
}; // ==================

/** Draw transformed rect */

var drawRect = function(x, y, z, w, h, s, str, f){
    stroke(str);
    fill(f);
    strokeWeight(s * (zoom / z));
    rect((x - camX) * (zoom / z) + xOff, (y - camY) * (zoom / z) + yOff, w * (zoom / z), h * (zoom / z));
}; // ==================

/** Draw the sling shot */

var drawSling = function(){
    drawLine(slingX, slingY, slingX, slingY - (0.5 * slingHeight), slingZ, 8, slingColor);
    
    drawLine(slingX, slingY - (0.5 * slingHeight), slingX - (slingWidth / 2), slingY - slingHeight, slingZ, 8, slingColor);
    
    drawLine(slingX, slingY - (0.5 * slingHeight), slingX + (slingWidth / 2), slingY - slingHeight, slingZ, 8, slingColor);
}; // ==================

/** Draw the floor of the world */

var drawFloor = function(){
    drawRect(-borderWidth, -150, 1, borderWidth * 2, 500, 4, floorStroke, floorFill);
};

init();

var draw = function() {
    background(209, 230, 255);
    
    getMovement();
    drawFloor();
    drawSling();
    
    
    
    
    // anything that should happen if debugging
    if (debugMode){
        fill(255, 255, 255);
        
        text("Camera  x: " + r(camX) + "  y: " + r(camY) + "  zoom: " + r(zoom), 6, 393);
    }
};
