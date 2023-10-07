var WORLD_WIDTH = 16;
var WORLD_HEIGHT = 16;

var WORLD_STEP_X = width/WORLD_WIDTH;
var WORLD_STEP_Y = height/WORLD_HEIGHT;

var BLOCK_AIR = 0;
var BLOCK_SOLID = 1;
var BLOCK_RAMP = 2;

var AIR_RESIST = 0.98;
var COLLISION_DAMP = 0.95;
var BOUNCE_DAMP = 0.9;
var GRAVITY = 0.1;
var BALL_SIZE = 10;
var BALL_LIFE = 200;

var ui_cur = 1;
var ui_sel = -1;
var ui_count = 4;
var ui_bound_y = 40;
var ui_bound_x = 400;
var ui_save_x;
var ui_save_y;
var ui_block_x;
var ui_block_y;
var ui_down = false;
var ui_cross_size = 4;
var ui_delay = 200;
var ui_last = 0;

var ui_names = ["AIR", "BLOCK", "RAMP", "BALL"];

var ball = [];
var grid = [];
var keys = [];



var setGridInit = function(w, h) {
    for(var i = 0; i < w; i++) {
        grid[i] = [];
        for(var k = 0; k < h; k++) {
            var id = BLOCK_AIR;
            if(i === 0 || i === WORLD_WIDTH-1 || k === 0 || k === WORLD_HEIGHT-1) {
                id = BLOCK_SOLID;
            }
            grid[i][k] = {type: id, dir: 0, water: false};
        }
    }
};

var writeIn = function(key) {
    var i = 0;
    WORLD_WIDTH = parseInt(key.substring(i, i+3), 10); i+=3;
    WORLD_HEIGHT = parseInt(key.substring(i, i+3), 10); i+=3;
    WORLD_STEP_X = width/WORLD_WIDTH;
    WORLD_STEP_Y = height/WORLD_HEIGHT;
    BALL_SIZE = parseInt(key.substring(i, i+3), 10); i+=3;
    setGridInit(WORLD_WIDTH, WORLD_HEIGHT);
    for(var j = 0; j < WORLD_WIDTH; j++) {
        for(var k = 0; k < WORLD_HEIGHT; k++) {
            grid[j][k].type = parseInt(key.substring(i, i+2), 10); i+=2;
            grid[j][k].dir = parseInt(key.substring(i, i+1), 10); i++;
            grid[j][k].water = parseInt(key.substring(i, i+1), 10); i++;
        }
    }
};

keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};

var pressed = function(code) {
    return keys[code];
};


var setGridIndex = function(x, y, id, dir, water) {
    grid[x][y] = {type: id, dir: dir, water: water};
};


var setGridChunk = function(x, y, w, h, id, dir, water) {
    if(x < 0) {x = 0;}
    if(y < 0) {x = 0;}
    if(x >= WORLD_WIDTH) {x = WORLD_WIDTH-1;}
    if(y >= WORLD_HEIGHT) {y = WORLD_HEIGHT-1;}
    if(x+w > WORLD_WIDTH) {w = WORLD_WIDTH-x;}
    if(y+h > WORLD_HEIGHT) {h = WORLD_HEIGHT-y;}
    for(var i = x; i < x+w; i++) {
        for(var k = y; k < y+h; k++) {
            setGridIndex(i, k, id, dir, water);
        }
    }
};

var setGridRamp = function(x, y, w, h, dir) {
    if(x < 0) {x = 0;}
    if(y < 0) {x = 0;}
    if(x >= WORLD_WIDTH) {x = WORLD_WIDTH-1;}
    if(y >= WORLD_HEIGHT) {y = WORLD_HEIGHT-1;}
    if(x+w > WORLD_WIDTH) {w = WORLD_WIDTH-x;}
    if(y+h > WORLD_HEIGHT) {h = WORLD_HEIGHT-y;}
    for(var i = x; i < x+w; i++) {
        for(var k = y; k < y+h; k++) {
            if(i <= k) {
                var id = BLOCK_SOLID;
                if(i === k) { id = BLOCK_RAMP;}
            }
        }
    }
};

var drawTri = function(dir, x, y, w, h) {
    if(dir === 0) {
        triangle(x, y, x, y+h, x+w, y+h);
    }
    if(dir === 1) {
        triangle(x, y+h, x+w, y+h, x+w, y);
    }
    if(dir === 2) {
        triangle(x+w, y+h, x+w, y, x, y);
    }
    if(dir === 3) {
        triangle(x+w, y, x, y, x, y+h);
    }
};

