var l = [];
var n = 670617279;
var ns = n;
var i = 0;
while(!(n === 1 || i > 999)) {
    l.push(n);
    if(n % 2 === 0) {
        n /= 2;
    }
    else {
        n = 3*n + 1;
    }
    i++;
}
l.push(1);
var s = 0;
for(var k = 0; k < l.length; k++) {
    if(l[k] > s) {
        s = l[k];
    }
}
fill(0, 0, 0);
stroke(0, 0, 0);
strokeWeight(1);
var sx = width/l.length;
var sy = height/s;
for(var k = 1; k < l.length; k++) {
    line(k*sx, 400-l[k]*sy, (k-1)*sx, 400-l[k-1]*sy);
}
fill(255, 0, 0);
text("root: " + ns, 3, 13);
text("iterations: " + i, 3, 24);
