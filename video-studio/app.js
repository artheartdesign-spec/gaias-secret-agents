const loadScript=src=>new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.async=false;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
(async()=>{try{await loadScript("./app-1.js");await loadScript("./app-2.js");await loadScript("./app-3.js");}catch(e){console.error("GSA Video Studio failed to load",e);}})();
