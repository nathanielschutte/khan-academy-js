var pointRadius = 8;
var centerX, centerY;
var lengthA, lengthB, lengthC;
var midAX, midBX, midCX;
var midAY, midBY, midCY;
var dirA, dirB, dirC;
var slopeAX, slopeBX, slopeCX, slopeAY, slopeBY, slopeCY;
var slopeAB, slopeBC;
var dA, dB, dC;
var tDA, tDB, tDC;
var aX1, aY1, aX2, aY2, bX1, bY1, bX2, bY2;
var circumX, circumY, circumR;
var orthoX, orthoY;
var eulerDir;
var d = sqrt(400 * 400 + 400 * 400);
var t = 0;
var info = true;

var circum;
var centroid;
var orthocenter;
var medians;
var segBisectors;
var altitudes;
var circle;
var eulerLine;

var bOut = 100;
var bIn = 30;
var bannerHeight = bIn;
var bannerSpeed = 4;
var banner = false;

var switchCount = 8;
var switchSize = 12;
var buttonSize = 22;

var selected = null;
var grabbed = null;
var hover = null;
var onButton = null;

var label = createFont("arial", 14);
var info = createFont("arial", 10);

var p = {
    x: [234, 120, 277],
    y: [160, 282, 234]
};

var b = {
    x: [82, 82, 192, 192, 302, 192, 82, 302],
    y: [35, 55, 35, 55, 35, 75, 75, 55],
    s: [true, true, false, false, true, false, true, true],
    t: ["Centroid:", "Circumcenter:", "Medians:", "Circum Lines:", "Circumcircle:", "Ortho Lines:", "Orthocenter:", "Euler's Line:"]
};

var s = {
    x: [369, 369, 369],
    y: [9, 39, 69],
};

mouseOut = function() {
    banner = false;
};



var direction = function(x, y) {
    var dir = 0;
    if(y === 0) {
        if(x > 0) {
            dir = 90;
        }
        else {
            dir = -90;
        }
    }
    else {
        dir = atan(x / y);
        if(y < 0) {
            if(x > 0) {
                dir += 180;
            }
            else if(x < 0) {
                dir -= 180;
            }
            else {
                dir = 180;
            }
        }
    }
    return dir;
};




var calculateAll = function() {
    
    // side lengths
    lengthA = dist(p.x[1], p.y[1], p.x[2], p.y[2]);
    lengthB = dist(p.x[0], p.y[0], p.x[2], p.y[2]);
    lengthC = dist(p.x[0], p.y[0], p.x[1], p.y[1]);
    
    // side midpoints
    midAX = ((p.x[1] + p.x[2]) / 2);
    midAY = ((p.y[1] + p.y[2]) / 2);
    midBX = ((p.x[0] + p.x[2]) / 2);
    midBY = ((p.y[0] + p.y[2]) / 2);
    midCX = ((p.x[0] + p.x[1]) / 2);
    midCY = ((p.y[0] + p.y[1]) / 2);
    
    // median angles
    dirA = direction(midAX - p.x[0], midAY - p.y[0]);
    dirB = direction(midBX - p.x[1], midBY - p.y[1]);
    dirC = direction(midCX - p.x[2], midCY - p.y[2]);
    
    // centroid
    centerX = (midAX + midBX + midCX) / 3;
    centerY = (midAY + midBY + midCY) / 3;
    
    // differences between points per coordinate
    slopeAX = p.x[2] - p.x[1];
    slopeBX = p.x[0] - p.x[2];
    slopeCX = p.x[1] - p.x[0];
    slopeAY = p.y[2] - p.y[1];
    slopeBY = p.y[0] - p.y[2];
    slopeCY = p.y[1] - p.y[0];
    
    // side normals
    tDA = direction(midAX - (midAX + slopeAX), midAY - (midAY - slopeAY));
    tDB = direction(midBX - (midBX + slopeBX), midBY - (midBY - slopeBY));
    tDC = direction(midCX - (midCX + slopeCX), midCY - (midCY - slopeCY));
    
    // used in circumcenter formula below
    dA = p.x[0] * p.x[0] + p.y[0] * p.y[0];
    dB = p.x[1] * p.x[1] + p.y[1] * p.y[1];
    dC = p.x[2] * p.x[2] + p.y[2] * p.y[2];
    
    // circumcenter coordinates
    circumX = (dA * (p.y[2] - p.y[1]) + dB * (p.y[0] - p.y[2]) + dC * (p.y[1] - p.y[0])) / (2 * (p.x[0] * (p.y[2] - p.y[1]) + p.x[1] * (p.y[0] - p.y[2]) + p.x[2] * (p.y[1] - p.y[0])));
    circumY = -1 * (dA * (p.x[2] - p.x[1]) + dB * (p.x[0] - p.x[2]) + dC * (p.x[1] - p.x[0])) / (2 * (p.x[0] * (p.y[2] - p.y[1]) + p.x[1] * (p.y[0] - p.y[2]) + p.x[2] * (p.y[1] - p.y[0])));
    
    // circumcircle radius
    circumR = (lengthA * lengthB * lengthC) / sqrt((lengthA + lengthB + lengthC) * (lengthB + lengthC - lengthA) * (lengthC + lengthA - lengthB) * (lengthA + lengthB - lengthC));
    
    // help variables for orthocenter formula below
    aX1 = p.x[0];
    aY1 = p.y[0];
    aX2 = p.x[0] + 20 * sin(tDA - 90);
    aY2 = p.y[0] - 20 * cos(tDA - 90);
    bX1 = p.x[1];
    bY1 = p.y[1];
    bX2 = p.x[1] + 20 * sin(tDB - 90);
    bY2 = p.y[1] - 20 * cos(tDB - 90);
    slopeAB = (aY1 - aY2) / (aX1 - aX2 + 0.001);
    slopeBC = (bY1 - bY2) / (bX1 - bX2 + 0.001);

    // orthocenter formula (intersection of two altitudes)
    orthoX = ((slopeAB * aX1) - aY1 + bY1 - (slopeBC * bX1)) / (slopeAB - slopeBC);
    orthoY = slopeAB * (orthoX - aX1) + aY1;
    
    // find angle of euler line
    eulerDir = direction(circumX - orthoX, circumY- orthoY);
};




