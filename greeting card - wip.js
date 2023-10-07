// === Variable Initialization ===

// parameters for the rotation
var t = 0;
var speed = 1;
var rotWidth = 170;
var rotHeight = 18;
var wiggleSpeed = 2;
var animate = true;

// font for the text on the banner
var font = createFont("cursive", 27);

// parameters for the falling snow
var i = 0;
var snowAmount = 150;
var snowSize = 7;
var snowSpeed = 2.25;
var snowWiggleAmount = 20;

// parameters for the hanging christmas lights
var lightHang = 20;
var lightLength = 1.35;
var lightSpacing = 30;

// snow arrays and parameters - pretty inefficient, I know
var snowX = [];
var snowY = [];
var snowRand = [];
var snowOff = [];
for(var k = 0; k < snowAmount; k++){
    snowX.push(random(400));
    snowY.push(random(400) - 400);
    snowRand.push(random(360));
    snowOff.push(random(2) - 1);
}

// other parameters
var newRotX;
var newRotY;
var objectSize;
var shapeCount = 2;
var depth = [];


// === Drawing and Animation ===

/** Draw the floor of snow */

var drawGround = function(){
    fill(255, 255, 255);
    noStroke();
    rect(0, 250, 400, 150);
};




/** Draw and update the position of the snow */

var drawSnow = function(){
    stroke(255, 255, 255);
    
    for (var k = 0; k < snowAmount; k++){
        strokeWeight(snowSize + snowOff[k]);
        
        snowY[k] += snowSpeed;
        
        if(snowY[k] > 400){
            snowX[k] = random(400);
            snowY[k] = random(400) - 400;
        }
        point(snowX[k] + (sin(i + snowRand[k]) * snowWiggleAmount), snowY[k]);
    }
};




/** Draw the snowman to position and scale */

var drawSnowman = function(snowX, snowY, snowSize){
    // shadow
    noStroke();
    fill(204, 204, 204);
    ellipse(snowX, snowY + snowSize / 2.2, snowSize, snowSize / 4);

    // body
    fill(255, 255, 255);
    stroke(0, 0, 0);
    strokeWeight(2);
    for(var k = 0; k < 3; k++){
        ellipse(snowX, snowY - (k * (snowSize / 1.7)), snowSize - (k * snowSize / 5), snowSize - (k * snowSize / 5));
    }

    // nose
    stroke(255, 170, 0);
    for(var k = 0; k < 10; k++){
        var tempStroke = snowSize / 10 - (snowSize / 10 / round(snowSize / 10) * (k + 1));
        if(tempStroke < 2){
            tempStroke = 2;
        }
        
        strokeWeight(tempStroke);
        point(snowX + (k * (snowSize / 44)), snowY - ((2 * (snowSize / 1.73))) + (k * (snowSize / 143    )));
    }
    
    // eyes
    stroke(0, 0, 0);
    strokeWeight(snowSize / 10);
    point(snowX + snowSize / -10, snowY - (snowSize * 1.25));
    point(snowX - snowSize / -10, snowY - (snowSize * 1.25));
    
    // mouth
    strokeWeight(snowSize / 22);
    point(snowX - snowSize / -8, snowY - (snowSize / 0.97));
    point(snowX + snowSize / -8, snowY - (snowSize / 0.97));
    point(snowX - snowSize / -15, snowY - (snowSize / 1.01));
    point(snowX + snowSize / -15, snowY - (snowSize / 1.01));
    point(snowX, snowY - (snowSize / 1.02));
    
    // buttons
    strokeWeight(snowSize / 9);
    point(snowX, snowY - (snowSize / 1.3));
    point(snowX, snowY - (snowSize / 1.8));
    point(snowX, snowY - (snowSize / 2.9));
    
    // hat
    stroke(125, 125, 125);
    strokeWeight(3);
    fill(0, 0, 0);
    ellipse(snowX, snowY - snowSize * 1.43, snowSize / 1.5, snowSize / 5);
    noStroke();
    rect(snowX - snowSize / 4.9, snowY - snowSize * 1.85, snowSize / 2.5, snowSize / 2.6);
    
    // arms
    stroke(166, 113, 57);
    strokeWeight(snowSize / 12);
    fill(128, 97, 35);
    line(snowX - snowSize / 3, snowY - snowSize / 1.7, snowX - snowSize, (cos(i * 2) * snowSize / 5) + (snowY - snowSize / 1.7));
    line(snowX + snowSize / 3, snowY - snowSize / 1.7, snowX + snowSize, (sin(i * 2) * snowSize / 5) + (snowY - snowSize / 1.7));
};



/** Draw the Christmas tree */

var drawTree = function(treeX, treeY, treeSize){
    
    // shadow
    noStroke();
    fill(204, 204, 204);
    ellipse(treeX, treeY + (treeSize / 1.7), treeSize * 1.7, treeSize / 3.5);
    
    // set up translation parameters
    var nx = treeX;
    var ny = treeY + (treeSize / 2);
    var dir = 0;
    var myWiggleSpeed = 2;
    
    // loop through each segment of the tree
    for(var k = 1; k < 13; k++){
        
        // change translation
        dir += sin(i * myWiggleSpeed) * (treeSize / 110);
        var cx = sin(dir) * (treeSize / 6);
        var cy = cos(dir) * (treeSize / 6);
        
        // draw the trunk
        if(k < 12){
            strokeWeight((25 - (k * 1.2)) * (treeSize / 100));
            stroke(122, 63, 15);
            line(nx, ny, nx + cx, ny - cy);
        }
        
        // draw the branches
        if(k > 2){
            
            // draw three sets of branches
            for(var j = 0; j < 3; j++){
                strokeWeight(((18 - k) - (j * 2.8)) * (treeSize / 100));
                stroke(34 + (j * 200), 135 + (j * 120), 41 + (j * 200));
                
                line(nx - (treeSize / 10 - (k * (treeSize / 140))), ny - (j * 4), nx - ((treeSize / 1.1) - (k * (treeSize / 18))), ny + ((treeSize / 4.5) + (k / 1) - (sin(i * myWiggleSpeed) * (treeSize / 20))) - (j * 4));
                line(nx + (treeSize / 10 - (k * (treeSize / 140))), ny - (j * 4), nx + ((treeSize / 1.1) - (k * (treeSize / 18))), ny + ((treeSize / 4.5) + (k / 1) - (sin(i * -myWiggleSpeed) * (treeSize / 20))) - (j * 4));
            }
        }
        
        // increase translation
        nx += cx;
        ny -= cy;
    }
};




