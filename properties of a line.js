var x1 = 100;
var x2 = 300;
var y1 = 200;
var y2 = 200;
var selected;

// ####################
/** CHANGE THESE */
var detail = 28; // grid spacing, MUST be an even number!

var decPlaces = 2; // round to number of decimal places
/** ============ */
// ####################

var getMouse = function(){
    if(! mouseIsPressed){
        selected = null;
    }
    if(dist(mouseX, mouseY, x1, y1) < 10){
        selected = 1;
    }
    else if(dist(mouseX, mouseY, x2, y2) < 10){
        selected = 2;
    }
    if(mouseIsPressed){
        if(selected === 1){
            x1 = round(mouseX / (400 / detail)) * (400 / detail);
            y1 = round(mouseY / (400 / detail)) * (400 / detail);
        }
        else if(selected === 2){
            x2 = round(mouseX / (400 / detail)) * (400 / detail);
            y2 = round(mouseY / (400 / detail)) * (400 / detail);
        }
    }
};




var drawGrid = function(){
    stroke(230, 230, 230);
    strokeWeight(2);
    
    for(var k = 0; k < detail; k++){
        line(0, (400 / detail) * k, 400, (400 / detail) * k);
    }
    for(var k = 0; k < detail; k++){
        line((400 / detail) * k, 0, (400 / detail) * k, 400);
    }
    
    stroke(199, 199, 199);
    strokeWeight(3);
    line(0, 200, 400, 200);
    line(200, 0, 200, 400);
};




var getDir = function(dx, dy){
    var dir;
    
    if(dy === 0){
        if(dx > 0){
            dir = 90;
        }
        else{
            dir = -90;
        }
    }
    else{
        dir = atan(dx/dy);
        if (dy < 0){
            if (dx > 0){
                dir += 180;
            }
            else if (dx < 0){
                dir -= 180;
            }
            else{
                dir = 180;
            }
        }
    }
    return dir;
};




var roundNum = function(num){
    return round(num * pow(10, decPlaces)) / pow(10, decPlaces);
};


var draw = function() {
    background(245, 245, 245);
    detail = round(detail * 2) / 2;
    
    getMouse();
    drawGrid();
    
    // line between points
    strokeWeight(30 / detail);
    stroke(212, 114, 111);
    line(x1, y1, x2, y2);
    
    // ellipse 1
    strokeWeight(min((400 / detail), 50) / 10);
    stroke(43, 120, 168);
    if(selected === 1){
        fill(135, 203, 255);
    }
    else{
        fill(63, 143, 196);
    }
    ellipse(x1, y1, min((400 / detail), 30) / 2, min((400 / detail), 30) / 2);
    // =========
    
    
    // ellipse 2
    if(selected === 2){
        fill(135, 203, 255);
    }
    else{
        fill(63, 143, 196);
    }
    ellipse(x2, y2, min((400 / detail), 30) / 2, min((400 / detail), 30) / 2);
    // =========
    
    // midpoint ellipse
    stroke(168, 54, 13);
    fill(227, 124, 86);
    ellipse((x1 + x2) / 2, (y1 + y2) / 2, min((300 / detail), 30) / 2, min((300 / detail), 30) / 2);
    
    // set up translated values
    var tx1 = (x1 - 200) / (400 / detail);
    var ty1 = (y1 - 200) / (400 / detail) * -1;
    var tx2 = (x2 - 200) / (400 / detail);
    var ty2 = (y2 - 200) / (400 / detail) * -1;
    
    // find the midpoint
    var midX = (tx1 + tx2) / 2;
    var midY = (ty1 + ty2) / 2;
    
    // text
    fill(122, 122, 122);
    var x = min(x1 - 10, 317);
    x = max(x, 2);
    var y = min(y1 + 20, 396);
    text("P1 x: " + roundNum(tx1) + "  y: " + roundNum(ty1), x, y);
    
    var x = min(x2 - 10, 317);
    x = max(x, 2);
    var y = min(y2 + 20, 396);
    text("P2 x: " + roundNum(tx2) + "  y: " + roundNum(ty2), x, y);
    
    fill(122, 122, 122);
    var x = min(((x1 + x2) / 2) - 10, 277);
    x = max(x, 2);
    var y = min(((y1 + y2) / 2) + 20, 396);
    text("Midpoint x: " + roundNum(midX) + "  y: " + roundNum(midY), x, y);
    // =========
    
    // find the distance
    var distance = dist(tx1, ty1, tx2, ty2);
    
    // find slope values
    var slope;
    var isSlope = tx1 - tx2 !== 0;
    if(isSlope){
        slope = (ty1 - ty2) / (tx1 - tx2);
    }
    
    // print the properties
    textSize(14);
    fill(36, 111, 168);
    text("Distance:", 9, 22);
    
    fill(36, 164, 255);
    text("" + roundNum(distance), 74, 22);
    
    fill(36, 111, 168);
    text("Slope:        or", 9, 42);
    text("Angle:", 9, 62);
    
    fill(36, 164, 255);
    if(isSlope){
        text("" + roundNum(slope), 102, 42);
    }
    else {
        text("Undefined", 102, 42);
    }
    
    text("" + roundNum(getDir((tx2 - tx1), (ty2 - ty1))), 56, 63);
    
    textSize(11);
    text("" + round(ty1 - ty2), 56, 36);
    text("" + round(tx1 - tx2), 56, 49);
    
    strokeWeight(1.5);
    stroke(36, 164, 255);
    line(57, 39, 72, 39);
    
    textSize(12);
    // =========
};