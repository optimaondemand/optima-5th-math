import subprocess,re
def sil(f):
    o=subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=noise=-40dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
    s=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)]; e=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
    d=re.search(r'Duration: (\d+):(\d+):([\d.]+)',o); D=int(d.group(2))*60+float(d.group(3)); return list(zip(s,e)),D
def segs(f,gaps):
    S,D=sil(f); cuts=[]
    for a,b in gaps:
        m=(a+b)/2; best=min(S,key=lambda x:abs((x[0]+x[1])/2-m)); assert best[0]<=b+0.3 and best[1]>=a-0.3,(f,a,b,best); cuts.append(best)
    st=[0]+[c[1]-0.2 for c in cuts]; en=[c[0]+0.25 for c in cuts]+[D]; return list(zip(st,en))
K=[(6.8,8.28),(15.547,17.36),(22.853,24.64),(30.827,32.48),(39.227,40.96),(46.32,47.12),(49.52,50.16),(55.12,56.0),(58.96,59.52),(69.28,70.88)]
C=[(7.04,9.12),(19.12,20.88),(34.88,36.64),(43.76,45.44),(66.24,67.76)]
names=['hemiunu-03-w1-01','hemiunu-03-w1-02','hemiunu-03-w1-03','hemiunu-03-w1-04','hemiunu-03-w1-05','hemiunu-03-w1-06','hemiunu-03-w3-01','hemiunu-03-w3-02','hemiunu-03-w3-03','v3-open','v3-close']
ks=segs('g503-kofi.mp3',K)
for n,(a,b) in zip(names,ks):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','g503-kofi.mp3','-ss',str(max(0,a)),'-to',str(b),'-af','afade=t=in:d=0.04,areverse,afade=t=in:d=0.12,areverse','-b:a','96k',n+'.mp3'],check=True); print(n,round(a,2),round(b,2))
cs=segs('g503-claire.mp3',C)
for i,(a,b) in enumerate(cs):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','g503-claire.mp3','-ss',str(max(0,a)),'-to',str(b),'-c:a','pcm_s16le','-ar','44100','v3-c%d.wav'%(i+1)],check=True); print('c%d'%(i+1),round(a,3),round(b,2))
