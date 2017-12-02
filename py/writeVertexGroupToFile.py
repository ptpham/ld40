
import bpy, json, os

outfile = os.path.expanduser('~/faceWeights.json')
targetName = 'face-base'

target = bpy.data.objects[targetName]
numVertices = len(target.data.vertices)

result = dict()
for group in target.vertex_groups:
  weights = []
  for i in range(numVertices):
    weight = 0
    try:
      weight = group.weight(i)
    except: pass
    weights.append(weight)
  result[group.name] = weights

with open(outfile, 'w') as handle:
  handle.write(json.dumps(result))

