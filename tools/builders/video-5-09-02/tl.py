import json,subprocess
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
CS={'c1':0,'c2':15.0785,'c3':29.2773,'c4':41.1671,'c5':53.7157,'c6':71.8578,'c7':82.0879,'c8':98.7841,'open':57.8714,'close':68.3468}
order=[('open','v2-open.mp3'),('c1','v2-c1.wav'),('c2','v2-c2.wav'),('c3','v2-c3.wav'),('c4','v2-c4.wav'),('c5','v2-c5.wav'),('c6','v2-c6.wav'),('c7','v2-c7.wav'),('c8','v2-c8.wav'),('close','v2-close.mp3')]
t=0.8; S={}; parts=[]
for k,f in order:
    S[k]=t; parts.append((t,f)); t+=dur(f)+(0.7 if k in('open','c8') else 0.45)
T=t+0.8
def A(k,x): return round(S[k]+x-CS[k],3)
cap=[('open',58.24,'This block is 3.274 m long.'),('open',61.84,'Four digits. But they are not all worth the same.'),('open',65.28,'Let’s find out what each one is worth.'),
('c1',0,'Here is a place-value chart with discs.'),('c1',3.2,'Three ones. Two tenths. Seven hundredths. Four thousandths.'),('c1',9.76,'The chart shows 3.274.'),
('c2',15.36,'The value of a digit depends on its place.'),('c2',18.72,'The 2 is in the tenths place.'),('c2',21.44,'Its value is two tenths: 0.2, or 2/10.'),
('c3',29.52,'The 7 is in the hundredths place.'),('c3',32.24,'Its value is seven hundredths: 0.07, or 7/100.'),
('c4',41.44,'The 4 is in the thousandths place.'),('c4',44.24,'Its value is four thousandths: 0.004, or 4/1,000.'),
('c5',54.0,'Add the values and you get the number back.'),('c5',57.04,'3.274 = 3 + 0.2 + 0.07 + 0.004'),('c5',67.92,'This is expanded form.'),
('c6',72.08,'We can also express it with fractions:'),('c6',74.88,'3 + 2/10 + 7/100 + 4/1,000'),
('c7',82.32,'Break one hundredth into ten equal parts.'),('c7',85.76,'You get ten thousandths.'),('c7',88.08,'So a hundredth is worth ten times as much as a thousandth.'),('c7',92.72,'Each place is worth ten times as much as the place to its right.'),
('c8',99.12,'Watch out for an empty place.'),('c8',101.52,'2.058 has no tenths.'),('c8',104.96,'The zero holds the place.'),('c8',107.28,'In expanded form, 2 + 0.05 + 0.008.'),
('close',68.64,'Every digit has its place, and every place has its value.'),('close',73.04,'Now build a block of your own.')]
cue={'ones':A('c1',3.2),'tenths':A('c1',4.72),'hund':A('c1',6.24),'thou':A('c1',7.92),'num':A('c1',10.88),
'g2':A('c2',18.96),'d2':A('c2',24.0),'f2':A('c2',26.0),'g3':A('c3',29.76),'d3':A('c3',34.88),'f3':A('c3',37.36),'g4':A('c4',41.68),'d4':A('c4',46.96),'f4':A('c4',49.84),
'e0':A('c5',57.04),'e1':A('c5',59.92),'e2':A('c5',60.64),'e3':A('c5',62.56),'e4':A('c5',64.88),'elab':A('c5',68.8),
'x1':A('c6',74.88),'x2':A('c6',75.52),'x3':A('c6',76.88),'x4':A('c6',78.32),
'brk':A('c7',83.04),'cnt':A('c7',86.4),'arr1':A('c7',89.84),'arr':A('c7',94.0),
'reset':A('c8',99.12),'gz':A('c8',104.0),'zero':A('c8',105.2),'ex8':A('c8',108.0)}
seg={'open':S['open'],'c1':S['c1'],'close':S['close'],'c8':S['c8'],'c7':S['c7']}
json.dump({'T':round(T,2),'S':S,'cue':cue,'cap':[[A(k,x),s] for k,x,s in cap]},open('tl.json','w'),indent=0)
# narration track
inp=[];flt=[]
for i,(st,f) in enumerate(parts): inp+=['-i',f]; flt.append('[%d:a]aresample=44100,aformat=channel_layouts=mono,adelay=%d[a%d]'%(i,int(st*1000),i))
subprocess.run(['ffmpeg','-y','-loglevel','error']+inp+['-filter_complex',';'.join(flt)+';'+''.join('[a%d]'%i for i in range(len(parts)))+'amix=inputs=%d:normalize=0,apad=whole_dur=%.2f[o]'%(len(parts),T),'-map','[o]','-ar','44100','narr.wav'],check=True)
print(T,S)