var drawGrid = function() {
    for(var i = 0; i < WORLD_WIDTH; i++) {
        for(var k = 0; k < WORLD_HEIGHT; k++) {
            var id = grid[i][k].type;
            var dir = grid[i][k].dir;
            var x = i*WORLD_STEP_X;
            var y = k*WORLD_STEP_Y;
            var w = WORLD_STEP_X;
            var h = WORLD_STEP_Y;
            if(id === BLOCK_AIR) {
                noStroke();
                fill(216, 220, 232);
                rect(x, y, w, h);
            }
            else if(id === BLOCK_SOLID) {
                strokeWeight(1);
                stroke(77, 35, 0);
                fill(120, 77, 31);
                rect(x, y, w, h);
            }
            else if(id === BLOCK_RAMP) {
                strokeWeight(1);
                stroke(77, 35, 0);
                fill(120, 77, 31);
                drawTri(dir, x, y, w, h);
            }
        }
    }
};

var getDir = function(x, y) {
    var xx = x*WORLD_STEP_X;
    var yy = y*WORLD_STEP_Y;
    var dir;
    if(mouseX%WORLD_STEP_X > WORLD_STEP_X/2) {
        if(mouseY%WORLD_STEP_Y > WORLD_STEP_Y/2) {
            dir = 1;
        }
        else {
            dir = 2;
        }
    }
    else {
        if(mouseY%WORLD_STEP_Y > WORLD_STEP_Y/2) {
            dir = 0;
        }
        else {
            dir = 3;
        }
    }
    return dir;
};

var outlineBlock = function(x, y, light) {
    if(light) {stroke(255, 0, 0, 40);}
    else{stroke(219, 59, 59, 120);}
    strokeWeight(1);
    noFill();
    if(ui_cur < 2) {
        rect(x*WORLD_STEP_X, y*WORLD_STEP_Y, WORLD_STEP_X, WORLD_STEP_Y);
    }
    else if(ui_cur === 2) {
        var dir = getDir(x, y);
        drawTri(dir, x*WORLD_STEP_X, y*WORLD_STEP_Y, WORLD_STEP_X, WORLD_STEP_Y);
    }
    else if(ui_cur === 3) {
        ellipse(mouseX, mouseY, BALL_SIZE, BALL_SIZE);
    }
};

var outlineChunk = function(x0, y0, x1, y1) {
    for(var i = x0; i <= x1; i++) {
        for(var k = y0; k <= y1; k++) {
            outlineBlock(i, k, true);
        }
    }
};

var drawUI = function() {
    if(mouseIsPressed) {
        if(ui_cur < 2) {
            var x0 = ui_block_x;
            var y0 = ui_block_y;
            var x1 = floor(mouseX/WORLD_STEP_X);
            var y1 = floor(mouseY/WORLD_STEP_Y);
            outlineChunk(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1));
        }
        else {
            outlineBlock(floor(mouseX/WORLD_STEP_X), floor(mouseY/WORLD_STEP_Y), false);
        }
    }
    else {
        outlineBlock(floor(mouseX/WORLD_STEP_X), floor(mouseY/WORLD_STEP_Y), false);
    }
    noStroke();
    fill(128, 128, 128, 50);
    rect(0, 0, ui_bound_x, ui_bound_y);
    var cur = ui_bound_x/ui_count;
    for(var i = 0; i < ui_count; i++) {
        var lit = 0;
        if(i === ui_cur) {
            lit = -1;
        }
        else if(i === ui_sel) {
            lit = 1;
        }
        noStroke();
        fill(79+lit*50, 36, 143, 120);
        rect(i*cur, 0, cur, ui_bound_y);
        textAlign(CENTER);
        fill(0, 0, 0, 150);
        text(ui_names[i], i*cur+cur/2+2, ui_bound_y/2+5);
        fill(255, 255, 255, 220);
        text(ui_names[i], i*cur+cur/2, ui_bound_y/2+3);
    }
};


var getBallBlock = function(x, y) {
    if(x < 0 || x > 400 || y < 0 || y > 400) {
        return 0;
    }
    return {x: floor(x/WORLD_STEP_X), y: floor(y/WORLD_STEP_Y)};
};

var addBall = function(x, y, xv, yv) {
    var p = getBallBlock(x, y);
    
    ball.push({x: x, y: y, xv: xv, yv: yv, life: 0});
};


var input = function() {
    if(!mouseIsPressed) {
        if(ui_down) {
            if(mouseY > ui_bound_y) {
                if(ui_cur < 2) {
                    var x0 = ui_block_x;
                    var y0 = ui_block_y;
                    var x1 = floor(mouseX/WORLD_STEP_X)-ui_block_x;
                    var y1 = floor(mouseY/WORLD_STEP_Y)-ui_block_y;
                    if(x1 < 0) {
                        x0 += x1;
                        x1 *= -1;
                    }
                    if(y1 < 0) {
                        y0 += y1;
                        y1 *= -1;
                    }
                    if(ui_cur === 0) {
                        setGridChunk(x0, y0, x1+1, y1+1, BLOCK_AIR, 0, false);
                    }
                    else {
                        setGridChunk(x0, y0, x1+1, y1+1, BLOCK_SOLID, 0, false);
                    }
                }
                else if(ui_cur === 2) {
                    setGridIndex(ui_block_x, ui_block_y, BLOCK_RAMP, 
                    getDir(ui_block_x, ui_block_y));
                }
            }
            else {
                ui_cur = floor(mouseX/(ui_bound_x/ui_count));
            }
        }
        ui_down = false;
        if(mouseY < ui_bound_y) {
            ui_sel = floor(mouseX/(ui_bound_x/ui_count));
        }
        else {
            ui_sel = -1;
        }
    }
    else {
        if(!ui_down || ui_cur > 1) {
            ui_save_x = mouseX;
            ui_save_y = mouseY;
            ui_block_x = floor(mouseX/WORLD_STEP_X);
            ui_block_y = floor(mouseY/WORLD_STEP_Y);
            ui_down = true;
        }
        if(mouseY > ui_bound_y && ui_cur === 3 && millis() - ui_last > ui_delay) {
            var p = getBallBlock(mouseX, mouseY);
            if(grid[p.x][p.y].type === BLOCK_AIR) {
                addBall(mouseX, mouseY, 0, 0);
                ui_last = millis();
            }
        }
    }
    
};



