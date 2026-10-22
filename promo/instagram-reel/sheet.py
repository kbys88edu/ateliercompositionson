import sys,glob
from PIL import Image
fs=sorted(glob.glob('out/still_*.png')); cols=int(sys.argv[1]) if len(sys.argv)>1 else 4
ims=[Image.open(f).convert('RGB').resize((324,576)) for f in fs]
rows=(len(ims)+cols-1)//cols; sh=Image.new('RGB',(324*cols,576*rows))
for i,im in enumerate(ims): sh.paste(im,((i%cols)*324,(i//cols)*576))
sh.save('/tmp/sheet.png'); print([f[-7:-4] for f in fs])
