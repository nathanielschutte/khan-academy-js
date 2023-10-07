var XPOS = 40;
var YPOS = 186;
var WIDTH = 320;
var HEIGHT = 174;
var SPACE_BAR = 0.13;
var THICKNESS = 1;

var timer;
var delay_card;
var delay_reveal;

var Card = {
    note: 0,
    octave: 0
};

var Card = function(n, o) {
    this.note = n;
    this.octave = o;
};

var current_card = new Card();

var drawSheet = function(x, y, w, h, s, t) {
    strokeWeight(t);
    stroke(0, 0, 0);
    for(var k = 0; k < 5; k++) {
        var t = y+k*s*(h/2);
        line(x, t, x+w, t);
    }
    for(var k = 0; k < 5; k++) {
        var t = y+h-k*s*(h/2);
        line(x, t, x+w, t);
    }
    line(x, y, x, y+h-1);
    line(x+w+1, y, x+w+1, y+h-1);
};


var drawStandardSheet = function(x, y) {
    drawSheet(XPOS, YPOS, WIDTH, HEIGHT, SPACE_BAR, THICKNESS);
};

var setCard = function(c) {
    
};


var refresh = function() {
    background(255, 255, 255);
    drawStandardSheet();
};


setCard(48);
