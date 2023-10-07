var x, y, xv, yv;
var bounceHeight, ballSize, ballColor, friction, gravity, floorHeight, bounce, timer;


/** CHANGE THESE PARAMATERS */
bounceHeight = 18;
ballSize = 64;
ballColor = color(41, 148, 194);
floorHeight = 334;
/** ======================= */



friction = 1.00;
gravity = 1;



/** Initialize ball position */

var init = function(){
    x = random(100) + 150;
    y = 200;
    xv = 2;
    yv = -2;
};

/** Update ball physics */

var updatePhysics = function(){
    
    // natural forces
    yv -= gravity;
    xv *= friction;
    
    // collision with floor
    if(y + (ballSize / 2) + (ballSize * 0.2) > floorHeight){
        bounce = 1;
        timer = 5;
        yv = bounceHeight;
    }
    else{
        if (timer > 0){
            timer -= 1;
            bounce = timer;
        }
        else{
            bounce = 0;
        }
    }
    
    // collision with edges
    if(x - (ballSize / 2) < 0 || x + (ballSize / 2) > 400){
        xv *= -1;
    }
    
    // apply velocities to position
    x += xv;
    y -= yv;
};

/** Draws the floor rect based on floorHeight */

var drawFloor = function(){
    noStroke();
    fill(163, 190, 214);
    rect(0, floorHeight - 50, 400, 400 - floorHeight + 50);
};

/** Draws the ball to position and size */

var drawBall = function(){
    noStroke();
    fill(ballColor);
    
    if (bounce > 2){
        ellipse(x, y, ballSize * 1.2, ballSize * 0.8);
    }
    else if (bounce === 1){
        ellipse(x, y, ballSize * 0.8, ballSize * 1.2);
    }
    else{
        ellipse(x, y, ballSize, ballSize);
    }
};

/** Draws the shadow based on the ball's distance to the ground */

var drawShadow = function(){
    var shadowY = (floorHeight - y) / 6;
    
    noStroke();
    fill(90 + shadowY, 113 + shadowY, 133 + shadowY);
    ellipse(x, floorHeight, ballSize + shadowY, (ballSize + shadowY) / 4);
};

/** Everything function */

var t = 1;

var draw = function() {
    if(t < 2){
        init();
    }
     
    background(235, 244, 245);
    
    updatePhysics();
    drawFloor();
    drawShadow();
    drawBall();
    
    t++;
};