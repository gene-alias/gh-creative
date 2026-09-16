"""Build compact, reproducible globe geometry from Natural Earth GeoJSON.
Input: /tmp/gh-earth-{land,borders,cities}.geojson (50m land/borders, 110m cities).
All output coordinates are lon/lat hundredths of a degree. Public domain data.
"""
import json, math, random
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
land = json.load(open('/tmp/gh-earth-land.geojson'))
borders = json.load(open('/tmp/gh-earth-borders.geojson'))
cities = json.load(open('/tmp/gh-earth-cities.geojson'))
mask = Image.new('1', (4096, 2048))
draw = ImageDraw.Draw(mask)
coast = []
def simplify(points, tolerance=0.1):
    if len(points) < 3: return points
    a,b=points[0],points[-1]
    dx,dy=b[0]-a[0],b[1]-a[1]
    d=dx*dx+dy*dy
    best,index=0,0
    for i,p in enumerate(points[1:-1],1):
        t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/d)) if d else 0
        distance=(p[0]-a[0]-t*dx)**2+(p[1]-a[1]-t*dy)**2
        if distance>best: best,index=distance,i
    if best<=tolerance*tolerance:return [a,b]
    return simplify(points[:index+1],tolerance)[:-1]+simplify(points[index:],tolerance)
def segments(ring):
    out=[]
    points=simplify(ring)
    for a,b in zip(points,points[1:]):
        if abs(a[0]-b[0])>180: continue
        # Avoid long chord cuts at high latitudes.
        n=max(1,math.ceil(max(abs(a[0]-b[0]),abs(a[1]-b[1]))/2))
        for i in range(n):
            for t in [i/n,(i+1)/n]:
                out.extend([round((a[0]+(b[0]-a[0])*t)*100),round((a[1]+(b[1]-a[1])*t)*100)])
    return out
for feature in land['features']:
    geometry=feature['geometry']
    polygons=geometry['coordinates'] if geometry['type']=='MultiPolygon' else [geometry['coordinates']]
    for polygon in polygons:
        for i,ring in enumerate(polygon):
            draw.polygon([((x+180)/360*4095,(90-y)/180*2047) for x,y in ring],fill=1 if i==0 else 0)
            coast.extend(segments(ring))
country=[]
for feature in borders['features']:
    geometry=feature['geometry']
    lines=geometry['coordinates'] if geometry['type']=='MultiLineString' else [geometry['coordinates']]
    for line in lines:country.extend(segments(line))
points=[]
for i in range(68000):
    y=1-2*(i+0.5)/68000
    lat=math.degrees(math.asin(y))
    lon=(math.degrees(i*math.pi*(3-math.sqrt(5)))+180)%360-180
    if mask.getpixel((int((lon+180)/360*4095),int((90-lat)/180*2047))):points.append([round(lon*100),round(lat*100)])
random.Random(42).shuffle(points)
city=[]
for f in cities['features']:
    lon,lat=f['geometry']['coordinates'][:2]
    city.extend([round(lon*100),round(lat*100)])
data={'coast':coast,'borders':country,'land':[v for p in points for v in p],'cities':city}
(root/'components/hero/earth-data.json').write_text(json.dumps(data,separators=(',',':')))
# The fallback is the same real geographic point cloud, orthographically projected.
def project(lon,lat):
    lon=math.radians(lon/100+25);lat=math.radians(lat/100)
    x=math.cos(lat)*math.sin(lon);y=math.sin(lat);z=math.cos(lat)*math.cos(lon)
    return x,y,z
paths=[]
for lon,lat in points[:10000]:
    x,y,z=project(lon,lat)
    if z>0:paths.append(f'M{200+x*188:.1f},{200-y*188:.1f}h.7v.7h-.7z')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><circle cx="200" cy="200" r="188" fill="#08080b" stroke="#e8eef3" stroke-opacity=".3"/><path fill="#E4272C" fill-opacity=".8" d="'+''.join(paths)+'"/></svg>'
(root/'public/assets/earth/earth-fallback.svg').write_text(svg)
print({k:len(v)//2 for k,v in data.items()})
print('Geometry bytes:',(root/'components/hero/earth-data.json').stat().st_size)
