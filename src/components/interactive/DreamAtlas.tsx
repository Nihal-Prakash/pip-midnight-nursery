import { useEffect, useId, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { atlasModels } from '../../assets/models'
import './DreamAtlas.css'

type Command = 'left' | 'right' | 'up' | 'down' | 'in' | 'out' | 'reset' | 'play'

function disposeTree(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  root.traverse(object => {
    if (object instanceof THREE.Mesh) {
      geometries.add(object.geometry)
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material)
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value)
      }
      if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose()
    }
  })
  textures.forEach(texture => { texture.dispose(); if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close() })
  materials.forEach(material => material.dispose())
  geometries.forEach(geometry => geometry.dispose())
}

function proceduralModel(id: string) {
  const group = new THREE.Group()
  const cream = new THREE.MeshStandardMaterial({ color: '#fff4e7', roughness: 0.65 })
  const lavender = new THREE.MeshStandardMaterial({ color: '#c9b6e7', roughness: 0.55 })
  const gold = new THREE.MeshStandardMaterial({ color: '#ffe5a0', metalness: 0.45, roughness: 0.35 })
  function add(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); group.add(mesh); return mesh
  }
  add(new THREE.CylinderGeometry(1.2, 1.3, 0.15, 48), cream, 0, -0.85)
  if (id === 'music-preview') {
    add(new THREE.BoxGeometry(1.7, 0.75, 1.15), lavender, 0, -0.36)
    add(new THREE.BoxGeometry(1.82, 0.12, 1.26), gold, 0, 0.08)
    const lid = add(new THREE.BoxGeometry(1.82, 0.12, 1.26), cream, 0, 0.62, -0.4); lid.rotation.x = -0.85
    add(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 40), gold, 0, 0.19)
    const star = add(new THREE.OctahedronGeometry(0.35), gold, 0, 0.62, 0.14); star.scale.y = 1.3
    add(new THREE.TorusGeometry(0.18, 0.045, 8, 24), gold, 1.03, -0.36).rotation.y = Math.PI / 2
  } else {
    add(new THREE.CylinderGeometry(0.35, 0.55, 0.2, 32), lavender, 0, -0.67)
    add(new THREE.OctahedronGeometry(0.47), cream, 0, 0.12)
    for (let i = 0; i < 3; i++) {
      const ring = add(new THREE.TorusGeometry(0.91, 0.025, 8, 64), gold, 0, 0.1)
      ring.rotation.set(i * 0.8, i * 1.1, 0.3)
      add(new THREE.SphereGeometry(0.085, 12, 8), lavender, Math.cos(i * 2.1) * 0.9, 0.1 + Math.sin(i * 2.1) * 0.9, 0)
    }
  }
  return group
}

