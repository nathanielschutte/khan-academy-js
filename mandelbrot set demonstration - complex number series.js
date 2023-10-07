/**
TODO 
- control starting complex number 'n' within set explorer mode (button)
- presets for various sets.  clickable button interface
- better information and help, navigation of program through UI (not keys)

*/

var screenW = 4.0;
var screenH = 4.0;
var numberSpace = 10;

var res = 200;
var step = 400/res;

var buttonRadius = 7;
var buttonPress = -1;

var outlineLines = false;
var outlineLayers = false;

var toggleOutline = true;
var baseAcc = 100;
var simpleAcc = 300;
var outlineAccuracy = baseAcc + (!outlineLayers)*simpleAcc;
var outlineSize = 3;
var outlineDepth = 100;

var nX = 0.0;
var nY = 0.0;
var coloring = 0;
var startHue = 175;
var deltaHue = 9;

var linesBetween = true;
var maxCompute = 40;
var minComputeOutline = 4;
var maxComputeOutline = 40;
var maxOutlineStep = 2;
var maxComputeFull = 80;
var outlineReq = true;

var lastN = {x: 0, y: 0};

var updateReq = 1;
var lastMouse = {x: 0, y: 0};
var mouseDrag = false;
var mBox = {x: -2.00, y: -2.00, w: 4.00};

var mode = 0;

var button = [];

var pixels = [];

var outline = [];

var setPixels = function() {
    for(var i = 0; i < 241; i++) {
        pixels[i] = [];
    }
};

var keys = [];

for(var i = 0; i < 200; i++) {
    keys[i] = false;
}

var addButton = function(x, y, id, title) {
    button.push({x: x, y: y, id: id, title: title});
};

var mapV = function(v, x1, x2, y1, y2) {
    var diff = (y2 - y1) / (x2 - x1);
    return (v - x1) * diff + y1;
};

var translateX = function(x) {
    return (400 / screenW) * x + 200;
};

var translateY = function(y) {
    return (400 / screenH) * -y + 200;
};

var translateXBack = function(x) {
    return (screenW / 400) * (x - 200);
};

var translateYBack = function(y) {
    return (screenH / 400) * (-y + 200);
};


var initMode0 = function() {
    mode = 0;
    addButton(200, 200, 0, "n");
};

var initMode1 = function() {
    mode = 1;
    addButton(200, 200, 1, "c");
    outlineReq = true;
};

var initMode2 = function() {
    mode = 2;
    addButton(200, 200, 0, "n");
    addButton(translateX(0.4), translateY(0.4), 1, "c");
    outlineReq = true;
    lastN = {x: 0, y: 0};
};

var initMode3 = function() {
    mode = 3;
    updateReq = 1;
};

var initMode4 = function() {
    addButton(200, 200, 0, "n");
    mode = 4;
};

var reset = function() {
    button = [];
};

keyPressed = function() {
    keys[keyCode] = true;
    if(keyCode === 32) {
        if(mode === 1 || mode === 2) { 
            toggleOutline = !toggleOutline;
            if(toggleOutline) {
                outlineReq = true;
            }
        }
        else if (mode === 3){
            mBox.x = -2.00;
            mBox.y = -1.50;
            mBox.w = 3.00;
            updateReq = 1;
        }
    }
    if(keyCode === 76) {
        if(mode === 1 || mode === 2) { 
            outlineLayers = !outlineLayers;
            outlineAccuracy = baseAcc + (!outlineLayers)*simpleAcc;
            outlineReq = true;
        }
    }
    else if(keyCode === 49) {
        reset();
        initMode0();
    }
    else if(keyCode === 50) {
        reset();
        initMode1();
    }
    else if(keyCode === 51) {
        reset();
        initMode2();
    }
    else if(keyCode === 52) {
        reset();
        initMode3();
    }
    else if(keyCode === 53) {
        reset();
        initMode4();
    }
};

keyReleased = function() {
    keys[keyCode] = false;
};


var getButtonValue = function(id) {
    var b = {x: 0, y: 0};
    
    for(var i = 0; i < button.length; i++) {
        if(id === button[i].id) {
            b.x = translateXBack(button[i].x);
            b.y = translateYBack(button[i].y);
        }
    }
    
    return b;
};

var drawPoint = function(x, y) {
    point(translateX(x), translateY(y));
};

var drawLines = function(x1, y1, x2, y2) {
    line(translateX(x1), translateY(y1), translateX(x2), translateY(y2));
};

var complexSquare = function(a, b) {
    var r = {x: 0, y: 0};
    r.x = a*a - b*b;
    r.y = 2*a*b;
    return r;
};

var stepSquares = function(n, c) {
    fill(0, 0, 0);
    stroke(255, 0, 0);
    
    var oldp = n;
    var p = complexSquare(n.x, n.y);
    
    for(var i = 0; i < maxCompute; i++) {
        stroke(128, 64, 128);
        strokeWeight(5);
        drawPoint(p.x, p.y);
        
        if(linesBetween) {
            strokeWeight(1);
            stroke(128, 64, 128, 140);
            drawLines(oldp.x, oldp.y, p.x, p.y);
        }
        
        oldp = p;
        p = complexSquare(p.x, p.y);
        p.x += c.x;
        p.y += c.y;
    }
};

