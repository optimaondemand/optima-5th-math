const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.route(/fonts|githubusercontent|github\.io/,r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/preview-5-09-02.html');await p.waitForTimeout(600);
await p.locator('.bd-tab[data-tab=learn]').click();await p.waitForTimeout(800);
const v=await p.evaluate(async()=>{const v=document.querySelector('#learn video');await new Promise(r=>{if(v.readyState>=1)r();else v.onloadedmetadata=r;setTimeout(r,4000)});return [v.duration,v.videoWidth]});console.log('video',v);
const a=await p.evaluate(async()=>{const k=Object.keys(window.BD_AUDIO||{});const r=[];for(const n of k){const au=new Audio(BD_AUDIO[n]);await new Promise(x=>{au.onloadedmetadata=x;au.onerror=x;setTimeout(x,3000)});r.push(n+':'+au.duration.toFixed(1))}return r});console.log(a.join(' '));console.log(errs);await b.close();})();
