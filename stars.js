var START_Z = 49;
var COUNT = 100;
var SPEED = 0.276;
var LENGTH = 0.5;
var THICKNESS = 2;
var SIZE = 1500;
var POV = 0.4;
var ZOOM = 0;
var FADE = 5;
var GLOW_R = 4;
var GLOW_S = 4;

var field = [];

var newOne = function(n) {
    var k = n ? START_Z : random(0, START_Z);
    return {x: random(0-SIZE+400, SIZE), y: random(0-SIZE+400, SIZE), z: k, c: random(20, 30)};
};

var pos = function(x, y, z) {
    if(z === 0) {z = 0.01;}
    z += ZOOM;
    return {x: (x-200)/(z*POV)+200, y: (y-200)/(z*POV)+200};
};

for(var i = 0; i < COUNT; i++) {
    field.push(newOne(false));
}

var update = function() {
    for(var i = 0; i < COUNT; i++) {
        field[i].z -= SPEED;
        var p = pos(field[i].x, field[i].y, field[i].z);
        if(p.x < 0 || p.x > 400 || p.y < 0 || p.y > 400) {
            var n = newOne(true);
            field[i].x = n.x;
            field[i].y = n.y;
            field[i].z = n.z;
        }
    }
};

var draw = function() {
    update();
    colorMode(RGB);
    background(0, 0, 0);
    for(var i = 0; i < COUNT; i++) {
        colorMode(HSB);
        var p = pos(field[i].x, field[i].y, field[i].z);
        var p1 = pos(field[i].x, field[i].y, field[i].z - LENGTH);
        for(var k = GLOW_R; k >= 0; k--) {
            strokeWeight(THICKNESS+k*GLOW_S);
            stroke(field[i].c, k*150, 255, (255-field[i].z*FADE-k*(255/(GLOW_R+1))));
            line(p.x, p.y, p1.x, p1.y);
        }
    }
};
