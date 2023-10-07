/** initialization */
var x1, y1, x2, y2, direction;

x1 = 200;
y1 = 200;


/** Direction function finds an angle based on a change in x and the change in y (delta x and delta y). For this example, the difference between x1 and x2, and the difference between y1 and y2 are input into the function.

Uses modified degrees.  No radians. */

var getDir = function(dx, dy){
    var dir = atan(dx/dy);
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
    return dir * -1;
};
 
 
/** If the mouse is pressed, match the second set of coordinates to the mouse's coordinates */

var getMouse = function(){
    if (mouseIsPressed){
        x2 = mouseX;
        y2 = mouseY;
    }
};


/** Draw and do the rest of the work */

var draw = function() {
    // update coordinates to mouse
    getMouse();
    
    // draw background and line
    background(221, 236, 240);
    line(x1, y1, x2, y2);
    
    // get the direction
    direction = getDir(x1 - x2, y1 - y2);
    
    // print the direction
    fill(148, 65, 65);
    textSize(16);
    text("Direction: " + direction, 12, 24);
};