var rotX = 0;
var rotY = 0;
var scal = 65;
var FOV = 7;

var floorSize = 150;

var dLineQuality = 10;

var p = {
    x: 83,
    y: 0,
    z: 0
};



var transform3 = function(x, y, z) {
    x /= 100;
    y /= 100;
    z /= 100;
    var r = {
        rx: x * cos(rotY) - y * sin(rotY),
        ry: (x * sin(rotY) + y * cos(rotY)) * cos(rotX) - z * sin(rotX),
        rz: (x * sin(rotY) + y * cos(rotY)) * sin(rotX) + z * cos(rotX)
    };
    var xx = r.rx * ((r.rz + FOV) * (scal / FOV)) + 200;
    var yy = r.ry * ((r.rz + FOV) * (scal / FOV)) + 200;
    
    return {x: xx, y: yy};
};


var drawLine = function(x1, y1, z1, x2, y2, z2, abide, thick) {
    var p1 = transform3(x1, y1, z1);
    var p2 = transform3(x2, y2, z2);
    
    if(!abide) {
        line(p1.x, p1.y, p2.x, p2.y);
    }
    else {
        
    }
    
    
};

var drawRect = function(p1, p2, p3, p4, abide, thick) {
    drawLine(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, abide, thick);
    drawLine(p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, abide, thick);
    drawLine(p3.x, p3.y, p3.z, p4.x, p4.y, p4.z, abide, thick);
    drawLine(p4.x, p4.y, p4.z, p1.x, p1.y, p1.z, abide, thick);
};

var givePerspective = function() {
    stroke(0, 0, 0);
    strokeWeight(1);
    drawLine(0, 400, 0, 0, -400, 0, false, 0);
    drawLine(400, 0, 0, -400, 0, 0, false, 0);
    drawLine(0, 0, 400, 0, 0, -400, false, 0);
    
    stroke(255, 0, 0);
    drawRect({x: floorSize, y: floorSize, z: 0}, {x: -floorSize, y: floorSize, z: 0}, {x: -floorSize, y: -floorSize, z: 0}, {x: floorSize, y: -floorSize, z: 0}, false, 0);
};

frameRate(60);
rotX = 65;
rotY = 288;

draw = function() {
    background(255, 255, 255);
    
    givePerspective();
};