/** Only verified local assets may receive URLs. Never derive a URL from a label. */
export type AtlasModel = {
  id: string
  label: string
  kind: 'procedural' | 'glb'
  url: string | null
  description: string
}

export const atlasModels: readonly AtlasModel[] = [
  { id: 'music-preview', label: 'Music-box study', kind: 'procedural', url: null, description: 'A little wind-up box, built from geometric shapes. This is an original procedural study, not the supplied music.glb.' },
  { id: 'globe-preview', label: 'Starlight globe', kind: 'procedural', url: null, description: 'A pocket constellation held inside golden orbits. This procedural object is not a reconstruction of Pip.' },
  { id: 'music', label: 'Supplied music box', kind: 'glb', url: null, description: 'music.glb is missing from the supplied archive and its remote gitlink. Geometry, materials, skinning and animation cannot be verified.' },
  { id: 'pip', label: 'Supplied Pip', kind: 'glb', url: null, description: 'pip.glb is missing from the supplied archive and its remote gitlink. No substitute character is presented as the original model.' },
]
