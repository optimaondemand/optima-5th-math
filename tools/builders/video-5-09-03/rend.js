const {chromium}=require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const mode=process.argv[2]||'stills';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file://'+process.cwd()+'/harness.html');
const TL=JSON.parse(fs.readFileSync('tl.json'));const svg=fs.readFileSync('site3.svg','utf8');
await p.evaluate(([tl,svg])=>{TL=tl;const s=document.querySelector('#site svg');s.outerHTML=svg;},[TL,svg]);await p.waitForTimeout(300);
if(mode==='stills'){const C=TL.cue,S=TL.S;const ts={open:S.open+3,pt:C.pt+1,c2:C.ten+1,c3:C.res1+1,c4:C.arr+1,c5z:C.zero5+1,c5:C.res5+1,c6:C.ord6+1,c6s:C.star6+1,close:S.close+2};
 for(const [k,t] of Object.entries(ts)){await p.evaluate(t=>render(t),t);await p.screenshot({path:'st-'+k+'.jpg',quality:70});}}
else{const fps=20,N=Math.ceil(TL.T*fps);const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-i','narr.wav','-c:v','libx264','-pix_fmt','yuv420p','-preset','medium','-crf','22','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart','g5math-09-03-learn.mp4']);
 for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/fps);const buf=await p.screenshot({type:'jpeg',quality:85});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await p.evaluate(t=>render(t),TL.cue.res1+1);await p.screenshot({path:'g5math-09-03-learn-poster.jpg',type:'jpeg',quality:80});}
await b.close();})();
