// QA ONLY: writes stand-in WebP files with the same dimensions and ~same byte size as the real
// optimised photos, so layout and LCP can be measured in an environment that cannot download them.
// Never commit the output. Real files come from `npm run images`.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const m = JSON.parse(readFileSync(new URL('../src/images.json', import.meta.url))).images;
const py = `
import sys, io, json, random
from PIL import Image, ImageDraw
m = json.loads(sys.stdin.read())
def make(w,h,target,path):
    img = Image.new('RGB',(w,h))
    px = img.load()
    random.seed(w*h)
    for y in range(h):
        for x in range(w):
            g = 90 + int(70*((x*7+y*13)%97)/97)
            n = random.randint(-28,28)
            px[x,y] = (40+n, g+n, 30+n)
    lo,hi=5,100; best=None
    for _ in range(9):
        q=(lo+hi)//2
        b=io.BytesIO(); img.save(b,'WEBP',quality=q); s=b.tell()
        best=(abs(s-target),q,b.getvalue()) if best is None or abs(s-target)<best[0] else best
        if s<target: lo=q+1
        else: hi=q-1
    open(path,'wb').write(best[2])
    return len(best[2])
for slug,v in m.items():
    if v.get('png'): continue
    s1=make(v['w'],v['h'],v['bytes'],f"public/images/{slug}.webp")
    if v['w']>600:
        s2=make(600,round(v['h']*600/v['w']),v['bytes600'],f"public/images/{slug}-600.webp")
    print(slug,s1)
`;
execSync(`python3 -I -c '${py.replace(/'/g, "'\\''")}'`, { input: JSON.stringify(m), stdio: ['pipe', 'inherit', 'inherit'] });
