/**
 * My first attempt at a platform game with different states!  There are only a few levels right now, but I'm making more.  It's pretty easy to make your own level, if you add an item to the array of levels the game logic will automatically configure to the new level count.  There is a variale named 'def' just before the 'levels' array, and if you copy and paste it into the 'levels' array you can work off of a template of sorts!
 * 
 * Block type numbers (used when creating levels):
 * 0 = air
 * 1 = platform
 * 2 = red death stuff
 * 3 = green goal
 * 
 * You can add block type by using the number 4 or above while creating a level, but you'll then need to change the 'drawLevel' function to use a different color for the new block.  Also, in the 'updatePlayer' function, logic can be extended to make things happen with your block!
 * 
 * Enjoy!


####################################


*/

var select = null;
var t = 0;
var current;
var collision;
var blockType = [];
var maxlives = 3;
var restarts = 0;

var spawnX = 40;
var spawnY = 340;

var game = {
    state: 0,
    time: 0,
    score: 0,
    level: 1,
    inGame: false
};

var player = {
    x: spawnX,
    y: spawnY,
    xv: 0,
    yv: 0,
    width: 15,
    height: 15,
    lives: maxlives,
    accel: 0.45,
    jump: 7,
    walljump: 12
};

var world = {
    gravity: -0.35,
    airFriction: 0.82,
    surfaceFriction: 0.97
};

var def = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];

var levels = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
          
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,],
          
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1,],
          
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 3, 1,
          1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1,],
          
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]];

var b = {
    x: [200, 200, 200, 200, 200, 200, 200, 200],
    y: [183, 248, 300, 375, 375, 365, 365, 325],
    w: [166, 146, 146, 73, 73, 135, 135, 135],
    h: [66, 40, 40, 31, 31, 32, 32, 32],
    text: ["Start", "Intructions", "Credits", "Back", "Back", "Return to Menu", "Return to Menu", "Continue"],
    size: [46, 20, 24, 20, 20, 17, 17, 17],
    tx: [-47, -47, -38, -22, -22, -59, -59, -36],
    ty: [17, 7, 9, 8, 8, 5, 5, 6],
    s: [0, 0, 0, 0, 0, 0, 0, 0],
    st: [0, 0, 0, 1, 2, 4, 5, 5],
    a: [3, 1, 2, 0, 0, 0, 0, 3],
    count: 8
};




var keys = [];

keyPressed = function() {
    keys[keyCode] = true;
};

keyReleased = function() {
    keys[keyCode] = false;
};




var contains = function(l, e) {
    var r = false;
    for(var i = 0; i < l.length; i++) {
        if(l[i] === e) {
            r = true;
        }
    }
    return r;
};





var doButtons = function() {
    if(! mouseIsPressed) {
        for(var i = 0; i < b.count; i++) {
            if(b.s[i] === 2) {
                if(mouseX < b.x[i] + b.w[i] / 2 && mouseX > b.x[i] - b.w[i] / 2 && mouseY < b.y[i] + b.h[i] / 2 && mouseY > b.y[i] - b.h[i] / 2) {
                    game.state = b.a[i];
                }
            }
            b.s[i] = 0;
        }
        select = null;
        for(var i = 0; i < b.count; i++) {
            if(mouseX < b.x[i] + b.w[i] / 2 && mouseX > b.x[i] - b.w[i] / 2 && mouseY < b.y[i] + b.h[i] / 2 && mouseY > b.y[i] - b.h[i] / 2 && b.st[i] === game.state) {
                b.s[i] = 1;
                select = i;
            }
        }
    }
    else {
        if(select !== null) {
            b.s[select] = 2;
        }
    }
    
    for(var i = 0; i < b.count; i++) {
        if(b.st[i] === game.state) {
            stroke(117, 75, 11);
            strokeWeight(4);
            
            if(b.s[i] === 0) {
                fill(173, 118, 59);
            }
            else if(b.s[i] === 1) {
                fill(209, 151, 81);
            }
            else {
                fill(166, 107, 40);
            }
            
            rect(b.x[i] - b.w[i] / 2, b.y[i] - b.h[i] / 2, b.w[i], b.h[i]);
            
            fill(133, 52, 8);
            textSize(b.size[i]);
            text(b.text[i], b.x[i] + b.tx[i], b.y[i] + b.ty[i]);
        }
    }
};




var drawLevel = function(l) {
    for(var i = 0; i < 400; i++) {
        strokeWeight(1);
        if(l[i] === 1) {
            stroke(143, 95, 23);
            fill(122, 81, 21);
        }
        else if(l[i] === 2) {
            stroke(143, 24, 24);
            fill(179, 45, 22);
        }
        else if(l[i] === 3) {
            stroke(30, 128, 23);
            fill(78, 209, 71);
        }
        if(l[i] !== 0) {
            rect(i * 20 % 400, floor(i / 20) * 20, 19, 19);
        }
    }
};


var respawn = function() {
    player.x = spawnX;
    player.y = spawnY;
    player.xv = 0;
    player.yv = 0;
};




var drawWorld = function() {
    drawLevel(current);
};




var win = function() {
    respawn();
    game.state = 4;
    game.level = 1;
};

var lose = function() {
    respawn();
    game.state = 5;
    player.lives = maxlives;
    restarts++;
};




