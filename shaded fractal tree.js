// ***********  Changeable Properties of the Tree ***********
// **********************************************************
var xPosition = 200;  // x position of tree
var yPosition = 363;  // y position of tree
var treeSize = 99;  // size of tree
var treeAngle = 0;  // angle of tree
var thickness = 58;  // thickness of branches

var quality = 4;  // quality of the shading on the branches
var iterations = 5;  // detail of the tree (be careful!)
var angleOne = 55;  // angle of one third of the branches
var angleTwo = 55;  // angle of another third of the branches
var angleThree = 0;  // angle of the rest of the branches

var colorDif = 60;  // shading amount of the tree
var colorChange = 23;  // change in color of the tree

var baseR = 176;  // red color value
var baseG = 111;  // green color value
var baseB = 20;  // blue color value
// **********************************************************





var drawBox = function(x, y, size, dir, r, g, b){
    var lineW = size / quality * (thickness / 100);
    strokeWeight(lineW + 1);
    
    for(var k = 0; k < quality + 1; k++){
        stroke(r - (abs(k - (quality / 2)) * colorDif / quality), g - (abs(k - (quality / 2)) * colorDif / quality), b - (abs(k - (quality / 2)) * colorDif / quality));
        
        var x1 = x - (lineW / 4) + sin(dir) * (lineW * (quality / 2 - k));
        var y1 = y - (lineW / 4) + cos(dir) * (lineW * (quality / 2 - k));
        var x2 = x1 + (sin(dir + 90) * (size - lineW / 2));
        var y2 = y1 + (cos(dir + 90) * (size - lineW / 2));
        
        line(x1, y1, x2, y2);
    }
};

var t = 0;

var treeFractal = function(x, y, s, a, m){
    drawBox(x, y, s, a - 90, baseR + ((m * colorChange) - 100), baseG, baseB);
    
    fill(156, 51, 51);
    
    var nx = x + (sin(a) * (s * 1.1));
    var ny = y + (cos(a) * (s * 1.1));

    var ns = s * 0.5 * sqrt(2);
    
    if(m > 0){
        treeFractal(nx, ny, ns, a + angleThree + (sin(t * 2) * (treeSize / 20)), m - 1);
        treeFractal(nx, ny, ns, a + angleOne + (cos(t * 2) * (treeSize / 20)), m - 1);
        treeFractal(nx, ny, ns, a - angleTwo + (sin(t * 2 + 15) * (treeSize / 20)), m - 1);
    }
};


var draw = function() {
    background(196, 237, 255);
    noStroke();
    fill(40, 133, 54);
    rect(0, 315, 400, 85);
    
    treeFractal(xPosition, yPosition, treeSize, treeAngle + 180, min(iterations, 6));
    
    t++;
    
    // fill(128, 36, 36);
    // text("Mouse  x: " + mouseX + " y: " + mouseY, 5, 393);
};