var t; // frame counter, starts at 0

var player = {
    x: 0, // camera x
    y: 0, // camera y
    xv: 0, // x velocity
    yv: 0, // y velocity
    w: 8, // unused
    h: 20, // unused
    accel: 2.5, // acceleration of camera
    damp: 0.8 // dampening of camera velocities
};

// block that mouse is touching
var targetx, targety;

// world data
var world = []; // main world array
var regenDelay = 20; // min frames between regenerations
var lastRegen = 0; // initialize last regen time at 0 frames

// generation constants
var WIDTH = 200; // width of world
var HEIGHT = 80; // height of world
var START_HEIGHT = 32; // initial height of land (far left side)
var MAX_HEIGHT = 50; // max land height
var MIN_HEIGHT = 20; // min land height
var WATER_LEVEL = 28; // water level
var SLOPE = 2; // slope of land

var DIRT_LEVEL = 4; // level of dirt layer

// spawn layers for different blocks
var level = {
    MAX_BED: 4,
    MIN_BED: 2,
    
    MAX_COAL: 40,
    MIN_COAL: 20,
    
    MAX_IRON: 32,
    MIN_IRON: 6,
    
    MAX_DIAMOND: 12,
    MIN_DIAMOND: 3
};

// rates of generation
var TREE_RATE = 89; // out of 100, 78-96 is preferrable
var COAL_RATE = 900; // out of 1000, 700-900 is preferrable
var IRON_RATE = 850; // out of 1000, 700-850 is preferrable
var DIAMOND_RATE = 600; // out of 1000, 400-700 is preferrable

// tree parameters
var TREE_MIN_SPACE = 1; // minimum number of blocks between trees
var TREE_HEIGHT = 6; // height of tree (will be slightly random)

// block constants
var B_SIZE = 10; // size of each block (in pixels)
var ORE_COUNT = 3; // number of different ores

var AIR = color(175, 224, 230);
var BEDROCK = color(41, 41, 41);
var DIRT = color(117, 79, 38);
var GRASS = color(42, 138, 23);
var STONE = color(70, 71, 74);
var WATER = color(33, 106, 184);
var WOOD = color(64, 28, 4);
var LEAVES = color(113, 150, 58);
var COAL = color(10, 10, 10);
var IRON = color(250, 186, 108);
var DIAMOND = color(81, 188, 224);
var SAND = color(247, 222, 108);
var CAVE = color(31, 31, 31);

// block colors
var B = [AIR, BEDROCK, DIRT, GRASS, STONE, WATER, WOOD, LEAVES, COAL, IRON, DIAMOND, SAND, CAVE];


var keys = [];
keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};



/** Initialize world list */

var startWorld = function() {
    for(var i = 0; i < WIDTH; i++) {
        world[i] = [];
        for(var k = 0; k < HEIGHT; k++) {
            world[i][k] = 0;
        }
    }
};


/** Add a tree */

var tree = function(x, y) {
    var h = floor(random(TREE_HEIGHT-1, TREE_HEIGHT+1));
    for(var i = 0; i < h; i++) {
        world[x][y+i] = 6;
    }
    
    // top leaf block
    world[x][y+h] = 7;
    world[x-1][y+h] = 7;
    world[x+1][y+h] = 7;
    
    // side block
    world[x+1][y+h-1] = 7;
    world[x-1][y+h-1] = 7;
    world[x+1][y+h-2] = 7;
    world[x-1][y+h-2] = 7;
    
    world[x+2][y+h-1] = 7;
    world[x-2][y+h-1] = 7;
    world[x+2][y+h-2] = 7;
    world[x-2][y+h-2] = 7;
    
    world[x+1][y+h-3] = 7;
    world[x-1][y+h-3] = 7;
    
    // special leaf formations
    if(floor(random(0, 2)) === 0) {
        world[x][y+h+1] = 7;
        if(floor(random(0, 2)) === 0) {
            world[x][y+h-1] = 7;
        }
    }
};


