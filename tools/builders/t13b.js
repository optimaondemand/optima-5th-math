const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});await p.route(/fonts|githubusercontent|github\.io/,r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/preview-5-09-02.html');await p.waitForTimeout(800);
await p.locator('#j1').scrollIntoViewIfNeeded();for(let i=0;i<2;i++)await p.locator('#d1 .col[data-k="0"] .pl').click();for(let i=0;i<6;i++)await p.locator('#d1 .col[data-k="1"] .pl').click();await p.waitForTimeout(300);await p.locator('#j1').screenshot({path:'shots/m-j1.png'});
await p.locator('.bd-tab[data-tab=learn]').click();await p.locator('.bd-path button[data-st="2"]').click();await p.waitForTimeout(400);
await p.locator('#j5').screenshot({path:'shots/m-j5.png'});
const sw=[];for(const t of ['warmup','learn','swyk']){await p.locator('.bd-tab[data-tab='+t+']').click();for(const s of ['1','2','3']){if(t==='learn')await p.locator('.bd-path button[data-st="'+s+'"]').click();await p.waitForTimeout(200);sw.push(await p.evaluate(()=>document.documentElement.scrollWidth));if(t!=='learn')break;}}
console.log('scrollWidths',sw,errs);await b.close();})();
