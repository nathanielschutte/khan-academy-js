var b_count = 4;
var b_spacing = 2;
var b_level = 3;
var b_height = 24;
var b_textSize = 16;

var style = 0;

var b = {
    x: [],
    y: [],
    w: [],
    h: [],
    s: [],
};

var t = 0;

var names = ["Apple", "Khan Academy", "Dots", "Radar"];
var dots = {
    x: [0,0,0,0,0,0,0,0],
    y: [0,0,0,0,0,0,0,0]
};

var updateButtons = function() {
    if(! mouseIsPressed) {
        for(var i = 0; i < b_count; i++) {
            if(mouseX > b.x[i] && mouseX < b.x[i] + b.w[i] && mouseY > b.y[i] && mouseY < b.y[i] + b.h[i]) {
                if(b.s[i] === 0 || b.s[i] > 2) {
                    if(b.s[i] > 3) {
                        b.s[i]--;
                    }
                    else if(b.s[i] === 3 || b.s[i] === 0) {
                        b.s[i] = 1;   
                    }
                }
                else if(b.s[i] === 2) {
                    b.s[i] = 4;
                }
            }
            else {
                b.s[i] = 0;
            }
        }
    }
    else {
        for(var i = 0; i < b_count; i++) {
            if(mouseIsPressed && b.s[i] === 1) {
                b.s[i] = 2;
            }
        }
    }
    for(var i = 0; i < b_count; i++) {
        if(b.s[i] > 2) {
            style = i;
        }
    }
};


var drawButtons = function() {
    for(var i = 0; i < b_count; i++) {
        noStroke();
        if(b.s[i] === 0 || b.s[i] > 2) {
            fill(73, 165, 227);  
        }
        else if(b.s[i] === 1) {
            fill(110, 188, 240);
        }
        else if(b.s[i] === 2) {
            fill(31, 129, 194);
        }
        
        var hh = 0;
        if(b.s[i] === 2) {
            hh += 1.5;
        }
        else if(b.s[i] === 1) {
            hh -= 1.5;
        }
        
        rect(b.x[i], b.y[i]+hh, b.w[i], b.h[i]-hh/2);
        
        var ww = b.x[i] + b.w[i]/2;
        if(i > 8) {
            ww -= b_textSize/3;
        }
        
        textSize(b_textSize);
        fill(0, 0, 0);
        text(i+1, ww-(b_textSize/4-1), b.y[i] + b.h[i]/2+(b_textSize/3)+1+hh);
        if(style === i) {
            fill(255, 255, 255);
        }
        else {
            fill(173, 225, 255);   
        }
        text(i+1, ww-(b_textSize/4), b.y[i] + b.h[i]/2+(b_textSize/3)+hh);
    }
};


var drawLoader = function(x, y) {
    noStroke();
    fill(66, 66, 66);
    rect(x-100, y-100, 202, 202);
    if(style === 0) {
        for(var i = 0; i < 14; i++) {
            colorMode(HSB);
            stroke(120, 0, max(137, i*20));
            strokeWeight(8);
            colorMode(RGB);
            
            var dir = -(i+floor(t/4))*(360/12);
            line(x+sin(dir)*36, y+cos(dir)*36, x+sin(dir)*72, y+cos(dir)*72);
        }
    }
    else if(style === 1) {
        noStroke();
        for(var i = 0; i < 8; i++) {
            var dir = -(i+floor(t/7))*(360/8);
            var xx = x+sin(dir)*55;
            var yy = y+cos(dir)*55;
            var nx = round(xx/52)*52;
            var ny = round(yy/52)*52;
            
            fill(max(150, i*10), max(150, i*30), max(150, i*40));
            
            rect(nx-32, ny-32, 50, 50);
        }
    }
    else if(style === 2) {
        noStroke();
        fill(255, 255, 255);
        var rad = 4;
        for(var i = 0; i < 8; i++) {
            var dir = ((sin((t+i*4.5)*1.8)+1)*180)-180;
            ellipse(x+sin(dir)*75, y+cos(dir)*65, rad*i/2+5, rad*i/2+5);
        }
    }
    else if(style === 3) {
        for(var i = 0; i < 180; i++) {
            colorMode(HSB);
            stroke((t*0.5)%255, (200-(i-t))%255, 240);
            strokeWeight(4);
            line(x, y, x+sin(i*2)*65, y+cos(i*2)*65);
            colorMode(RGB);
        }
    }
};


var setButtons = function(n, height) {
    var width = 400/n;
    for(var i = 0; i < n; i++) {
        b.x[i] = b_spacing/2 + (i*width);
        b.y[i] = b_level;
        b.w[i] = width - b_spacing;
        b.h[i] = height;
        b.s[i] = 0;
    }
};


setButtons(b_count, b_height);
frameRate(60);

draw = function() {
    background(255, 255, 255);
    noStroke();
    fill(214, 214, 214);
    rect(0, 0, 400, b_height+b_level*2);
    fill(145, 145, 145);
    rect(2, 2, 396, b_height+b_level*2-4);
    
    textSize(24);
    fill(0, 58, 102);
    text(names[style] + ":", 101, b_height+b_level*2+62);
    fill(0, 117, 219);
    text(names[style] + ":", 100, b_height+b_level*2+61);
    
    updateButtons();
    drawButtons();
    
    drawLoader(200, 200);
    
    t++;
};