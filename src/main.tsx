import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { App } from '@/app/ui/App'
import ReactDOM from 'react-dom/client'

import './styles/index.scss'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