var drawCircumLines = function() {
    stroke(135, 0, 0);
    strokeWeight(0.5);
    
    if(segBisectors) {
        line(midAX, midAY, midAX + d * sin(tDA + 90), midAY - d * cos(tDA + 90));
        line(midBX, midBY, midBX + d * sin(tDB + 90), midBY - d * cos(tDB + 90));
        line(midCX, midCY, midCX + d * sin(tDC + 90), midCY - d * cos(tDC + 90));
        
        line(midAX, midAY, midAX - d * sin(tDA + 90), midAY + d * cos(tDA + 90));
        line(midBX, midBY, midBX - d * sin(tDB + 90), midBY + d * cos(tDB + 90));
        line(midCX, midCY, midCX - d * sin(tDC + 90), midCY + d * cos(tDC + 90));
    }
    
};




var drawCircumCenter = function() {
    stroke(179, 0, 0);
    strokeWeight(pointRadius / 1.5);
    
    if(circum) {
        point(circumX, circumY);
    }
};




var drawCircumCircle = function() {
    noFill();
    stroke(158, 0, 0);
    strokeWeight(1);
    
    if(circle) {
        ellipse(circumX, circumY, circumR * 2, circumR * 2);
    }
};




var drawOrthoLines = function() {
    stroke(0, 133, 73);
    strokeWeight(0.5);
    
    if(altitudes) {
        line(p.x[0], p.y[0], p.x[0] + d * sin(tDA + 90), p.y[0] - d * cos(tDA + 90));
        line(p.x[1], p.y[1], p.x[1] + d * sin(tDB + 90), p.y[1] - d * cos(tDB + 90));
        line(p.x[2], p.y[2], p.x[2] + d * sin(tDC + 90), p.y[2] - d * cos(tDC + 90));
        
        line(p.x[0], p.y[0], p.x[0] - d * sin(tDA + 90), p.y[0] + d * cos(tDA + 90));
        line(p.x[1], p.y[1], p.x[1] - d * sin(tDB + 90), p.y[1] + d * cos(tDB + 90));
        line(p.x[2], p.y[2], p.x[2] - d * sin(tDC + 90), p.y[2] + d * cos(tDC + 90));
    }
};




var drawOrthoCenter = function() {
    stroke(0, 179, 6);
    strokeWeight(pointRadius / 1.5);
    
    if(orthocenter) {
        point(orthoX, orthoY);
    }
};




