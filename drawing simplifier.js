var dr = [];

var s = {
    x: [],
    y: []
};

var cur = {
    x: 0,
    y: 0,
    c: 0
};

var next = {
    x: 0,
    y: 0,
    c: 0
};



var lastx, lasty;
var groupRange = 90;
var groupWidth = 60;

var td, tx, ty;
var d1, d2, d3;
var test = false;

var dir = function(x, y) {
    var d = atan(x / (y + 0.001));
    if(y < 0) {
        if(x > 0) {
            d += 180;
        }
        else if(x < 0) {
            d -= 180;
        }
        else {
            d = 180;
        }
    }
    return d;
};




var current = function(l) {
    cur.x = s.x[l];
    cur.y = s.y[l];
    cur.c = l;
};

var next = function(l) {
    next.x = s.x[l];
    next.y = s.y[l];
    next.c = l;
};




var drawSimple = function() {
    current(0);
    next(1);
    var d = {
        x: [],
        y: []
    };
    d.x.push(cur.x);
    d.y.push(cur.y);
    
    var i = 0;
    var k = 1;
    while(i < s.y.length - 1) {
        td = dir(cur.x - next.x, cur.y - next.y);
        tx = cur.x + groupRange * sin(td);
        ty = cur.y + groupRange * cos(td);
        
        d1 = dist(cur.x, cur.y, tx, ty);
        d2 = dist(next.x, next.y, tx, ty);
        d3 = dist(next.x, next.y, cur.x, cur.y);
        
        if((d2 + d3) - d1 > groupWidth || dist(next.x, next.y, cur.x, cur.y) > groupRange || next.c === s.y.length - 1) {
            current(next.c);
            k = cur.c + 1;
            next(k);
            d.x.push(cur.x);
            d.y.push(cur.y);
            i = cur.c;
        }
        else {
            k++;
            i++;
            next(k);
        }
    }
    s.x.length = 0;
    s.y.length = 0;
    dr.push(d);
    test = false;
};




var renderSmooth = function() {
    strokeWeight(2);
    for(var m = 0; m < dr.length; m++) {
        for(var l = 0; l < dr[m].y.length - 1; l++) {
            if(l < 10) {
                stroke(230, 106, 106);
                //var ds = dist(dr[m].x[l], dr[m].y[l], dr[m].x[l - 1], dr[m].y[l - 1]);
                //var di = dir(dr[m].x[l] - dr[m].x[l - 1], dr[m].y[l] - dr[m].y[l - 1]);
                //bezier(dr[m].x[l], dr[m].y[l], dr[m].x[l] + ds * sin(dr), dr[m].x[l] + ds * cos(dr), dr[m].x[l] + ds * sin(dr), dr[m].x[l] + ds * cos(dr), dr[m].x[l + 1], dr[m].y[l + 1]);
            }
            
            stroke(0, 157, 255);
            line(dr[m].x[l], dr[m].y[l], dr[m].x[l + 1], dr[m].y[l + 1]);
        }
    }
};




var draw = function() {
    if(mouseIsPressed) {
        if(dist(mouseX, mouseY, s.x[s.y.length - 1], s.y[s.y.length - 1]) > 1 || s.y.length < 1) {
            s.x.push(mouseX);
            s.y.push(mouseY);
            if(s.y.length > 1) {
                stroke(12, 47, 84);
                strokeWeight(2);
                line(s.x[s.y.length - 1], s.y[s.y.length - 1], s.x[s.y.length - 2], s.y[s.y.length - 2]);
                test = true;
            }
        }
    }
    else {
        if(s.y.length > 2 && test) {
            background(255, 255, 255);
            drawSimple();
            renderSmooth();
        }
        fill(255, 0, 0);
    }
    
    frameRate(60);
};