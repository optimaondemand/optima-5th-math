const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});await p.route(/fonts/,r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/preview-5-09-01.html');await p.waitForTimeout(800);
await p.locator('#j1').scrollIntoViewIfNeeded();await p.waitForTimeout(600);await p.locator('#j1').screenshot({path:'shots/m-j1.png'});
await p.locator('.bd-tab[data-tab=learn]').click();await p.locator('.bd-path button[data-st="2"]').click();await p.waitForTimeout(400);
for(const k of [0,1,2,3,4,5]){await p.locator('#hund rect.c[data-k="'+k+'"]').click();}await p.locator('#hund .cut').click();await p.waitForTimeout(300);
await p.locator('#j4').screenshot({path:'shots/m-j4.png'});
console.log(errs,await p.evaluate(()=>document.documentElement.scrollWidth));await b.close();})();
