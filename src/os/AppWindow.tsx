import { useEffect, useRef } from 'react'
import type { Dispatch, PointerEvent, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { AppDefinition } from '../apps/registry'
import type { Bounds, WindowAction, WindowState } from '../state/windows'

export function AppWindow({ app, state, focused, z, viewport, dispatch, children }: { app: AppDefinition; state: WindowState; focused: boolean; z: number; viewport: Bounds; dispatch: Dispatch<WindowAction>; children: ReactNode }) {
  const panel = useRef<HTMLElement>(null)
  const title = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; original: WindowState; mode: 'move' | 'resize' } | null>(null)
  const pending = useRef(0)
  const reduced = useReducedMotion()
  const mobile = viewport.width <= 700
  const hidden = state.minimized || (mobile && !focused)
  useEffect(() => {
    if (focused && !state.minimized && !panel.current?.contains(document.activeElement)) title.current?.focus({ preventScroll: true })
  }, [focused, state.minimized])
  useEffect(() => () => { cancelAnimationFrame(pending.current); document.documentElement.classList.remove('dx-dragging') }, [])

  function start(event: PointerEvent<HTMLElement>, mode: 'move' | 'resize') {
    if (mobile || state.maximized || event.button !== 0 || (event.target as Element).closest('button')) return
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX, y: event.clientY, original: state, mode }
    document.documentElement.classList.add('dx-dragging')
  }
  function move(event: PointerEvent<HTMLElement>) {
    const d = drag.current
    if (!d) return
    const dx = event.clientX - d.x, dy = event.clientY - d.y
    cancelAnimationFrame(pending.current)
    pending.current = requestAnimationFrame(() => dispatch(d.mode === 'move'
      ? { type: 'move', id: app.id, x: d.original.x + dx, y: d.original.y + dy, viewport }
      : { type: 'resize', id: app.id, width: d.original.width + dx, height: d.original.height + dy, viewport }))
  }
  function end() {
    drag.current = null
    document.documentElement.classList.remove('dx-dragging')
  }
  return <motion.section ref={panel} id={`window-${app.id}`} role="dialog" aria-labelledby={`title-${app.id}`} aria-describedby={`hint-${app.id}`} hidden={hidden} inert={hidden} data-app={app.id} data-focused={focused} data-maximized={state.maximized} className="dx-window" style={{ left: state.x, top: state.y, width: state.width, height: state.height, zIndex: z }} initial={{ opacity: 0, scale: reduced ? 1 : .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .18 }} onPointerDownCapture={() => { if (!focused) dispatch({ type: 'focus', id: app.id }) }} onFocusCapture={() => { if (!focused) dispatch({ type: 'focus', id: app.id }) }}>
    <div className="dx-titlebar" ref={title} tabIndex={0} data-drag aria-label={`${app.label} window title. Arrow keys move; Shift and arrow keys resize.`} onPointerDown={e => start(e, 'move')} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onDoubleClick={e => { if (!(e.target as Element).closest('button')) dispatch({ type: 'maximize', id: app.id }) }} onKeyDown={e => {
      if (e.target !== e.currentTarget || mobile || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
      e.preventDefault()
      const dx = e.key === 'ArrowRight' ? 20 : e.key === 'ArrowLeft' ? -20 : 0
      const dy = e.key === 'ArrowDown' ? 20 : e.key === 'ArrowUp' ? -20 : 0
      dispatch(e.shiftKey ? { type: 'resize', id: app.id, width: state.width + dx, height: state.height + dy, viewport } : { type: 'move', id: app.id, x: state.x + dx, y: state.y + dy, viewport })
    }}><img src={app.icon} alt="" /><span id={`title-${app.id}`}>{app.label}</span><span className="dx-titlebar-spark" aria-hidden="true">✧</span><div className="dx-window-controls"><button aria-label={`Minimize ${app.label}`} title="Minimize" onClick={() => dispatch({ type: 'minimize', id: app.id })}>−</button><button className="dx-maximize" aria-label={`${state.maximized ? 'Restore' : 'Maximize'} ${app.label}`} title={state.maximized ? 'Restore size' : 'Maximize'} onClick={() => dispatch({ type: 'maximize', id: app.id })}>{state.maximized ? '❐' : '□'}</button><button className="dx-close" aria-label={`Close ${app.label}`} title="Close (Escape)" onClick={() => dispatch({ type: 'close', id: app.id })}>×</button></div></div>
    <div className="dx-window-content">{children}</div><footer className="dx-window-status" id={`hint-${app.id}`}><span>✦ {app.description}</span><span>{mobile ? 'DREAM.EXE' : 'ESC TO CLOSE'}</span></footer>
    {!mobile && !state.maximized && <div className="dx-resize" aria-hidden="true" onPointerDown={e => start(e, 'resize')} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>◢</div>}
  </motion.section>
}
