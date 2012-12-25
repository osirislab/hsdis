//Clean up HS code
//Fix drag
//  Processor specific code
//  Container specific code
//  Need abstraction layer for both exec format (PE/ELF) and the arch
//Views:
//  Graph
//  Dis
//  Hex
//Provide a view for every type
//Create vs Render
document.head.add(elem('style').html(
    'body { margin: 0px; background: url(Xmg/bg.jpg) no-repeat; background-size: cover; font-family: lucida console; }' +
    '#hidden { width: 0px; height: 0px; overflow: hidden; }' +
    '#nav { width: 100%; position: fixed; border-bottom: solid 1px; background: grey; z-index: 1; }' +

    '.nav_img { opacity: 0.8; cursor: pointer; margin: 1px 0px; }' +
    '.nav_img:hover { opacity: 1; }' +
    '.nav_btn { cursor: pointer; display: inline-block; font-size: 12px; background: rgba(200,200,200,0.8); padding: 1px; border: solid; border-width: 1px 1px 0px 1px; margin: 0px 3px 0px 3px; }' +
    '.active_btn { padding: 3px 3px 1px 3px; margin: 0px 1px 0px 1px; background: rgba(255,255,255,0.8); }' +
    '.nav_elem { display: inline-block; }' +
    '.tab { background: rgba(255,255,255,0.8); position: absolute; width: 100%; top: 30px; bottom: 0px; overflow: hidden; }' +
    '.tab_content { position: absolute; top: 0px; bottom: 0px; width: 100%; overflow: scroll; }' +
    //Hex view
    '.hexblock { display: inline-block; width: 30px; }' +
    //Graph view
    '.basicblock { border: solid; border-width: 1px 2px 2px 1px; position: absolute; background: #999999; }' +
    '.basicblockhead { height: 16px; background: lightblue; border-bottom: solid 1px; }' +
    '.ins { border: none; margin: 0px; font-family: lucida console; font-size: 12pt; width: 100%; }' +
    '.line { position: absolute; pointer-events: none; }' +
    //Ins components
    '.val { color: blue; }' +
    '.op { color: green; }' +
    '.reg { color: red; }'
));

//Controls UI on the nav bar
var nav_bar = {
    'data':{
        'buttons':[],
        'tabs':[]
    },
    'ui':{
        'nav':elem('div').eid('nav'),
        'tab_nav_elem':elem('div').cls('nav_elem'),
        'tab_elem':elem('div').cls('tab'),
        'hidden':elem('div').eid('hidden'),
        'btn_nav_elem':elem('div').cls('nav_elem'),
        'curr_tab':null
    },
    'init':function(parent) {
        this.ui.nav.add(this.ui.btn_nav_elem);
        this.ui.nav.add(this.ui.tab_nav_elem);
        parent.add(this.ui.hidden);
        parent.add(this.ui.nav);
        parent.add(this.ui.tab_elem);
    },
    'add_hidden':function(e) {
        this.ui.hidden.add(e);
    },
    'add_button':function(b) {
        b.cls('nav_img');
        this.data.buttons.push(b);
        this.ui.btn_nav_elem.add(b)
    },
    'add_tab':function(name, tab) {
        var t = this;
        var tab_nav_elem = elem('span')
            .cls('nav_btn'+ (!this.data.tabs.length ? ' active_btn':''))
            .html(name)
            .evt('click', function() {
                if(t.ui.curr_tab == this) return;
                t.ui.tab_elem.html();
                t.ui.tab_elem.add(tab);
                this.cls('nav_btn active_btn');
                t.ui.curr_tab.cls('nav_btn');
                t.ui.curr_tab = tab_nav_elem;
            })
        ;
        this.ui.tab_nav_elem.add(tab_nav_elem);
        if(!this.data.tabs.length) {
            this.ui.tab_elem.add(tab);
            this.ui.curr_tab = tab_nav_elem;
        }
        this.data.tabs.push({'name':name, 'tab':tab_nav_elem, 'content':tab});
    },
    'del_tab':function(i) {
        if(this.ui.curr_tab == this.data.tabs[i].tab) {
            this.ui.curr_tab = null;
        }
        this.data.tabs[i].content.rem();
        this.data.tabs[i].tab.rem();
        this.data.tabs.splice(i, 1);
    },
    'clear_tabs':function() {
        while(this.data.tabs.length) this.del_tab(0);
    },
};

var load_bar = {
    'data':{
        'active':false
    },
    'ui':{
        'overlay':elem('div').eid('overlay'),
        'prog':elem('div').eid('prog'),
        'prog_bar':elem('div').eid('prog_bar')
    },
    'init':function(parent) {
        parent.add(this.ui.overlay);
    },
    'update':function(i) {
        this.ui.prog_bar.css('width', (i|0)+'%');
    }
};

var log = {
    'error':function(s) {
        console.log(s);
    }
};

var TAB_TYPE = {
    'GRAPH':0,
    'DIS':1,
    'HEX':2
};
var TAB_TEXT = ['Graph', 'Dis', 'Hex'];

