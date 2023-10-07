var particle = [];

var vel = 8;
var radius = 9;
var life = 40;

var gravity = 0.45;
var damp = 0.99;
var pushDelay = 1;
var extrDelay = 10;


var t = 0;
var ls = 0;

var tx = {
    
};

var update = function() {
    for(var i = 0; i < particle.length; i++) {
        particle[i].xv *= damp;
        particle[i].yv *= damp;
        particle[i].yv += -gravity;
        
        particle[i].x += particle[i].xv;
        particle[i].y -= particle[i].yv;
        
        particle[i].s -= particle[i].s / (life - particle[i].l);
        particle[i].l += 1;
        
        if(particle[i].l > life) {
            particle.splice(i, 1);
        }
    }
};

var drawAll = function() {
    for(var i = 0; i < particle.length; i++) {
        noStroke();
        fill(particle[i].c);
        ellipse(particle[i].x, particle[i].y, particle[i].s, particle[i].s);
    }
};

var newParticle = function(x, y) {
    var p = {
        x: x,
        y: y,
        xv: random(-vel + 0.001, vel + 0.001),
        yv: random(-1, vel + 0.001),
        c: color(random(1, 255), random(1, 255), random(1, 255)),
        s: radius + random(-2, 2),
        l: 0
    };
    particle.push(p);
};



draw = function() {
    background(245, 245, 245);
    
    // everything important
    if(mouseIsPressed && t - ls > pushDelay) {
        newParticle(mouseX, mouseY);
        ls = t;
    }
    if(! mouseIsPressed && t - ls > extrDelay) {
        newParticle(mouseX, mouseY);
        ls = t;
    }
    
    update();
    drawAll();
    
    
    // text
    fill(48, 181, 242);
    text("Hold that mouse down!", 131, 19);
    
    t++;
    frameRate(60);
};