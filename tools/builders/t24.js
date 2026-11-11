const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/preview-5-09-01.html');await p.waitForTimeout(800);
await p.click('#bd-read');await p.waitForTimeout(300);console.log('ra shown',await p.$eval('#optima-read-aloud',e=>!e.hidden),await p.$eval('#ora-status',e=>e.textContent));
await p.click('#bd-read');console.log('ra hidden',await p.$eval('#optima-read-aloud',e=>e.hidden));
await p.click('[data-tab="learn"]');await p.waitForTimeout(500);
const v=await p.$('.bd-video video');await v.scrollIntoViewIfNeeded();await p.waitForTimeout(300);
console.log('dur',await p.evaluate(()=>new Promise(r=>{const v=document.querySelector('.bd-video video');if(v.readyState>0)r(v.duration);else v.onloadedmetadata=()=>r(v.duration);setTimeout(()=>r('timeout'),5000)})));
await p.screenshot({path:'shots/t24-video.png'});console.log('ERR',errs);await b.close();})();
