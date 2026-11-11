# usage: python3 build.py 5-09-02   (reads lesson-<id>.src.html; writes preview-<id>.html, repo-<id>.html, repo-bd.js)
import re,base64,sys,os,json
D=os.path.dirname(os.path.abspath(__file__))
LID=sys.argv[1] if len(sys.argv)>1 else '5-09-01'
src=open(D+'/lesson-%s.src.html'%LID).read()
N=[0]
def inp(a,lab,h):
    N[0]+=1; return '<input class="bd-ans" id="a%d" data-a="%s" inputmode="decimal" autocomplete="off" aria-label="%s"%s>' % (N[0],a,lab,(' data-hint="%s"' % h.replace('"','&quot;')) if h else '')
def tok(m):
    t=m.group(1); h=''
    if '~' in t: t,h=t.split('~',1)
    k,v=t.split(':',1)
    if k=='n': return inp(v,'answer',h)
    if k=='fr':
        a,c=v.split(':'); return '<span class="bd-fr">'+inp(a,'numerator',h)+'<i></i>'+inp(c,'denominator',h)+'</span>'
src=re.sub(r'\[\[((?:n|fr):[^\]]*?)\]\]',tok,src)
src=re.sub(r'<span class="frs">([^/<]+)/([^<]+)</span>',lambda m:'<span class="bd-frs"><span>%s</span><span>%s</span></span>'%(m.group(1),m.group(2)),src)
css=open(D+'/bd.css').read(); js=open(D+'/bd.src.js').read().replace('__CREW__',open(D+'/crew.json').read())
def b64(f): return ('data:image/webp;base64,' if f.endswith('.webp') else 'data:image/jpeg;base64,')+base64.b64encode(open(D+'/images/builders/'+f,'rb').read()).decode()
AU=D+'/audio/builders'
aud={f:'data:audio/mpeg;base64,'+base64.b64encode(open(AU+'/'+f,'rb').read()).decode() for f in (os.listdir(AU) if os.path.isdir(AU) else []) if f.endswith('.mp3') and 'sample' not in f}
pre=re.sub(r'\{\{VID:([^}]+)\}\}',lambda m:('data:video/mp4;base64,' if m.group(1).endswith('.mp4') else 'data:image/jpeg;base64,')+(base64.b64encode(open(D+'/video/'+m.group(1),'rb').read()).decode() if os.path.exists(D+'/video/'+m.group(1)) else ''),src)
pre=re.sub(r'\{\{IMG:([^}]+)\}\}',lambda m:b64(m.group(1)),pre).replace('{{CSS}}','<style>'+css+'</style>').replace('{{JS}}','<script>window.BD_AUDIO='+json.dumps(aud)+';</script><script>'+js+'</script>')
open(D+'/preview-%s.html'%LID,'w').write(pre)
# version stamp for the shared layer (a returning browser gets a layer fix right away): md5 of the repo's bd.js + bd.css.
# After changing bd.src.js or bd.css, copy them into assets/builders first, then rebuild every builders page so the stamps match.
import hashlib
_A=os.path.join(D,'..','..','assets','builders')
VER=hashlib.md5((open(_A+'/bd.js',encoding='utf8').read()+open(_A+'/bd.css',encoding='utf8').read()).encode('utf8')).hexdigest()[:8] if os.path.exists(_A+'/bd.js') else '0'
rep=re.sub(r'\{\{IMG:([^}]+)\}\}',lambda m:'images/builders/'+m.group(1),re.sub(r'\{\{VID:([^}]+)\}\}',lambda m:'assets/video/'+m.group(1),src)).replace("audio: 'hemiunu","audio: 'audio/builders/hemiunu").replace('{{CSS}}','<link rel="stylesheet" href="assets/builders/bd.css?v=%s">'%VER).replace('{{JS}}','<script src="assets/builders/bd.js?v=%s"></script>'%VER)
open(D+'/repo-%s.html'%LID,'w').write(rep)
open(D+'/repo-bd.js','w').write(js)
print(len(pre)//1024,'KB preview', N[0],'boxes')
