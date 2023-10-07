var torchX, torchY, torchW, lastX;
var p = [];

torchW = 20;

var last = 0;
var rate = 0.01;
var spawn = 50;
var time = 0;
var rise = 1.2;
var life = 10;
var bright = 20;

var baseColor = 50;



var direction = function(x, y) {
    var d;
    if(y === 0) {
        if(x < 0) {
            d = 90;
        }
        else {
            d = -90;
        }
    }
    else {
        d = atan(x/y);
        if(y < 0) {
            if(x > 90) {
                d += 180;
            }
            else if(x < 180) {
                d -= 180;
            }
            else {
                d = 180;
            }
        }
    }
    return d;
};



var newParticle = function() {
    var par = {
        x: torchX + random(-1, 1),
        y: torchY + torchW / 2 + random(-8, 8),
        xv: random(-0.5, 0.5),
        yv: random(0.5, 1.5),
        k: random(0, torchW),
        s: random(1.01, 5),
        b: random(0.71, 1),
        l: random(-3.001, 3),
        o: torchX
    };
    p.push(par);
};



var updateParticles = function() {
    for(var i = 0; i < p.length; i++) {
        p[i].yv += rise;
        if(dist(p[i].x, p[i].y, torchX, torchY) < torchW) {
            var dir = direction(p[i].x - torchX, p[i].y - torchY);
            p[i].x += p[i].k / 2 * sin(dir);
            p[i].y += p[i].k / 2 * cos(dir);
        }
        p[i].xv += (p[i].o - p[i].x) / (life * 2);
        
        p[i].x += p[i].xv;
        p[i].y -= p[i].yv;
        
        p[i].l++;
        
        if(p[i].l > life || p[i].y < 0) {
            p.splice(i, 1);
            i--;
        }
    }
};



var render = function() {
    for(var i = 0; i < p.length; i++) {
        var w = p[i].k / 1.25;
        
        // big glow
        stroke(255, 218, 145, 0.5);
        strokeWeight(p[i].s * 11);
        line(p[i].x, p[i].y, p[i].x - p[i].xv, p[i].y - p[i].yv);
        
        // normal glow
        stroke(255, 218, 145, 10);
        strokeWeight(p[i].s * 5);
        line(p[i].x, p[i].y, p[i].x - p[i].xv, p[i].y - p[i].yv);
        
        // flame
        strokeWeight(p[i].s);
        stroke(255 - (w / torchW * 24), 255 - (w / torchW * 200), 255 - (w / torchW * 122), 100 - (w / torchW * 100));
        line(p[i].x, p[i].y, p[i].x - p[i].xv, p[i].y - p[i].yv);
    }
};



var backLight = function() {
    var yOff = life * 5;
    var bOff = bright * 5;
    var k = 255 / bright / 1200;
    
    for(var i = 0; i < bright; i++) {
        fill(baseColor + 300 * i * k, baseColor + 250 * i * k, baseColor + 205 * i * k, 100);
        noStroke();
        ellipse(torchX, torchY - yOff, (torchW + bOff * 1.2) - (i * 8) + abs(lastX - mouseX)*8, (torchW + yOff) / 24* bOff - (i * 10));
    }
};



draw = function() {
     background(baseColor, baseColor, baseColor);
     
     torchX = mouseX;
     torchY = mouseY;
     
     if(time - last > rate) {
         for(var i = 0; i < spawn; i ++) {
             newParticle();
         }
         last = time;
     }
     
     updateParticles();
     //backLight();
     render();
     
     text(p.length, 10, 390);
     time++;
     
     lastX = mouseX;
};

frameRate(60);