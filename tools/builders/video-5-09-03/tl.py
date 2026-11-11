import json,subprocess
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
CS={'c1':0,'c2':8.881,'c3':20.659,'c4':36.41,'c5':45.255,'c6':67.554,'open':59.17,'close':70.61}
order=[('open','v3-open.mp3'),('c1','v3-c1.wav'),('c2','v3-c2.wav'),('c3','v3-c3.wav'),('c4','v3-c4.wav'),('c5','v3-c5.wav'),('c6','v3-c6.wav'),('close','v3-close.mp3')]
t=0.8;S={};parts=[]
for k,f in order:
    S[k]=t;parts.append((t,f));t+=dur(f)+(0.7 if k in('open','c6') else 0.45)
T=t+0.8
def A(k,x): return round(S[k]+x-CS[k],3)
cap=[('open',59.52,'Two long blocks for the corner: 3.528 m and 3.582 m.'),('open',66.08,'Same digits, different order. Which one is longer?'),
('c1',0,'To compare decimals, line up the decimal points.'),('c1',3.84,'Now each place sits under the same place.'),
('c2',9.12,'Start at the left, with the greatest place.'),('c2',12.16,'Ones: 3 and 3. The same.'),('c2',15.92,'Tenths: 5 and 5. The same.'),
('c3',20.88,'Hundredths: 2 and 8. Different! This place decides.'),('c3',26.64,'2 hundredths < 8 hundredths, so 3.528 < 3.582.'),
('c4',36.64,'On a number line, 3.582 is farther right.'),('c4',41.12,'The greater number is always farther right.'),
('c5',45.44,'Watch out. Is 3.482 greater because it has more digits?'),('c5',51.04,'Write a zero in each empty place. 3.5 = 3.500.'),('c5',58.04,'Tenths: 5 and 4. So 3.5 is greater.'),('c5',63.44,'More digits does not mean a greater number.'),
('c6',67.76,'To order decimals, compare the same way.'),('c6',71.04,'Tenths: 0, 6, 0. 3.6 is the greatest.'),('c6',76.72,'Hundredths: 6 and 0.'),('c6',79.44,'From least to greatest: 3.006, 3.06, 3.6.'),
('close',70.88,'Line up the places and start at the left.'),('close',73.44,'Now check my new blocks.')]
cue={'pt':A('c1',2.32),'ones':A('c2',12.16),'ten':A('c2',15.92),'hund':A('c3',20.88),'res1':A('c3',29.84),
'f1':A('c4',37.0),'f2':A('c4',38.4),'arr':A('c4',41.12),
'ch5':A('c5',45.44),'zero5':A('c5',51.04),'ten5':A('c5',58.04),'res5':A('c5',60.56),
'ch6':A('c6',67.76),'zero6':A('c6',69.12),'ten6':A('c6',71.04),'star6':A('c6',74.24),'hund6':A('c6',76.72),'ord6':A('c6',79.44)}
json.dump({'T':round(T,2),'S':S,'cue':cue,'cap':[[A(k,x),s] for k,x,s in cap]},open('tl.json','w'),indent=0)
inp=[];flt=[]
for i,(st,f) in enumerate(parts): inp+=['-i',f]; flt.append('[%d:a]aresample=44100,aformat=channel_layouts=mono,adelay=%d[a%d]'%(i,int(st*1000),i))
subprocess.run(['ffmpeg','-y','-loglevel','error']+inp+['-filter_complex',';'.join(flt)+';'+''.join('[a%d]'%i for i in range(len(parts)))+'amix=inputs=%d:normalize=0,apad=whole_dur=%.2f[o]'%(len(parts),T),'-map','[o]','-ar','44100','narr.wav'],check=True)
print(T,S)