var updateBalls = function() {
    for(var i = 0; i < ball.length; i++) {
        ball[i].yv += GRAVITY;
        
        ball[i].x += ball[i].xv;
        var p = getBallBlock(ball[i].x, ball[i].y);
        if(grid[p.x][p.y].type === BLOCK_SOLID) {
            var g;
            if(ball[i].xv >= 0) {
                g = p.x*WORLD_STEP_X-BALL_SIZE;
            }
            else {
                g = (p.x+1)*WORLD_STEP_X;
            }
            var f = g-ball[i].x;
            var ct = f + COLLISION_DAMP*(ball[i].xv-f);
            var cf = ct - f;
            
            ball[i].x = g - cf;
            ball[i].xv *= -COLLISION_DAMP;
        }
        
        ball[i].y += ball[i].yv;
        var p = getBallBlock(ball[i].x, ball[i].y);
        if(grid[p.x][p.y].type === BLOCK_SOLID) {
            
            var g;
            if(ball[i].yv >= 0) {
                g = p.y*WORLD_STEP_Y-BALL_SIZE/2 - 10;
            }
            else {
                g = (p.y+1)*WORLD_STEP_Y-BALL_SIZE/2;
            }
            
            ball[i].y = g;
            
            // // var f = g-ball[i].y;
            // // var ct = f + COLLISION_DAMP*(ball[i].yv-f);
            // // var cf = ct - f;
            
            // // ball[i].y = g - cf;
            // // ball[i].yv *= -COLLISION_DAMP;
            
            // ball[i].y = g;
            
            // // ball[i].y -= ball[i].yv;
            // // ball[i].yv *= -1;
        }
        
        
        ball[i].life++;
        
        if(ball[i].life > BALL_LIFE || ball[i].x > 400 || ball[i].y > 400 || 
        ball[i].x+BALL_SIZE < 0) {
            ball.splice(i, 1);
            i--;
        }
    }
};


var drawBalls = function() {
    for(var i = 0; i < ball.length; i++) {
        strokeWeight(1);
        stroke(97, 0, 0);
        fill(150, 0, 0);
        ellipse(ball[i].x, ball[i].y, BALL_SIZE, BALL_SIZE);
    }
};

var pad = function(num, pad) {
    num = num+"";
    for(var i = 0; i < pad-num.length; i++) {
        num = "0" + num;
    }
    return num;
};


var writeOut = function() {
    var out = "";
    out = out + pad(WORLD_WIDTH, 3) + pad(WORLD_HEIGHT, 3) + pad(BALL_SIZE, 3);
    for(var i = 0; i < WORLD_WIDTH; i++) {
        for(var k = 0; k < WORLD_HEIGHT; k++) {
            var g = grid[i][k];
            out = out + pad(g.type, 2) + g.dir + (g.water ? "1" : "0");
        }
    }
    return out;
};



keyPressed = function() {
    if(keyCode === 87) {
        println(writeOut());
    }
};

writeIn("0160160100100010001000100010001000100010001000100010001000100010001000100010000000230000000000000000002000100010001000100010001000100010001000000021000000000021002200000010000000000000000000200010001000100000002300000000001000100000001000220000000000000000002000100010000000210000000000100010000000200010002200000000000000000010001000000023000000000010001000220000000000200000000000000000001000100000002100000000001000100010000000000000000000210000000000100010000000230000000000100020001000000000000000210023000000000010001000000021000000000010000000100000000000210023000000000000001000100000002300000000001000000010000000210023000000000000000000100010000000210000000000100000001000100023000000000000000000000010001000000023000000000010000000100000000000200000002000000000001000100000002100000021001000000010000000000000000000000000000000100010000000230000001000230000001000000021000000210000002100000010001000000021002100100000002100100000001000100010001000100000001000100010001000100010001000100010001000100010001000100010001000100");


draw = function() {
    background(216, 220, 232);
    input();
    drawGrid();
    drawUI();
    updateBalls();
    drawBalls();
};
