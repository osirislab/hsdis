function hex(n, i) {
    var x = n.toString(16);
    while(x.length<i) x = '0' + x;
    return x;
}
function max(a, b) {
    return a>b ? a:b;
}
function min(a, b) {
    return a>b ? b:a;
}