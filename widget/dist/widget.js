!function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,n){"use strict";function r(t,e){if(!t)throw Error("API method required");if(t=t.toLowerCase(),-1===i.indexOf(t))throw Error("Method ".concat(t," is not supported"));switch(t){case"paper":Object(o.a)(e);break;default:console.warn("No handler defined for ".concat(t))}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),i=["paper"];!function(t){var e=t[t["ORKG-Widget"]],n=e.q;if(n)for(var o=0;o<n.length;o++)r(n[o][0],n[o][1]);e=r}(window)},function(t,e,n){"use strict";function r(t){for(var e=document.getElementsByClassName("orkg-widget"),n=0;n<e.length;n++)!function(n){var r=document.createElement("div");r.innerHTML=i.a,r.getElementsByClassName("orkg-widget-icon")[0].src=s.a;var o=e[n],a=o.getAttribute("data-doi");l(a).then(function(e){for(r.getElementsByClassName("orkg-widget-txt-link")[0].textContent=c.open[t.language],r.getElementsByClassName("orkg-widget-text-statements")[0].textContent=c.numStatements[t.language],r.getElementsByClassName("orkg-widget-statements")[0].textContent=e.num_statements,r.getElementsByClassName("orkg-widget-link")[0].href="http://localhost:3000/paper/"+e.id;r.children.length>0;)o.appendChild(r.children[0])}).catch(function(e){r.getElementsByClassName("orkg-widget-txt-link")[0].textContent=c.add[t.language],r.getElementsByClassName("orkg-widget-link")[0].href="http://localhost:3000/add-paper";var n=r.getElementsByClassName("orkg-widget-description")[0];for(n.parentNode.removeChild(n);r.children.length>0;)o.appendChild(r.children[0])})}(n)}e.a=r;var o=n(2),i=n.n(o),a=n(3),s=(n.n(a),n(8)),c={add:{de:"Artikel zu ORKG hinzufügen",en:"Add paper to ORKG"},open:{de:"In ORKG öffnen",en:"Open in ORKG"},numStatements:{de:"Anzahl der Aussagen",en:"Number of statements"}},l=function(t){var e="http://localhost:8000/api/widgets/?doi="+t;return new Promise(function(t,n){fetch(e).then(function(e){if(e.ok){var r=e.json();if(!r.then)return t(r);r.then(t).catch(n)}else n({error:new Error("Error response. (".concat(e.status,") ").concat(e.statusText)),statusCode:e.status,statusText:e.statusText})}).catch(n)})}},function(t,e){t.exports='<div class="orkg-widget-box">\n    <a href="#" class="orkg-widget-link" target="_blank">\n        <span class="orkg-widget-label">\n            <img src="xxxHTMLLINKxxx0.30851722778768330.9687178139899817xxx" class="orkg-widget-icon" />\n            <span class="orkg-widget-txt-link">Open in ORKG</span>\n        </span>\n    </a>\n    <div class="orkg-widget-description">\n        <span class="orkg-widget-text-statements">Number of statements</span>\n        <span class="orkg-widget-statements">0</span>\n    </div>\n</div>\n'},function(t,e,n){var r=n(4);"string"==typeof r&&(r=[[t.i,r,""]]);var o={hmr:!0};o.transform=void 0;n(6)(r,o);r.locals&&(t.exports=r.locals)},function(t,e,n){e=n(5)(!1),e.push([t.i,".orkg-widget-box {\n    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n    border: 1px solid rgb(232, 97, 97);\n}\n.orkg-widget-link {\n    color: #fff;\n    background-color: rgb(232, 97, 97);\n    border-color: rgb(232, 97, 97);\n    padding: 6px 12px;\n    display: block;\n    margin-bottom: 0 !important;\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 1.42857143;\n    text-align: center;\n    white-space: nowrap;\n    touch-action: manipulation;\n    cursor: pointer;\n    user-select: none;\n    background-image: none;\n    border: 1px solid transparent;\n    text-decoration: none;\n}\n.orkg-widget-link:hover,\n.orkg-widget-link:focus {\n    color: #fff;\n    background-color: #e34040;\n    border-color: #e23434;\n}\n.orkg-widget-description {\n    padding: 5px;\n}\n.orkg-widget-label {\n    position: relative;\n    left: -3px;\n    text-align: left;\n    display: inline-block;\n    background: transparent;\n}\n.orkg-widget-icon {\n    width: 24px;\n    vertical-align: middle;\n}\n.orkg-widget-statements {\n    float: right;\n    font-weight: bold;\n}\n",""]),t.exports=e},function(t,e,n){"use strict";function r(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=o(r);return[n].concat(r.sources.map(function(t){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(t," */")})).concat([i]).join("\n")}return[n].join("\n")}function o(t){return"/*# ".concat("sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(t)))))," */")}t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var n=r(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n}).join("")},e.i=function(t,n,r){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var s=0;s<t.length;s++){var c=[].concat(t[s]);r&&o[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c))}},e}},function(t,e,n){function r(t,e){for(var n=0;n<t.length;n++){var r=t[n],o=g[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(f(r.parts[i],e))}else{for(var a=[],i=0;i<r.parts.length;i++)a.push(f(r.parts[i],e));g[r.id]={id:r.id,refs:1,parts:a}}}}function o(t,e){for(var n=[],r={},o=0;o<t.length;o++){var i=t[o],a=e.base?i[0]+e.base:i[0],s=i[1],c=i[2],l=i[3],f={css:s,media:c,sourceMap:l};r[a]?r[a].parts.push(f):n.push(r[a]={id:a,parts:[f]})}return n}function i(t,e){var n=v(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=w[w.length-1];if("top"===t.insertAt)r?r.nextSibling?n.insertBefore(e,r.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),w.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=v(t.insertInto+" "+t.insertAt.before);n.insertBefore(e,o)}}function a(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=w.indexOf(t);e>=0&&w.splice(e,1)}function s(t){var e=document.createElement("style");return t.attrs.type="text/css",l(e,t.attrs),i(t,e),e}function c(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",l(e,t.attrs),i(t,e),e}function l(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n])})}function f(t,e){var n,r,o,i;if(e.transform&&t.css){if(!(i=e.transform(t.css)))return function(){};t.css=i}if(e.singleton){var l=b++;n=m||(m=s(e)),r=u.bind(null,n,l,!1),o=u.bind(null,n,l,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(e),r=p.bind(null,n,e),o=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),r=d.bind(null,n),o=function(){a(n)});return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else o()}}function u(t,e,n,r){var o=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=A(e,o);else{var i=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function d(t,e){var n=e.css,r=e.media;if(r&&t.setAttribute("media",r),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function p(t,e,n){var r=n.css,o=n.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(r=x(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}var g={},h=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),v=function(t){var e={};return function(n){if(void 0===e[n]){var r=t.call(this,n);if(r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(t){r=null}e[n]=r}return e[n]}}(function(t){return document.querySelector(t)}),m=null,b=0,w=[],x=n(7);t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=h()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=o(t,e);return r(n,e),function(t){for(var i=[],a=0;a<n.length;a++){var s=n[a],c=g[s.id];c.refs--,i.push(c)}if(t){r(o(t,e),e)}for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete g[c.id]}}}};var A=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,r=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var o=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o))return t;var i;return i=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},function(t,e,n){"use strict";e.a="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAkCAMAAADfNcjQAAAArlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8tivQqAAAAOXRSTlMABAf6EfcL1oE7xDYYWu/ib5R8VElA5si4l4+JdBzrv08z8d7OsqydhGNeRjArJiHboHgVD6i6Z6J3b8ivAAACPElEQVQ4y3VUB5KjQAwUOWewiY7rnNfe2+v/f+zEDK7yVdmiCmZoqdXSCOjFFMosRDt+vjeFfoHxCC0pH3APWkD6Gs4nDhcNQ4r19Z5ACRDqjNMcxXuKY2PLVOW6J1J4Ofg9zqeLrqQ/sSIdnEh9DfRKDcDeBlCR5B576nxXr9w/rUnkwFgnm+nc0gxtpD8Er53Os9xxcnti+TS29KEEDWUe2R27OA1J042Kwm9SFY46jRfW6QZMGp/MVGpUyb3SuJZ5dccz6ZJGwKilgykZ1IlLe0tKz7H0eeFvQ8DNht7u0bLkGSl8BZiYoojzD6DZQqw+CjnoOFaZi2JYQxtodgWmR15OkVIfa/PNrPE8Ao7cAIUTXG5XlYTHgQ7FFq6AJUkc/LLauS/3rGxLNqYSHkg0GFjTkDW5EaVwXx3u0AyUpIjNX5dvrdTw1FnYwKLwxa4JTa5iJ6uQeArDy749O+oblsHra56BdxL2XOBrTvSYoCbSFxvRKA9GJ+B7bQCJ2p+EoxknatAJ4gvCM8NmHAHX2ZCrQkLhIF51nDt1scXaav05k2dtSbjxcfehm3CU7QCtdES0MBppZCwvwvkbgHGM1p6at7n+nGPNIhvGqqqmQcIjB1E4ndLyTxVnOb/DjEMnYFsdACxNmdw858nXAoB7ELNU7HeZQ/tV3Q3igp5I7brHUMzT4mQY1abv3AsoBSvmEp7oWRuT8vbrLlD2/fOt+6f/wwYx57bsj78QdYUfO5p+xJlkGxrV//A/nMo2F7Pql/EAAAAASUVORK5CYII="}]);