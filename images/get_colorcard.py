from PIL import Image

color_card = Image.open('sy_78273129266.jpg')
color_card.convert('RGB')

print color_card.width, color_card.height

seg_left = 100
seg_right = color_card.width - 100

colors = []
prevcolor = (0,0,0)

for seg in [seg_left, seg_right]:
    for i in xrange(color_card.height):
        r, g, b = color_card.getpixel((seg, i))
        if r > 100 and g > 100 and b > 100:
            delta_abs = abs(prevcolor[0] - r) + abs(prevcolor[1] - g) + abs(prevcolor[2] - b)
            if delta_abs > 100:
                prevcolor = (r,g,b)
                colors += [[r/256.0, g/256.0, b/256.0, 0.4]]
                print prevcolor
print colors
print len(colors)