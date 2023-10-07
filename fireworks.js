

var pars = [];
    
var launchX;
var launchY;
var launchSize = 20;
var slideSpeed = 3;

var gravity = 0.1;

var setVelocity = 8;
var setDelay = 20;
var setTime = 0;

var explodeVel = 9;
var explodeDamp = 0.94;
var explodeCount = 40;
var explodeSpread = 0.22;

var secExplodeVel = 5;
var secExplodeDamp = 0.82;
var secExplodeCount = 5;
var secExplodeSpread = 0.1;

var trailDelay = 1;
var trailSpread = 0.2;
var trailDist = 30;

var timer = 0;
var keys = [300];

for(var i = 0; i < 300; i++) {
    keys[i] = false;
}

keyPressed = function() {
    if(keyCode <= 300) {
        keys[keyCode] = true;
    }
};

keyReleased = function() {
    if(keyCode <= 300) {
        keys[keyCode] = false;
    }
};


// not used
var mapV = function(v, x1, x2, y1, y2) {
    var diff = (y2 - y1) / (x2 - x1);
    return (v - x1) * diff + y1;
};

var createParticle = function(x, y, xv, yv, l, type, c, m) {
    var p = {
        x: x,
        y: y,
        xv: xv,
        yv: yv,
        life: l,
        type: type,
        color: c,
        mass: m
    };
    
    pars.push(p);
};


var launchFirework = function() {
    var c;
    var r = floor(random(0, 6));
    if(r === 0) {
        c = color(255, 0, 0);
    }
    else if(r === 1) {
        c = color(0, 255, 17);
    }
    else if(r === 2) {
        c = color(255, 0, 191);
    }
    else if(r === 3) {
        c = color(0, 115, 255);
    }
    else if(r === 4) {
        c = color(255, 98, 0);
    }
    else if(r === 5) {
        c = color(162, 0, 255);
    }
    createParticle(launchX + launchSize/4, launchY - launchSize, 0, setVelocity, 100, 0, c, 1);
};


var explode = function(x, y, c) {
    for(var i = 0; i < explodeCount; i++) {
        var angle = random(0, 365);
        var change = random(1-explodeSpread, 1+explodeSpread);
        var xv = explodeVel * cos(angle) * change;
        var yv = explodeVel * sin(angle) * change; 
        createParticle(x, y, xv, yv, 60, 1, c, 0.5);
    }
    createParticle(x, y, 0, 0, 5, 99, c, 0);
};


var secondExplode = function(x, y, c) {
    for(var i = 0; i < secExplodeCount; i++) {
        var angle = random(0, 365);
        var change = random(1-secExplodeSpread, 1+secExplodeSpread);
        var xv = secExplodeVel * cos(angle) * change;
        var yv = secExplodeVel * sin(angle) * change;
        createParticle(x, y, xv, yv, 60, 3, c, 0.1);
    }
};


var getInput = function() {
    if(keys[39]) {
        launchX += slideSpeed;
        if(launchX > 400-launchSize/2) {
            launchX = 400-launchSize/2;
        }
    }
    if(keys[37]) {
        launchX -= slideSpeed;
        if(launchX < 0) {
            launchX = 0;
        }
    }
    if(keys[32]) {
        if(timer - setTime > setDelay) {
            launchFirework();
            setTime = timer;
        }
    }
};


var drawLight = function(x, y, size, color, spread, steps, glitter) {
    for(var i = steps; i > 0; i--) {
        noStroke();
        fill(red(color), green(color), blue(color), (steps - i)*12);
        
        var s = size + spread*i;
        ellipse(x, y, s, s);
    }
    fill(255, 255, 255);
    
    if(glitter === 1) {
        size += random(-3 , 3);
    }
    ellipse(x, y, size, size);
};


var updateParticles = function() {
    for(var i = 0; i < pars.length; i++) {
        pars[i].yv -= gravity*pars[i].mass;
        
        if(pars[i].type === 1) {
            pars[i].xv *= explodeDamp;
            pars[i].yv *= explodeDamp;
        }
        if(pars[i].type === 3) {
            pars[i].xv *= secExplodeDamp;
            pars[i].yv *= secExplodeDamp;
        }
        
        if(pars[i].type === 0) {
            if(timer % trailDelay === 0) {
                createParticle(pars[i].x, pars[i].y, random(-trailSpread, trailSpread), 0, trailDist, 2, color(255, 241, 214), 0.2);
            }
        }
        
        pars[i].x += pars[i].xv;
        pars[i].y -= pars[i].yv;
        
        pars[i].life -= 1;
        if(pars[i].life < 0) {
            if(pars[i].type === 0) {
                explode(pars[i].x, pars[i].y, pars[i].color);
            }
            
            if(pars[i].type === 1) {
                secondExplode(pars[i].x, pars[i].y, color(255, 206, 43));
            }
            
            pars.splice(i, 1);
            i--;
        }
    }
};


var displayParticles = function() {
    for(var i = 0; i < pars.length; i++) {
        
        // main rocket
        if(pars[i].type === 0) {
            drawLight(pars[i].x, pars[i].y, 12, pars[i].color, 10, 8, 0);
        }
        
        // initial explosion particles
        if(pars[i].type === 1) {
            drawLight(pars[i].x, pars[i].y, pars[i].life/8, pars[i].color, 7, 5, 0);
        }
        
        // trailing particles on main rocket
        if(pars[i].type === 2) {
            drawLight(pars[i].x, pars[i].y, pars[i].life/6, pars[i].color, 4, pars[i].life/4, 0);
        }
        
        // secondary explosion particles
        if(pars[i].type === 3) {
            drawLight(pars[i].x, pars[i].y, pars[i].life/10, pars[i].color, 4, 2, 1);
        }
        
        // bright flash upon explosion
        if(pars[i].type === 99) {
            drawLight(pars[i].x, pars[i].y, pars[i].life*30, pars[i].color, 40, 7, 0);
        }
    }
};


var begin = function() {
    launchX = 200;
    launchY = 400;
    
    pars = [];
};


var update = function() {
    getInput();
    updateParticles();
};


var display = function() {
    fill(138, 138, 138);
    noStroke();
    rect(launchX, launchY-launchSize, launchSize/2, launchSize);
    
    displayParticles();
};




frameRate(60);
colorMode(RGB);

begin();
draw = function() {
    background(0, 0, 0);
    
    fill(255, 255, 255);
    text("Press SPACE to launch!  Arrow keys to move the launcher.", 5, 18);
    
    update();
    display();
    
    timer++;
};