var drawButtons = function() {
    for(var i = 0; i < button.length; i++) {
        fill(117, 32, 32);
        if(buttonPress === i) {
            fill(255, 0, 0);
        }
        
        if(button[i].id === 1) {
            fill(0, 27, 135);
            if(buttonPress === i) {
                fill(87, 104, 255);
            }
        }
        
        noStroke();
        ellipse(button[i].x, button[i].y, buttonRadius, buttonRadius);
        
        text(button[i].title, button[i].x + 7, button[i].y + 12);
    }
};

var drawGraphLines = function() {
    strokeWeight(1);
    stroke(143, 112, 86);
    line(0, 200, 400, 200);
    line(200, 0, 200, 400);
    
    fill(143, 112, 86);
    for(var i = 0; i <= numberSpace; i++) {
        var d = i*(400/numberSpace);
        var value = (screenW / numberSpace) * i - screenW/2;
        
        textAlign(CENTER);
        text(value, i*(400/numberSpace) - 1, 219);
        
        if(value !== 0) {
            text(-value, 176, i*(400/numberSpace) + 6);
        }
        
        line(d, 195, d, 205);
        line(195, d, 205, d);
    }
    
    if(mode === 0) {
        stroke(66, 143, 72, 100);
        noFill();
        strokeWeight(2);
        ellipse(200, 200, 200, 200);
    }
};


var updateButtons = function() {
    if(!mouseIsPressed) {
        buttonPress = -1;
        for(var i = 0; i < button.length; i++) {
            if(dist(mouseX, mouseY, button[i].x, button[i].y) < buttonRadius) {
                buttonPress = i;
            }
        }
    }
    else {
        if(buttonPress !== -1) {
            var b = button[buttonPress];
            b.x = mouseX;
            b.y = mouseY;
            
            if(b.x !== lastN.x || b.y !== lastN.y) {
                outlineReq = true;
            }
        }
    }
};


var mQuickCheck = function(n, c, max) {
    var t = 0;
    var r = n;
    while(r.x*r.x + r.y*r.y < 4 && t < max) {
        r = complexSquare(r.x, r.y);
        r.x += c.x;
        r.y += c.y;
        t++;
    }
    return t === max;
};


/**
Shoot a ray from the edge of an r=2 circle towards center,
put a dot down when converge is found
n - the starting value n of the series
*/
var mRay = function(n, max) {
    
    // circular ray pattern
    var angleStep = 360/outlineAccuracy;
    for(var a = 0; a < 360; a += angleStep) {
        var c = {x: 2*cos(a), y: 2*sin(a)};
        var tx = -c.x / outlineDepth;
        var ty = -c.y / outlineDepth;
        for(var i = 0; i < outlineDepth; i++) {
            if(mQuickCheck(n, c, max)) {
                outline.push(c);
                break;
            }
            c.x += tx;
            c.y += ty;
        }
    }
    
    // square ray pattern
    
};


/**
Draws all of the dots that were generated representing boundaries of
the convergent set.  Color the layers depending on time to divergency
*/
var mRayDraw = function() {
    if(outline.length < 1) {
        return;
    }
    colorMode(RGB);
    strokeWeight(outlineSize);
    var colorOffset = 0;
    var cur;
    var last = {x: translateX(outline[0].x), y: translateY(outline[0].y)};
    point(last.x, last.y);
    for(var i = 1; i < outline.length; i++) {
        cur = {x: translateX(outline[i].x), y: translateY(outline[i].y)};
        
        stroke((66 + colorOffset*40) % 255, (143 + colorOffset*40), (72 + colorOffset*10), 150);
        strokeWeight(outlineSize);
        point(cur.x, cur.y);
        
        if(outlineLines) {
            strokeWeight(outlineSize/2);
            line(last.x, last.y, cur.x, cur.y);
        }
        
        last = cur;
        
        colorOffset = floor(i / outlineAccuracy);
    }
};


var showLevels = function(n) {
    fill(69, 72, 138);
    textAlign(LEFT);
    text("outline update: " + outlineReq, 72, 397);
    if(toggleOutline) {
        if(outlineReq) {
            outline = [];
            if(outlineLayers) {
                for(var i = minComputeOutline; i < maxComputeOutline; i += maxOutlineStep) {
                    mRay(n, i);
                }
            }
            else {
                mRay(n, maxComputeOutline);
            }
            outlineReq = false;
            
        }
        mRayDraw();
    }
};


