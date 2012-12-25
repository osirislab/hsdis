//Functs
//Ver 0.1.010
var css={'float':'cssFloat'};
function $(x){return document.getElementById(x)}
function $$(x,p){if(!p)p=document;return p.getElementsByTagName(x)}
function elem(x){return document.createElement(x)}
function h2d(h) {return parseInt(h,16)}
function d2h(d) {return d.toString(16)}
function max(x,y) {return x>y ? x:y}
function min(x,y) {return x<y ? x:y}
function clamp(x,y,z) {return x>y ? x:(y>z ? z:y)}
function pad(t,n,r,p) {if(r==null)r='0';var c=n-(t+'').length;for(var i=0;i<c;i++)if(p)t=r+t;else t=t+r;return t}
function ajax(u,c,e,d){var x;if(window.XMLHttpRequest)x=new XMLHttpRequest();else x=new ActiveXObject("Microsoft.XMLHTTP");
x.onreadystatechange=function(){if(x.readyState==4)if(x.status!=200 && x.status!=304){if(e)e(x.status,d)}else if(c){c(x.responseText,d)}};x.open('GET',u,true);
x.setRequestHeader('Accept',' ');x.setRequestHeader('Content-Type',' ');x.send()}
Element.prototype.add=function(x){if(!(x instanceof Array))x=[x];for(var i=0;i<x.length;++i)this.appendChild(x[i]);return this};
Element.prototype.ins=function(x,y,z){if(!(x instanceof Array))x=[x];if(z!=0)y=y.nextSibling;for(var i=0;i<x.length;++i)this.insertBefore(x[i],y);return this};//Use # args instead, in case null is passed
Element.prototype.set=function(x,y){if(y!=null){var a=x;x={};x[a]=y}for(var z in x)this.setAttribute(z,x[z]);return this};
Element.prototype.get=function(x,y){return x=='html' ? this.innerHTML:this.getAttribute(x,y)};
Element.prototype.eid=function(x){this.set('id',x);return this};
Element.prototype.val=function(x){this.set('value',x);return this};
Element.prototype.cls=function(x){this.set('class',x);return this};
Element.prototype.css=function(x,y){if(y==null && !(x instanceof Object))this.set('style',x);
else{	if(!(x instanceof Object)){var a=x;x={};x[a]=y}for(var z in x){if(css[z])z=css[z];this.style[z]=x[z];}}return this};
Element.prototype.html=function(x){this.innerHTML=x==null ? '':x;return this};
Element.prototype.rem=function(){if(!this.parentNode)return this;return this.parentNode.removeChild(this)};
Element.prototype.evt=function(x,y,z){this.addEventListener(x,y,z==null ? false:z);return this};
Element.prototype.cpy=function(){var x=elem(this.tagName);for(var y in this)x.set(y,x[y]);return x;} //Incomp
window.evt=function(x,y,z){this.addEventListener(x,y,z==null ? false:z);return this};
HTMLSelectElement.prototype.add=function(x){if(!(x instanceof Array))x=[x];for(var i=0;i<x.length;++i)this.options[this.options.length]=x[i];return this}