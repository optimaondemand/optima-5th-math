import subprocess,re
def sil(f):
    o=subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=noise=-40dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
    s=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)]; e=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
    d=re.search(r'Duration: (\d+):(\d+):([\d.]+)',o); D=int(d.group(2))*60+float(d.group(3)); return list(zip(s,e)),D
def segs(f,gaps):
    S,D=sil(f); cuts=[]
    for a,b in gaps:
        m=(a+b)/2; best=min(S,key=lambda x:abs((x[0]+x[1])/2-m)); assert best[0]<=b+0.3 and best[1]>=a-0.3,(f,a,b,best); cuts.append(best)
    st=[0]+[c[1]-0.2 for c in cuts]; en=[max(c[0]+0.25,c[1]-0.15) for c in cuts]+[D]; return list(zip(st,en))
K=[(8.08,8.777),(14.08,15.223),(19.48,20.366),(25.68,26.8),(33.28,34.56),(37.84,39.013),(40.8,42.114),(45.6,46.891),(48.72,49.76),(57.97,59.147)]
C=[(10.667,12.72),(22.02,23.56),(38.427,40.0),(52.069,53.52),(63.387,64.88),(72.427,74.12)]
names=['hemiunu-04-w1-01','hemiunu-04-w1-02','hemiunu-04-w1-03','hemiunu-04-w1-04','hemiunu-04-w1-05','hemiunu-04-w1-06','hemiunu-04-w3-01','hemiunu-04-w3-02','hemiunu-04-w3-03','v4-open','v4-close']
ks=segs('g504-kofi.mp3',K)
for n,(a,b) in zip(names,ks):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','g504-kofi.mp3','-ss',str(max(0,a)),'-to',str(b),'-af','afade=t=in:d=0.04,areverse,afade=t=in:d=0.12,areverse','-b:a','96k',n+'.mp3'],check=True); print(n,round(a,2),round(b,2))
cs=segs('g504-claire.mp3',C)
for i,(a,b) in enumerate(cs):
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','g504-claire.mp3','-ss',str(max(0,a)),'-to',str(b),'-c:a','pcm_s16le','-ar','44100','v4-c%d.wav'%(i+1)],check=True); print('c%d'%(i+1),round(a,3),round(b,2))
