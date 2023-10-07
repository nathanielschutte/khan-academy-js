/** LOOK down below for the change I made!  At the very bottom! */

//backround stuff

background(212, 212, 212);
fill(179, 179, 179);
noStroke();

    //shadings

            var shadeSpaceX = 100;
            var shadeSpaceY = 5;
            
            //shade function
        
        var shade = function(shadeSpaceX,shadeSpaceY) {
        
        rect(0, shadeSpaceY, 97, 95, 15);
        rect(shadeSpaceX, shadeSpaceY, 97, 95, 15);
        rect(shadeSpaceX*2, shadeSpaceY, 97, 95, 15);
        rect(shadeSpaceX*3, shadeSpaceY, 97, 95, 15);
        };
        
        //shadings
        shade(100, 5);
        shade(100, 105);
        shade(100, 205);
        shade(100, 305);

//RECTANGLES
    var rectX = 5;
    var rectSpaceX = 100;
    var rectSpaceY = 105;
    var rectCornerRounding = 15;

    fill(255, 216, 168);
    strokeWeight(2);
    stroke(0, 0, 0);

        //top row rectangles
        
            rect(rectX, 5, 90, 90, rectCornerRounding);
            
            rect(rectX + rectSpaceX, 5, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX*2, 5, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX*3, 5, 90, 90, rectCornerRounding);
        
        //2nd row rectangles
            rect(rectX, rectSpaceY, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX, rectSpaceY, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX*2, rectSpaceY, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX*3, rectSpaceY, 90, 90, rectCornerRounding);
        
        //3rd row rectangles
            rect(rectX, rectSpaceY*2 - 5, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX, rectSpaceY*2 - 5, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX*2, rectSpaceY*2 - 5, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX*3, rectSpaceY*2 - 5, 90, 90, rectCornerRounding);
        
        //4th row rectangles
            rect(rectX, rectSpaceY*3 - 10, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX, rectSpaceY*3 - 10, 90, 90, rectCornerRounding);
            rect(rectX + rectSpaceX*2, rectSpaceY*3 - 10, 90, 90,rectCornerRounding);
            rect(rectX + rectSpaceX*3, rectSpaceY*3 - 10, 90, 90, rectCornerRounding);

var lastPressed = false;

// draw function will update several times a second (built in function, no need to call on it)
draw = function() {
    
    // check to see which square the mouse is hovering over
    for(var i = 0; i < 16; i++) { // loop through each of the 16 squares
        
        // figure out the squares' positions based on variable 'i'
        var xpos = rectX + rectSpaceX * (i % 4);
        var ypos = 5 + (rectSpaceY-5) * floor(i / 4);
        
        // now see if the mouse is hovering over the current square
        if(mouseX > xpos && mouseX < xpos + 90 && mouseY > ypos && mouseY < ypos + 90) {
            
            // if the mouse is down, do something (change the square's color)
            // only change the color is the mouse was just pressed, otherwise the color will spaz out
            if(mouseIsPressed && ! lastPressed) {
                
                // I copied the above code for a rectangle but set a random color before drawing
                fill(random(0, 255), random(0, 255), random(0, 255));
                rect(xpos, ypos, 90, 90, rectCornerRounding);
                
                lastPressed = true;
            }
            else if(! mouseIsPressed) {
                lastPressed = false;
            }
        }
    }
};