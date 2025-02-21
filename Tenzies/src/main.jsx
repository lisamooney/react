import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'https://lisamooney.com/react/Tenzies/index.css'
import App from 'https://lisamooney.com/react/Tenzies/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