var drawMedians = function() {
    stroke(0, 0, 0);
    strokeWeight(0.5);
    
    if(medians) {
        line(p.x[0], p.y[0], midAX, midAY);
        line(p.x[1], p.y[1], midBX, midBY);
        line(p.x[2], p.y[2], midCX, midCY);
    }
};




var drawEulerLine = function() {
    stroke(106, 28, 196);
    strokeWeight(0.5);
    
    if(eulerLine) {
        line(circumX, circumY, circumX + d * sin(eulerDir), circumY + d * cos(eulerDir));
        line(orthoX, orthoY, circumX - d * sin(eulerDir), circumY - d * cos(eulerDir));
        line(circumX, circumY, orthoX, orthoY);
    }
};




var drawTri = function() {
    fill(228, 232, 102);
    stroke(0, 38, 133);
    strokeWeight(1);
    
    triangle(p.x[0], p.y[0], p.x[1], p.y[1], p.x[2], p.y[2]);
};




var drawCentroid = function() {
    fill(0, 0, 0);
    stroke(51, 76, 115);
    strokeWeight(pointRadius * 0.1);
    if(centroid) {
        ellipse(centerX, centerY, pointRadius / 1.5, pointRadius / 1.5);
    }
};




var checkPoints = function() {
    if(! mouseIsPressed && ! banner) {
        selected = null;
    
        for(var k = 0; k < 3; k++) {
            if(dist(mouseX, mouseY, p.x[k], p.y[k]) < pointRadius) {
                selected = k;
            }
        }
    }
};




var dragPoints = function() {
    if(selected !== null && mouseIsPressed) {
        p.x[selected] = mouseX;
        p.y[selected] = max(mouseY, bIn);
    }
};




var checkHover = function() {
    if(! mouseIsPressed && banner) {
        hover = null;
        for(var i = 0; i < switchCount; i++) {
            if(dist(mouseX, mouseY, b.x[i] + switchSize / 2, b.y[i] + switchSize / 2) < switchSize) {
                hover = i;
            }
        }
    }
};




var checkOnButton = function() {
    if(! mouseIsPressed && banner) {
        onButton = null;
        for(var i = 0; i < 3; i++) {
            if(dist(mouseX, mouseY, s.x[i] + buttonSize / 2, s.y[i] + buttonSize / 2) < buttonSize / 1.5) {
                onButton = i;
            }
        }
    }
};




var buttonClicked = function() {
    if(onButton !== null && mouseIsPressed) {
        if(onButton === 0) {
            for(var i = 0; i < switchCount; i++) {
                b.s[i] = true;
            }
        }
        else if(onButton === 1){
            for(var i = 0; i < switchCount; i++) {
                b.s[i] = false;
            }
        }
        else {
            for(var i = 0; i < switchCount; i++) {
                if(b.s[i]) {
                    b.s[i] = false;
                }
                else {
                    b.s[i] = true;
                }
            }
        }
        onButton = null;
    }
};




var switchClicked = function() {
    if(hover !== null && mouseIsPressed) {
        if(b.s[hover]) {
            b.s[hover] = false;
        }
        else {
            b.s[hover] = true;
        }
        hover = null;
    }
};




var drawPoints = function() {
    for(var k = 0; k < 3; k++) {
        if(k === selected) {
            fill(194, 227, 255);
        }
        else {
            fill(89, 183, 255);
        }
        stroke(0, 84, 110);
        strokeWeight(pointRadius * 0.1);
        
        ellipse(p.x[k], p.y[k], pointRadius, pointRadius);
    }
};




var labelPointsAndLines = function() {
    textFont(label);
    fill(0, 124, 191);
    text("A", (p.x[0] - 4) + 12 * (sin(dirA - 180)), (p.y[0] + 4) - 12 * (cos(dirA)));
    text("B", (p.x[1] - 4) + 12 * (sin(dirB - 180)), (p.y[1] + 4) - 12 * (cos(dirB)));
    text("C", (p.x[2] - 4) + 12 * (sin(dirC - 180)), (p.y[2] + 4) - 12 * (cos(dirC)));
};




