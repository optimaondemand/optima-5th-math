const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:850}});const errs=[],bad=[];p.on('pageerror',e=>errs.push(e.message));p.on('response',r=>{if(r.status()>=400&&r.url().includes('8765'))bad.push(r.status()+' '+r.url())});p.on('requestfailed',r=>{if(r.url().includes('8765'))bad.push('FAIL '+r.url())});
await p.goto('http://localhost:8765/canvas.html');await p.waitForTimeout(2500);const f=p.frames()[1];
console.log('crew sprites',await f.$$eval('.bd-mate img, .bd-mate svg, .bd-mate canvas',a=>a.length));
console.log('imgs broken',await f.$$eval('img',a=>a.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)));
console.log('olt',await f.$$eval('.olt',a=>a.length));
await f.click('[data-tab="learn"]');await f.waitForTimeout(500);
console.log('vid',await f.evaluate(()=>new Promise(r=>{const v=document.querySelector('.bd-video video');if(v.readyState>0)r(v.duration);else v.onloadedmetadata=()=>r(v.duration);setTimeout(()=>r('timeout'),5000)})));
console.log('bad',bad,'ERR',errs);await b.close();})();
