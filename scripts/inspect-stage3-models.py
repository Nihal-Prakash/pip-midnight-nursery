#!/usr/bin/env python3
"""Inspect actual GLB bytes; --self-test exercises validation without model assets."""
import argparse
import json
import math
from pathlib import Path
import struct


def inspect_glb(data):
    def require(condition, message):
        if not condition:
            raise ValueError(message)
    require(len(data) >= 20, 'Truncated GLB')
    magic, version, length = struct.unpack_from('<III', data)
    require((magic, version, length) == (0x46546c67, 2, len(data)), 'Invalid GLB header')
    chunks = {}; offset = 12
    while offset < length:
        require(offset + 8 <= length, 'Truncated chunk header')
        size, kind = struct.unpack_from('<II', data, offset); offset += 8
        require(size % 4 == 0 and offset + size <= length, 'Invalid chunk bounds')
        require(kind not in chunks, 'Duplicate chunk')
        chunks[kind] = data[offset:offset + size]; offset += size
    require(0x4e4f534a in chunks, 'Missing JSON')
    doc = json.loads(chunks[0x4e4f534a]); binary = chunks.get(0x004e4942, b'')
    require(not doc.get('extensionsRequired'), 'Required extensions need a dedicated decoder; not audited')
    buffers = doc.get('buffers', [])
    require(len(buffers) <= 1 and all('uri' not in b and b['byteLength'] <= len(binary) for b in buffers), 'External or truncated buffer; not audited')
    accessors = []
    formats = {5120: 'b', 5121: 'B', 5122: 'h', 5123: 'H', 5125: 'I', 5126: 'f'}
    widths = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}
    for accessor in doc.get('accessors', []):
        require('sparse' not in accessor, 'Sparse accessor needs a dedicated decoder; not audited')
        require(accessor['type'] in widths and accessor['componentType'] in formats, 'Unsupported accessor layout')
        width = widths[accessor['type']]; fmt = '<' + formats[accessor['componentType']] * width
        size = struct.calcsize(fmt)
        if 'bufferView' not in accessor:
            rows = [(0,) * width] * accessor['count']
        else:
            view = doc['bufferViews'][accessor['bufferView']]
            require(view.get('buffer', 0) == 0, 'Unknown buffer')
            start = view.get('byteOffset', 0); end = start + view['byteLength']
            stride = view.get('byteStride', size); local = accessor.get('byteOffset', 0)
            require(0 <= start <= end <= len(binary) and stride >= size and local >= 0 and accessor['count'] >= 0, 'Invalid buffer view')
            require(not accessor['count'] or start + local + stride * (accessor['count'] - 1) + size <= end, 'Accessor exceeds buffer view')
            rows = [struct.unpack_from(fmt, binary, start + local + i * stride) for i in range(accessor['count'])]
        require(all(math.isfinite(v) for row in rows for v in row), 'Nonfinite accessor value')
        accessors.append(rows)
    primitives = []
    for mesh in doc.get('meshes', []):
        for primitive in mesh['primitives']:
            attrs = primitive['attributes']; require('POSITION' in attrs, 'Missing positions')
            positions = accessors[attrs['POSITION']]; count = len(positions)
            require(count > 0 and all(len(row) == 3 for row in positions), 'Invalid positions')
            require(all(len(accessors[index]) == count for index in attrs.values()), 'Attribute count mismatch')
            indices = accessors[primitive['indices']] if 'indices' in primitive else []
            require(all(len(row) == 1 and isinstance(row[0], int) and 0 <= row[0] < count for row in indices), 'Index out of vertex range')
            primitives.append({'vertices': count, 'indices': len(indices), 'mode': primitive.get('mode', 4), 'attributes': list(attrs), 'bounds': [[min(p[i] for p in positions) for i in range(3)], [max(p[i] for p in positions) for i in range(3)]]})
    skins = []
    for node_index, node in enumerate(doc.get('nodes', [])):
        if 'skin' not in node:
            continue
        skin = doc['skins'][node['skin']]; require('mesh' in node, 'Skin node has no mesh')
        for primitive in doc['meshes'][node['mesh']]['primitives']:
            attrs = primitive['attributes']; require('JOINTS_0' in attrs and 'WEIGHTS_0' in attrs, 'Skin missing joint/weight attributes')
            require(all(isinstance(j, int) and 0 <= j < len(skin['joints']) for row in accessors[attrs['JOINTS_0']] for j in row), 'Joint out of skin range')
            require(all(all(w >= 0 for w in row) and sum(row) > 0 for row in accessors[attrs['WEIGHTS_0']]), 'Invalid skin weights')
        skins.append({'node': node_index, 'skin': node['skin'], 'jointCount': len(skin['joints'])})
    animations = []
    for animation in doc.get('animations', []):
        for sampler in animation['samplers']:
            times = accessors[sampler['input']]
            require(times and all(len(t) == 1 for t in times) and all(a[0] < b[0] for a, b in zip(times, times[1:])), 'Invalid animation timeline')
            require(bool(accessors[sampler['output']]), 'Empty animation output')
        animations.append({'name': animation.get('name', '(unnamed)'), 'channels': len(animation['channels']), 'samplers': len(animation['samplers'])})
    return {'meshes': len(doc.get('meshes', [])), 'primitives': primitives, 'accessorsDecoded': len(accessors), 'materials': doc.get('materials', []), 'textures': doc.get('textures', []), 'images': doc.get('images', []), 'skinDefinitions': len(doc.get('skins', [])), 'skins': skins, 'animations': animations}


