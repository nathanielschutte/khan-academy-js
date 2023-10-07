var rec = [];
var tHeight = 18;
var tWidth = 110;
var x, y;
var xOff = 0
;

var startX = 5;
var startY = 13;

mousePressed = function() {
    if(rec.length > 0) {
        println(rec);
    }
};

keyPressed = function() {
	rec.push(keyCode);
	
	if(x + xOff > 400) {
            xOff -= 80 + tWidth;
		}
};

draw = function() {
	background(0, 0, 0);
	stroke(255, 255, 255);
	x = startX;
	y = startY;
	
	for(var k = 0; k < rec.length; k++) {
		text("Letter " + (k + 1) + ":  " + rec[k], x + xOff, y);
		if(y > 400 - tHeight - (tHeight / 2)) {
            y = startY;
            x += tWidth;
		}
		else {
            y += tHeight;
		}
	}
};