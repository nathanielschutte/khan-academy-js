var data = [];
var type = 0;
var border = true;

var startCol = 233;
var endCol = 140;


var testLength = 7;
var testMin = 1;
var testMax = 62;


var addDataPoint = function(x, y) {
    data.push([x, y]);
};


for(var i = 0; i < testLength; i++) {
    addDataPoint(i, testMin+floor(random(testMax-testMin)));
}



var graph = function(t, x, y, w, h, dt, spc) {
    var max = null;
    for(var i = 0; i < dt.length; i++) {
        if(max === null || dt[i][1] > max) {
            max = dt[i][1];
        }
    }
    if(t === 0) {
        var step = w/dt.length+(spc/dt.length);
        var bw = step-spc;
        for(var i = 0; i < dt.length; i++) {
            var c = color(endCol-((endCol-startCol)/dt.length)*i, 255, 255);
            noStroke();
            colorMode(HSB);
            fill(c);
            var o = (h/max)*dt[i][1];
            rect(x+(step*i), y+(h-o), bw, (h/max)*dt[i][1]);
        }
    }
    else if(t === 1) {
        
    }
    
    if(border) {
        colorMode(RGB);
        stroke(0, 0, 0);
        strokeWeight(1);
        line(x, y, x+w, y);
        line(x+w, y, x+w, y+h);
        line(x+w, y+h, x, y+h);
        line(x, y+h, x, y);
    }
};



keyIsPressed = function() {
    if(keyCode > 48 && keyCode < 58) {
        type = keyCode-49;
    }
};



draw = function() {
    colorMode(RGB);
    background(255, 255, 255);
    graph(type, 50, 50, 300, 300, data, 8);
};




