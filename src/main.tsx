import React from 'react'

import { App } from '@/app/ui/App'
import ReactDOM from 'react-dom/client'

import './styles/index.scss'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
