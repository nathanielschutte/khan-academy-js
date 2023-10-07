// ==== Change ====
var def_col = {
    r: 130,
    g: 78,
    b: 255
};
var colorRange = 18;

var floatRange = 30;
var floatSpeed = 2.06;

// ================












var p = [];

var spawnRandom = function(n) {
    for(var i = 0; i < n; i++) {
        var col = color(random(def_col.r-colorRange, def_col.r+colorRange), random(def_col.g-colorRange, def_col.g+colorRange), random(def_col.b-colorRange, def_col.b+colorRange), random(65, 120));
        var c = {x: random(0, 400), y: random(0, 800), yv: random(0.02, 0.15), size: random(35, 75), color: col};
        p.push(c);
    }
};


var updateCircles = function() {
    for(var i = 0; i < p.length; i++) {
        p[i].y -= p[i].yv*(p[i].size/20);
        if(p[i].y < -p[i].size) {
            p[i].y = 400+p[i].size/2;
        }
    }
};


var drawCircles = function() {
    noStroke();
    for(var i = 0; i < p.length; i++) {
        fill(p[i].color);
        ellipse(p[i].x+sin(p[i].y*floatSpeed)*floatRange, p[i].y, p[i].size, p[i].size);
    }
};


frameRate(60);
spawnRandom(18);

draw = function() {
    background(def_col.r+130, def_col.g+130, def_col.b+130);
    
    updateCircles();
    drawCircles();
    
    fill(255-def_col.r, 255-def_col.b, 255-def_col.g);
    textAlign(CENTER, CENTER);
    text("Hit 'restart' to get color back!", 200, 10);
};
