var t = 0;

var speed = 14;
var floorHeight = 292;
var guyPosX = 200;
var guyPosY = floorHeight;
var guyThick = 4;
var guyTorso = 42;
var guyArm = 64;
var guyLeg = 62;
var guyHead = 45;

guyPosY -= guyLeg/sqrt(2);

var guy = {
    shoulder: 0,
    arm: {
        right: {
            upper: 0,
            lower: 0
        },
        left: {
            upper: 0,
            lower: 0
        }
    },
    leg: {
        right: {
            upper: 0,
            lower: 0
        },
        left: {
            upper: 0,
            lower: 0
        }
    },
};

var drawGuy = function() {
    stroke(0, 0, 0);
    strokeWeight(guyThick);
    
    var guyX = guyPosX;
    var guyY = guyPosY+cos(t*speed*2)*5;
    
    guy.shoulder = (sin(t*speed*2)-1)*2;
    
    guy.arm.left.upper = sin(t*speed)*20;
    guy.arm.right.upper = -sin(t*speed)*20;
    guy.arm.left.lower = 100+sin((t-0.5)*speed)*40;
    guy.arm.right.lower = 100-sin((t-0.5)*speed)*40;
    
    guy.leg.left.upper = sin(t*speed)*40;
    guy.leg.right.upper = -sin(t*speed)*40;
    guy.leg.left.lower = -30+sin((t-0.5)*speed)*60;
    guy.leg.right.lower = -30-sin((t-0.5)*speed)*60;
    
    var shoulderX = guyX-sin(guy.shoulder)*guyTorso;
    var shoulderY = guyY-cos(guy.shoulder)*guyTorso;
    
    line(guyX, guyY, shoulderX, shoulderY);
    
    var leftElbowX = shoulderX+sin(guy.arm.left.upper)*guyArm/2;
    var leftElbowY = shoulderY+cos(guy.arm.left.upper)*guyArm/2;
    
    var rightElbowX = shoulderX+sin(guy.arm.right.upper)*guyArm/2;
    var rightElbowY = shoulderY+cos(guy.arm.right.upper)*guyArm/2;
    
    line(shoulderX, shoulderY, leftElbowX, leftElbowY);
    line(shoulderX, shoulderY, rightElbowX, rightElbowY);
    
    line(leftElbowX, leftElbowY, leftElbowX+sin(guy.arm.left.lower)*guyArm/3, leftElbowY+cos(guy.arm.left.lower)*guyArm/3);
    line(rightElbowX, rightElbowY, rightElbowX+sin(guy.arm.right.lower)*guyArm/3, rightElbowY+cos(guy.arm.right.lower)*guyArm/3);
    
    var leftKneeX = guyX+sin(guy.leg.left.upper)*guyLeg/2;
    var leftKneeY = guyY+cos(guy.leg.left.upper)*guyLeg/2;
    
    var rightKneeX = guyX+sin(guy.leg.right.upper)*guyLeg/2;
    var rightKneeY = guyY+cos(guy.leg.right.upper)*guyLeg/2;
    
    line(guyX, guyY, leftKneeX, leftKneeY);
    line(guyX, guyY, rightKneeX, rightKneeY);
    
    line(leftKneeX, leftKneeY, leftKneeX+sin(guy.leg.left.lower)*guyLeg/3, leftKneeY+cos(guy.leg.left.lower)*guyLeg/3);
    line(rightKneeX, rightKneeY, rightKneeX+sin(guy.leg.right.lower)*guyLeg/3, rightKneeY+cos(guy.leg.right.lower)*guyLeg/3);
    
    
    
    fill(0, 0, 0);
    noStroke();
    ellipse(shoulderX, shoulderY-guyHead/2, guyHead, guyHead);
};


frameRate(30);
draw = function() {
    background(142, 194, 245);
    
    fill(18, 153, 14);
    noStroke();
    rect(0, floorHeight, 400, 400 - floorHeight);
    
    drawGuy();
    
    t++;
};
