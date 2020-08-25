(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  window.edithRecord=function(){var e,t=function(){return (t=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)};function n(e){var t="function"==typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}}function o(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var o,r,a=n.call(e),i=[];try{for(;(void 0===t||t-- >0)&&!(o=a.next()).done;)i.push(o.value);}catch(e){r={error:e};}finally{try{o&&!o.done&&(n=a.return)&&n.call(a);}finally{if(r)throw r.error}}return i}function r(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(o(arguments[t]));return e}!function(e){e[e.Document=0]="Document",e[e.DocumentType=1]="DocumentType",e[e.Element=2]="Element",e[e.Text=3]="Text",e[e.CDATA=4]="CDATA",e[e.Comment=5]="Comment";}(e||(e={}));var a=1,i=RegExp("[^a-z1-6-]");function u(e){try{var t=e.rules||e.cssRules;return t?Array.from(t).reduce((function(e,t){return e+(function(e){return "styleSheet"in e}(n=t)?u(n.styleSheet)||"":n.cssText);var n;}),""):null}catch(e){return null}}var s,c,l,d,p,f=/url\((?:'([^']*)'|"([^"]*)"|([^)]*))\)/gm,m=/^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/,h=/^(data:)([\w\/\+\-]+);(charset=[\w-]+|base64).*,(.*)/i;function v(e,t){return (e||"").replace(f,(function(e,n,o,r){var a,i=n||o||r;if(!i)return e;if(!m.test(i))return "url('"+i+"')";if(h.test(i))return "url("+i+")";if("/"===i[0])return "url('"+(((a=t).indexOf("//")>-1?a.split("/").slice(0,3).join("/"):a.split("/")[0]).split("?")[0]+i+"')");var u=t.split("/"),s=i.split("/");u.pop();for(var c=0,l=s;c<l.length;c++){var d=l[c];"."!==d&&(".."===d?u.pop():u.push(d));}return "url('"+u.join("/")+"')"}))}function y(e,t){if(!t||""===t.trim())return t;var n=e.createElement("a");return n.href=t,n.href}function g(e,t,n){return "src"===t||"href"===t&&n?y(e,n):"srcset"===t&&n?function(e,t){return ""===t.trim()?t:t.split(",").map((function(t){var n=t.trimLeft().trimRight().split(" ");return 2===n.length?y(e,n[0])+" "+n[1]:1===n.length?""+y(e,n[0]):""})).join(",")}(e,n):"style"===t&&n?v(n,location.href):n}function S(t,n,o,r,a){switch(void 0===a&&(a={}),t.nodeType){case t.DOCUMENT_NODE:return {type:e.Document,childNodes:[]};case t.DOCUMENT_TYPE_NODE:return {type:e.DocumentType,name:t.name,publicId:t.publicId,systemId:t.systemId};case t.ELEMENT_NODE:var s=!1;"string"==typeof o?s=t.classList.contains(o):t.classList.forEach((function(e){o.test(e)&&(s=!0);}));for(var c=function(e){var t=e.toLowerCase().trim();return i.test(t)?"div":t}(t.tagName),l={},d=0,p=Array.from(t.attributes);d<p.length;d++){var f=p[d],m=f.name,h=f.value;l[m]=g(n,m,h);}if("link"===c&&r){var y,S=Array.from(n.styleSheets).find((function(e){return e.href===t.href}));(y=u(S))&&(delete l.rel,delete l.href,l._cssText=v(y,S.href));}if("style"===c&&t.sheet&&!(t.innerText||t.textContent||"").trim().length)(y=u(t.sheet))&&(l._cssText=v(y,location.href));if("input"===c||"textarea"===c||"select"===c){h=t.value;"radio"!==l.type&&"checkbox"!==l.type&&"submit"!==l.type&&"button"!==l.type&&h?l.value=a[l.type]||a[c]?"*".repeat(h.length):h:t.checked&&(l.checked=t.checked);}if("option"===c){var b=t.parentElement;l.value===b.value&&(l.selected=t.selected);}if("canvas"===c&&(l.rr_dataURL=t.toDataURL()),"audio"!==c&&"video"!==c||(l.rr_mediaState=t.paused?"paused":"played"),s){var C=t.getBoundingClientRect(),w=C.width,E=C.height;l.rr_width=w+"px",l.rr_height=E+"px";}return {type:e.Element,tagName:c,attributes:l,childNodes:[],isSVG:(k=t,"svg"===k.tagName||k instanceof SVGElement||void 0),needBlock:s};case t.TEXT_NODE:var I=t.parentNode&&t.parentNode.tagName,N=t.textContent,T="STYLE"===I||void 0;return T&&N&&(N=v(N,location.href)),"SCRIPT"===I&&(N="SCRIPT_PLACEHOLDER"),{type:e.Text,textContent:N||"",isStyle:T};case t.CDATA_SECTION_NODE:return {type:e.CDATA,textContent:""};case t.COMMENT_NODE:return {type:e.Comment,textContent:t.textContent||""};default:return !1}var k;}function b(t,n,o,r,i,u,s){void 0===i&&(i=!1),void 0===u&&(u=!0);var c,l=S(t,n,r,u,s);if(!l)return console.warn(t,"not serialized"),null;c="__sn"in t?t.__sn.id:a++;var d=Object.assign(l,{id:c});t.__sn=d,o[c]=t;var p=!i;if(d.type===e.Element&&(p=p&&!d.needBlock,delete d.needBlock),(d.type===e.Document||d.type===e.Element)&&p)for(var f=0,m=Array.from(t.childNodes);f<m.length;f++){var h=b(m[f],n,o,r,i,u,s);h&&d.childNodes.push(h);}return d}function C(e,t,n){void 0===n&&(n=document);var o={capture:!0,passive:!0};return n.addEventListener(e,t,o),function(){return n.removeEventListener(e,t,o)}}!function(e){e[e.DomContentLoaded=0]="DomContentLoaded",e[e.Load=1]="Load",e[e.FullSnapshot=2]="FullSnapshot",e[e.IncrementalSnapshot=3]="IncrementalSnapshot",e[e.Meta=4]="Meta",e[e.Custom=5]="Custom";}(s||(s={})),function(e){e[e.Mutation=0]="Mutation",e[e.MouseMove=1]="MouseMove",e[e.MouseInteraction=2]="MouseInteraction",e[e.Scroll=3]="Scroll",e[e.ViewportResize=4]="ViewportResize",e[e.Input=5]="Input",e[e.TouchMove=6]="TouchMove",e[e.MediaInteraction=7]="MediaInteraction",e[e.StyleSheetRule=8]="StyleSheetRule";}(c||(c={})),function(e){e[e.MouseUp=0]="MouseUp",e[e.MouseDown=1]="MouseDown",e[e.Click=2]="Click",e[e.ContextMenu=3]="ContextMenu",e[e.DblClick=4]="DblClick",e[e.Focus=5]="Focus",e[e.Blur=6]="Blur",e[e.TouchStart=7]="TouchStart",e[e.TouchMove_Departed=8]="TouchMove_Departed",e[e.TouchEnd=9]="TouchEnd";}(l||(l={})),function(e){e[e.Play=0]="Play",e[e.Pause=1]="Pause";}(d||(d={})),function(e){e.Start="start",e.Pause="pause",e.Resume="resume",e.Resize="resize",e.Finish="finish",e.FullsnapshotRebuilded="fullsnapshot-rebuilded",e.LoadStylesheetStart="load-stylesheet-start",e.LoadStylesheetEnd="load-stylesheet-end",e.SkipStart="skip-start",e.SkipEnd="skip-end",e.MouseInteraction="mouse-interaction",e.EventCast="event-cast",e.CustomEvent="custom-event",e.Flush="flush",e.StateChange="state-change";}(p||(p={}));var w={map:{},getId:function(e){return e.__sn?e.__sn.id:-1},getNode:function(e){return w.map[e]||null},removeNodeFromMap:function(e){var t=e.__sn&&e.__sn.id;delete w.map[t],e.childNodes&&e.childNodes.forEach((function(e){return w.removeNodeFromMap(e)}));},has:function(e){return w.map.hasOwnProperty(e)}};function E(e,t,n){void 0===n&&(n={});var o=null,r=0;return function(a){var i=Date.now();r||!1!==n.leading||(r=i);var u=t-(i-r),s=this,c=arguments;u<=0||u>t?(o&&(window.clearTimeout(o),o=null),r=i,e.apply(s,c)):o||!1===n.trailing||(o=window.setTimeout((function(){r=!1===n.leading?0:Date.now(),o=null,e.apply(s,c);}),u));}}function I(){return window.innerHeight||document.documentElement&&document.documentElement.clientHeight||document.body&&document.body.clientHeight}function N(){return window.innerWidth||document.documentElement&&document.documentElement.clientWidth||document.body&&document.body.clientWidth}function T(e,t){if(!e)return !1;if(e.nodeType===e.ELEMENT_NODE){var n=!1;return "string"==typeof t?n=e.classList.contains(t):e.classList.forEach((function(e){t.test(e)&&(n=!0);})),n||T(e.parentNode,t)}return e.nodeType,e.TEXT_NODE,T(e.parentNode,t)}function k(e){return Boolean(e.changedTouches)}var M=function(e,t){return e+"@"+t};function x(e){return "__sn"in e}var D=function(e,t,o,r){var a=this;this.texts=[],this.attributes=[],this.removes=[],this.adds=[],this.movedMap={},this.addedSet=new Set,this.movedSet=new Set,this.droppedSet=new Set,this.processMutations=function(e){var t,o,r,i;e.forEach(a.processMutation);var u=[],s=function(e){if(e.parentNode){var t=w.getId(e.parentNode),n=e.nextSibling&&w.getId(e.nextSibling);if(-1===t||-1===n)return u.push(e);a.adds.push({parentId:t,nextId:n,node:b(e,document,w.map,a.blockClass,!0,a.inlineStylesheet,a.maskInputOptions)});}};try{for(var c=n(a.movedSet),l=c.next();!l.done;l=c.next())s(f=l.value);}catch(e){t={error:e};}finally{try{l&&!l.done&&(o=c.return)&&o.call(c);}finally{if(t)throw t.error}}try{for(var d=n(a.addedSet),p=d.next();!p.done;p=d.next()){var f=p.value;_(a.droppedSet,f)||L(a.removes,f)?_(a.movedSet,f)?s(f):a.droppedSet.add(f):s(f);}}catch(e){r={error:e};}finally{try{p&&!p.done&&(i=d.return)&&i.call(d);}finally{if(r)throw r.error}}for(;u.length&&!u.every((function(e){return -1===w.getId(e.parentNode)}));)s(u.shift());a.emit();},this.emit=function(){var e={texts:a.texts.map((function(e){return {id:w.getId(e.node),value:e.value}})).filter((function(e){return w.has(e.id)})),attributes:a.attributes.map((function(e){return {id:w.getId(e.node),attributes:e.attributes}})).filter((function(e){return w.has(e.id)})),removes:a.removes,adds:a.adds};(e.texts.length||e.attributes.length||e.removes.length||e.adds.length)&&(a.emissionCallback(e),a.texts=[],a.attributes=[],a.removes=[],a.adds=[],a.addedSet=new Set,a.movedSet=new Set,a.droppedSet=new Set,a.movedMap={});},this.processMutation=function(e){switch(e.type){case"characterData":var t=e.target.textContent;T(e.target,a.blockClass)||t===e.oldValue||a.texts.push({value:t,node:e.target});break;case"attributes":if(t=e.target.getAttribute(e.attributeName),T(e.target,a.blockClass)||t===e.oldValue)return;var n=a.attributes.find((function(t){return t.node===e.target}));n||(n={node:e.target,attributes:{}},a.attributes.push(n)),n.attributes[e.attributeName]=g(document,e.attributeName,t);break;case"childList":e.addedNodes.forEach((function(t){return a.genAdds(t,e.target)})),e.removedNodes.forEach((function(t){var n=w.getId(t),o=w.getId(e.target);T(t,a.blockClass)||T(e.target,a.blockClass)||(a.addedSet.has(t)?(O(a.addedSet,t),a.droppedSet.add(t)):a.addedSet.has(e.target)&&-1===n||function e(t){var n=w.getId(t);return !w.has(n)||(!t.parentNode||t.parentNode.nodeType!==t.DOCUMENT_NODE)&&(!t.parentNode||e(t.parentNode))}(e.target)||(a.movedSet.has(t)&&a.movedMap[M(n,o)]?O(a.movedSet,t):a.removes.push({parentId:o,id:n})),w.removeNodeFromMap(t));}));}},this.genAdds=function(e,t){if(!T(e,a.blockClass)){if(x(e)){a.movedSet.add(e);var n=null;t&&x(t)&&(n=t.__sn.id),n&&(a.movedMap[M(e.__sn.id,n)]=!0);}else a.addedSet.add(e),a.droppedSet.delete(e);e.childNodes.forEach((function(e){return a.genAdds(e)}));}},this.blockClass=t,this.inlineStylesheet=o,this.maskInputOptions=r,this.emissionCallback=e;};function O(e,t){e.delete(t),t.childNodes.forEach((function(t){return O(e,t)}));}function L(e,t){var n=t.parentNode;if(!n)return !1;var o=w.getId(n);return !!e.some((function(e){return e.id===o}))||L(e,n)}function _(e,t){var n=t.parentNode;return !!n&&(!!e.has(n)||_(e,n))}function R(e,t,n){if(!1===n.mouseInteraction)return function(){};var o=!0===n.mouseInteraction||void 0===n.mouseInteraction?{}:n.mouseInteraction,r=[];return Object.keys(l).filter((function(e){return Number.isNaN(Number(e))&&!e.endsWith("_Departed")&&!1!==o[e]})).forEach((function(n){var o=n.toLowerCase(),a=function(n){return function(o){if(!T(o.target,t)){var r=w.getId(o.target),a=k(o)?o.changedTouches[0]:o,i=a.clientX,u=a.clientY;e({type:l[n],id:r,x:i,y:u});}}}(n);r.push(C(o,a));})),function(){r.forEach((function(e){return e()}));}}var A,P=["INPUT","TEXTAREA","SELECT"],z=new WeakMap;function F(e,n,o,a,i){function u(e){var t=e.target;if(t&&t.tagName&&!(P.indexOf(t.tagName)<0)&&!T(t,n)){var r=t.type;if("password"!==r&&!t.classList.contains(o)){var i=t.value,u=!1;"radio"===r||"checkbox"===r?u=t.checked:(a[t.tagName.toLowerCase()]||a[r])&&(i="*".repeat(i.length)),s(t,{text:i,isChecked:u});var c=t.name;"radio"===r&&c&&u&&document.querySelectorAll('input[type="radio"][name="'+c+'"]').forEach((function(e){e!==t&&s(e,{text:e.value,isChecked:!u});}));}}}function s(n,o){var r=z.get(n);if(!r||r.text!==o.text||r.isChecked!==o.isChecked){z.set(n,o);var a=w.getId(n);e(t(t({},o),{id:a}));}}var c=("last"===i.input?["change"]:["input","change"]).map((function(e){return C(e,u)})),l=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value"),d=[[HTMLInputElement.prototype,"value"],[HTMLInputElement.prototype,"checked"],[HTMLSelectElement.prototype,"value"],[HTMLTextAreaElement.prototype,"value"]];return l&&l.set&&c.push.apply(c,r(d.map((function(e){return function e(t,n,o,r,a){void 0===a&&(a=window);var i=a.Object.getOwnPropertyDescriptor(t,n);return a.Object.defineProperty(t,n,r?o:{set:function(e){var t=this;setTimeout((function(){o.set.call(t,e);}),0),i&&i.set&&i.set.call(this,e);}}),function(){return e(t,n,i||{},!0)}}(e[0],e[1],{set:function(){u({target:this});}})})))),function(){c.forEach((function(e){return e()}));}}function j(e,t){void 0===t&&(t={}),function(e,t){var n=e.mutationCb,o=e.mousemoveCb,a=e.mouseInteractionCb,i=e.scrollCb,u=e.viewportResizeCb,s=e.inputCb,c=e.mediaInteractionCb,l=e.styleSheetRuleCb;e.mutationCb=function(){for(var e=[],o=0;o<arguments.length;o++)e[o]=arguments[o];t.mutation&&t.mutation.apply(t,r(e)),n.apply(void 0,r(e));},e.mousemoveCb=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];t.mousemove&&t.mousemove.apply(t,r(e)),o.apply(void 0,r(e));},e.mouseInteractionCb=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];t.mouseInteraction&&t.mouseInteraction.apply(t,r(e)),a.apply(void 0,r(e));},e.scrollCb=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];t.scroll&&t.scroll.apply(t,r(e)),i.apply(void 0,r(e));},e.viewportResizeCb=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];t.viewportResize&&t.viewportResize.apply(t,r(e)),u.apply(void 0,r(e));},e.inputCb=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];t.input&&t.input.apply(t,r(e)),s.apply(void 0,r(e));},e.mediaInteractionCb=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];t.mediaInteaction&&t.mediaInteaction.apply(t,r(e)),c.apply(void 0,r(e));},e.styleSheetRuleCb=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];t.styleSheetRule&&t.styleSheetRule.apply(t,r(e)),l.apply(void 0,r(e));};}(e,t);var n,o,a,i,u,s,l=(n=e.mutationCb,o=e.blockClass,a=e.inlineStylesheet,i=e.maskInputOptions,u=new D(n,o,a,i),(s=new MutationObserver(u.processMutations)).observe(document,{attributes:!0,attributeOldValue:!0,characterData:!0,characterDataOldValue:!0,childList:!0,subtree:!0}),s),p=function(e,t){if(!1===t.mousemove)return function(){};var n,o="number"==typeof t.mousemove?t.mousemove:50,r=[],a=E((function(t){var o=Date.now()-n;e(r.map((function(e){return e.timeOffset-=o,e})),t?c.TouchMove:c.MouseMove),r=[],n=null;}),500),i=E((function(e){var t=e.target,o=k(e)?e.changedTouches[0]:e,i=o.clientX,u=o.clientY;n||(n=Date.now()),r.push({x:i,y:u,id:w.getId(t),timeOffset:Date.now()-n}),a(k(e));}),o,{trailing:!1}),u=[C("mousemove",i),C("touchmove",i)];return function(){u.forEach((function(e){return e()}));}}(e.mousemoveCb,e.sampling),f=R(e.mouseInteractionCb,e.blockClass,e.sampling),m=function(e,t,n){return C("scroll",E((function(n){if(n.target&&!T(n.target,t)){var o=w.getId(n.target);if(n.target===document){var r=document.scrollingElement||document.documentElement;e({id:o,x:r.scrollLeft,y:r.scrollTop});}else e({id:o,x:n.target.scrollLeft,y:n.target.scrollTop});}}),n.scroll||100))}(e.scrollCb,e.blockClass,e.sampling),h=function(e){return C("resize",E((function(){var t=I(),n=N();e({width:Number(n),height:Number(t)});}),200),window)}(e.viewportResizeCb),v=F(e.inputCb,e.blockClass,e.ignoreClass,e.maskInputOptions,e.sampling),y=function(e,t){var n=function(n){return function(o){var r=o.target;r&&!T(r,t)&&e({type:"play"===n?d.Play:d.Pause,id:w.getId(r)});}},o=[C("play",n("play")),C("pause",n("pause"))];return function(){o.forEach((function(e){return e()}));}}(e.mediaInteractionCb,e.blockClass),g=function(e){var t=CSSStyleSheet.prototype.insertRule;CSSStyleSheet.prototype.insertRule=function(n,o){var r=w.getId(this.ownerNode);return -1!==r&&e({id:r,adds:[{rule:n,index:o}]}),t.apply(this,arguments)};var n=CSSStyleSheet.prototype.deleteRule;return CSSStyleSheet.prototype.deleteRule=function(t){var o=w.getId(this.ownerNode);return -1!==o&&e({id:o,removes:[{index:t}]}),n.apply(this,arguments)},function(){CSSStyleSheet.prototype.insertRule=t,CSSStyleSheet.prototype.deleteRule=n;}}(e.styleSheetRuleCb);return function(){l.disconnect(),p(),f(),m(),h(),v(),y(),g();}}function H(e){return t(t({},e),{timestamp:Date.now()})}function V(e){void 0===e&&(e={});var n=e.emit,r=e.checkoutEveryNms,a=e.checkoutEveryNth,i=e.blockClass,u=void 0===i?"edith-block":i,l=e.ignoreClass,d=void 0===l?"edith-ignore":l,p=e.inlineStylesheet,f=void 0===p||p,m=e.maskAllInputs,h=e.maskInputOptions,v=e.hooks,y=e.packFn,g=e.sampling,S=void 0===g?{}:g,E=e.mousemoveWait;if(!n)throw new Error("emit function is required");void 0!==E&&void 0===S.mousemove&&(S.mousemove=E);var T,k=!0===m?{color:!0,date:!0,"datetime-local":!0,email:!0,month:!0,number:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0,textarea:!0,select:!0}:void 0!==h?h:{};"NodeList"in window&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach);var M=0;function x(e){var t,n,r,a;void 0===e&&(e=!1),A(H({type:s.Meta,data:{href:window.location.href,width:N(),height:I()}}),e);var i=o(function(e,t,n,o){void 0===t&&(t="edith-block"),void 0===n&&(n=!0);var r={};return [b(e,e,r,t,!1,n,!0===o?{color:!0,date:!0,"datetime-local":!0,email:!0,month:!0,number:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0}:!1===o?{}:o),r]}(document,u,f,k),2),c=i[0],l=i[1];if(!c)return console.warn("Failed to snapshot the document");w.map=l,A(H({type:s.FullSnapshot,data:{node:c,initialOffset:{left:void 0!==window.pageXOffset?window.pageXOffset:(null===document||void 0===document?void 0:document.documentElement.scrollLeft)||(null===(n=null===(t=null===document||void 0===document?void 0:document.body)||void 0===t?void 0:t.parentElement)||void 0===n?void 0:n.scrollLeft)||(null===document||void 0===document?void 0:document.body.scrollLeft)||0,top:void 0!==window.pageYOffset?window.pageYOffset:(null===document||void 0===document?void 0:document.documentElement.scrollTop)||(null===(a=null===(r=null===document||void 0===document?void 0:document.body)||void 0===r?void 0:r.parentElement)||void 0===a?void 0:a.scrollTop)||(null===document||void 0===document?void 0:document.body.scrollTop)||0}}}));}A=function(e,t){if(n(y?y(e):e,t),e.type===s.FullSnapshot)T=e,M=0;else if(e.type===s.IncrementalSnapshot){M++;var o=a&&M>=a,i=r&&e.timestamp-T.timestamp>r;(o||i)&&x(!0);}};try{var D=[];D.push(C("DOMContentLoaded",(function(){A(H({type:s.DomContentLoaded,data:{}}));})));var O=function(){x(),D.push(j({mutationCb:function(e){return A(H({type:s.IncrementalSnapshot,data:t({source:c.Mutation},e)}))},mousemoveCb:function(e,t){return A(H({type:s.IncrementalSnapshot,data:{source:t,positions:e}}))},mouseInteractionCb:function(e){return A(H({type:s.IncrementalSnapshot,data:t({source:c.MouseInteraction},e)}))},scrollCb:function(e){return A(H({type:s.IncrementalSnapshot,data:t({source:c.Scroll},e)}))},viewportResizeCb:function(e){return A(H({type:s.IncrementalSnapshot,data:t({source:c.ViewportResize},e)}))},inputCb:function(e){return A(H({type:s.IncrementalSnapshot,data:t({source:c.Input},e)}))},mediaInteractionCb:function(e){return A(H({type:s.IncrementalSnapshot,data:t({source:c.MediaInteraction},e)}))},styleSheetRuleCb:function(e){return A(H({type:s.IncrementalSnapshot,data:t({source:c.StyleSheetRule},e)}))},blockClass:u,ignoreClass:d,maskInputOptions:k,inlineStylesheet:f,sampling:S},v));};return "interactive"===document.readyState||"complete"===document.readyState?O():D.push(C("load",(function(){A(H({type:s.Load,data:{}})),O();}),window)),function(){D.forEach((function(e){return e()}));}}catch(e){console.warn(e);}}return V.addCustomEvent=function(e,t){if(!A)throw new Error("please add custom event after start recording");A(H({type:s.Custom,data:{tag:e,payload:t}}));},V}();

  var RecordPlugin = /*#__PURE__*/function () {
    function RecordPlugin() {

      _classCallCheck(this, RecordPlugin);

      this.name = 'redo';
    } // 开始录屏


    _createClass(RecordPlugin, [{
      key: "startRecordVideo",
      value: function startRecordVideo() {
        // 如果某个DOM节点配置了_edith-private的class，那么该元素在插件进行录制前就会被预先隐藏掉来保障隐私安全。
        // 使用二维数组来存放多个 event 数组, 
        this.eventsMatrix = [[]];
        var that = this;
        window.edithRecord({
          emit: function emit(event, isCheckout) {
            // isCheckout 是一个标识，告诉你重新制作了快照
            if (isCheckout) {
              that.eventsMatrix.push([]);
            }

            var lastEvents = that.eventsMatrix[that.eventsMatrix.length - 1];
            lastEvents.push(event);
          },
          checkoutEveryNth: 200,
          // 每 200 个 event 重新制作快照
          checkoutEveryNms: 120 * 1000 // 每2分钟重新制作快照

        });
      } // 向后端传送最新的两个 event 数组

    }, {
      key: "getRedo",
      value: function getRedo() {
        var _this$eventsMatrix$sl = this.eventsMatrix.slice(-2),
            _this$eventsMatrix$sl2 = _slicedToArray(_this$eventsMatrix$sl, 2),
            a = _this$eventsMatrix$sl2[0],
            _this$eventsMatrix$sl3 = _this$eventsMatrix$sl2[1],
            b = _this$eventsMatrix$sl3 === void 0 ? [] : _this$eventsMatrix$sl3;

        var events = [].concat(_toConsumableArray(a), _toConsumableArray(b));
        return events;
      }
    }, {
      key: "apply",
      value: function apply(compiler) {
        var that = this;
        compiler(that.name, function (_ref, callback) {
          var state = _ref.state;
          if (!state[that.name]) that.startRecordVideo();
          callback(that.getRedo());
        });
      }
    }]);

    return RecordPlugin;
  }();

  if (!window.Edith) window.Edith = {};
  window.Edith.RecordPlugin = RecordPlugin;

  return RecordPlugin;

}());
