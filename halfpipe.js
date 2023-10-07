var boardStartX = 50;
var boardStartY = 50;
var boardLength = 40;

var GRAVITY = 0.10;

var seg = [];

var nodeCount = 3;
var nodes = [];

var subLength = boardLength/nodeCount;

var build = function() {
    for(var i = 0; i < nodeCount; i++) {
        nodes.push({x: boardStartX+i*(subLength),
        y: boardStartY,
        xv: 0,
        yv: 0});
    }
};

var resetBoard = function() {
    for(var i = 0; i < nodeCount; i++) {
        nodes[i].x = boardStartX+i*(boardLength/nodeCount);
        nodes[i].y = boardStartY;
        nodes[i].xv = 0;
        nodes[i].yv = 0;
    }
};


var updateNodes = function() {
    for(var i = 0; i < nodeCount; i++) {
        nodes[i].yv -= GRAVITY;
        
        nodes[i].x += nodes[i].xv;
        nodes[i].y -= nodes[i].yv;
    }
    
    var respawn = true;
    for(var i = 0; i < nodeCount; i++) {
        if(nodes[i].x < 400 && nodes[i].x > 0 &&
                nodes[i].y > 0 && nodes[i].y < 400) {
            respawn = false;
        }
    }
    if(respawn) {
        resetBoard();
    }
};


var drawNodes = function() {
    strokeWeight(2);
    stroke(0, 0, 0);
    fill(0, 0, 0);
    for(var i = 0; i < nodeCount-1; i++) {
        line(nodes[i].x, nodes[i].y, nodes[i+1].x, nodes[i+1].y);
    }
};


build();

frameRate(60);
draw = function() {
    
    updateNodes();
    
    background(255, 255, 255);
    drawNodes();
};