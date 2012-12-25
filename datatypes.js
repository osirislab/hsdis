function Instruction() {
    this.opcode     = 0;
    this.addr       = 0;
    this.len        = 0;
    this.operand_0  = 0;
    this.operand_1  = 0;
    this.operand_2  = 0;
    this.lval       = 0;
    this.valid      = false; //Never used ...
    this.flags      = 0;
    this.destinations= []; //0 is default destination (No jmp dest for conditional, jmp dest otherwise)
    this.str        = '';
    this.size       = 0;
    this.basicblock = null;
}

function BasicBlock(ins_) {
    this.instructions = [];
    this.functions = [];
    this.next = [];
    this.add = function(ins) {
        ins.basicblock = this;
        this.next = ins.destinations.length ? ins.destinations.slice():[ins.addr+ins.size];
        
        this.instructions.push(ins);
    }
    this.rem = function(i, num) {
        var ret = this.instructions.splice(i, num);
        var cnt = this.instructions.length;

        if(cnt>0) {
            var last_ins = this.instructions[cnt-1];
            this.next = last_ins.destinations.length ? last_ins.destinations.slice():[last_ins.addr+last_ins.size];
        }
        return ret;
    }
    this.split = function(ins) {
        var bb = new BasicBlock();
        var i = 0;

        while(i<this.instructions.length) {
            if(ins == this.instructions[i]) break;
            i++;
        }

        var temp_next = this.next;
        var bbs = this.rem(i, this.instructions.length-i);
        
        for(var i = 0; i<bbs.length; ++i)
            bb.add(bbs[i]);
        for(var i = 0; i<this.functions.length; ++i)
            this.functions[i].add(bb);

        bb.next = temp_next;
        this.next = [bb.instructions[0].addr];

        return bb;
    }
    if(ins_) this.instructions.push(ins_);
}

function Function(bb_) {
    this.basicblocks = [];
    this.add = function(bb) {
        var dest = this.basicblocks.length-1;
        this.basicblocks.push(bb);
        for(var i = 0; i<bb.functions.length; ++i)
            if(bb.functions[i]==this) return;
        bb.functions.push(this);
    }
    this.rem = function(i, num) {
        var ret = this.basicblocks.splice(i, num);
        for(var j = 0; j<ret.length; ++j)
            for(var k = 0; k<ret[j].functions.length; ++k)
                if(ret[j].functions[k]==this) {
                    ret[j].functions.splice(k, 1);
                    break;
                }
        return ret;//broken
    }
    if(bb_) this.add(bb_);
}