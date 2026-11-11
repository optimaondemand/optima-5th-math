const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});await p.route(/fonts|githubusercontent|github\.io/,r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/preview-5-09-04.html');await p.waitForTimeout(800);
await p.locator('#win1').scrollIntoViewIfNeeded();await p.locator('#win1 .bd-play button').click();
const nx=p.locator('#win1 .bd-next, #win1 button.next').first();
for(let i=0;i<6;i++){await p.waitForTimeout(9000);if(i===1||i===2||i===4)await p.locator('#win1').screenshot({path:'shots/w1-'+i+'.png'});
 const hot=p.locator('#win1 .bd-hot:not(.done)');if(await hot.count()){await hot.first().click();await p.waitForTimeout(600);await p.locator('#win1').screenshot({path:'shots/w1-close.png'});await p.locator('#win1 .x').first().click();}
 const ch=p.locator('#win1 .bd-choice');if(await ch.count())await ch.nth(2).click();
 if(i<5)await nx.click();}
console.log('count:',await p.locator('#win1').textContent().then(t=>t.slice(-120)));console.log(errs);await b.close();})();
