var frame = 0;
var timer = 0;
var state = 0;
var camX = 0;
var camY = 0;

var maxAmmo = 60;
var fireRate = 3;
var lastFire = 0;

var heli = {x: 0, y: 0, xv: 0, yv: 0, rot: 0, rv: 0, fire: false};
var bullet = {x: [], y: [], xv: [], yv: [], force: 20, size: 3};
var turret = {ammo: 0, dir: 90,};
var rain = {speed: 18, amount: 8, len: 18, random: 50};
var light = {amount: 8, level: 40, cur: 0};
var b = {
    x: [110, 120, 120, 175, 175, 346],
    y: [155, 220, 280, 340, 340, 4],
    w: [180, 160, 160, 50, 50, 50],
    h: [60, 55, 55, 22, 22, 22],
    t: ["Start", "Help", "Credits", "Back", "Back", "Menu"],
    s: [0, 0, 0, 0, 0, 0],
    b: [3, 1, 2, 0, 0, 0],
    e: [0, 0, 0, 1, 2, 3],
    ts: [27, 27, 27, 16, 16, 16]
};
var b_count = 6;

textAlign(CENTER, CENTER);

var keys = [256];
keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};

var titleVel = 0;
var titleY = 0;
var go = ["Ready", "Set", "GO!"];


var drawRain = function() {
    strokeWeight(2);
    
    for(var i = 0; i < rain.amount+1; i++) {
        for(var k = 0; k < rain.amount+1; k++) {
            var step = 400/rain.amount;
            var val1 = i*step-((frame*rain.speed/2)%step);
            var val2 = k*step+((frame*rain.speed)%step);
            var off1 = 0;
            var off2 = 0;
            line(val1+off1, val2+off2, val1+rain.len/2+off1, val2-rain.len+off2);
        }
    }
};


var doLight = function() {
    if(floor(random(0, light.amount)) === 1) {
        light.cur = light.level + floor(random(-4, 4));
    }
    if(light.cur > 0) {
        light.cur -= floor(random(0, 2));
    }
    if(light.cur < 0) {
        light.cur = 0;
    }
    
    fill(255, 255, 255, light.cur*2);
    rect(0, 0, 400, 400);
};


var backdrop = function() {
    switch(state) {
        case 0:
            background(20, 74, 122);
            stroke(90, 124, 176);
            drawRain();
            doLight();
            
            fill(98, 154, 204);
            noStroke();
            rect(192, 68, 16, 23);
            rect(200-abs(sin(frame*10))*150-5, 64,abs(sin(frame*10))*300+10, 4);
            
            textSize(40);
            fill(72, 123, 163);
            text("Helicopter Game", 187, 96);
            fill(169, 210, 245);
            text("Helicopter Game", 185, 93);
            break;
        case 1:
            background(20, 74, 122);
            textSize(40);
            fill(72, 123, 163);
            text("Help", 200, 96);
            fill(169, 210, 245);
            text("Help", 198, 93);
            break;
        case 2:
            background(20, 74, 122);
            textSize(40);
            fill(72, 123, 163);
            text("Credits", 200, 96);
            fill(169, 210, 245);
            text("Credits", 198, 93);
            break;
        case 3:
            background(20, 74, 122);
            stroke(90, 124, 176);
            drawRain();
            doLight();
            
            if(titleY > 0) {
                fill(98, 154, 204);
                noStroke();
                rect(192, titleY-25, 16, 23);
                rect(200-abs(sin(frame*10))*150-5, titleY-29,abs(sin(frame*10))*300+10, 4);
                
                textSize(40);
                fill(72, 123, 163);
                text("Helicopter Game", 187, titleY+3);
                fill(169, 210, 245);
                text("Helicopter Game", 185, titleY);
            }
            break;
    }
};


var updateButtons = function() {
    if(! mouseIsPressed) {
        for(var i = 0; i < b_count; i++) {
            if(b.e[i] === state && mouseX > b.x[i] && mouseX < b.x[i] + b.w[i] && mouseY > b.y[i] && mouseY < b.y[i] + b.h[i]) {
                if(b.s[i] === 0 || b.s[i] > 2) {
                    if(b.s[i] > 3) {
                        b.s[i]--;
                    }
                    else if(b.s[i] === 3 || b.s[i] === 0) {
                        b.s[i] = 1;   
                    }
                }
                else if(b.s[i] === 2) {
                    b.s[i] = 4;
                }
            }
            else {
                b.s[i] = 0;
            }
        }
    }
    else {
        for(var i = 0; i < b_count; i++) {
            if(b.e[i] === state && mouseIsPressed && b.s[i] === 1) {
                b.s[i] = 2;
            }
        }
    }
    for(var i = 0; i < b_count; i++) {
        if(b.e[i] === state && b.s[i] > 2) {
            state = b.b[i];
            if(state === 3) {
                titleVel = -24;
                titleY = 93;
            }
            backdrop();
        }
    }
};


