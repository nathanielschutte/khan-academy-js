var p = [];

var generate = function(count) {
    for(var i = 0; i < count; i++) {
        p.push({x: random(10, 390), y: random(10, 390)});
    }
};

generate(50);

draw = function() {
    stroke(0, 0, 0);
    strokeWeight(3);
    for(var i = 0; i < p.length; i++) {
        point(p[i].x, p[i].y);
    }
};