var par = {x: [], y: [], xv: [], yv: [], s: [], c: [], op: [], type: [], life: []};
var guy = {x: 0, y: 0, xv: 0, yv: 0, w: 10, h: 20, accel: 0.3, jump: 5, damp: 0.9, gravity: 0.2};
var block = {x: 0, y: 0};
var shadow = {north: getImage("cute/ShadowNorth"), south: getImage("cute/ShadowSouth"), east: getImage("cute/ShadowEast"), west: getImage("cute/ShadowWest"), northwest: getImage("cute/ShadowNorthWest"), southwest: getImage("cute/ShadowSouthWest"), northeast: getImage("cute/ShadowNorthEast"), southeast: getImage("cute/ShadowSouthEast")};
var portal = {a: {v: false, x: 0, y: 0, d: 0}, b: {v: false, x: 0, y: 0, d: 0}};

var startVel = 10;
var blastRad = 100;
var blastAmount = 12;
var blastParticleVel = 2;
var blastParticleDamp = 0.8;
var blastLife = 80;

var canJump = false;
var canClick = false;
var showTarget = false;

var rocketDelay = 20;
var lastRocket = 0;
var frame = 0;

var levelMode = 1;
var solidBlock = color(143, 143, 143);
var moonRock = color(219, 219, 219);
var guyImage = getImage("cute/CharacterHornGirl");

var WIDTH = 20;
var HEIGHT = 20;
var level = [];
for(var i = 0; i < WIDTH; i++) {
    level[i] = [];
    for(var k = 0; k < HEIGHT; k++) {
        level[i][k] = 0;
    }
}
var keys = [256];
keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};


var createParticle = function(x, y, xv, yv, s, c, type, life) {
    par.x.push(x);
    par.y.push(y);
    par.xv.push(xv);
    par.yv.push(yv);
    par.s.push(s);
    par.c.push(c);
    par.type.push(type);
    par.life.push(life);
};


var deleteParticle = function(p) {
    par.x.splice(p, 1);
    par.y.splice(p, 1);
    par.xv.splice(p, 1);
    par.yv.splice(p, 1);
    par.s.splice(p, 1);
    par.c.splice(p, 1);
    par.type.splice(p, 1);
    par.life.splice(p, 1);
};


var drawLevel = function() {
    var blockW = width/WIDTH;
    var blockH = height/HEIGHT;
    for(var i = 0; i < WIDTH; i++) {
        for(var k = 0; k < HEIGHT; k++) {
            if(levelMode === 0) {
                noStroke();
                if(level[i][k] === 1) {
                    fill(56, 56, 56);
                }
                else {
                    fill(230, 230, 230);
                }
                rect(i*blockW, k*blockH, blockW, blockH);
            }
            else if(levelMode === 1) {
                stroke(97, 97, 97);
                strokeWeight(1);
                if(level[i][k] === 1) {
                    fill(112, 112, 112);
                }
                else if(level[i][k] === 2) {
                    fill(219, 219, 219);
                }
                else if(level[i][k] === 3) {
                    fill(69, 222, 105);
                }
                else {
                    noStroke();
                    fill(255, 255, 255);
                }
                rect(i*blockW, k*blockH, blockW, blockH);
            }
        }
    }
};


