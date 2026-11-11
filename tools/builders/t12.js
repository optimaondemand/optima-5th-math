const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});await p.route(/fonts/,r=>r.abort());
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/preview-5-09-01.html');await p.waitForTimeout(1200);
const fill=async(sel,vals)=>{const ins=p.locator(sel+' .bd-step.now .bd-ans');const n=await ins.count();for(let i=0;i<n;i++){await ins.nth(i).fill(String(vals[i]));await ins.nth(i).press('Enter');}await p.waitForTimeout(250);};
const tapRuler=async(mm,from,to)=>{const r=p.locator('#j1 .bd-step.now .bd-rsvg');const bb=await r.boundingBox();const x=bb.x+bb.width*(30+(mm-from*10)*(940/((to-from)*10)))/1000;await p.mouse.click(x,bb.y+bb.height*.3);await p.waitForTimeout(250);};
await p.locator('#j1').scrollIntoViewIfNeeded();
await tapRuler(95,0,12);console.log('wrong:',await p.locator('#j1 .bd-step.now .bd-fb').textContent());
await tapRuler(100,0,12);await p.screenshot({path:'shots/n1.png'});
await fill('#j1',[1,10,0.1]);console.log('step now:',await p.locator('#j1 .bd-step.now .tx').textContent());
await tapRuler(10,0,12);await fill('#j1',[1,100,'.01']);console.log('lead fb:',await p.locator('#j1 .bd-step.now .bd-afb').last().textContent());await fill('#j1',[1,100,'0.01']);
await tapRuler(1,0,1);await fill('#j1',[1,1000]);
await fill('#j1',[168,1000]);console.log('s1 all:',await p.locator('.bd-steps[data-id=s1]').getAttribute('class'));
await p.locator('#j1').screenshot({path:'shots/n2.png'});
await p.locator('.bd-tab[data-tab=learn]').click();await p.waitForTimeout(500);await p.screenshot({path:'shots/n3.png'});
// north zoom
await p.locator('#zoom-north .seg[data-s="2"]').click();await p.waitForTimeout(1300);await p.locator('#zoom-north .seg[data-s="5"]').click();await p.waitForTimeout(1300);await p.locator('#zoom-north .tick-hit[data-t="3"]').click();await p.waitForTimeout(500);
await fill('#j2',[253,1000]);
await p.locator('.bd-nextst[data-go="2"]').click();await p.waitForTimeout(400);
await p.evaluate(()=>{document.querySelectorAll('.bd-exbtn').forEach(b=>{for(let i=0;i<8;i++)b.click();})});
await fill('#j3',[38,1000]);await fill('#j3',[0,0,3,8]);await p.locator('#j3').screenshot({path:'shots/n4.png'});await fill('#j3',['0.38']);console.log('bad fb:',await p.locator('#j3 .bd-step.now .bd-afb').first().textContent());await fill('#j3',['0.038']);await fill('#j3',['0.640','0.275']);
for(const k of [3,4,5,13,14,15]){await p.locator('#hund rect.c[data-k="'+k+'"]').click();}
await p.locator('#hund .cut').click();await p.waitForTimeout(300);await p.locator('#j4').screenshot({path:'shots/n5.png'});
await fill('#j4',[60,60]);
await fill('#j5',[125]);await fill('#j5',[625,1000]);await fill('#j5',['0.625']);await fill('#j5',['0.046','0.164']);
await p.locator('.bd-nextst[data-go="3"]').click();await p.waitForTimeout(400);
await fill('#j6',[24,1000]);await fill('#j6',[3,125]);await fill('#j6',[3,4]);
await p.locator('#zoom-east .seg[data-s="3"]').click();await p.waitForTimeout(1300);await p.locator('#zoom-east .seg[data-s="9"]').click();await p.waitForTimeout(1300);await p.locator('#zoom-east .tick-hit[data-t="1"]').click();await p.waitForTimeout(400);
await fill('#j7',['230.391',391,1000]);
await p.locator('.bd-nextst[data-go="swyk"]').click();await p.waitForTimeout(400);
const sw=p.locator('#j8 .bd-ans');const v=['0.006','0.028',17,200];for(let i=0;i<4;i++){await sw.nth(i).fill(String(v[i]));await sw.nth(i).press('Enter');}
await p.locator('#prove').fill('1 m cut into 10 is a tenth, cut a tenth into 10 is a hundredth, cut again is a thousandth = 1 mm');
await p.locator('#gather').click();console.log((await p.locator('#gathered').inputValue()).slice(0,500));
await p.waitForTimeout(200);console.log('prog:',await p.locator('.bd-prog .n').textContent());
await p.reload();await p.waitForTimeout(800);console.log('after reload prog:',await p.locator('.bd-prog .n').textContent());
console.log('ERR',errs);await b.close();})();
