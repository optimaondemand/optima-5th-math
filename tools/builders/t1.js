const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
await p.goto('file://'+process.cwd()+'/preview-5-09-01.html');await p.waitForTimeout(800);
await p.screenshot({path:'shots/01-hero.png',fullPage:false});await p.screenshot({path:'shots/01-top.png',clip:{x:0,y:0,width:1200,height:1500},fullPage:true});
const w=p.locator('#win1');await w.scrollIntoViewIfNeeded();await p.locator('#win1 .bd-play button').click();
for(let i=0;i<8;i++){await p.waitForTimeout(i===6?8000:3000);await w.screenshot({path:`shots/w${i}.png`});
 const hot=p.locator('#win1 .bd-hot:not(.done)');if(await hot.count()){await hot.first().click();await p.waitForTimeout(700);await w.screenshot({path:`shots/w${i}-close.png`});await p.locator('#win1 .bd-close .x').click();}
 const ch=p.locator('#win1 .bd-choice');if(await ch.count()){await ch.nth(1).click();}
 if(i<7) await p.locator('#win1 .next').click();}
await p.locator('#win1 .bd-your a').click();await p.waitForTimeout(1200);console.log('tab after go:',await p.locator('.bd-tab[aria-selected=true]').textContent());
// zoom north
const z=p.locator('#zoom-north svg');await z.scrollIntoViewIfNeeded();
await z.screenshot({path:'shots/z0.png'});
const segClick=async(s)=>{await p.locator(`#zoom-north .seg[data-s="${s}"]`).click();};
await segClick(5);await p.waitForTimeout(300);console.log('fb wrong:',await p.locator('#zoom-north .bd-fb').textContent());
await segClick(2);await p.waitForTimeout(1500);await z.screenshot({path:'shots/z1.png'});
await segClick(5);await p.waitForTimeout(1500);await z.screenshot({path:'shots/z2.png'});
await p.locator('#zoom-north .tick-hit[data-t="4"]').click();console.log('fb tick wrong:',await p.locator('#zoom-north .bd-fb').textContent());
await p.locator('#zoom-north .tick-hit[data-t="3"]').click();await p.waitForTimeout(800);
await p.locator('#job2').screenshot({path:'shots/z3.png'});
console.log('num:',await p.locator('#zoom-north .bd-num').textContent());
// block
await p.locator('#block .big rect.c[data-k="34"]').click();await p.locator('#block .zoomed rect.c[data-s="5"]').click();
await p.locator('#job4').screenshot({path:'shots/b1.png'});
await p.locator('#block .zoomed rect.c[data-s="9"]').click();console.log('blk:',await p.locator('#block .bd-num').textContent());
await p.locator('.bd-tab[data-tab=swyk]').click();await p.waitForTimeout(500);
// site
for(let i=0;i<4;i++){await p.locator(`#bd-site .svgbox .stake[data-i="${i}"]`).click();await p.waitForTimeout(200);}
await p.waitForTimeout(2000);await p.locator('#bd-site').screenshot({path:'shots/s1.png'});
await p.locator('#bd-reveal').click();await p.waitForTimeout(300);await p.locator('#bd-site').screenshot({path:'shots/s10.png'});
// reload keeps
await p.reload();await p.waitForTimeout(800);await p.locator('.bd-tab[data-tab=learn]').click();console.log('after reload num:',await p.locator('#zoom-north .bd-num').textContent(),'pred box:',await p.locator('#bd-predict-back').isVisible());
// phone
console.log('prog:',await p.locator('.bd-prog .n').textContent());const m=await b.newPage({viewport:{width:390,height:844}});await m.route(/fonts/,r=>r.abort());await m.goto('file://'+process.cwd()+'/preview-5-09-01.html');await m.waitForTimeout(500);
await m.screenshot({path:'shots/m-full.png',fullPage:true});
console.log('hscroll:',await m.evaluate(()=>document.documentElement.scrollWidth));
console.log('prog:',await p.locator('.bd-prog .n').textContent());console.log('ERR',errs.filter(e=>!/ERR_FAILED/.test(e)));await b.close();})();
