var polySize = 50;
var polyCount = 6;
var polyRandom = 6; // val from 0-10
var polyHue = 154;
var polyHighlight = 140;
var polyInitVel = 3;
var polyBreakVel = 2;
var polyVelCap = 20;
var polyInitRot = 2;
var polyGrabRot = 4;
var polyBoomRot = 8;
var polyBreakRot = 4;
var polyHeight = 3 ;
var polyUp = 3;
var polyVelDrag = 0.993;
var polyRotDrag = 0.993;
var polyGrabRadius = 10;
var polyIntersectSize = 6;

var borderMin = 387; 
var borderMax = 337;
var currentBorder = borderMax;
var borderDrag = 5;

var blowRadius = 200;
var blowMax = 12;
var lastBlow = 0;
var blowDelay = 20;

var blowParticleVel = 12;
var blowParticleCount = 65;
var blowParticleGrav = 0.45;
var blowParticleLifechange = 2;
var blowParticleSize = 5;
var blowParticleFade = 11;
var blowParticleOp = 255;

var l = {
    x1: mouseX,
    y1: mouseY,
    x2: mouseX,
    y2: mouseY,
    dr: false
};

var cutReq = 0;
var polyHigh = -1;
var polyOffX;
var polyOffY;
var setOffset = false;
var setVel = false;
var velX = 0;
var velY = 0;


var poly = [];
var t = 0;

var pr = [];

var keys = [];

keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};

var addPoly = function(px, py, n, s) {
    var k = 360/n;
    var x = [];
    var y = [];
    for(var i = 0; i < n; i++) {
        var xx = sin(k*i) * s + random(-s/(10-polyRandom), s/(10-polyRandom));
        var yy = cos(k*i) * s + random(-s/(10-polyRandom), s/(10-polyRandom));
        x.push(xx);
        y.push(yy);
    }
    var drs = [];
    var dst = [];
    for(var k = 0; k < x.length; k++) {
        drs.push(atan2(x[k], y[k]));
        dst.push(dist(0, 0, x[k], y[k]));
    }
    var p = {
        x: px,
        y: py,
        xv: random(-polyInitVel, polyInitVel),
        yv: random(-polyInitVel, polyInitVel),
        xp: x,
        yp: y,
        c: i*10,
        dir: 0,
        dv: random(-polyInitRot, polyInitRot),
        dirs: drs,
        dist: dst,
        ix: [null, null],
        iy: [null, null],
        io: [false, false],
        ip: [null, null, null, null]
    };
    
    poly.push(p);
};


var copyPoly = function(i, x, y, xx, yy, da, db) {
    var p = poly[i];
    var pp = {x: x, y: y, xv: random(-polyBreakVel, polyBreakVel), yv: random(-polyBreakVel, polyBreakVel), xp: xx, yp: yy, c: p.c, dir: p.dir, dv: random(-polyBreakRot, polyBreakRot), dirs: da, dist: db, ix: [null, null], iy: [null, null], io: [false, false], ip: [null, null, null, null]};
    poly.push(p);
};


var addParticle = function(x, y) {
    var pp = {x: x, y: y, xv: random(-blowParticleVel, blowParticleVel), yv: random(-blowParticleVel, blowParticleVel), l: 0};
    pr.push(pp);
};