/** Set ore chunks of type n */

var chunk = function(x, y, n, t) {
    if(t === 0) { // big chunk
        world[x][y] = n;
        world[x+1][y] = n;
        world[x+1][y-1] = n;
        world[x][y-1] = n;
        world[x-1][y] = n;
        world[x-1][y-1] = n;
        if(floor(random(0, 2)) === 0) {
            world[x+2][y] = n;
        }
        if(floor(random(0, 2)) === 0) {
            world[x+1][y-2] = n;
        }
        if(floor(random(0, 2)) === 0) {
            world[x-2][y-1] = n;
        }
        if(floor(random(0, 2)) === 0) {
            world[x-1][y+2] = n;
        }
    }
    else if(t === 1) { // small chunk
        world[x][y] = n;
        if(floor(random(0, 2)) === 0) {
            world[x+1][y] = n;
        }
        if(floor(random(0, 2)) === 0) {
            world[x+1][y-1] = n;
        }
        if(floor(random(0, 2)) === 0) {
            world[x][y-1] = n;
        }
    }
};


/** Add an ore (sort ores into proper chunk types) */

var ore = function(x, y, s) {
    
    // coal (big chunk)
    if(s === 8) {
        chunk(x, y, s, 0);
    }
    
    // iron and diamond (small chunk)
    if(s === 9 || s === 10) {
        chunk(x, y, s, 1);
    }
};


/** Generate base land */

var floorGen = function() {
    var h = START_HEIGHT;
    var start = h;
    var lastTree = 0;
    
    var trees = [];
    var ores = [];
    
    for(var i = 0; i < WIDTH; i++) {
        var bed = floor(random(level.MIN_BED, level.MAX_BED));
        var dirt = floor(random(DIRT_LEVEL, DIRT_LEVEL+1));
        for(var k = 0; k < HEIGHT; k++) {
            
            // bedrock level
            if(k < bed) {
                world[i][k] = 1;
            }
            
            // in the stone
            // coal gen
            else if(k < h-dirt) {
                if(i < WIDTH-2 && i > 2 && k >= level.MIN_COAL && k <= level.MAX_COAL && floor(random(0, 1000-COAL_RATE)) === 0) {
                    var or = {x: i, y: k, t: 8};
                    ores[ores.length] = or;
                }
                
                // iron gen
                else if(i < WIDTH-2 && i > 2 && k >= level.MIN_IRON && k <= level.MAX_IRON && floor(random(0, 1000-IRON_RATE)) === 0) {
                    var or = {x: i, y: k, t: 9};
                    ores[ores.length] = or;
                }
                
                // diamond gen
                else if(i < WIDTH-2 && i > 2 && k >= level.MIN_DIAMOND && k <= level.MAX_DIAMOND && floor(random(0, 1000-DIAMOND_RATE)) === 0) {
                    var or = {x: i, y: k, t: 10};
                    ores[ores.length] = or;
                }
                
                // just stone
                else {
                    world[i][k] = 4;
                }
            }
            
            // dirt level
            else if(k < h-1) {
                world[i][k] = 2;
            }
            
            // grass level
            else if(k < h) {
                if(floor(random(0, 100-TREE_RATE)) === 0 && i < WIDTH-3 && i > 3 && (i - lastTree) > TREE_MIN_SPACE && k < HEIGHT-TREE_HEIGHT-2 && k >= WATER_LEVEL) {
                    var tr = {x: i, y: k};
                    trees[trees.length] = tr; // add tree to list
                    lastTree = i;
                }
                else {
                    if(k < WATER_LEVEL) {
                        world[i][k] = 11;
                    }
                    else {
                        world[i][k] = 3;   
                    }
                }
            }
            
            // above ground
            else {
                if(k <= WATER_LEVEL) {
                    world[i][k] = 5;
                }
            }
        }
        
        // find new slope
        var slope = random(-SLOPE, SLOPE);
        if(h-start > SLOPE*3) {
            slope -= SLOPE/2;
        }
        else if(h-start < -SLOPE*3) {
            slope += SLOPE/2;
        }
        h += slope;
        if(h > MAX_HEIGHT) {
            h = MAX_HEIGHT;
        }
        else if (h < MIN_HEIGHT) {
            h = MIN_HEIGHT;
        }
    }
    
    // generate trees
    for(var i = 0; i < trees.length; i++) {
        tree(trees[i].x, trees[i].y);
    }
    
    // generate ores
    for(var i = 0; i < ores.length; i++) {
        ore(ores[i].x, ores[i].y, ores[i].t);
    }
};


