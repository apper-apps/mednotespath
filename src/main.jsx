import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { Workbox } from 'workbox-window'
import { toast } from 'react-toastify'

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js')
  
  wb.addEventListener('controlling', () => {
    window.location.reload()
  })
  
  wb.addEventListener('waiting', () => {
    toast.info(
      'New app update available! Click to refresh.',
      {
        onClick: () => {
          wb.messageSkipWaiting()
        },
        autoClose: false,
        closeButton: true
      }
    )
  })
  
  wb.register().catch((error) => {
    console.error('Service Worker registration failed:', error)
  })
}

// Add offline/online status detection
window.addEventListener('online', () => {
  toast.success('You are back online!')
})

window.addEventListener('offline', () => {
  toast.warning('You are now offline. Some features may be limited.')
})

// Add install prompt handling
let deferredPrompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  
  // Show custom install button or toast
  toast.info(
    'Install Anatomy Uncovered as an app for better experience!',
    {
      onClick: () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              toast.success('App installed successfully!')
            }
            deferredPrompt = null
          })
        }
      },
      autoClose: 8000,
      closeButton: true
    }
  )
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
)