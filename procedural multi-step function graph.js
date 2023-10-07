var f = [];
var x = 0;
var y;
var last = 0;

var step = 3;
var sclx = 1;
var scly = 10;

var trans = [];
trans.push("ADD");
trans.push("SUB");
trans.push("MUL");
trans.push("DIV");
trans.push("EXP");
trans.push("SIN");
trans.push("COS");
trans.push("TAN");
trans.push("LOG");
trans.push("INV");

var addFunc = function(x, b) {
    f.push({x: x, b: b});
};


var defFunc = function() {
    f = [];
    addFunc(8);
    addFunc(4, 1.68);
    addFunc(1, 7);
};


var doFunc = function(x, a, b) {
    if(x === 0) {
        return a + b;
    }
    else if(x === 1) {
        return a - b;
    }
    else if(x === 2) {
        return a * b;
    }
    else if(x === 3) {
        return a / b;
    }
    else if(x === 4) {
        return pow(a,b);
    }
    else if(x === 5) {
        return sin(a);
    }
    else if(x === 6) {
        return cos(a);
    }
    else if(x === 7) {
        return tan(a);
    }
    else if(x === 8) {
        return log(a);
    }
    else if(x === 9) {
        return 1/a;
    }
};


var evalFunc = function(p) {
    var k = p;
    for(var i = 0; i < f.length; i++) {
        k = doFunc(f[i].x, k, f[i].b);
    }
    return k;
};


defFunc();

stroke(199, 155, 155);
line(0, height/2, width, height/2);
line(width/2, 0, width/2, height);

stroke(41, 27, 150);
for(var i = 0; i < width+1; i += step) {
    var n = evalFunc(i/sclx)*scly + height/2;
    if(i !== 0) {
        line(i-step, 400-last, i, 400-n);
    }
    last = n;
}

fill(123, 109, 199);
for(var i = 0; i < f.length; i++) {
    text(f[i].x + " (" + trans[f[i].x] + ")     " + f[i].b, 20, 20+14*i);
}
