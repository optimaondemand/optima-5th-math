const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const [w,n] of [[1200,'d'],[390,'m']]){const p=await b.newPage({viewport:{width:w,height:900}});await p.route(/fonts/,r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/preview-5-09-01.html');await p.waitForTimeout(800);
const st=p.locator('#museum .stage');await st.scrollIntoViewIfNeeded();const bb=await st.boundingBox();
for(const [x,y] of [[.43,.31],[.27,.80],[.5,.5]]){await p.mouse.move(bb.x+bb.width*x,bb.y+bb.height*y,{steps:4});}
await p.waitForTimeout(300);await p.locator('#museum').screenshot({path:'shots/mus-'+n+'.png'});
console.log(n,await p.locator('#museum .finds li.on').count(),errs,await p.evaluate(()=>document.documentElement.scrollWidth));}
await b.close();})();
