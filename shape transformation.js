var WORLDx, WORLDy, WORLDzoom, WORLDrot;
var xv, yv, zv, rv;
var panSpeed, zoomSpeed, rotSpeed;
var borderWidth, borderHeight, borderZoom, drag;




/** Initialize world position and movement velocities */

var init = function(){
    WORLDx = 0;
    WORLDy = 0;
    WORLDzoom = 1;
    WORLDrot = 0;
    
    xv = 0;
    yv = 0;
    zv = 0;
    rv = 0;
    
    panSpeed = 2;
    zoomSpeed = 0.01;
    rotSpeed = 2;
    
    borderWidth = 800;
    borderHeight = 800;
    borderZoom = 3;
    drag = 0.9;
};



/** Get key control and update position */

var control = function(){
    if (keyIsPressed){
        switch (keyCode){
        case RIGHT:
            xv += panSpeed;
            break;
        case LEFT:
            xv -= panSpeed;
            break;
        case UP:
            yv += panSpeed;
            break;
        case DOWN:
            yv -= panSpeed;
            break;
        case 87:
            zv += zoomSpeed;
            break;
        case 83:
            zv -= zoomSpeed;
            break;
        case 65:
            rv += rotSpeed;
            break;
        case 68:
            rv -= rotSpeed;
        }
    }
    
    
    xv *= drag;
    yv *= drag;
    zv *= drag;
    rv *= drag;
    
    WORLDx += xv;
    WORLDy -= yv;
    WORLDzoom += zv;
    WORLDrot += rv;
    
    WORLDx = min(WORLDx, borderWidth / 2);
    WORLDx = max(WORLDx, borderWidth / -2);
    WORLDy = min(WORLDy, borderHeight / 2);
    WORLDy = max(WORLDy, borderHeight / -2);
    WORLDzoom = min(WORLDzoom, borderZoom);
    WORLDzoom = max(WORLDzoom, 0.01);
};




/** Find the angle of change in x and y */

var getDir = function(dx, dy){
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



/** Return translated x position */

var tx = function(x){
    return (x - WORLDx) * WORLDzoom;
};



/** Return translated y position */

var ty = function(y){
    return (y - WORLDy) * WORLDzoom;
};




/** Draw translated point */

var drawPoint = function(x, y){
    point(tx(x), ty(y));
};




/** Draw translated line */

var drawLine = function(x1, y1, x2, y2){
    line(tx(x1), ty(y1), tx(x2), ty(y2));
};



/** Draw translated rect */

var drawRect = function(x, y, w, h){
    rect(tx(x), ty(y), w * WORLDzoom, h * WORLDzoom);
};



/** Draw translated ellipse */

var drawEllipse = function(x, y, w, h){
    ellipse(tx(x), ty(y), w * WORLDzoom, h * WORLDzoom);
};



/** Draw translated triangle */

var drawTriangle = function(x1, y1, x2, y2, x3, y3){
    triangle(tx(x1), ty(y1), tx(x2), ty(y2), tx(x3), ty(y3));
};



/** Set drawing properties for stroke */

var setStroke = function(s, sc, sw){
    if (! s){
        noStroke();
        return;
    }
    stroke(sc);
    strokeWeight(sw);
};



/** Set drawing properties for fill */

var setFill = function(f, fc){
    if (! f){
        noStroke();
        return;
    }
    fill(fc);
};




init();




/** Main */

var draw = function() {
     background(255, 255, 255);
     
     control();
     
     setStroke(true, color(166, 35, 166), 5);
     setFill(true, color(150, 196, 245));
     
     drawRect(63, 41, 70, 105);
     drawTriangle(203, 110, 349, 158, 262, 51);
};