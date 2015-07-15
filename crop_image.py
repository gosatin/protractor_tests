from PIL import Image
import os
import sys

path = '/tmp/screenshots'
marker = '_startPos'
out_image = 'screenshot.png'
filename_prefix = 'screenshot_'
file_ext = '.png'

files = []
width = 0
height = 0
stitched_image_path = os.path.join(path, out_image)
cur_height = 0
imgs = []
for i in os.listdir(path):
    if os.path.isfile(os.path.join(path,i)) and filename_prefix in i:
        files.append(os.path.join(path, i))
files.sort()


for path in files:
  header_size = int(path[path.find(marker) + len(marker):path.find(file_ext)])
  img = Image.open(path)
  img_w, img_h = img.size
  if img_w > width:
    width = img_w
  img = img.crop( (0,header_size,img_w,img_h) )
  height += img.size[1]
  imgs.append(img)

big_img = Image.new('RGB',(width, height))
for img in imgs:
  big_img.paste(img, (0,cur_height))
  cur_height += img.size[1]

try:
  imagefile = open(stitched_image_path, 'wb')
  big_img.save(imagefile, 'png', quality=90)
  imagefile.close()
except SystemError as e:
  print'Cannot save user image', e

