/** CHANGE THESE TWO VARIABLES */
var res = 100; // set to number between 1-399
var iterations = 20; // number of iterations
/** ========================== */


var xpos = -30;
var ypos = 0;
var uscale = 1.00;
var xstretch = 1;
var ystretch = 1;

var step = floor(400/res);
var pixels = [];

colorMode(HSB);
var startHue = 130;
var deltaHue = 6;

var lx, ly;
var lm = false;

var keys = [];
keyPressed = function() {keys[keyCode] = true;};
keyReleased = function() {keys[keyCode] = false;};

var setPixels = function() {
    for(var i = 0; i < 400; i++) {
        pixels[i] = [];
        for(var k = 0; k < 400; k++) {
            pixels[i][k] = 0;
        }
    }
};


var findSet = function() {
    for(var i = 0; i < 400; i += step) {
        for(var k = 0; k < 400; k += step) {
            var xs = (((i-200-xpos)*uscale*xstretch)+200)*(3.5/400)-2.5;
            var ys = (((k-200-ypos)*uscale*ystretch)+200)*(3/400)-1.5;
            var x = 0;
            var y = 0;
            var iter = 0;
            while(x*x+y*y < 2*2 && iter < iterations) {
                var xt = x*x-y*y+xs;
                y = 2*x*y+ys;
                x = xt;
                iter++;
            }
            pixels[i][k] = color(startHue+iter*deltaHue, 255, 255);
        }
    }
};


var drawSet = function() {
    for(var i = 0; i < 400; i += step) {
        for(var k = 0; k < 400; k += step) {
            //noStroke();
            //fill(pixels[i][k]);
            //rect(i-0.5, k-0.5, step+1, step+1);
            
            stroke(pixels[i][k]);
            strokeWeight(step+1);
            point(i, k);
        }
    }
};


frameRate(10);
setPixels();

var t = 0;
draw = function() {
    if(mouseIsPressed) {
        if(lm) {
            xpos = mouseX - lx;
            ypos = mouseY - ly;
        }
        else {
            lx = mouseX - xpos;
            ly = mouseY - ypos;
        }
        lm = true;
    }
    else {
        lm = false;
    }
    
    var keypress = t === 1;
    if(keys[UP]) {
        uscale -= uscale/10;
        keypress = true;
    }
    if(keys[DOWN]) {
        uscale += uscale/10;
        keypress = true;
    }
    
    if(((abs(mouseX - pmouseX) > 0 || abs(mouseY - pmouseY) > 0) && mouseIsPressed) || keypress) {
        findSet();
        
        background(0);
        drawSet();
        fill(0, 0, 80, 90);
        rect(2, 2, 302, 45);
        
        fill(0, 0, 100);
        text("- Click and drag with mouse to pan around", 7, 17);
        text("- Hold UP and DOWN to zoom in and out", 7, 29);
        text("- Change resolution within the code (very first variable)", 7, 41);
        fill(0, 0, 255);
        text("- Click and drag with mouse to pan around", 8, 16);
        text("- Hold UP and DOWN to zoom in and out", 8, 28);
        text("- Change resolution within the code (very first variable)", 8, 40);
    }
    
    t++;
};

