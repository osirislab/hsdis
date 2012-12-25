var dbg = {
    'func':function(f) {
        var s = '';
        for(var i = 0; i<f.basicblocks.length; ++i) {
            s += "---\n";
            s += this.bb(f.basicblocks[i]);
        }
        return s;
    },
    'bb':function(b) {
        var s = '';
        for(var i = 0; i<b.instructions.length; ++i) {
            s += hex(b.instructions[i].addr,8) + ' ' +
            b.instructions[i].str + "\n";
        }
        for(var i = 0; i<b.next.length; ++i)
            s += hex(b.next[i]) + ',';
        return s;
    }

};
function fe(d, f) {
    for(var i=0; i<d.length; ++i)
        f(d[i],i);
}