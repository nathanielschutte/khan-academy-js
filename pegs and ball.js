var pegSize = 42;
var pegColor = color(35, 111, 130);
var pegAnimSpeed = 5;

var ballColor = color(194, 15, 15);
var grav = 0.1;

var placeDelay = 30;
var lastPlace = 0;

var ball = {
    x: 200,
    y: 80,
    dir: 180,
    mag: 6,
    s: 20,
    c: ballColor,
    moving: false
};

var pegs = {
    x: [182, 73, 300],
    y: [200, 343, 240],
    s: [pegSize, pegSize, pegSize],
    c: [pegColor, pegColor, pegColor],
    anim: [pegSize, pegSize, pegSize]
};

var keys = [];

keyPressed = function() {
    keys[keyCode] = true;
};

keyReleased = function() {
    keys[keyCode] = false;
};

var lastPress = lastPress;
var control = function() {
    if(mouseIsPressed) {
        if(lastPress) {
            pegs.x.push(mouseX);
            pegs.y.push(mouseY);
            pegs.s.push(0);
            pegs.c.push(pegColor);
            pegs.anim.push(pegSize);
        }
        if(frameCount - lastPlace > placeDelay) {
            lastPlace = frameCount;
            lastPress = true;
        }
        else {
            lastPress = false;
        }
    }
    else {
        lastPress = true;
    }
    
    if(keys[32] === true) {
        ball.x = mouseX;
        ball.y = mouseY;
        ball.dir = 180;
        ball.mag = 6;
        ball.moving = true;
    }
    else {
        ball.moving = false;
    }
};


var apply = function(a, b) {
    ball.x += b * sin(a);
    ball.y -= b * cos(a);
};


var update = function() {
    for(var i = 0; i < pegs.x.length; i++) {
        if(abs(pegs.anim[i] - pegs.s[i]) > 0.1) {
            pegs.s[i] += (pegs.anim[i] - pegs.s[i]) / pegAnimSpeed;
        }
    }
    
    if(!ball.moving) {
        for(var i = 0; i < pegs.x.length; i++) {
            if(dist(ball.x, ball.y, pegs.x[i], pegs.y[i]) < pegs.s[i]/2 + ball.s/2) {
                var dd = atan2(pegs.x[i] - ball.x, pegs.y[i] - ball.y);
                ball.dir = -ball.dir + 2*dd;
            }
        }
        
        if(ball.x+ball.s/2 > 400 || ball.x-ball.s/2 < 0) {
            ball.dir *= -1;
        }
        if(ball.y+ball.s/2 > 400 || ball.y - ball.s/2 < 0) {
            ball.dir = 180-ball.dir;
        }
        apply(ball.dir, ball.mag);
    }
}; 


var render = function() {
    for(var i = 0; i < pegs.x.length; i++) {
        fill(pegs.c[i]);
        noStroke();
        ellipse(pegs.x[i], pegs.y[i], pegs.s[i], pegs.s[i]);
        stroke(255, 0, 0);
        point(pegs.x[i], pegs.y[i]);
    }
    
    fill(ball.c);
    ellipse(ball.x, ball.y, ball.s, ball.s);
};



draw = function() {
    background(222, 222, 222);
    
    control();
    update();
    render();
};