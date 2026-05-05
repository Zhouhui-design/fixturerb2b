import React from 'react'
import ReactDOM from 'react-dom/client'
import ChatWidget from './components/ChatWidget'
import './index.css'

// Hide loading screen when app loads
window.addEventListener('load', () => {
  const loading = document.getElementById('loading')
  if (loading) {
    setTimeout(() => {
      loading.classList.add('hidden')
      setTimeout(() => loading.remove(), 300)
    }, 500)
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatWidget />
  </React.StrictMode>,
)
