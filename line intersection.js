var p = [];
var s = [];

var p_high = -1;
var p_select = -1;

var pointRadius = 10;


var control = function() {
    if(!mouseIsPressed) {
        p_select = -1;
        p_high = -1;
        for(var i = 0; i < p.length; i++) {
            if(dist(p[i].x, p[i].y, mouseX, mouseY) < pointRadius) {
                p_high = i;
            }
        }
    }
    else {
        if(p_high > -1 && mouseIsPressed) {
            p_select = p_high;
            p[p_select].x = mouseX;
            p[p_select].y = mouseY;
        }
    }
};

var checkIntersect = function(x0, y0, x1, y1, x2, y2, x3, y3) {
    var p = {x: null, y: null};
    var a, b, dA, nA, nB;
    
    dA = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
    if (dA === 0) {
        return null;
    }
    a = y0 - y2;
    b = x0 - x2;
    nA = ((x3 - x2) * a) - ((y3 - y2) * b);
    nB = ((x1 - x0) * a) - ((y1 - y0) * b);
    a = nA / dA;
    b = nB / dA;
    
    if(a > 0 && a < 1 && b > 0 && b < 1) {
        p.x = x0 + (a * (x1 - x0));
        p.y = y0 + (a * (y1 - y0));
        return p;
    }
    else {
        return null;
    }
};


var drawSprings = function() {
    for(var i = 0; i < s.length; i++) {
        stroke(186, 47, 47);
        strokeWeight(2);
        line(p[s[i].a].x, p[s[i].a].y, p[s[i].b].x, p[s[i].b].y);
    }
};


var drawPoints = function() {
    for(var i = 0; i < p.length; i++) {
        if(i === p_high && p_select === -1) {
            fill(171, 207, 245);
        }
        else if(i === p_select) {
            fill(50, 134, 199);
        }
        else {
            fill(93, 158, 227);
        }
        
        strokeWeight(0.5);
        stroke(23, 69, 125);
        
        ellipse(p[i].x, p[i].y, pointRadius, pointRadius);
    }
};


var clearAll = function() {
    p = [];
    s = [];
};


var addPoint = function(xx, yy) {
    p.push({x: xx, y: yy});
};


var setSpring = function(aa, bb) {
    s.push({a: aa, b: bb, len: dist(p[aa].x, p[aa].y, p[bb].x, p[bb].y)});
};


var addSpring = function(x1, y1, x2, y2) {
    addPoint(x1, y1);
    addPoint(x2, y2);
    setSpring(p.length - 1, p.length - 2);
};


var setTemplate = function() {
    clearAll();
    addSpring(220, 80, 280, 200);
    addSpring(100, 240, 150, 180);
};



frameRate(60);
setTemplate();
draw = function() {
    
    control();
    
    background(232, 232, 232);
    drawSprings();
    drawPoints();
    
    var i = checkIntersect(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
    if(i !== null) {
        strokeWeight(16);
        stroke(117, 207, 230);
        point(i.x, i.y);
    }
};