var drawPolys = function() {
    for(var i = 0; i < poly.length; i++) {
        colorMode(HSB);
        
        var bright = (polyHigh === i) * polyHighlight;
        var shift = polyHeight+polyUp*(polyHigh === i);
        var scale = (polyHigh === i)*0.02+1.01;
        fill(0, 0, 0, 100);
        noStroke();
        
        beginShape();
        for(var k = 0; k < poly[i].xp.length; k++) {
            vertex(poly[i].xp[k]*scale+poly[i].x+shift, poly[i].yp[k]*scale+poly[i].y+shift);
        }
        vertex(poly[i].xp[0]*scale+poly[i].x+shift, poly[i].yp[0]*scale+poly[i].y+shift);
        endShape();
        
        
        scale = (polyHigh === i)*0.02+1;
        fill(polyHue, poly[i].c+100, 255);
        stroke(polyHue, poly[i].c+100, 255);
        strokeWeight(0.8);
        
        beginShape();
        for(var k = 0; k < poly[i].xp.length; k++) {
            var _x = poly[i].xp[k]*scale+poly[i].x;
            var _y = poly[i].yp[k]*scale+poly[i].y;
            vertex(_x, _y);
            text(k, _x, _y);
        }
        vertex(poly[i].xp[0]*scale+poly[i].x, poly[i].yp[0]*scale+poly[i].y);
        endShape();
        
        // for testing
        fill(0, 0, 0);
        for(var k = 0; k < poly[i].xp.length; k++) {
            var _x = poly[i].xp[k]*scale+poly[i].x;
            var _y = poly[i].yp[k]*scale+poly[i].y;
            text(k, _x, _y);
        }
        // ==========
        
        strokeWeight(3);
        stroke(polyHue, poly[i].c+70, 200);
        point(poly[i].x, poly[i].y);
        
        strokeWeight(polyIntersectSize);
        colorMode(RGB);
        stroke(199, 109, 109);
        var a = poly[i].io[0];
        var b = poly[i].io[1];
        if(a && b) {
            stroke(115, 230, 165);
        }
        if(a) {
            point(poly[i].ix[0], poly[i].iy[0]);
        }
        if(b) {
            point(poly[i].ix[1], poly[i].iy[1]);
        }
    }
};


var updatePolys = function() {
    for(var i = 0; i < poly.length; i++) {
        poly[i].x += poly[i].xv;
        poly[i].y -= poly[i].yv;
        poly[i].dir += poly[i].dv;
        for(var k = 0; k < poly[i].xp.length; k++) {
            var dirr = poly[i].dirs[k] + poly[i].dir;
            var distt = poly[i].dist[k];
            poly[i].xp[k] = sin(dirr)*distt;
            poly[i].yp[k] = cos(dirr)*distt;
            var xx = poly[i].xp[k]+poly[i].x;
            var yy = poly[i].yp[k]+poly[i].y;
            if(xx < 0 || xx > 400) {
                if(xx < 0) {
                    poly[i].x -= xx-1;
                }
                else {
                    poly[i].x -= xx-400+1;
                }
                poly[i].xv *= -1;
            }
            
            if(yy < 0 || yy > currentBorder) {
                if(yy < 0) {
                    poly[i].y -= yy-1;
                }
                else {
                    poly[i].y -= yy-currentBorder+1;
                }
                poly[i].yv *= -1;
            }
        }
        poly[i].xv *= polyVelDrag;
        poly[i].yv *= polyVelDrag;
        poly[i].dv *= polyRotDrag;
    }
};


var checkIntersect = function(x0, y0, x1, y1, x2, y2, x3, y3) {
    var p = {x: null, y: null};
    var a, b, dA, nA, nB;
    
    dA = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
    if (dA === 0) {
        return null;
    }
    a = y0 - y2;
    b = x0 - x2;
    nA = ((x3 - x2) * a) - ((y3 - y2) * b);
    nB = ((x1 - x0) * a) - ((y1 - y0) * b);
    a = nA / dA;
    b = nB / dA;
    
    if(a > 0 && a < 1 && b > 0 && b < 1) {
        p.x = x0 + (a * (x1 - x0));
        p.y = y0 + (a * (y1 - y0));
        return p;
    }
    else {
        return null;
    }
};