var collide = function(x, y, w, h) {
    var r = false;
    blockType = [];
    for(var i = 0; i < 400; i++) {
        if(x + w / 2 > i * 20 % 400 && x - w / 2 < i * 20 % 400 + 20 && y + h / 2 > floor(i / 20) * 20 && y - h / 2 < floor(i / 20) * 20 + 20) {
            if(current[i] === 1) {
                r = true;
            }
            else {
                if(! contains(blockType, current[i])) {
                    blockType.push(current[i]);
                }
            }
        }
    }
    return r;
};




var updatePlayer = function() {
    player.yv += world.gravity;
    collision = false;
    
    player.x += player.xv;
    if(collide(player.x, player.y, player.width, player.height)) {
        collision = true;
        player.x -= player.xv;
        if(keys[38] && player.xv !== 0) {
            player.xv = (abs(player.xv) / player.xv) * -player.walljump;
            player.yv = player.jump;
        }
        else {
            player.xv = 0;
        }
        player.yv *= world.surfaceFriction;
    }
    
    player.y -= player.yv;
    if(collide(player.x, player.y, player.width, player.height)) {
        collision = true;
        player.y += player.yv;
        if(player.yv > 0) {
            player.yv *= -0.15;
        }
        else {
            player.yv = 0;
        }
        player.xv *= world.surfaceFriction;
        if(player.yv === 0 && keys[38]) {
            player.yv = player.jump;
        }
    }
    player.xv *= world.airFriction;
    
    if(collide) {
        if(contains(blockType, 2)) {
            if(player.lives > 1) {
                respawn();
                player.lives--;
            }
            else {
                lose();
            }
        }
        else if(contains(blockType, 3)) {
            if(game.level < levels.length) {
                respawn();
                game.level++;
            }
            else {
                win();
            }
        }
    }
};




var drawPlayer = function() {
    stroke(105, 105, 105);
    strokeWeight(1);
    fill(18, 18, 18);
    
    rect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
};




var updateGame = function() {
    current = levels[game.level - 1];
    
    drawWorld();
    updatePlayer();
    drawPlayer();
    
    if(keys[37]) {
        player.xv -= player.accel;
    }
    if(keys[39]) {
        player.xv += player.accel;
    }
    
    stroke(153, 97, 0);
    strokeWeight(3);
    fill(227, 175, 70);
    rect(25, 25, 349, 24);
    
    fill(196, 0, 134);
    textSize(16);
    text("Lives: " + player.lives, 31, 44);
    fill(191, 25, 25);
    text("Restarts: " + restarts, 105, 44);
    fill(0, 0, 0);
    text("Level: " + game.level, 314, 44);
};




var updateMenu = function() {
    if(game.state === 0) {
        stroke(138, 92, 36);
        strokeWeight(6);
        fill(173, 126, 56);
        rect(50, 38 + sin(t * 6) * 12, 300, 69);
        
        fill(148, 102, 46);
        rect(107, -68 + sin(t * 6) * 12, 3, 100);
        rect(289, -68 + sin(t * 6) * 12, 3, 100);
        
        textSize(40);
        fill(138, 102, 30);
        text("Platform Game", 70, 90 + sin(t * 6) * 12);
        fill(92, 57, 4);
        text("Platform Game", 64, 85 + sin(t * 6) * 12);
        
        player.lives = maxlives;
        restarts = 0;
        game.level = 1;
    }
    else if(game.state === 1) {
        stroke(133, 28, 28);
        strokeWeight(6);
        fill(230, 156, 156);
        rect(50, 38, 300, 61);
        
        textSize(40);
        fill(217, 108, 108);
        text("Instructions", 102, 85);
        fill(133, 17, 17);
        text("Instructions", 98, 83);
        
        textSize(16);
        text("- Use the arrow keys to move left and right.\n- Use the up arrow" +
                " to jump.\n- You can wall jump!", 45, 140);
        text("=  Bad.  Do not touch this!", 96, 216);
        text("=  Good.  This is your goal!", 96, 252);
        
        noStroke();
        fill(199, 0, 0);
        rect(57, 194, 30, 30);
        fill(0, 199, 7);
        rect(57, 232, 30, 30);
    }
    else if(game.state === 2) {
        stroke(133, 28, 28);
        strokeWeight(6);
        fill(230, 156, 156);
        rect(50, 38, 300, 61);
        
        textSize(40);
        fill(217, 108, 108);
        text("Credits", 140, 85);
        fill(133, 17, 17);
        text("Credits", 136, 83);
    }
};




var winScreen = function() {
    textSize(70);
    fill(156, 17, 96);
    text("You Won!", 50, 176);
    
    textSize(18);
    text("You had to restart " + restarts + " times.", 61, 211);
    text("You had " + player.lives + " lives left.", 61, 234);
    
    textSize(22);
    fill(128, 9, 49);
    text("Thanks for playing!", 103, 278);
};




var loseScreen = function() {
    textSize(70);
    fill(156, 17, 96);
    text("You Lost!", 50, 176);
    
    textSize(18);
    text("But because I'm nice, you can\n" +
            "        continue on anyway!", 74, 211);
            
    text("You have currently lost " + restarts + " times.", 73, 280);
};




draw = function() {
    if(game.state < 3) {
        background(22, 171, 240);
        updateMenu();
    }
    else if(game.state === 3){
        background(193, 234, 247);
        updateGame();
    }
    else if(game.state === 4) {
        background(36, 164, 224);
        winScreen();
    }
    else if(game.state === 5) {
        background(36, 164, 224);
        loseScreen();
    }
    
    doButtons();
    t += 0.5;
    
    frameRate(60);
};