var crunch = function() {
    if(mode === 0) {
        stepSquares(getButtonValue(0), {x: 0, y: 0});
        //text(getButtonValue(0).y, 100, 100);
    }
    else if(mode === 1) {
        stepSquares({x: 0, y: 0}, getButtonValue(1));
        
        // form a rough outline of the convergent set
        showLevels({x: 0, y: 0});
    }
    else if(mode === 2) {
        stepSquares(getButtonValue(0), getButtonValue(1));
        
        // form a rough outline of the convergent set
        showLevels(getButtonValue(0));
    }
};


var drawBackground = function() {
    background(240, 188, 149);
    drawGraphLines();
};

/** Arguments:
window:
    xp, yp position
    w, h dimensions
area of interest:
    x1, y1, x2, y2 define rect
*/
var mLevel = function(xp, yp, w, h, x1, y1, x2, y2) {
    
    var stepX = (x2 - x1) / res;
    var stepY = (y2 - y1) / res;
    var xs = 0;
    var ys = 0;
    for(var i = x1; i < x2; i += stepX) {
        ys = 0;
        for(var k = y1; k < y2; k += stepY) {
            var t = 0;
            var r = {x: nX, y: nY};
            while(r.x*r.x + r.y*r.y < 4 && t < maxComputeOutline) {
                r = complexSquare(r.x, r.y);
                r.x += i;
                r.y += k;
                t++;
            }
            if(coloring === 0) {
                if(t === maxComputeOutline) {
                    pixels[xs][ys] = {h: 0, s: 0, b: 0};
                    fill(0, 0, 0);
                }
                else {
                    fill((startHue + t*deltaHue) % 255, 255, 255);
                    pixels[xs][ys] = {h: (startHue + t*deltaHue) % 255, s: 255, b: 255};
                }
            }
            
            //rect(xp + translateX(i), yp + translateY(k), step, step);
            ys++;
        }
        xs++;
    }
};

var setBox = function(x1, y1, x2, y2) {
    
};

var mDraw = function(speedUp) {
    colorMode(HSB);
    noStroke();
    for(var i = 0; i < res; i += speedUp) {
        for(var k = 0; k < res; k += speedUp) {
            fill(pixels[i][k].h, pixels[i][k].s, pixels[i][k].b);
            rect(i*step, 400-k*step, step*speedUp, step*speedUp);
        }
    }
    colorMode(RGB);
    
    fill(255, 255, 255);
    textAlign(LEFT);
    text("x: " + mBox.x + "   y: " + mBox.y + "   w: " + mBox.w, 5, 12);
};

var updateInput = function() {
    if(!mouseIsPressed) {
        if(mouseDrag) {
            if(abs(mouseX - lastMouse.x) > abs(mouseY - lastMouse.y)) {
                if(mouseX > lastMouse.x) {
                    if(mouseY > lastMouse.y) {
                        setBox(lastMouse.x, mouseY, mouseX, mouseY + mouseX - lastMouse.x);
                    }
                }
            }
            updateReq = 1;
        }
        mouseDrag = false;
    }
    else {
        if(!mouseDrag) {
            lastMouse.x = mouseX;
            lastMouse.y = mouseY;
            mouseDrag = true;
        }
    }
};

var drawInput = function() {
    if(mouseDrag) {
        background(255, 255, 255);
        mDraw(3);
        stroke(255, 255, 255);
        strokeWeight(1);
        line(lastMouse.x, lastMouse.y, mouseX, lastMouse.y);
        line(mouseX, lastMouse.y, mouseX, mouseY);
        line(mouseX, mouseY, lastMouse.x, mouseY);
        line(lastMouse.x, mouseY, lastMouse.x, lastMouse.y);
    }
};

reset();
initMode0();
setPixels();

draw = function() {
    
    // cool visuals of complex number series
    if(mode < 3 || mode === 4) {
        
        // draws the grid lines
        drawBackground();
        
        // UI
        updateButtons();
        
        // visualize the series
        crunch();
        drawButtons();
        
        // button info
        if(buttonPress !== -1) {
            fill(44, 55, 128);
            text(button[buttonPress].title, 10, 14);
        }
        
        // temp help... better UI overall to come!
        fill(44, 55, 128);
        textAlign(LEFT);
        text("MODES   [1] constant C   [2] constant N   [3] both variable   [4] full explorer", 3, 11);
        text("mode: " + mode, 4, 397);
        
        if(mode === 1 || mode === 2) {
            text("Press [SPACE] to toggle boundary", 3, 22);
            text("Press [L] to toggle multiple layers", 3, 34);
        }
    }
    
    // actual set explorer
    else {
        
        // time for a recalculation of a given range of the set.
        // also do a pretty render of the new colors.
        if(updateReq === 1) {
            background(255, 255, 255);
            mLevel(0, 0, 400, 400, mBox.x, mBox.y, mBox.x + mBox.w, mBox.y + mBox.w);
            //mLevel(0, 0, 400, 400, -0.775, 0, -0.725, 0.15);
            mDraw(1);
            updateReq = 0;
        }
        
        // do all of the mouse input work and draw UI visuals using
        // low res render of the colors.  Trigger an update when
        // mouse is released
        else {
            updateInput();
            drawInput();
        }
    }
};
