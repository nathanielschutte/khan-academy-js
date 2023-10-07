var splatDelay = 4;
var lastSplat = -1;
var t = 0;

var splat = function(x, y) {
    var r = random(15, 30);
    var rr = random(0, 255);
    var gg = random(0, 255);
    var bb = random(0, 255);
    var c = (rr, gg, bb);
    fill(c);
    noStroke();
    
    ellipse(x, y, r, r);
    
    var iter = floor(random(16, 38));
    for(var i = 0; i < iter; i++) {
        var dir = (i*(360/iter))+random(-20.001, 20);
        var iter2 = floor(random(10, 32));
        var base = random(10, 18);
        for(var k = 0; k < iter2; k++) {
            var th = k/(iter2/32);
            stroke(rr+th, gg+th, bb+th, 100-th/2);
            strokeWeight(max((sin(k*random(32, 79))*random(39, 75))/12+base-k/(iter2/15), 2));
            line(x+(max(k*4-1,0)*sin(dir)),y+(max(k*4-1,0)*cos(dir)),x+(max(k*4,0)*sin(dir)),y+(max(k*4,0)*cos(dir)));
            dir += sin(k*76)*random(0.001, 1.5);
        }
    }
};

frameRate(30);
draw = function() {
    if(mouseIsPressed && t - lastSplat > splatDelay) {
        splat(mouseX, mouseY);
        lastSplat = t;
    }
    
    t++;
};
