var gridw = 30;
var gridh = 30;
var range = 120;
var intensity = 64;
var rise = 24;
var dip = 40;

var sw = 400 / gridw;
var sh = 400 / gridh;

var render = function() {
    for(var i = 0; i < gridh; i++) {
        for(var k = 0; k < gridw; k++) {
            var dis = max(range-dist(mouseX, mouseY, k*sw, i*sh), -dip);
            dis *= intensity/range;
            dis = pow(dis, 2)*(1/rise);
            
            noStroke();
            fill(255/gridh*i + dis*2, 255/gridw*k+dis*2, 151+dis*2);
            rect(k*sw, i*sh-dis+dip/2, sw + 1+dis/8, sh + 1+dis/8);
        }
    }
};



draw = function() {
    background(255, 255, 255);
    
    render();
};