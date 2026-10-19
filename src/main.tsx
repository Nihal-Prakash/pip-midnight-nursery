import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DreamOS from './os/DreamOS.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DreamOS />
  </StrictMode>,
)