export function DreamAtlas({ reduced }: { reduced: boolean }) {
  const [selected, setSelected] = useState(atlasModels[0].id)
  const [status, setStatus] = useState('Preparing the display…')
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hasAnimation, setHasAnimation] = useState(false)
  const [retry, setRetry] = useState(0)
  const mount = useRef<HTMLDivElement>(null)
  const command = useRef<(action: Command) => void>(() => {})
  const hintId = useId()
  const model = atlasModels.find(item => item.id === selected)!

  useEffect(() => {
    const host = mount.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    setReady(false); setPlaying(false); setHasAnimation(false)
    setStatus('Preparing the display…')
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // WebGL availability is external state; report initialization failure to the UI.
      // eslint-disable-next-line react/set-state-in-effect
      setStatus('The 3D display could not start. WebGL may be unavailable; the model notes and other nursery stations still work.')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const canvas = renderer.domElement
    canvas.tabIndex = 0
    canvas.setAttribute('role', 'img')
    canvas.setAttribute('aria-label', `${model.label} interactive 3D display`)
    canvas.setAttribute('aria-describedby', hintId)
    host.appendChild(canvas)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100)
    camera.position.set(3.3, 2.3, 4.4)
    const controls = new OrbitControls(camera, canvas)
    controls.enablePan = false; controls.enableDamping = false
    controls.minDistance = 2.5; controls.maxDistance = 10
    controls.minPolarAngle = 0.15; controls.maxPolarAngle = Math.PI - 0.15
    controls.update(); controls.saveState()
    scene.add(new THREE.HemisphereLight('#fff4e7', '#81638e', 2.5))
    const lamp = new THREE.DirectionalLight('#ffe5a0', 4); lamp.position.set(3, 4, 5); scene.add(lamp)
    const rim = new THREE.DirectionalLight('#c9b6e7', 2); rim.position.set(-3, 2, -2); scene.add(rim)
    const turntable = new THREE.Group(); scene.add(turntable)
    let mixer: THREE.AnimationMixer | undefined
    let disposed = false, failed = false, running = false, frame = 0, last = 0
    const abort = new AbortController()
    let timeout: ReturnType<typeof setTimeout> | undefined
    function draw() { if (!disposed && !failed) renderer.render(scene, camera) }
    function tick(now: number) {
      if (!running || disposed || failed || document.hidden) return
      const delta = Math.min((now - last) / 1000, 0.05); last = now
      if (mixer) mixer.update(delta)
      else turntable.rotation.y += delta * 0.35
      draw(); frame = requestAnimationFrame(tick)
    }
    function stop() { running = false; cancelAnimationFrame(frame); setPlaying(false) }
    function visibility() {
      cancelAnimationFrame(frame)
      if (running && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick) }
    }
    function fail(message: string) {
      if (disposed) return
      failed = true; stop(); setReady(false); setStatus(message)
    }
    function lost(event: Event) {
      event.preventDefault(); fail('The 3D display lost its connection. Retry the display, or continue exploring the nursery.')
    }
    canvas.addEventListener('webglcontextlost', lost)
    document.addEventListener('visibilitychange', visibility)
    controls.addEventListener('change', draw)
    const resize = new ResizeObserver(() => {
      const width = host.clientWidth, height = host.clientHeight
      if (!width || !height) return
      camera.aspect = width / height; camera.updateProjectionMatrix()
      renderer.setSize(width, height, false); draw()
    })
    resize.observe(host)
    command.current = action => {
      if (failed || disposed) return
      if (action === 'play') {
        if (reduced) return
        if (running) stop()
        else { running = true; setPlaying(true); last = performance.now(); frame = requestAnimationFrame(tick) }
        return
      }
      stop()
      if (action === 'reset') {
        turntable.rotation.set(0, 0, 0); mixer?.setTime(0); controls.reset()
      } else {
        const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target))
        if (action === 'left') spherical.theta -= Math.PI / 8
        if (action === 'right') spherical.theta += Math.PI / 8
        if (action === 'up') spherical.phi -= Math.PI / 12
        if (action === 'down') spherical.phi += Math.PI / 12
        if (action === 'in') spherical.radius /= 1.2
        if (action === 'out') spherical.radius *= 1.2
        spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle)
        spherical.radius = THREE.MathUtils.clamp(spherical.radius, controls.minDistance, controls.maxDistance)
        camera.position.setFromSpherical(spherical).add(controls.target); controls.update()
      }
      draw()
    }
    function keydown(event: KeyboardEvent) {
      const actions: Record<string, Command> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' }
      if (actions[event.key]) { event.preventDefault(); event.stopPropagation(); command.current(actions[event.key]) }
    }
    canvas.addEventListener('keydown', keydown)
    function install(root: THREE.Object3D, clips: THREE.AnimationClip[] = []) {
      if (disposed || failed) { disposeTree(root); return }
      const bounds = new THREE.Box3().setFromObject(root)
      const size = bounds.getSize(new THREE.Vector3()).length()
      if (!Number.isFinite(size) || size <= 0) { disposeTree(root); fail('This model has no usable geometry. Select another study.'); return }
      const fitted = new THREE.Group(); fitted.add(root)
      root.position.sub(bounds.getCenter(new THREE.Vector3()))
      fitted.scale.setScalar(2.8 / size); turntable.add(fitted)
      const valid = clips.filter(clip => clip.duration > 0 && clip.tracks.length > 0 && clip.validate())
      if (valid.length) { mixer = new THREE.AnimationMixer(root); mixer.clipAction(valid[0]).play(); setHasAnimation(true) }
      setReady(true)
      setStatus(model.kind === 'procedural' ? 'Procedural preview · not a supplied GLB' : valid.length ? `Model loaded · ${valid.length} valid animation clip(s); playing the first clip on request` : 'Model loaded · no valid animation clip; group turntable available')
      draw()
    }
    if (model.kind === 'procedural') install(proceduralModel(model.id))
    else if (model.url) {
      timeout = setTimeout(() => { abort.abort(); fail('Model loading timed out. Retry or select another study.') }, 12000)
      fetch(model.url, { signal: abort.signal }).then(response => {
        if (!response.ok) throw new Error('Model response failed')
        return response.arrayBuffer()
      }).then(bytes => new GLTFLoader().parseAsync(bytes, model.url!.slice(0, model.url!.lastIndexOf('/') + 1)))
        .then(gltf => { clearTimeout(timeout); install(gltf.scene, gltf.animations) })
        .catch(() => { clearTimeout(timeout); if (!disposed && !failed) fail('This model could not be loaded. Retry or select another study.') })
    } else fail('This supplied model is unavailable. Choose a procedural study instead.')
    return () => {
      disposed = true; command.current = () => {}; running = false
      abort.abort(); clearTimeout(timeout); cancelAnimationFrame(frame); resize.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      canvas.removeEventListener('keydown', keydown); canvas.removeEventListener('webglcontextlost', lost)
      controls.removeEventListener('change', draw); controls.dispose()
      mixer?.stopAllAction(); if (mixer) mixer.uncacheRoot(mixer.getRoot())
      disposeTree(scene); renderer.dispose(); renderer.forceContextLoss(); canvas.remove()
    }
  }, [model, reduced, retry, hintId])

  return <section className="dx-atlas" aria-label="Dream Atlas">
    <header><p className="dx-eyebrow">DREAM ATLAS / OBJECT STUDIES</p><h2>A small world, from every side.</h2><p>“I keep my invention studies here. Turn one over and take a closer look.” — Pip</p></header>
    <div className="dx-atlas-models" aria-label="Choose a model">
      {atlasModels.map(item => <button type="button" className="dx-secondary" key={item.id} aria-pressed={selected === item.id} disabled={item.kind === 'glb' && !item.url} onClick={() => setSelected(item.id)}>{item.label}{item.kind === 'glb' && !item.url ? ' · unavailable' : ''}</button>)}
    </div>
    <div className="dx-atlas-display" ref={mount} aria-busy={!ready && status === 'Preparing the display…'} />
    <p className="dx-atlas-status" role="status">{status}</p>
    {!ready && status !== 'Preparing the display…' && <button type="button" className="dx-secondary" onClick={() => setRetry(value => value + 1)}>Retry 3D display</button>}
    <div className="dx-atlas-controls" aria-label="3D view controls">
      {([['left', 'Rotate left'], ['right', 'Rotate right'], ['up', 'Tilt up'], ['down', 'Tilt down'], ['in', 'Zoom in'], ['out', 'Zoom out'], ['reset', 'Reset view']] as const).map(([action, label]) => <button type="button" className="dx-secondary" key={action} disabled={!ready} onClick={() => command.current(action)}>{label}</button>)}
      <button type="button" className="dx-primary" disabled={!ready || reduced} aria-pressed={playing} onClick={() => command.current('play')}>{playing ? 'Pause' : 'Play'} {hasAnimation ? 'animation' : 'turntable'}</button>
    </div>
    <p id={hintId} className="dx-atlas-hint">Drag to orbit; pinch or scroll to zoom. On the focused display: arrow keys rotate, + / − zoom, Home resets. {reduced ? 'Reduced motion: automatic playback is off; manual controls still work.' : 'Playback starts only when you press Play.'}</p>
    <p className="dx-atlas-description">{model.description}</p>
    <aside className="dx-atlas-missing"><strong>Original model shelf · awaiting files</strong><p>The supplied Pip and music-box GLBs could not be recovered. These geometric studies are labeled alternatives, not the original models. No missing model is downloaded.</p></aside>
    <small>3D display: Three.js (MIT). Procedural studies: DREAM.EXE. Supplied-art provenance is recorded in the project credits.</small>
  </section>
}

export default DreamAtlas
