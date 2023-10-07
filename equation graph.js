var unit = 28;
var xScale = unit;
var yScale = unit;
var xOffset = width/2;
var yOffset = height/2;
var res = 80;
var step = 400/res;

var last = [2];
var onPress = false;

var cache = [];

var addFunc = function(a, b) {
    return {op: a, val: b};
};

var thisFunc = [addFunc("^", 0)];

var drawGrid = function() {
    strokeWeight(1);
    stroke(117, 191, 209);
    
    for(var i = 0; i < height+1; i += yScale) {
        var a = i+(yOffset%yScale);
        line(0, a, 400, a);
    }
    for(var i = 0; i < width+1; i += xScale) {
        var a = i+(xOffset%xScale);
        line(a, 0, a, 400);
    }
    
    strokeWeight(2);
    stroke(89, 145, 158);
    line(0, yOffset, 400, yOffset);
    line(xOffset, 0, xOffset, 400);
};


var drawFunc = function() {
    
};


var operate = function(f, x) {
    if(f.op === "sin") {
        return sin(x);
    }
};


var doFunc = function(x) {
    var xx = x;
    for(var i = 0; i < thisFunc.length; i++) {
        xx = operate(thisFunc[i], xx);
    }
    return xx;
};


var control = function() {
    if(mouseIsPressed) {
        if(onPress) {
            last[0] = mouseX - xOffset;
            last[1] = mouseY - yOffset;
            onPress = false;
        }
        else {
            xOffset = mouseX - last[0];
            yOffset = mouseY - last[1];
        }
    }
    else {
        onPress = true;
    }
};



frameRate(60);

draw = function() {
    background(255, 255, 255);
    
    control();
    drawGrid();
    
    if(frameCount < 10 || (mouseIsPressed && (mouseX-pmouseX !== 0 || mouseY-pmouseY !== 0))) {
        cache = [];
        for(var i = 0; i < 400+1; i += step) {
            var x = (i-xOffset);
            var y = sin(x)*yScale+yOffset;
            cache.push(y);
        }
    }
    strokeWeight(1);
    stroke(184, 0, 0);
    for(var i = 1; i < 400/step+1; i++) {
        line((i-1)*step, cache[i-1], i*step, cache[i]);
    }
};
