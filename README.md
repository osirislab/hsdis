hsdis
=====
A CFG generator written in js. Currently supports hsvm machine code from [Haxathon Supremacy](https://github.com/endeav0r/hsvm), although other architectures are possible.

Install
-------
Nothing to see here.

Help
----
Open up `index.html` in a relatively recent web browser. The interface should load in a second or two and the CFG can be browsed.
A _green_ link from the bottom of a basic block to another indicates a conditional jump to that location. A _red_ link indicates an unconditional jump or the fall through from a conditional jump.

The nav bar contains a series of buttons to load, save and close a binary. The tabs may be used to navigate between the functions in the binary.
