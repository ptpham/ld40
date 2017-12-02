
import bpy, json, os

outfile = os.path.expanduser('~/faceWeights.json')
targetName = 'Cube'

target = bpy.data.objects['Cube']
numVertices = len(target.data.vertices)

result = dict()
for group in target.vertex_groups:
  weights = []
  for i in xrange(numVertices):
    weight = 0
    try:
      weight = group.weight(i)
    except: pass
    weights.append(weight)
  result[group.name] = weights

with open(outfile, 'w') as handle:
  handle.write(json.dumps(result))

