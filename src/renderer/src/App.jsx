import { useEffect, useRef, useState } from 'react'

// --- Styles ---
const appContainerStyle = (opacity) => ({
  width: '100vw',
  height: '100vh',
  backgroundColor: `rgba(0, 0, 0, ${opacity})`,
  userSelect: 'none',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
})

const dragAreaStyle = {
  flexGrow: 1,
  WebkitAppRegion: 'drag'
}

const controlPanelContainerStyle = {
  flexShrink: 0,
  padding: '10px',
  textAlign: 'center',
  WebkitAppRegion: 'no-drag'
}

const sliderContainerStyle = (isExpanded) => ({
  marginTop: '10px',
  display: isExpanded ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  color: 'white'
})

const controlButtonStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '8px',
  color: 'white',
  padding: '5px 10px',
  cursor: 'pointer'
}

const closeButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  width: '30px',
  height: '30px',
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '50%',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  WebkitAppRegion: 'no-drag',
  userSelect: 'none'
}

const resizeHandleStyle = {
  position: 'absolute',
  right: '0px',
  bottom: '0px',
  width: '20px',
  height: '20px',
  cursor: 'nwse-resize',
  WebkitAppRegion: 'no-drag',
  background: 'rgba(255, 255, 255, 0.3)',
  borderTopLeftRadius: '10px',
  userSelect: 'none'
}

// --- Component ---
function App() {
  const [opacity, setOpacity] = useState(0.5)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    window.api.onSetOpacity((value) => {
      setOpacity(value)
    })
  }, [])

  const initialSize = useRef({ width: 0, height: 0 })
  const initialMousePos = useRef({ x: 0, y: 0 })

  const handleResizeMouseDown = (e) => {
    e.preventDefault()
    initialSize.current = { width: window.innerWidth, height: window.innerHeight }
    initialMousePos.current = { x: e.clientX, y: e.clientY }
    window.addEventListener('mousemove', handleResizeMouseMove)
    window.addEventListener('mouseup', handleResizeMouseUp)
  }

  const handleResizeMouseMove = (e) => {
    const dx = e.clientX - initialMousePos.current.x
    const dy = e.clientY - initialMousePos.current.y
    const newWidth = initialSize.current.width + dx
    const newHeight = initialSize.current.height + dy
    window.api.resizeWindow(newWidth, newHeight)
  }

  const handleResizeMouseUp = () => {
    window.removeEventListener('mousemove', handleResizeMouseMove)
    window.removeEventListener('mouseup', handleResizeMouseUp)
  }

  const handleOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value)
    setOpacity(newOpacity)
    window.api.updateOpacity(newOpacity)
  }

  const handleClose = () => {
    window.api.closeApp()
  }

  return (
    <div style={appContainerStyle(opacity)}>
      <div style={dragAreaStyle}>
        <button style={closeButtonStyle} onClick={handleClose}>
          ×
        </button>
      </div>
      <div style={controlPanelContainerStyle}>
        <button style={controlButtonStyle} onClick={() => setIsExpanded(!isExpanded)}>
          투명도 조절 {isExpanded ? '▲' : '▼'}
        </button>
        <div style={sliderContainerStyle(isExpanded)}>
          <span>Min</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.01"
            value={opacity}
            onChange={handleOpacityChange}
          />
          <span>Max</span>
        </div>
      </div>
      <div style={resizeHandleStyle} onMouseDown={handleResizeMouseDown}></div>
    </div>
  )
}

export default App