var drawShadows = function() {
    var blockW = width/WIDTH;
    var blockH = height/HEIGHT;
    for(var i = 0; i < WIDTH; i++) {
        for(var k = 0; k < HEIGHT; k++) {
            if(level[i][k] === 0) {
                if(k > 0 && level[i][k-1] === 1) {
                    image(shadow.north, i*blockW, k*blockH-8, blockW, blockH+8);
                }
                if(k < HEIGHT && level[i][k+1] === 1){
                    image(shadow.south, i*blockW, k*blockH+blockH-44, blockW, blockH+61);
                }
                if(i > 0 && level[i-1][k] === 1) {
                    image(shadow.west, i*blockW, k*blockH-13, blockW, blockH+23);
                }
                if(i < WIDTH && level[i+1][k] === 1) {
                    image(shadow.east, i*blockW, k*blockH-12, blockW, blockH+23);
                }
                if(i > 0 && k > 0 && level[i-1][k-1] === 1 && level[i][k-1] !== 1 && level[i-1][k] !== 1) {
                    image(shadow.northwest, i*blockW, k*blockH-8, blockW, blockH+8);
                }
                if(i > 0 && k < HEIGHT && level[i-1][k+1] === 1 && level[i][k+1] !== 1 && level[i-1][k] !== 1) {
                    image(shadow.southwest, i*blockW, k*blockH+5, blockW, blockH);
                }
                if(i < WIDTH && k > 0 && level[i+1][k-1] === 1 && level[i+1][k] !== 1 && level[i][k-1] !== 1) {
                    image(shadow.northeast, i*blockW, k*blockH-8, blockW, blockH+8);
                }
                if(i < WIDTH && k < HEIGHT && level[i+1][k+1] === 1 && level[i][k+1] !== 1 && level[i+1][k] !== 1) {
                    image(shadow.southeast, i*blockW, k*blockH, blockW, blockH+8);
                }
            }
        }
    }
};


var findBlock = function(x, y) {
    block.x = floor(x/WIDTH);
    block.y = floor(y/HEIGHT);
};


var setChunk = function(x, y, w, h) {
    for(var i = 0; i < w; i++) {
        for(var k = 0; k < h; k++) {
            level[x+i][y+k] = 1;
        }
    }
};


var drawGuy = function() {
    if(levelMode === 0) {
        noStroke();
        fill(89, 157, 230);
        rect(guy.x, guy.y, guy.w, guy.h);
    }
    else if(levelMode === 1) {
        image(guyImage, guy.x-guy.w/2, guy.y-guy.h/2-4, guy.w*2, guy.h*2);
    }
};


var drawParticles = function() {
    for(var i = 0; i < par.x.length; i++) {
        noStroke();
        fill(par.c[i]);
        ellipse(par.x[i], par.y[i], par.s[i], par.s[i]);
    }
};


var control = function() {
    if(keys[RIGHT] || keys[68]) {
        guy.xv += guy.accel;
    }
    if(keys[LEFT] || keys[65]) {
        guy.xv -= guy.accel;
    }
    if((keys[UP] || keys[87]) && canJump) {
        guy.yv = guy.jump;
        canJump = false;
    }
};


var fireRocket = function(type) {
    var dir = -atan2(guy.x - mouseX, guy.y - mouseY);
    createParticle(guy.x+guy.w/2, guy.y, startVel*sin(dir), startVel*cos(dir), 10, type === 0 ? color(179, 111, 9, 255) : color(11, 72, 179, 255), type, 0);
};


var check = function(jump) {
    var b = false;
    findBlock(guy.x, guy.y);
    if(level[block.x][block.y] === 1) {
        b = true;
    }
    findBlock(guy.x+guy.w, guy.y);
    if(level[block.x][block.y] === 1) {
        b = true;
    }
    findBlock(guy.x, guy.y+guy.h);
    if(level[block.x][block.y] === 1) {
        b = true;
        if(jump) {
            canJump = true;
        }
    }
    findBlock(guy.x+guy.w, guy.y+guy.h);
    if(level[block.x][block.y] === 1) {
        b = true;
        if(jump) {
            canJump = true;
        }
    }
    return b;
};


var sideClear = function(s, bx, by, rx, ry) {
    var clear = false;
    
    
};


var blockClear = function(bx, by, rx, ry) {
    var side = -1;
    
};


