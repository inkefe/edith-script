var t,e,n=function(){return"".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)},i=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return{name:t,value:e,delta:0,entries:[],id:n(),isFinal:!1}},a=function(t,e){try{if(PerformanceObserver.supportedEntryTypes.includes(t)){var n=new PerformanceObserver((function(t){return t.getEntries().map(e)}));return n.observe({type:t,buffered:!0}),n}}catch(t){}},r=!1,o=!1,s=function(t){r=!t.persisted},u=function(){addEventListener("pagehide",s),addEventListener("beforeunload",(function(){}))},c=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];o||(u(),o=!0),addEventListener("visibilitychange",(function(e){var n=e.timeStamp;"hidden"===document.visibilityState&&t({timeStamp:n,isUnloading:r})}),{capture:!0,once:e})},f=function(t,e,n,i){var a;return function(){n&&e.isFinal&&n.disconnect(),e.value>=0&&(i||e.isFinal||"hidden"===document.visibilityState)&&(e.delta=e.value-(a||0),(e.delta||e.isFinal||void 0===a)&&(t(e),a=e.value))}},p=function(){return void 0===t&&(t="hidden"===document.visibilityState?0:1/0,c((function(e){var n=e.timeStamp;return t=n}),!0)),{get timeStamp(){return t}}},m=function(){return e||(e=new Promise((function(t){return["scroll","keydown","pointerdown"].map((function(e){addEventListener(e,t,{once:!0,passive:!0,capture:!0})}))}))),e},l=function(){function t(){var t=this;this.getData=function(){!function(t){var e=i("FID"),n=p(),r=function(t){t.startTime<n.timeStamp&&(e.value=t.processingStart-t.startTime,e.entries.push(t),e.isFinal=!0,s())},o=a("first-input",r),s=f(t,e,o);o?c((function(){o.takeRecords().map(r),o.disconnect()}),!0):window.perfMetrics&&window.perfMetrics.onFirstInputDelay&&window.perfMetrics.onFirstInputDelay((function(t,i){i.timeStamp<n.timeStamp&&(e.value=t,e.isFinal=!0,e.entries=[{entryType:"first-input",name:i.type,target:i.target,cancelable:i.cancelable,startTime:i.timeStamp,processingStart:i.timeStamp+t}],s())}))}(t.setState("FID")),function(t){var e,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=i("LCP"),o=p(),s=function(t){var n=t.startTime;n<o.timeStamp?(r.value=n,r.entries.push(t)):r.isFinal=!0,e()},u=a("largest-contentful-paint",s);if(u){e=f(t,r,u,n);var l=function(){r.isFinal||(u.takeRecords().map(s),r.isFinal=!0,e())};m().then(l),c(l,!0)}}(t.setState("LCP")),function(t){var e,n=i("FCP"),r=p(),o=a("paint",(function(t){"first-contentful-paint"===t.name&&t.startTime<r.timeStamp&&(n.value=t.startTime,n.isFinal=!0,n.entries.push(t),e())}));o&&(e=f(t,n,o))}(t.setState("FCP"))},this.state={timing:window.performance.timing},this.setState=function(e){return function(n){t.state[e]=~~n.value}},this.name="performance"}return t.prototype.apply=function(t){var e=this;t(e.name,(function(t,n){e.getData(),n(e.state)}))},t}();export default l;