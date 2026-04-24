import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { moduleLoaded, logInfo } from './utils/logger'

moduleLoaded('main')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

logInfo('main', 'React root rendered')
