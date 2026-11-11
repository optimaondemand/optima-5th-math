const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});await p.route(/fonts/,r=>r.abort());
await p.goto('file://'+process.cwd()+'/preview-5-09-01.html');await p.waitForTimeout(500);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(500);
await p.locator('.bd-tab[data-tab=learn]').click();await p.locator('.bd-path button[data-st="2"]').click();await p.waitForTimeout(300);
const fill=async(vals)=>{const ins=p.locator('#j3 .bd-step.now .bd-ans');for(let i=0;i<vals.length;i++){await ins.nth(i).fill(String(vals[i]));await ins.nth(i).press('Enter');}await p.waitForTimeout(250);};
await fill([38,1000]);await fill([0,0,3,8]);await p.locator('#j3').screenshot({path:'shots/r2.png'});
for(const k of [3,4,5,13,14,15]){await p.locator('#hund rect.c[data-k="'+k+'"]').click();}await p.locator('#hund .cut').click();await p.waitForTimeout(300);await p.locator('#j4').screenshot({path:'shots/r3.png'});
await b.close();})();