/** Draw a strand of christmas light */

var drawLights = function(x, y, hang, length, col, docolor){
    for(var k = 0; k < 400; k++){
        if(k % lightSpacing === 0){
            if(docolor){
                colorMode("HSB", 100);
                stroke((k + i)*2 % 255, 60, 100);
                colorMode("RGB", 255);
            }
            strokeWeight(8);
        }
        else{
            stroke(col);
            strokeWeight(2);
        }
        point(k + x, y + (abs(sin(k * lightLength) * lightHang)));
    }
};




/** Draw a present with given parameters */

var drawPresent = function(x, y, w, h, c, wc, ww, wx, wy){
    // main body
    fill(c);
    noStroke();
    rect(x - w / 2, y - h / 2, w, h);
    
    // ribbon
    fill(wc);
    rect((x + wx) - ww / 2, y - h / 2, ww, h);
    rect(x - w / 2, (y + wy) - ww / 2, w, ww);
    
    // bow
    noFill();
    var tmpC1 = x - w * 0.5;
    var tmpC2 = y - h * 1.1;
    var tmpC3 = x - w * 0.8;
    var tmpC4 = y - h * 0.1;
    
    stroke(wc);
    strokeWeight(ww / 1.5);
    bezier(x + wx, y - h / 2, tmpC1 + wx, tmpC2, tmpC3 + wx, tmpC4, x + wx, (y - h / 2) - 2);
    
    tmpC1 = x + w * 0.5;
    tmpC3 = x + w * 0.8;
    
    bezier(x + wx, y - h / 2.1, tmpC1 + wx, tmpC2, tmpC3 + wx, tmpC4, x + wx, (y - h / 2.1) - 2);
    
    /* bezier control testing
    stroke(255, 204, 0);
    strokeWeight(6);
    point(tmpC1, tmpC2);
    point(tmpC3, tmpC4); */
};




/** Draw a pile of presents */

var drawPile = function(x, y){
    noStroke();
    fill(204, 204, 204);
    ellipse(x + 17, y + 45, 117, 22);
    
    drawPresent(x, y + 5, 75, 80, color(73, 68, 207), color(219, 52, 52), 11, 0, 0);
    
    drawPresent(x + 40, y + 24, 58, 47, color(52, 163, 75), color(214, 178, 69), 6, 8, -5);
    
    drawPresent(x + -21, y + 23, 22, 50, color(255, 191, 0), color(255, 0, 187), 5, 0, 0);
    
    drawPresent(x + 2, y + 38, 42, 25, color(230, 60, 74), color(56, 198, 217), 5, -4, 1);
};




/** Find new rotation values based on input */

var findRot = function(o, x, y){
    newRotX = sin(t + o) * rotWidth + x;
    newRotY = cos(t + o) * rotHeight + y;
    
    objectSize = newRotY * 2 - 430;
};




/** Draw everything and rotate */

draw = function() {
    
    // background and shadow for banner and lights
    noStroke();
    fill(163, 201, 214);
    background(140, 255, 255);
    rect(8, 10, 396, 70);
    
    // drawLights(6, 81, lightHang, lightLength, color(163, 201, 214), false);
    
    // draw everything
    drawGround();
    
    findRot(0, 200, 260);
    var tempSize = objectSize;
    var tempRotX = newRotX;
    var tempRotY = newRotY;
    findRot(180, 200, 260);
    
    if(objectSize > tempSize){
        drawSnowman(tempRotX, tempRotY, tempSize);
        drawPile(187, 250);
        drawTree(newRotX, newRotY, objectSize);
    }
    else{
        drawTree(newRotX, newRotY, objectSize);
        drawPile(187, 250);
        drawSnowman(tempRotX, tempRotY, tempSize);
    }
    
    // increase t to rotate objects
    if (animate){
        t += speed;
    }
    
    // draw the snow
    drawSnow();
    
    i += wiggleSpeed;
    
    // draw top banner
    stroke(255, 153, 153);
    fill(207, 23, 23);
    strokeWeight(4);
    rect(2, 2, 396, 70);
    
    textFont(font, 32);
    
    fill(110, 0, 18);
    text("Merry Christmas!", 82, 38);
    fill(78, 230, 86);
    text("Merry Christmas!", 78, 34);
    
    textSize(15);
    fill(110, 0, 18);
    text("Enjoy the snowy weather!", 124, 64);
    fill(78, 230, 86);
    text("Enjoy the snowy weather!", 120, 60);
    
    // christmas lights
    drawLights(0, 73, lightHang, lightLength, color(33, 33, 33), true);
    
    // other text
    fill(0, 0, 0);
    var f = createFont("monospace", 10);
    textFont(f, 9);
    text("Nate Schutte", 4, 396);
    text("12/25/13", 357, 396);
};