var drawButtons = function() {
    for(var i = 0; i < b_count; i++) {
        if(b.e[i] === state) {
            noStroke();
            if(b.s[i] === 0 || b.s[i] > 2) {
                fill(73, 165, 227);  
            }
            else if(b.s[i] === 1) {
                fill(110, 188, 240);
            }
            else if(b.s[i] === 2) {
                fill(31, 129, 194);
            }
            
            rect(b.x[i], b.y[i], b.w[i], b.h[i]);
            
            var ww = b.x[i] + b.w[i]/2 - 1;
            var hh = b.y[i] + b.h[i]/2;
            
            textSize(b.ts[i]);
            fill(0, 0, 0);
            text(b.t[i], ww+1, hh+1);
            fill(173, 225, 255);   
            text(b.t[i], ww, hh);
        }
    }
};


var startGame = function() {
    heli.y = 420;
    heli.x = 40;
    heli.xv = 0;
    heli.yv = 0;
    heli.rot = 0;
    heli.rv = 0;
    
    bullet.x = [];
    bullet.y = [];
    bullet.xv = [];
    bullet.yv = [];
    
    turret.ammo = maxAmmo;
    turret.dir = 0;
};


var doBullets = function() {
    for(var i = 0; i < bullet.x.length; i++) {
        bullet.x[i] += bullet.xv[i];
        bullet.y[i] -= bullet.yv[i];
        if(bullet.x[i] < 0 || bullet.x[i] > 400 || bullet.y[i] < 0 || bullet.y[i] > 400) {
            bullet.x.splice(i, 1);
            bullet.y.splice(i, 1);
            bullet.xv.splice(i, 1);
            bullet.yv.splice(i, 1);
            i--;
        }
    }
};


var gameTick = function() {
    heli.xv = (mouseX/5+30 - heli.x)/5;
    heli.yv = (mouseY - heli.y)/3;
    heli.x += heli.xv;
    heli.y += heli.yv;
    
    heli.rot = -heli.yv;
    turret.dir = atan2(mouseX - heli.x, mouseY - heli.y);
    
    if(mouseIsPressed && frame - lastFire > fireRate) {
        bullet.x.push(heli.x+sin(heli.rot+90)*30);
        bullet.y.push(heli.y+cos(heli.rot+90)*30);
        bullet.xv.push(sin(-heli.rot+90)*bullet.force);
        bullet.yv.push(cos(-heli.rot+90)*bullet.force);
        heli.fire = true;
        lastFire = frame;
    }
    
    doBullets();
};


var drawHeli = function() {
    noStroke();
    fill(51, 51, 51);
    ellipse(heli.x, heli.y, 50, 50);
    fill(153, 209, 247);
    ellipse(heli.x+11, heli.y-6, 20, 20);
    
    stroke(189, 189, 189);
    line(heli.x+sin(heli.rot+45)*42, heli.y+cos(heli.rot+45)*42, heli.x+sin(heli.rot-45)*42, heli.y+cos(heli.rot-45)*42);
    line(heli.x+sin(heli.rot+24)*28, heli.y+cos(heli.rot+24)*32, heli.x+sin(heli.rot+24)*28, heli.y+cos(heli.rot+24)*26);
    line(heli.x+sin(heli.rot-24)*28, heli.y+cos(heli.rot-24)*32, heli.x+sin(heli.rot-24)*28, heli.y+cos(heli.rot-24)*26);
    
    if(heli.fire) {
        noStroke();
        fill(252, 199, 159, random(150, 200));
        ellipse(heli.x+sin(heli.rot+90)*30, heli.y+cos(heli.rot+90), 20, 20);
        heli.fire = false;
    }
};


var drawBullets = function() {
    for(var i = 0; i < bullet.x.length; i++) {
        fill(0, 0, 0);
        noStroke();
        ellipse(bullet.x[i], bullet.y[i], bullet.size, bullet.size);
    }
};


var drawGame = function() {
    drawHeli();
    drawBullets();
};


frameRate(30);
draw = function() {
    backdrop();
    
    if(state === 3) {
        if(titleY > 0) {
            titleVel += 2;
            titleY -= titleVel;
            timer = 0;
        }
        else {
            if(timer > 20 && timer < 110) {
                textSize(80);
                var u = floor((timer-20)/30);
                fill(28, 61, 77);
                text(go[u], 200+5, 205+pow((timer-20)/2%15, u === 2 ? 2 : 3));
                fill(204, 237, 255);
                text(go[u], 200, 200+pow((timer-20)/2%15, u === 2 ? 2 : 3));
            }
            else {
                if(timer === 110) {
                    startGame();
                }
                else if(timer > 110) {
                    gameTick();
                    drawGame();
                }
            }
            timer++;
        }
        
    }
    
    updateButtons();
    drawButtons();
    
    frame++;
};
