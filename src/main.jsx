// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router' // add import for BrowserRouter
import './index.css'
import App from './App.jsx'

// Wrap the App component with the BrowserRouter component to enable
// enable route handling throughout your application.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