var _dis = {
    'data':{
        'buf':null,
        'ops':null,
        'functions':null
    },
    'init':function() {
        load_bar.init(document.body);
        nav_bar.init(document.body);
        var t = this;
        //Setup the hidden file target
        var file = elem('input').set('type', 'file').evt('change', function(e) {
            if(!e.target.files.length) return;
            var f = e.target.files[0]

            try {
                if( f.size > 4 * 1024 * 1024 && 
                    !confirm('This file is over 4MB. Are you sure you want to open it?')
                ) return;
                var reader = new FileReader();
                reader.onerror = function(x) { alert(x); };
                reader.onload = function() { t.load(reader.result, HS); /*HACK*/ };
                reader.readAsBinaryString(f);
            } catch(e) { alert('Unable to open file'); }
        });
        nav_bar.add_hidden(file);
        var buttons = [];

        //Setup the open button
        var open = elem('img').set('src', 'img/open.png').evt('click', function() {
            file.focus();
            file.click();
        });
        nav_bar.add_button(open);

        //Setup the save button
        var save = elem('img').set('src', 'img/save.png').evt('click', function() {
            t.save();
        });
        nav_bar.add_button(save);

        //Setup the close button
        var close = elem('img').set('src', 'img/close.png').evt('click', function() {
            t.close();
        });
        nav_bar.add_button(close);
    },
    'load':function(data, X) {
        //Close all tabs
        this.close();

        var _buf = new ArrayBuffer(data.length);
        this.data.buf = new Uint8Array(_buf);
        for(var i = 0; i<data.length; ++i)
            this.data.buf[i] = data.charCodeAt(i);

        this.data.ops = [];
        this.data.functions = [];
        X.parse(this.data.buf, this.data.ops, this.data.functions);

        for(var i = 0; i<this.data.functions.length; ++i)
            _dis.renderGraph(i);
    },
    'close':function() {
        nav_bar.clear_tabs();
        this.data.buf = null;
        this.data.ops = null;
        this.data.functions = null;
    },
    'save':function() {
        if(!this.data.buf || !this.data.buf.length) return;
        var str = '';
        for(var i = 0; i<this.data.buf.length; ++i)
            str += String.fromCharCode(this.data.buf[i]);
            //FIXME:Use downloadify?
            document.location.href = 'data:binary/octet-stream;base64,' + btoa(str);
    },
    'renderGraph':function(fi) {
        var queue = [this.data.functions[fi].basicblocks[0]];
        var funct = this.data.functions[fi];

        //Draw graph view
        var graph_data_cntr = elem('div').cls('tab_content');
        nav_bar.add_tab('Graph', graph_data_cntr);

        //Set up basic blocks
        var bb_map = {};
        for(var i = 0; i<funct.basicblocks.length; ++i) {
            var ins_addr = funct.basicblocks[i].instructions[0].addr;
            var bb_data = this._setUpGraphBasicBlock(graph_data_cntr, funct.basicblocks[i]);
            bb_map[ins_addr] = bb_data;

            graph_data_cntr.add(bb_data.elem);
        }

        //Connect basic blocks
        for(var i = 0; i<funct.basicblocks.length; ++i) {
            var bb = funct.basicblocks[i];
            var dests = [];
            var bb_data = bb_map[bb.instructions[0].addr];

            //Collect all the destinations
            for(var j = 0; j<bb.next.length; ++j) {
                var dest = bb.next[j];

                if(!bb_map[dest]) {
                    log.error("Destination " + hex(dest,8) + " doesn't exist");
                    continue;
                }
                dests.push(bb_map[dest]);
            }
/*-Might want to rework, graph_data_cntr is gettign passed in anyway-*/
            //Parse destinations
            var line_data = this._setUpGraphLines(graph_data_cntr, bb_data, dests);

            for(var j = 0; j<line_data.length; ++j)
                graph_data_cntr.add(line_data[j].elem);
/*--*/
        }
    },
    '_colorizeIns':function(str) {
        var p = str.split(/,? /);
        var ret = elem('span').cls('val').html(p[0]).outerHTML + ' ' +
                  elem('span').cls('op').html(p[1]).outerHTML;
        for(var i = 2; i<p.length; ++i)
            ret += (i>2 ? ',':'') + ' ' + elem('span').cls('reg').html(p[i]).outerHTML;
        return ret;
    },
    '_setUpGraphBasicBlock':function(cntr, bb) {
        var data = {};
        data.x = Math.random()*1000|0;
        data.y = bb.instructions[0].addr*8; //HACK
        data.block = bb;
        data.lines = [];

        data.elem = elem('div').cls('basicblock');
        data.headelem = elem('div').cls('basicblockhead');
        data.elem.css('left', data.x + 'px');
        data.elem.css('top', data.y + 'px');
        data.elem.add(data.headelem);

        //Set up instructions
        for(var j = 0; j<bb.instructions.length; ++j) {
            var ins_data = bb.instructions[j];
            var ins_elem = elem('div').cls('ins').html(
                this._colorizeIns(hex(ins_data.addr, 8) + ' ' + ins_data.str)
            );
            data.elem.add(ins_elem);
        }
        this._setUpGraphBasicBlockCallbacks(cntr, data);

        return data;
    },
    '_setUpGraphBasicBlockCallbacks':function(cntr, data) {
        var t = this;
        var mouse_start = [0,0];
        var elem_start = [0,0];
        var move = false;

        cntr.evt('mouseup', function() { move = false; });

        data.headelem.evt('mousedown', function(e) {
            mouse_start = [e.clientX, e.clientY];
            elem_start = t._calculateElementPos(data.headelem);
            move = true;
        });
        cntr.evt('mousemove', function(e) {
            if(!move) return;
            data.x = elem_start[0] + e.clientX - mouse_start[0];
            data.y = elem_start[1] + e.clientY - mouse_start[1] -31; //HACK
            t._renderGraphBasicBlock(data);
            for(var i = 0; i<data.lines.length; ++i)
                t._renderGraphLine(data.lines[i]);
        });
    },
    '_renderGraphBasicBlock':function(data) {
        data.elem.css('left', data.x + 'px');
        data.elem.css('top', data.y + 'px');
    },
    '_setUpGraphLines':function(cntr, bb_data, dests) {
        var t = this;
        bb_data.dests = dests;

        for(var i = 0; i<dests.length; ++i) {
            var dest_data = dests[i];
            var line = elem('canvas').cls('line');
            var line_data = {'elem':line, 'source':bb_data, 'dest':dest_data, 'type':i!=0};

            this._renderGraphLine(line_data);
            bb_data.lines.push(line_data);
            dest_data.lines.push(line_data);
        }

        return bb_data.lines;
    },
    '_renderGraphLine':function(line_data) {
        var src_pos = [
            (line_data.source.x + line_data.source.elem.offsetWidth/2)|0,
            line_data.source.y + line_data.source.elem.offsetHeight
        ];
        var dest_pos = [
            (line_data.dest.x + line_data.dest.elem.offsetWidth/2)|0,
            line_data.dest.y
        ];
        var size = [
            Math.abs(dest_pos[0]-src_pos[0]),
            Math.abs(src_pos[1]-dest_pos[1])
        ];
        if(!size[0]) size[0] = 1;
        if(!size[1]) size[1] = 1;
        line_data.elem.css('left', min(src_pos[0], dest_pos[0]) + 'px')
            .css('top', min(src_pos[1], dest_pos[1]) + 'px')
            .set('width', size[0])
            .set('height', size[1]);
        var ctx = line_data.elem.getContext('2d');
        ctx.strokeStyle = line_data.type ? 'green':'red';
        ctx.moveTo(src_pos[0] > dest_pos[0] ? 0:size[0], src_pos[1] > dest_pos[1] ? 0:size[1]);
        ctx.lineTo(src_pos[0] > dest_pos[0] ? size[0]:0, src_pos[1] > dest_pos[1] ? size[1]:0);
        ctx.stroke();
    },
    '_calculateElementPos':function(obj) { //Quirksmode.org
        var curleft = curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        return [curleft,curtop];
    },
    'render':{ //Render function, maybe place elsewhere?
        'Hex':function(tab) {
            //Draw hex view
            var hex_data_cntr = elem('div');
            for(var i = 0; i<this.data.buf.length; ++i) {
                hex_data_cntr.add(elem('span')
                    .html(hex(this.data.buf[i], 2))
                    .cls('hexblock')
                );
            }
            nav.content.add(hex_data_cntr);
        },
        'Dis':function(tab) {
            var hex_data_cntr = elem('div');
            
        }
    }
};


