var waterHeight = 246;  // y position of water level
var waterWidth = 12;  // width of each "section" of water
var waterSmooth = true;  // smoothes the top of the water
var viscocity = 9;  // higher values flow smoother
var friction = 0.94;  // friction of the water
var dragRange = 60;  // range that allows water to be moved

var lineQuality = 30;  // quality of each water segment
var lineR = 0; //  initial water red color
var lineG = 135;  // initial water green color
var lineB = 220;  // initial water blue color
var lineColorChange = 120;  // water color gradient magnitude

var objectSize = 35;  //  size of boxes
var gravity = 0.5;  // amount of gravity to affect boxes
var buoyancy = 1.15;  // buoyancy of the water
var spinVel = 0.15;  // spin of boxes upon water collision
var moveVel = 0.05;  // velocity of boxes upon colliison
var waterFriction = 0.91;  //  friction applied from water
var maxObjects = 200;  // max number of objects allowed

var water = {
    p: [],
    v: []
};

var object = {
    x: [],
    y: [],
    xv: [],
    yv: [],
    uu: [],
    uuv: [],
    h1: [],
    h2: [],
    h3: []
};

for(var k = 0; k < 400 / waterWidth; k++) {
    water.p.push(waterHeight);
    water.v.push(random(-1, 1) + (sin(k * 5) * 1.2) + cos(k * random(2, 3)));
}




/** Get keys */

keyPressed = function() {
    if(keyCode === 32) {
        object.x.push(mouseX);
        object.y.push(mouseY);
        object.xv.push(0);
        object.yv.push(0);
        object.uu.push(0);
        object.uuv.push(0  );
        object.h1.push(round((object.length - 1) / waterWidth));
        object.h2.push(round((object.length - 1) / waterWidth) + 1);
        object.h3.push(round((object.length - 1) / waterWidth) - 1);
    }
};




/** Update the objects */

var updateObjects = function() {
    for(var k = 0; k < object.x.length; k++) {
        
        // water collision points
        object.h1[k] = round(object.x[k] / waterWidth);
        object.h2[k] = round(object.x[k] / waterWidth) + 1;
        object.h3[k] = round(object.x[k] / waterWidth) - 1;
        
        // forces
        object.yv[k] -= gravity;
        
        if(object.y[k] + objectSize / 2 > water.p[object.h1[k]]) {
            object.yv[k] += buoyancy;
            
            object.xv[k] *= waterFriction;
            object.yv[k] *= waterFriction;
            object.uuv[k] *= waterFriction;
            
            var diff1 = water.p[object.h2[k]] - water.p[object.h1[k]];
            var diff2 = water.p[object.h3[k]] - water.p[object.h1[k]];
            
            object.uuv[k] -= diff1 * spinVel;
            object.uuv[k] += diff2 * spinVel;
            object.xv[k] += diff1 * moveVel;
            object.xv[k] -= diff2 * moveVel;
        }
        
        object.x[k] += object.xv[k];
        object.y[k] -= object.yv[k];
        object.uu[k] += object.uuv[k];
        
        if(k > maxObjects - 1) {
            var lastItem = 0;
            
            // get rid of oldest object
            object.x.splice(lastItem, 1);
            object.y.splice(lastItem, 1);
            object.xv.splice(lastItem, 1);
            object.yv.splice(lastItem, 1);
            object.uu.splice(lastItem, 1);
            object.uuv.splice(lastItem, 1);
            object.h1.splice(lastItem, 1);
            object.h2.splice(lastItem, 1);
            object.h3.splice(lastItem, 1);
        }
        
        if(object.x[k] > 400 || object.x[k] < 0) {
            object.x[k] -= object.xv[k];
            object.xv[k] *= -1;
            object.uuv[k] *= -1;
        }
    }
};




/** Translated box */

var drawBox = function(x, y, s, r) {
    stroke(133, 81, 25);
    strokeWeight(5);
    
    line(x + sin(90 + r) * (s / 2), y + cos(90 + r) * (s / 2), x + sin(180 + r) * (s / 2), y + cos(180 + r) * (s / 2));
    
    line(x + sin(180 + r) * (s / 2), y + cos(180 + r) * (s / 2), x + sin(-90 + r) * (s / 2), y + cos(-90 + r) * (s / 2));
    
    line(x + sin(-90 + r) * (s / 2), y + cos(-90 + r) * (s / 2), x + sin(0 + r) * (s / 2), y + cos(0 + r) * (s / 2));
    
    line(x + sin(-0 + r) * (s / 2), y + cos(-0 + r) * (s / 2), x + sin(90 + r) * (s / 2), y + cos(90 + r) * (s / 2));
};






/** Draw the objects */

var drawObjects = function() {
    for(var k = 0; k < object.x.length; k++) {
        stroke(99, 99, 99);
        strokeWeight(2);
        fill(161, 161, 161);
        
        drawBox(object.x[k], object.y[k], objectSize, object.uu[k] - 45);
    }
};




/** Update the water */

var update = function() {
    for(var k = 0; k < 400 / waterWidth; k++) {
        water.v[k] *= friction;
        
        if(k !== 0) {
            water.v[k] += (water.p[k - 1] - water.p[k]) / viscocity;
        }
        if(k < 400 / waterWidth - 1) {
            water.v[k] += (water.p[k + 1] - water.p[k]) / viscocity;
        }
        var tempDist = dist(mouseX, mouseY, k * waterWidth, water.p[k]);
        if(tempDist < dragRange && mouseIsPressed) {
            water.v[k] += (dragRange - tempDist) / viscocity;
        }
        
        water.v[k] += (waterHeight - water.p[k]) / (viscocity / 1.2);
    }
    
    for(var k = 0; k < 400 / waterWidth; k++) {
        water.p[k] += water.v[k];
    }
};




/** Draw a line with an opacity gradient */

var waterLine = function(x1, y1, x2, y2) {
    var stepX = (x1 - x2) / lineQuality;
    var stepY = (y1 - y2) / -lineQuality;
    
    var stepColor = lineColorChange / lineQuality;
    
    for(var k = 0; k < lineQuality; k++) {
        stroke(lineR + (k * stepColor), lineG + (k * stepColor), lineB + (k * stepColor), 165);
        
        line(x1 + (k * stepX), y1 + (k * stepY), x1 + ((k + 1) * stepX), y1 + ((k + 1) * stepY));
    }
};




/** Draw everything */
frameRate(30);
draw = function() {
    background(209, 246, 255);

    update();
    updateObjects();
    drawObjects();  
    
    var width = 400 / (400 / waterWidth);
    strokeWeight(width);
    
    for(var k = 0; k < 400 / waterWidth; k++) {
        waterLine(k * width + (width / 2), 400, k * width + (width / 2), water.p[k]);
        
        if(k < 400 / waterWidth - 1 && waterSmooth) {
            line(k * width + (width / 2), water.p[k] - 3, (k + 1) * width + (width / 2), water.p[k + 1] - 3);
        }
    }
    
    var f = createFont("monospace", 12);
    textFont(f, 10);
    
    fill(148, 53, 18);
    
    text(" - Click and drag with your mouse to manipulate the waves", 4, 12);
    text(" - Press space to drop an object into the world", 4, 25);
    text(" - Manipulate the objects with the waves", 4, 38);

    fill(255, 255, 255);
    textFont(f, 8);
    
    text("Water and Object Physics Sim - Created by Nate Kent", 4, 396);
};