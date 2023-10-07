var rotX = 0;
var rotY = 0;
var scal = 65;
var FOV = 5;

var p = {
    x: [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    y: [1,1,1,0,0,0,-1,-1,-1,1,1,1,0,0,0,-1,-1,-1,1,1,1,0,0,0,-1,-1,-1],
    z: [-1,0,1,-1,0,1,-1,0,1,-1,0,1,-1,0,1,-1,0,1,-1,0,1,-1,0,1,-1,0,1]
};


var drawSpot = function(x, y,  z) {
    var r = {
        rx: x * cos(rotY) - y * sin(rotY),
        ry: (x * sin(rotY) + y * cos(rotY)) * cos(rotX) - z * sin(rotX),
        rz: (x * sin(rotY) + y * cos(rotY)) * sin(rotX) + z * cos(rotX)
    };
    var xx = r.rx * ((r.rz + FOV) * (scal / FOV)) + 200;
    var yy = r.ry * ((r.rz + FOV) * (scal / FOV)) + 200;
    
    var s = (1.5+r.rz)*4;
    
    stroke(max(0,min(255,255-s*30)), 125, max(0,min(255,s*30)));
    line(xx - s, yy, xx + s, yy);
    line(xx, yy - s, xx, yy + s);
};


var drawStuff = function() {
    for(var i = 0; i < p.x.length; i++) {
        drawSpot(p.x[i], p.y[i], p.z[i]);
    }
};

frameRate(60);

draw = function() {
    background(255, 255, 255);
    
    rotX = mouseY*(400/360);
    rotY = mouseX*(400/360);
    
    drawStuff();
};