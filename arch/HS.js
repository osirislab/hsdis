var HS={
    'REG':{
        '0' :0x00,
        '1' :0x01,
        '2' :0x02,
        '3' :0x03,
        '4' :0x04,
        '5' :0x05,
        '6' :0x06,
        '7' :0x0A,
        'BP':0x08,
        'SP':0x09,
        'IP':0x07,
    },
    'OP':{
        'ADD'    :0x10,
        'ADDLVAL':0x11,
        'SUB'    :0x12,
        'SUBLVAL':0x13,
        'MUL'    :0x14,
        'MULLVAL':0x15,
        'DIV'    :0x16,
        'DIVLVAL':0x17,
        'MOD'    :0x18,
        'MODLVAL':0x19,
        'AND'    :0x1A,
        'ANDLVAL':0x1B,
        'OR'     :0x1C,
        'ORLVAL' :0x1D,
        'XOR'    :0x1E,
        'XORLVAL':0x1F,
        'JMP'    :0x20,
        'JE'     :0x21,
        'JNE'    :0x22,
        'JL'     :0x23,
        'JLE'    :0x24,
        'JG'     :0x25,
        'JGE'    :0x26,
        'CALL'   :0x27,
        'CALLR'  :0x28,
        'RET'    :0x29,
        'LOAD'   :0x30,
        'LOADR'  :0x31,
        'LOADB'  :0x32,
        'LOADBR' :0x33,
        'STOR'   :0x34,
        'STORR'  :0x35,
        'STORB'  :0x36,
        'STORBR' :0x37,
        'IN'     :0x40,
        'OUT'    :0x41,
        'PUSH'   :0x42,
        'PUSHLVAL':0x43,
        'POP'    :0x44,
        'MOV'    :0x51,
        'MOVLVAL':0x52,
        'CMP'    :0x53,
        'CMPLVAL':0x54,
        'HLT'    :0x60,
        'SYSCALL':0x61,
        'NOP'    :0x90
    },
    'OP_FLAG':{
        'FUNC':0x01
    },
    'ins_reg_str':function(reg) {
        switch(reg) {
            case HS.REG[0]:return 'r0';
            case HS.REG[1]:return 'r1';
            case HS.REG[2]:return 'r2';
            case HS.REG[3]:return 'r3';
            case HS.REG[4]:return 'r4';
            case HS.REG[5]:return 'r5';
            case HS.REG[6]:return 'r6';
            case HS.REG[7]:return 'r7';
            case HS.REG.SP:return 'rsp';
            case HS.REG.BP:return 'rbp';
            case HS.REG.IP:return 'rip';
        }
        return null;
    },
    'ins_opcode_str':function(opcode) {
        switch(opcode) {
            case HS.OP.ADD    :return 'add';
            case HS.OP.ADDLVAL:return 'add';
            case HS.OP.SUB    :return 'sub';
            case HS.OP.SUBLVAL:return 'sub';
            case HS.OP.MUL    :return 'mul';
            case HS.OP.MULLVAL:return 'mul';
            case HS.OP.DIV    :return 'div';
            case HS.OP.DIVLVAL:return 'div';
            case HS.OP.MOD    :return 'mod';
            case HS.OP.MODLVAL:return 'mod';
            case HS.OP.AND    :return 'and';
            case HS.OP.ANDLVAL:return 'and';
            case HS.OP.OR     :return 'or';
            case HS.OP.ORLVAL :return 'or';
            case HS.OP.XOR    :return 'xor';
            case HS.OP.XORLVAL:return 'xor';
            case HS.OP.JMP    :return 'jmp';
            case HS.OP.JE     :return 'je';
            case HS.OP.JNE    :return 'jne';
            case HS.OP.JL     :return 'jl';
            case HS.OP.JLE    :return 'jle';
            case HS.OP.JG     :return 'jg';
            case HS.OP.JGE    :return 'jge';
            case HS.OP.CALL   :return 'call';
            case HS.OP.CALLR  :return 'call';
            case HS.OP.RET    :return 'ret';
            case HS.OP.LOAD   :return 'load';
            case HS.OP.LOADR  :return 'load';
            case HS.OP.LOADB  :return 'loadb';
            case HS.OP.LOADBR :return 'loadb';
            case HS.OP.STOR   :return 'stor';
            case HS.OP.STORR  :return 'stor';
            case HS.OP.STORB  :return 'storb';
            case HS.OP.STORBR :return 'storb';
            case HS.OP.IN     :return 'in';
            case HS.OP.OUT    :return 'out';
            case HS.OP.PUSH   :return 'push';
            case HS.OP.PUSHLVAL:return 'push';
            case HS.OP.POP    :return 'pop';
            case HS.OP.MOV    :return 'mov';
            case HS.OP.MOVLVAL:return 'mov';
            case HS.OP.CMP    :return 'cmp';
            case HS.OP.CMPLVAL:return 'cmp';
            case HS.OP.HLT    :return 'hlt';
            case HS.OP.SYSCALL:return 'syscall';
            case HS.OP.NOP    :return 'nop';
        }
        return null;
    },
    'get_ins':function(buf, i) {
        var ins = new Instruction();
        ins.addr      = i;
        ins.opcode    = buf[i  ];
        ins.operand_0 = buf[i+1];
        ins.operand_1 = buf[i+2];
        ins.operand_2 = buf[i+3];
        ins.lval      = (buf[i+2] << 8) + buf[i+3];
        ins.valid     = true;
        ins.size      = 4;

        var opcode    = this.ins_opcode_str(buf[i  ]);
        var operand_0 = this.ins_reg_str(   buf[i+1]);
        var operand_1 = this.ins_reg_str(   buf[i+2]);
        var operand_2 = this.ins_reg_str(   buf[i+3]);
        var lval      = hex((buf[i+2] << 8) + buf[i+3]);

        if(!opcode)
            return null;

        switch(buf[i]) {
            case HS.OP.ADD:
            case HS.OP.SUB:
            case HS.OP.MUL:
            case HS.OP.DIV:
            case HS.OP.MOD:
            case HS.OP.AND:
            case HS.OP.OR :
            case HS.OP.XOR:
                if(!operand_0 || !operand_1 || !operand_2)
                    return null;
                ins.str = opcode+' '+operand_0+', '+operand_1+', '+operand_2;
                return ins;

            case HS.OP.ADDLVAL:
            case HS.OP.SUBLVAL:
            case HS.OP.MULLVAL:
            case HS.OP.DIVLVAL:
            case HS.OP.MODLVAL:
            case HS.OP.ANDLVAL:
            case HS.OP.ORLVAL :
            case HS.OP.XORLVAL:
                if(!operand_0)
                    return null;
                ins.str = opcode+' '+operand_0+', '+lval;
                return ins;

            case HS.OP.MOV   :
            case HS.OP.CMP   :
            case HS.OP.LOADR :
            case HS.OP.STORR :
            case HS.OP.LOADBR:
            case HS.OP.STORBR:
                if(!operand_0 || !operand_1)
                    return null;
                ins.str = opcode+' '+operand_0+', '+operand_1;
                return ins;

            case HS.OP.JE      :
            case HS.OP.JNE     :
            case HS.OP.JL      :
            case HS.OP.JLE     :
            case HS.OP.JG      :
            case HS.OP.JGE     :
                ins.destinations.push(i + 4);
            case HS.OP.JMP     :
            case HS.OP.CALL    :
                var dest = ins.lval&0x8000 ? ins.lval-0x10000:ins.lval;
                ins.destinations.push(i + 4 + dest);
            case HS.OP.PUSHLVAL:
                ins.str = opcode+' '+lval;
                return ins;

            case HS.OP.LOAD   :
            case HS.OP.STOR   :
            case HS.OP.LOADB  :
            case HS.OP.STORB  :
            case HS.OP.MOVLVAL:
            case HS.OP.CMPLVAL:
                if(!operand_0)
                    return null;
                ins.str = buf[i] == HS.OP.STOR ?
                    opcode+' '+lval+', '+operand_0:
                    opcode+' '+operand_0+', '+lval
                ;
                return ins;

            case HS.OP.CALLR:
            case HS.OP.IN   :
            case HS.OP.OUT  :
            case HS.OP.PUSH :
            case HS.OP.POP  :
                if(!operand_0)
                    return null;
                ins.str = opcode+' '+operand_0;
                return ins;

            case HS.OP.RET    :
            case HS.OP.HLT    :
            case HS.OP.SYSCALL:
            case HS.OP.NOP    :
                ins.str = opcode;
                return ins;
        }

        return null;
    },
    'parse':function(buf, opcodes, functions) {
        //Maybe ditch this
        //First pass: Find functions
        this._parseFindFunctions(buf, opcodes, functions);
    
        //Parse each function
        for(var i = 0; i<functions.length; ++i) {
            var ins = functions[i].basicblocks[0].instructions[0];

            var queue = [ins.addr + 4];

            this._parseQueue(buf, opcodes, functions, queue, i);
            var bbl = functions[i].basicblocks.length;
            if(!functions[i].basicblocks[bbl - 1].length) functions[i].basicblocks.pop();
        }
    },
    '_parseFindFunctions':function(buf, opcodes, functions) {
        //Maybe ditch this
        //First pass: Find functions
        for(var i=0; i<buf.length; ++i) {
            opcodes[i] = this.get_ins(buf, i);

            //If we can't parse the op, nothing we can do
            if(!opcodes[i]) continue;

            var dest = 0;

            //If it's the first instruction, always add it
            if(i!=0) {
                //Otherwise, require a CALL instruction
                if(opcodes[i].opcode != HS.OP.CALL) continue;

                //Calculated the destination address of the call
                var dest = i + 4 + opcodes[i].lval;

                //Check if the opcode is already defined
                if(opcodes[dest] && (opcodes[dest].flags & OP_FLAG.FUNC)) continue;
                if(!opcodes[dest]) opcodes[dest] = this.get_ins(buf, dest);

                //Error, invalid jump!
                if(!opcodes[dest]) continue;
            } else
                dest = i;

            opcodes[dest].flags |= HS.OP_FLAG.FUNC;

            //OK, add it to the list
            functions.push(new Function(
                new BasicBlock(opcodes[dest])
            ));
        }
    },
    '_parseQueue':function(buf, opcodes, functions, queue, i) {
        while(queue.length) {
            var bbi = functions[i].basicblocks.length - 1;

            //Disassemble the opcode if it doesn't exist
            var c_ins = opcodes[queue[0]] = opcodes[queue[0]] || get_ins(buf, queue[0]);

            if(c_ins) {
                //If it's already in a basic block...
                if(c_ins.basicblock) {
                    //Terminate this bb
                    queue.shift();

                    //And it's the head instruction
                    if(c_ins.basicblock.instructions[0] == c_ins) {
                        //Setup a new basic block!
                        if(functions[i].basicblocks[bbi].instructions.length) functions[i].add(new BasicBlock());
                    } else {
                        var bb = c_ins.basicblock.split(c_ins);
                        if(!functions[i].basicblocks[bbi].instructions.length) functions[i].rem(bbi, 1);
                        functions[i].add(new BasicBlock());
                    }
                    continue;
                }

                functions[i].basicblocks[bbi].add(c_ins);

                switch(c_ins.opcode) {
                    //Check if it's a branch statement
                    case HS.OP.JMP:
                    case HS.OP.JE :
                    case HS.OP.JNE:
                    case HS.OP.JL :
                    case HS.OP.JLE:
                    case HS.OP.JG :
                    case HS.OP.JGE:
                        //Push all the destinations onto the queue if yes
                        for(var j=0; j<c_ins.destinations.length; ++j) queue.push(c_ins.destinations[j]);
                    //Or if it's a return/halt
                    case HS.OP.RET:
                    case HS.OP.HLT:
                        //Then terminate this bb
                        queue.shift();

                        //Setup a new basic block!
                        if(functions[i].basicblocks[bbi].instructions.length) functions[i].add(new BasicBlock());
                        continue;
                    //Found a call instruction, add the
                    case HS.OP.CALL:
/*This causes bugs.
                        var tc_ins = opcodes[c_ins.lval] = opcodes[c_ins.lval] || HS.get_ins(buf, c_ins.lval);
                        if(tc_ins && !(tc_ins.flags & HS.OP_FLAG.FUNC)) {
                            functions.push(new Function(new BasicBlock(tc_ins)));
                            tc_ins.flags |= HS.OP_FLAG.FUNC;
                        }
*/
                }
            } else {
                //If the instruction is invalid
                log.error('Invalid instruction!');
                //Then terminate this bb
                queue.shift();
                //Setup a new basic block!
                if(functions[i].basicblocks[bbi].instructions.length) functions[i].add(new BasicBlock());
            }
            if(queue.length) queue[0]+=4;
        }
    }
};