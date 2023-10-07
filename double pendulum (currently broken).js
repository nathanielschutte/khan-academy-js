var x1, y1, x2, y2, L1, L2, a1, a2, a1v, a2v, a1a, a2a, g, fr, m1, m2;

var cx = 253; // center x
var cy = 140; // center y

g = 1; // gravity
fr = 1; // friction
m1 = 3; // mass 1
m2 = 3; // mass 2
L1 = 50; // length 1
L2 = 50; // length 2

var deg = 1;

// startup parameters
var init = function() {
    x1 = cx+L1;
    y1 = cy;
    x2 = cx+L1+L2;
    y2 = cy;
    a1 = 90;
    a2 = 90;
    a1v = 0;
    a2v = 0;
    a1a = 0;
    a2a = 0;
};

var f = createFont("monospace", 10);


var update = function() {
    var mSum = m1+m2;
    var a = (a1-a2)*deg;
    var i = mSum+m1-m2*cos(2*a);
    
    a1a = (-g*(mSum + m1)*sin(a1*deg)-m2*g*sin(a-a2*deg)-2*sin(a)*m2*(pow(a2v, 2)*L2 - pow(a1v, 2)*L1*cos(a)))/L1/i;
    a2a = 2*sin(a)*(pow(a1v, 2)*L1*mSum+g*mSum*cos(a1*deg)+pow(a2v, 2)*L2*m2*cos(a))/L2/i;

    
    a1v += a1a;
    a2v += a2a;
    a1 += a1v;
    a2 += a2v;
    
    a1v*=fr;
    a2v*=fr;
    
    x1 = cx+L1*sin(a1);
    y1 = cy+L1*cos(a1);
    x2 = x1+L2*sin(a2);
    y2 = y1+L2*cos(a2);
};





var drawAll = function() {
    stroke(199, 80, 80);
    strokeWeight(1);
    line(cx, cy, x1, y1);
    line(x1, y1, x2, y2);
    
    fill(56, 124, 207);
    stroke(18, 112, 184);
    strokeWeight(2);
    ellipse(x1, y1, 10, 10);
    ellipse(x2, y2, 10, 10);
    
    fill(189, 38, 38);
    stroke(143, 34, 34);
    ellipse(cx, cy, 10, 10);
};




var drawText = function() {
    textFont(f);
    fill(26, 26, 26);
    text("Particle 1:", 5, 328);
    text("X Position: " + x1, 14, 345);
    text("Y Position: " + y1, 14, 355);
    text("Angle: " + a1, 14, 370);
    text("Angular Vel: " + a1v, 14, 380);
    text("Angular Accel: " + a1a, 14, 390);
    
    text("Particle 2:", 5, 228);
    text("X Position: " + x2, 14, 245);
    text("Y Position: " + y2, 14, 255);
    text("Angle: " + a2, 14, 270);
    text("Angular Vel: " + a2v, 14, 280);
    text("Angular Accel: " + a2a, 14, 290);
};



init();
draw = function() {
    background(255, 255, 255);
    update();
    drawAll();
    drawText();
    
    frameRate(30);
};