window.addEventListener('load', function() {
    _dis.init();
    _dis.load(atob(
    "UQgJABMJEABRAQkAQAMAADcBAwBAAwAAUgQAARAEBAE3BAMAUgIAAlQCEAAhAAAsQAMAAFQD//8h"+
    "AAAgEAQBAjcEAwBUAwAAIQAACBECAAEgAP/UQgEAACcAAARgAAAAQggAAFEICQBCAQAAQgIAAEID"+
    "AABCBAAAUQEIABEBAAQxAQEAQgEAACcAAFwRCQACUQIAABIJCQJRAwkAQgMAAEIBAAAnAABgEQkA"+
    "BFIEAABTBAIAIQAAFBABAwQzAQEAQQEAABEEAAEgAP/kEAkJAkQEAABEAwAARAIAAEQBAABECAAA"+
    "KQAAAEIIAABRCAkAUQAIABEAAAQxAAAAMQAAAEQIAAApAAAAQggAAFEICQBCAQAAQgIAAEIDAABC"+
    "BAAAQgUAAEIGAABCCgAAUQEIABEBAAQxAQEAUQIIABECAAYxAgIAQgEAACcA/5wRCQACUQMAABEB"+
    "AAJSBAAAUgUAAFMFAwAmAABgEAYBBDMGBgBUBgAAIQAAUFQGAIAmAAAUEAACBTcABgARBAABEQUA"+
    "ASAA/8wbBgB/EQQAARAKAQQzCgoAVAYAACEAABQQAAIFNwAKABEFAAETBgABIAD/5BEEAAEgAP+Y"+
    "RAoAAEQGAABEBQAARAQAAEQDAABEAgAARAEAAEQIAAApAAAA"
    ), HS);
});