def self_test():
    # Synthetic bytes are parser fixtures, never replacement artwork.
    doc = {'asset': {'version': '2.0'}, 'buffers': [{'byteLength': 42}],
           'bufferViews': [{'buffer': 0, 'byteOffset': 0, 'byteLength': 36},
                           {'buffer': 0, 'byteOffset': 36, 'byteLength': 6}],
           'accessors': [{'bufferView': 0, 'componentType': 5126, 'count': 3, 'type': 'VEC3'},
                         {'bufferView': 1, 'componentType': 5123, 'count': 3, 'type': 'SCALAR'}],
           'meshes': [{'primitives': [{'attributes': {'POSITION': 0}, 'indices': 1}]}]}
    def pack(payload):
        text = json.dumps(doc).encode(); text += b' ' * (-len(text) % 4)
        payload += b'\0' * (-len(payload) % 4)
        return struct.pack('<III', 0x46546c67, 2, 28 + len(text) + len(payload)) + struct.pack('<II', len(text), 0x4e4f534a) + text + struct.pack('<II', len(payload), 0x004e4942) + payload
    vertices = struct.pack('<9f', 0, 0, 0, 1, 0, 0, 0, 1, 0)
    report = inspect_glb(pack(vertices + struct.pack('<3H', 0, 1, 2)))
    assert report['meshes'] == 1 and report['primitives'][0]['vertices'] == 3
    assert report['materials'] == [] and report['animations'] == [] and report['skins'] == []
    for payload in [vertices + struct.pack('<3H', 0, 1, 3), struct.pack('<f', math.nan) + vertices[4:] + struct.pack('<3H', 0, 1, 2)]:
        try:
            inspect_glb(pack(payload))
        except ValueError:
            pass
        else:
            raise AssertionError('Invalid index or nonfinite accessor was accepted')
    print('PASS: real accessor decoding, finite coordinates, index bounds, empty material/skin/clip inventory')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('paths', nargs='*', type=Path)
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    if args.self_test:
        self_test()
    else:
        paths = args.paths or [Path('Pip2.0 Assets/pip-midnight-nursery/music.glb'), Path('Pip2.0 Assets/pip-midnight-nursery/pip.glb')]
        for path in paths:
            print(json.dumps({'path': str(path), 'status': 'inspected', **inspect_glb(path.read_bytes())} if path.is_file() else {'path': str(path), 'status': 'missing', 'geometry': 'not inspected'}, indent=2))