var splode = function(x, y, t, p, bx, by) {
    if(t === 1) {
        var k = floor(random(10, 16));
        for(var i = 0; i < k; i++) {
            createParticle(x, y, sin(i*(360/k))*blastParticleVel+random(-1, 1), cos(i*(360/k))*blastParticleVel+random(-1, 1), random(6, 8), color(242, 200, 72, random(150, 220)), p === 1 ? 1 : 11, floor(random(blastLife-20, blastLife+20)));
        }
    }
    else {
        if(p === 1) {
            portal.a.v = true;
            portal.a.x = bx;
            portal.a.y = by;
        }
        else {
            portal.b.v = true;
            portal.b.x = bx;
            portal.b.y = by;
        }
    }
};


var updateParticles = function() {
    var blow = {yes: false, x: 0, y: 0, type: 0, portal: 1, bx: 0, by: 0};
    for(var i = 0; i < par.x.length; i++) {
        if(par.type[i] === 0 || par.type[i] === 10) {
            par.x[i] += par.xv[i];
            par.y[i] -= par.yv[i];
            findBlock(par.x[i], par.y[i]);
            if(level[block.x][block.y] > 0) {
                blow.yes = true;
                blow.type = level[block.x][block.y];
                blow.portal = par.type[i];
                blow.x = par.x[i] - par.xv[i];
                blow.y = par.y[i] + par.yv[i];
                blow.bx = block.x;
                blow.by = block.y;
                deleteParticle(i);
                i--;
            }
        }
        else if(par.type[i] === 1) {
            par.yv[i] -= guy.gravity;
            par.x[i] += par.xv[i];
            findBlock(par.x[i], par.y[i]);
            if(level[block.x][block.y] === 1) {
                par.x[i] -= par.xv[i];
                par.xv[i] *= -blastParticleDamp;
            }
            par.xv[i] *= 0.98;
            par.y[i] -= par.yv[i];
            findBlock(par.x[i], par.y[i]);
            if(level[block.x][block.y] === 1) {
                par.y[i] += par.yv[i];
                par.yv[i] *= -blastParticleDamp;
            }
            par.yv[i] *= 0.98;
            par.life[i]--;
            if(par.life[i] < 1) {
                deleteParticle(i);
                i--;
            }
        }
    }
    if(blow.yes) {
        splode(blow.x, blow.y, blow.type, blow.portal, blow.bx, blow.by);
    }
};


var update = function() {
    guy.x += guy.xv;
    if(check()) {
        guy.x -= guy.xv;
        guy.xv = 0;
    }
    
    guy.yv -= guy.gravity;
    guy.y -= guy.yv;
    if(check(true)) {
        guy.y += guy.yv;
        guy.yv = 0;
        guy.xv *= guy.damp;
    }
    
    if(mouseIsPressed) {
        if(frame > lastRocket + rocketDelay) {
            fireRocket(mouseButton === LEFT ? 0 : 10);
            lastRocket = frame;
        }
    }
    
    guy.xv *= 0.94;
    
    updateParticles();
};


var setBorder = function(thick) {
    setChunk(0, 0, WIDTH, thick);
    setChunk(0, HEIGHT-thick, WIDTH, thick);
    setChunk(0, 0, thick, HEIGHT);
    setChunk(WIDTH-thick, 0, thick, HEIGHT);
};


var setLevel = function() {
    setBorder(1);
    setChunk(11, 1, 4, 7);
    setChunk(6, HEIGHT-2, 13, 1);
    setChunk(1, 5, 6, 3);
    setChunk(1, 8, 1, 11);
    setChunk(7, 13, 2, 5);
    setChunk(13, 12, 2, 2);
};


var setGuy = function() {
    guy.x = 50;
    guy.y = 30;
    guy.xv = 0;
    guy.yv = 0;
};


setLevel();
setGuy();

frameRate(60);
var draw = function() {
    background(255, 255, 255);
    
    control();
    update();
    
    drawLevel();
    drawGuy();
    drawParticles();
    drawShadows();
    
    frame++;
    
    fill(255, 255, 255);
    textSize(11);
    text("This is unfinished!", 24, 134);
    text("Run and jump with arrow keys", 245, 375);
    text("Use right/left mouse buttons to fire orange/blue portals", 127, 393);
};