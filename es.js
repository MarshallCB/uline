const{replace:e}="",t=/[&<>'"]/g,n={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},s=e=>n[e],r=n=>e.call(n,t,s),a=/([^\s\\>"'=]+)\s*=\s*(['"]?)$/,i=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,o=/<[a-z][^>]+$/i,c=/>[^<>]*$/,u=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/gi,l=/\s+$/,p=(e,t)=>0<t--&&(o.test(e[t])||!c.test(e[t])&&p(e,t)),$=(e,t,n)=>i.test(t)?e:`<${t}${n.replace(l,"")}></${t}>`,{toString:g}=Function,{assign:h,keys:f}=Object,b="isµ"+Date.now(),w=new RegExp(`(\x3c!--${b}(\\d+)--\x3e|\\s*${b}(\\d+)=('|")([^\\4]+?)\\4)`,"g"),m=(e,t,n)=>` ${e}=${t}${r(n)}${t}`,k=e=>{switch(typeof e){case"string":return r(e);case"boolean":case"number":return String(e);case"object":switch(!0){case e instanceof Array:return e.map(k).join("");case e&&e.is_uline:return e.toString()}}return null==e?"":r(String(e))};function d(e){const t=r(this[e]);return"role"===e?` role="${t}"`:` aria-${e.toLowerCase()}="${t}"`}function y(e){return` data-${t=e,t.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z])([A-Z]))/g,"$2$5-$3$6").toLowerCase()}="${r(this[e])}"`;var t}const{isArray:j}=Array,x=(S=new WeakMap,{get:e=>S.get(e),set:(e,t)=>(S.set(e,t),t)});var S;class A extends String{constructor(e){super(String(e)),this.is_uline=!0}}const z=(e,t,n)=>{const{length:s}=t,r=x.get(e)||x.set(e,((e,t,n)=>{const s=((e,t,n)=>{const s=[],{length:r}=e;for(let n=1;n<r;n++){const r=e[n-1];s.push(a.test(r)&&p(e,n)?r.replace(a,((e,s,r)=>`${t}${n-1}=${r||'"'}${s}${r?"":'"'}`)):`${r}\x3c!--${t}${n-1}--\x3e`)}s.push(e[r-1]);const i=s.join("").trim();return n?i:i.replace(u,$)})(e,b,n),r=[];let i=0,o=null;for(;o=w.exec(s);){const e=s.slice(i,o.index);if(i=o.index+o[0].length,o[2])r.push((t=>e+k(t)));else{const t=o[5],n=o[4];switch(!0){case"aria"===t:r.push((t=>e+f(t).map(d,t).join("")));break;case"data"===t:r.push((s=>"string"==typeof s?e+m(t,n,s):e+f(s).map(y,s).join("")));break;case"style"===t:r.push((s=>{let r=e;return"string"==typeof s&&(r+=m(t,n,s)),"object"==typeof s&&s.is_uline&&(r+=m(t,n,s.toString())),r}));break;case"."===t[0]:const s=t.slice(1).toLowerCase();r.push("dataset"===s?t=>e+f(t).map(y,t).join(""):t=>{let r=e;return null!=t&&!1!==t&&(r+=!0===t?` ${s}`:m(s,n,t)),r});break;case"on"===t.slice(0,2):r.push((s=>{let r=e;switch(typeof s){case"object":if(s.is_uline){r+=m(t,n,s.toString());break}if(!(t in s))break;if("function"!=typeof(s=s[t]))break;case"function":if(s.toString===g)break;case"string":r+=m(t,n,s)}return r}));break;default:r.push((s=>{let r=e;return null!=s&&(r+=m(t,n,s)),r}))}}}const{length:c}=r;if(c!==t)throw new Error(`invalid template ${e}`);if(c){const e=r[c-1],t=s.slice(i);r[c-1]=n=>e(n)+t}else r.push((()=>s));return r})(e,s,n));return s?t.map(D,r).join(""):r[0]()},_=(e,t)=>j(e)?((e,t)=>e[0]+t.map(q,e).join(""))(e,t):e,v=e=>(e.node=e,e.for=()=>e,e),C=(e,...t)=>new A(_(e,t)),L=(e,...t)=>new A(_(e,t)),Z=v(((e,...t)=>new A(z(e,t,!1)))),E=v(((e,...t)=>new A(z(e,t,!0))));function q(e,t){return e+this[t+1]}function D(e,t){return this[t](e)}export{C as css,Z as html,L as raw,E as svg};
