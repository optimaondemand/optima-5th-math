import json,subprocess
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
CS={'c1':0,'c2':12.369,'c3':23.316,'c4':39.737,'c5':53.296,'c6':64.614,'c7':73.737,'open':49.51,'close':58.67}
order=[('open','v4-open.mp3')]+[('c%d'%i,'v4-c%d.wav'%i) for i in range(1,8)]+[('close','v4-close.mp3')]
t=0.8;S={};parts=[]
for k,f in order:
    S[k]=t;parts.append((t,f));t+=dur(f)+(0.5 if k in('open','c7') else 0.25)
T=t+0.8
def A(k,x): return round(S[k]+x-CS[k],3)
cap=[('open',49.76,'This stone is 4.273 m long.'),('open',53.36,'My stonecutters cannot cut to the millimeter.'),('open',56.16,'How close is close enough?'),
('c1',0,'To round to the nearest hundredth, find the two hundredths it sits between.'),('c1',5.28,'4.273 is between 4.27 and 4.28.'),
('c2',12.72,'Halfway is 4.275.'),('c2',16.08,'4.273 is before halfway, so it is closer to 4.27.'),
('c3',23.56,'Look at the digit just to the right of the rounding place. It is 3.'),('c3',29.2,'0 to 4: keep the digit. 5 to 9: round up.'),('c3',34.16,'So 4.273 rounds to 4.27.'),
('c4',40.0,'Now round the same number to the nearest tenth.'),('c4',43.36,'The benchmarks are 4.2 and 4.3.'),('c4',47.28,'The hundredths digit is 7, so round up: 4.3.'),
('c5',53.52,'To the nearest whole number: 4 or 5?'),('c5',57.44,'The tenths digit is 2, so keep the 4.'),('c5',61.12,'One number, three different roundings.'),
('c6',64.88,'What if a number sits exactly on halfway, like 4.25?'),('c6',70.08,'We round up, to 4.3.'),
('c7',74.12,'Watch out. Round 3.96 to the nearest tenth.'),('c7',78.8,'9 tenths + 1 more tenth make 1 whole.'),('c7',82.48,'So it rounds to 4.0. The zero shows we rounded to tenths.'),
('close',59.147,'Close enough, and just right.'),('close',61.44,'Now write my work orders.')]
cue={'flag1':A('c1',5.28),'half2':A('c2',12.72),'arr2':A('c2',19.36),'dig3':A('c3',27.6),'rule3':A('c3',29.2),'res3':A('c3',34.16),
'dig4':A('c4',47.28),'arr4':A('c4',49.28),'dig5':A('c5',57.44),'arr5':A('c5',59.28),'sum5':A('c5',61.12),'flag6':A('c6',68.32),'arr6':A('c6',70.08),
'flag7':A('c7',75.2),'plus7':A('c7',78.8),'arr7':A('c7',82.48),'res7':A('c7',82.48)}
json.dump({'T':round(T,2),'S':S,'cue':cue,'cap':[[A(k,x),s] for k,x,s in cap]},open('tl.json','w'),indent=0)
inp=[];flt=[]
for i,(st,f) in enumerate(parts): inp+=['-i',f]; flt.append('[%d:a]aresample=44100,aformat=channel_layouts=mono,adelay=%d[a%d]'%(i,int(st*1000),i))
subprocess.run(['ffmpeg','-y','-loglevel','error']+inp+['-filter_complex',';'.join(flt)+';'+''.join('[a%d]'%i for i in range(len(parts)))+'amix=inputs=%d:normalize=0,apad=whole_dur=%.2f[o]'%(len(parts),T),'-map','[o]','-ar','44100','narr.wav'],check=True)
print(T,S)