var drawTopBanner = function() {
    if(! mouseIsPressed) {
            if(mouseY < bannerHeight) {
            bannerHeight += (bOut - bannerHeight) / bannerSpeed;
        }
        else {
            bannerHeight += (bIn - bannerHeight) / bannerSpeed;
        }
        if(abs(bannerHeight - bOut) < 5) {
            banner = true;
            selected = null;
        }
        else {
            banner = false;
        }
    }
    
    
    fill(71, 112, 173);
    noStroke();
    rect(0, 0, 400, bannerHeight);
    
    fill(87, 136, 189);
    noStroke();
    for(var i = 0; i < 3; i++) {
        rect(8 + i * 109, 8, 91, bannerHeight - 16);
    }
    fill(114, 158, 204);
    rect(326, 8, 67, bannerHeight - 16);
    
    fill(0, 81, 143);
    textFont(info, 12);
    text("Centers", 10, 20);
    text("Lines", 120, 20);
    text("Other", 230, 20);
};




var drawSwitches = function() {
    textFont(info, 11);
    
    for(var i = 0; i < switchCount; i++) {
        fill(182, 205, 222);
        text(b.t[i], b.x[i] - 71, b.y[i] + 9);
        
        stroke(0, 34, 56);
        if(b.s[i]) {
            fill(0, 212, 42);
        }
        else {
            fill(179, 0, 0);
        }
        
        rect(b.x[i], b.y[i], switchSize, switchSize);
    }
};




var drawButtons = function() {
    textFont(info, 12);
    
    for(var i = 0; i < 3; i++) {
        stroke(0, 34, 56);
        if(i === 0) {
            if(onButton === i) {
                fill(130, 240, 156);
            }
            else {
                fill(78, 224, 83);
            }
        }
        else if(i === 1) {
            if(onButton === i) {
                fill(235, 150, 150);
            }
            else {
                fill(230, 78, 78);
            }
        }
        else {
            if(onButton === i) {
                fill(143, 231, 255);
            }
            else {
                fill(0, 204, 255);
            }
        }
        rect(s.x[i], s.y[i], buttonSize, buttonSize);
        
        fill(192, 210, 224);
        if(i === 0) {
            text("All On: ", s.x[i] - 40, s.y[i] + 18);
        }
        else if(i === 1){
            text("All Off: ", s.x[i] - 40, s.y[i] + 18);
        }
        else {
            text("Invert: ", s.x[i] - 40, s.y[i] + 18);
        }
    }
};




var showInfo = function() {
    var yOff1 = sin(t * 7) * 4;
    var yOff2 = cos(t * 7) * 4;
    
    textFont(info, 16);
    fill(255, 109, 69);
    text("Drag these points!", 209, 100 + yOff1);
    
    stroke(255, 109, 69);
    strokeWeight(2);
    line(233, 110 + yOff1, 233, 130 + yOff1);
    line(227, 124 + yOff1, 233, 130 + yOff1);
    line(239, 124 + yOff1, 233, 130 + yOff1);
    
    text("Mouse over for options!", 10, 78 + yOff2);
    line(92, 59 + yOff2, 92, 40 + yOff2);
    line(86, 48 + yOff2, 92, 40 + yOff2);
    line(98, 48 + yOff2, 92, 40 + yOff2);
};




var updateSwitches = function() {
    centroid = b.s[0];
    circum = b.s[1];
    medians = b.s[2];
    segBisectors = b.s[3];
    circle = b.s[4];
    altitudes = b.s[5];
    orthocenter = b.s[6];
    eulerLine = b.s[7];
};




draw = function() {
    background(245, 245, 245);
    
    checkPoints(); // check triangle's points for mouse grab
    dragPoints(); // drag the appropriate points
    checkHover(); // check the switches for mouse hover
    switchClicked(); // switch the appropriate switches
    checkOnButton(); // check buttons for mouse hover
    buttonClicked(); // perform action specific to button
    updateSwitches(); // set booleans based on switch state
    
    calculateAll();
    
    drawTri(); // base triangle
    drawMedians(); // medians
    drawCircumLines(); // segment bisectors
    drawOrthoLines(); // angle bisectors
    drawEulerLine(); // Euler's line!
    drawCentroid(); // centroid
    drawCircumCenter(); // circumcenter
    drawOrthoCenter(); // orthocenter
    drawCircumCircle(); // circumcircle
    
    drawPoints(); // draw the triangle's points
    labelPointsAndLines(); // label triangle
    
    drawTopBanner(); // draw the top banner
    if(banner) {
        drawSwitches(); // switches
        drawButtons(); // buttons
    }
    
    if((mouseIsPressed || mouseY < bannerHeight) && info && t > 60) {
        info = false;
    }
    
    if(info) {
        showInfo();
    }
    
    frameRate(60); // nice and smooth!
    
    t++;
};