var doIntersect = function() {
    for(var j = 0; j < poly.length; j++) {
        var p = poly[j];
        p.io[0] = false;
        p.io[1] = false;
        if(l.dr) {
            for(var i = 0, k = p.xp.length-1; i < p.xp.length; k = i++) {
                var intr = checkIntersect(l.x1, l.y1, l.x2, l.y2, p.x+p.xp[k], p.y+p.yp[k], p.x+p.xp[i], p.y+p.yp[i]);
                if(intr !== null) {
                    if(!p.io[0]) {
                        p.ix[0] = intr.x;
                        p.iy[0] = intr.y;
                        p.io[0] = true;
                        p.ip[0] = k;
                        p.ip[1] = i;
                    }
                    else if(!p.io[1]) {
                        p.ix[1] = intr.x;
                        p.iy[1] = intr.y;
                        p.io[1] = true;
                        p.ip[2] = k;
                        p.ip[3] = i;
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
};


var cutPolys = function() {
    for(var i = 0; i < poly.length; i++) {
        var p = poly[i];
        if(p.io[0] && p.io[1]) {
            for(var j = 0; j < 2; j++) {
                var xp = [];
                var yp = [];
                xp.push(p.ix[j === 0 ? 0 : 1]);
                yp.push(p.iy[j === 0 ? 0 : 1]);
                var k = p.ip[j === 0 ? 1 : 3];
                while(k < p.ip[j === 0 ? 2 : 0] && k < j === 0 ? 1 : 3 + p.xp.length) {
                    xp.push(p.xp[k]+p.x);
                    yp.push(p.yp[k]+p.y);
                    k++;
                    k = k%p.xp.length;
                }
                xp.push(p.ix[j === 0 ? 1 : 0]);
                yp.push(p.iy[j === 0 ? 1 : 0]);
                var xsum = 0;
                var ysum = 0;
                for(var k = 0; k < xp.length; i++) {
                    xsum += xp[k];
                    ysum += yp[k];
                }
                var x = xsum / xp.length;
                var y = ysum / xp.length;
                for(var k = 0; k < xp.length; k++) {
                    xp[k] -= x;
                    yp[k] -= y;
                }
                var drs = [];
                var dst = [];
                for(var k = 0; k < x.length; k++) {
                    drs.push(atan2(x[k], y[k]));
                    dst.push(dist(0, 0, x[k], y[k]));
                }
                copyPoly(i, x, y, xp, yp, drs, dst);
            }
        }
    }
};


var doParticle = function() {
    for(var i = 0; i < pr.length; i++) {
        var pp = pr[i];
        // pp.yv -= blowParticleGrav;
        pp.x += pp.xv;
        pp.y -= pp.yv;
        pp.l += blowParticleLifechange;
        
        if(pp.x < 0 || pp.x > 400 || pp.y > 400) {
            pr.splice(i, 1);
            i--;
            continue;
        }
        
        colorMode(RGB);
        stroke(255, 241, 178, blowParticleOp-(pp.l*blowParticleFade));
        strokeWeight(blowParticleSize-pp.l);
        line(pp.x, pp.y, pp.x-pp.xv, pp.y+pp.yv);
    }
};


var inPoly = function(x, y) {
    var point = -1;
    for(var i = 0; i < poly.length; i++) {
        var n = poly[i].xp.length;
        var xp = poly[i].xp;
        var yp = poly[i].yp;
        var xx = poly[i].x;
        var yy = poly[i].y;
        var c = false;
        for(var k = 0, j = n-1; k < n; j = k++) {
            if(((yp[k]+yy>y) !== (yp[j]+yy>y)) && (x < (xp[j]+xx-xp[k]-xx) * (y-yp[k]-yy) / (yp[j]+yy-yp[k]-yy) + xp[k]+xx)) {
                c = !c;
            }
        }
        if(c) {
            point = i;
        }
    }
    return point;
};


var boom = function(x, y) {
    for(var i = 0; i < poly.length; i++) {
        var p = poly[i];
        var d = dist(p.x, p.y, x, y);
        var dd = atan2(p.x-x, p.y-y);
        if(d < blowRadius) {
            var a = (blowRadius-d)*(blowMax /blowRadius);
            p.xv += sin(dd)*a;
            p.yv -= cos(dd)*a;
            p.dv += random(-polyBoomRot, polyBoomRot);
        }
    }
    
    for(var i = 0; i < blowParticleCount; i++) {
        addParticle(mouseX, mouseY);
    }
    
    colorMode(RGB);
    fill(255, 230, 168, 40);
    ellipse(x, y, blowRadius, blowRadius);
    fill(255, 230, 168, 100);
    ellipse(x, y, blowRadius/4, blowRadius/4);
};


var control = function() {
    if(mouseIsPressed) {
        if(mouseButton === LEFT) {
            if(polyHigh === -1) {
                l.x1 = mouseX;
                l.y1 = mouseY;
                l.dr = true;
                cutReq = 1;
            }
            else {
                var p = poly[polyHigh];
                if(!setOffset) {
                    polyOffX = mouseX - p.x;
                    polyOffY = mouseY - p.y;
                    
                    poly.splice(polyHigh, 1);
                    poly.push(p);
                    polyHigh = poly.length-1;
                    
                    setOffset = true;
                    
                    p.dv = random(-polyGrabRot, polyGrabRot);
                }
                p.x = mouseX - polyOffX;
                p.y = mouseY - polyOffY;
                setVel = true;
                if(abs(mouseX-pmouseX) > abs(velX)) {
                    velX = mouseX-pmouseX;
                }
                else {
                    velX *= 0.7;
                }
                
                if(abs(mouseY-pmouseY) > abs(velY)) {
                    velY = mouseY-pmouseY;
                }
                else {
                    velY *= 0.7;
                }
            }
        }
    }
    else {
        setOffset = false;
        l.x2 = mouseX;
        l.y2 = mouseY;
        l.dr = false;
        if(setVel) {
            var p = poly[polyHigh];
            p.xv = min(max(velX, -polyVelCap), polyVelCap);
            p.yv = min(max(velY, -polyVelCap), polyVelCap);
            p.yv *= -1;
            p.dv += random(-polyGrabRot, polyGrabRot);
            setVel = false;
        }
        polyHigh = inPoly(mouseX, mouseY);
        
        if(cutReq === 1) {
            //cutPolys();
            cutReq = 0;
        }
    }
    
    
    if(keys[32] && t-lastBlow > blowDelay) {
        boom(mouseX, mouseY);
        lastBlow = t;
    }
};


var drawLine = function() {
    colorMode(RGB);
                
    stroke(0, 0, 0, 20);
    strokeWeight(4);
    line(l.x1+8, l.y1+8, l.x2, l.y2);
    
    stroke(140, 25, 25);
    strokeWeight(0.5);
    line(l.x1, l.y1, l.x2, l.y2);
};


var drawBorder = function() {
    colorMode(RGB);
    fill(50, 85, 125, (currentBorder-borderMax)*-4+255);
    noStroke();
    rect(0, currentBorder, 400, 400);
    
    fill(235, 246, 255, (currentBorder-borderMax)*-4+255);
    textSize(12);
    text("- Click and drag polygons with left mouse button", 6, currentBorder+15);
    text("- Click and drag across polygons to slice them", 6, currentBorder+28);
    text("- Right click polygons to add/delete them", 6, currentBorder+41);
    text("- Space key to create explosion at mouse pointer", 6, currentBorder+54);
};





for(var i = 0; i < polyCount; i++) {
    addPoly(random(50, 350), random(50, 350), floor(random(8)+3), floor(random(polySize)+30));
}

draw = function() {
    colorMode(RGB);
    background(152, 190, 224);
    
    control();
    
    updatePolys();
    doIntersect();
    drawPolys();
    if(l.dr) {drawLine();}
    doParticle(); 
    drawBorder();
    
    
    if(t < 200 || mouseY > currentBorder) {
        currentBorder += (borderMax - currentBorder) / borderDrag;
    }
    else {
        currentBorder += (borderMin - currentBorder) / borderDrag;
    }
    
    
    t++;
};