/** Regenerate everything */

var regen = function() {
    startWorld();
    floorGen();
};


/** Respawn player */

var respawn = function() {
    player.x = 0;
    player.y = 400 - START_HEIGHT*B_SIZE;
    player.xv = 0;
    player.yv = 0;
};


/** Draw block */

var block = function(i, k, size) {
    var n = world[i+floor(player.x/size)][k+floor(player.y/size)];
    var c;
    var style = false;
    var sc;
    
    if(n < 8 || n > 10) {
        c = B[n];   
    }
    else {
        c = B[4];
        sc = B[n];
        style = true;
    }
    
    fill(c);
    noStroke();
            
    var x = i*size + (-player.x%size);
    var y = -k*size + (player.y%size) + (400-size);
    rect(x, y, size, size);
    
    if(style) {
        if(n <= 7 + ORE_COUNT) {
            fill(sc);
            rect(x+size/6, y+size/6, size/3, size/8);
            rect(x+size/1.5, y+size/2, size/3, size/8);
            rect(x+size/3, y+size/1.5, size/3, size/8);
        }
    }
};


/** Render the tiles */

var renderTiles = function() {
    var size = B_SIZE;
    for(var i = 0; i < min(floor(400/size)+2, WIDTH); i++) {
        for(var k = 0; k < min(floor(400/size)+2, HEIGHT); k++) {
            block(i, k, size);
        }
    }
};


/** Render all sky components */

var renderSky = function() {
    // sun
    // clouds
    // stars
};


/** Get control */

var control = function() {
    if(keys[68]) {
        player.xv += player.accel;
    }
    if(keys[65]) {
        player.xv -= player.accel;
    }
    if(keys[87]) {
        player.yv -= player.accel;
    }
    if(keys[83]) {
        player.yv += player.accel;
    }
    player.xv *= player.damp;
    player.yv *= player.damp;
    
    player.x += player.xv;
    player.y -= player.yv;
    
    player.x = min(WIDTH*B_SIZE-400-B_SIZE-1, max(0, player.x));
    player.y = min(HEIGHT*B_SIZE-400-B_SIZE+1, max(0, player.y));
    
    if(keys[73]) {
        B_SIZE = min(60, B_SIZE+1);
    }
    if(keys[79]) {
        B_SIZE = max(5, B_SIZE-1);
    }
    
    B_SIZE = floor(B_SIZE);
    
    if(keys[82] && t - lastRegen > regenDelay) {
        regen();
        lastRegen = t;
    }
};


/** Fancy text */

var bettahText = function(t, x, y) {
    fill(77, 77, 77);
    text(t, x-1, y+1);
    fill(255, 255, 255);
    text(t, x, y);
};


frameRate(60);
t = 0;

regen();
respawn();

draw = function() {
    background(255, 255, 255);
    
    // main methods
    control();
    renderSky();
    renderTiles();
    
    // instruction panel
    fill(0, 0, 0, 80);
    rect(4, 2, 226, 34);
    
    // instruction text
    fill(255, 255, 255);
    bettahText("- Use the WASD keys to pan around", 8, 16);
    bettahText("- Press the 'R' key to generate new world", 8, 30);
    
    // increase frame count
    t++;
};
