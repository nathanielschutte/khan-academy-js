var gravity = 0.49;
var damp = 0.98;
var colFriction = 0.92;
var bounce = 1;

var t = 0;

var border = {
    minX: 128,
    maxX: 280,
    minY: 340,
    maxY: 100
};


var p = [];

var particle = function(x, y) {
    var pt = {
        x: x,
        y: y,
        xv: random(-3, 3.01),
        yv: random(-3, 3.01)
    };
    p.push(pt);
};




var createParticleMass = function(w, h) {
    for(var i = 0; i < w; i++) {
        for(var k = 0; k < h; k++) {
            particle((i * (((400 - (400 - border.maxX + border.minX)) + ((400 - (400 - border.maxX + border.minX)) / w)) / w)) + border.minX, (k * (((400 - (400 - border.minY + border.maxY)) + ((400 - (400 - border.minY + border.maxY)) / h)) / h)) + border.maxY);
        }
    }
};




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




var update = function() {
    for(var i = 0; i < p.length; i++) {
        p[i].xv *= damp;
        p[i].yv *= damp;
        p[i].yv -= gravity;
        
        p[i].x += p[i].xv;
        p[i].y -= p[i].yv;
        
        for(var k = 0; k < p.length - 1; k++) {
            if(k !== i) {
                if(dist(p[i].x, p[i].y, p[k].x, p[k].y) < 2) {
                    //var dr = dir(p[i].x - p[k].x, p[i].y, p[k].y);
                    p[i].x -= p[i].xv;
                    p[i].y += p[i].yv;
                    
                    p[i].xv *= -bounce;
                    p[i].yv *= -bounce;
                }
            }
        }
        
        if(p[i].x > border.maxX || p[i].x < border.minX) {
            p[i].x -= p[i].xv;
            p[i].xv *= -1;
            p[i].yv *= colFriction;
        }
        if(p[i].y > border.minY || p[i].y < border.maxY) {
            p[i].y += p[i].yv;
            p[i].yv *= -1;
            p[i].xv *= colFriction;
        }
    }
};




var grad = function() {
    for(var i = 0; i < 35; i++) {
        noStroke();
        fill((i / 2.8) * 20, 255 - (i / 2.8) * 20, 100 - (i / 2.8));
        rect((i * (300 / 38.2)) + 50, 30, 35, 30);
    }
    textSize(14);
    fill(16, 47, 97);
    text("Velocity", 178, 21);
    fill(0, 94, 255);
    text("Velocity", 177, 20);
    
    fill(11, 217, 35);
    text("Low", 49, 20);
    
    fill(217, 13, 13);
    text("High", 323, 20);
};




var render = function() {
    strokeWeight(2);
    for(var i = 0; i < p.length; i++) {
        stroke((p[i].xv + p[i].yv) * 20, 255 - (p[i].xv + p[i].yv) * 20, 100 - (p[i].xv + p[i].yv) * 10);
        point(p[i].x, p[i].y);
    }
    
    noFill();
    strokeWeight(1);
    stroke(0, 0, 0);
    quad(border.minX, border.maxY, border.maxX, border.maxY, border.maxX, border.minY, border.minX, border.minY);
    
    grad();
};




createParticleMass(19, 19);
var draw = function() {
    background(250, 250, 250);
    
    update();
    render();
    
    t++;
};