const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});await p.route(/fonts/,r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/preview-5-09-01.html');await p.waitForTimeout(800);
await p.locator('.bd-mdet').scrollIntoViewIfNeeded();await p.locator('.bd-mdet').screenshot({path:'shots/o1.png'});
await p.locator('.bd-tab[data-tab=learn]').click();await p.waitForTimeout(400);
const ex=p.locator('#learn .bd-ex');for(let i=0;i<5;i++){await ex.locator('.bd-exbtn').click();}
await p.locator('#learn').screenshot({path:'shots/o2.png'});
await p.locator('.bd-path button[data-st="2"]').click();await p.waitForTimeout(300);
await p.locator('#j3 .bd-ex .bd-exbtn').click();
await p.locator('#j3').screenshot({path:'shots/o3.png'});
await p.locator('.bd-foot').scrollIntoViewIfNeeded();await p.locator('.bd-foot').screenshot({path:'shots/o4.png'});
console.log(errs);await b.close();})();
