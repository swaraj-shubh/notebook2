import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

document.documentElement.dataset.theme =
  localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// click ripple on buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button')
  if (!btn || btn.disabled) return
  const r = btn.getBoundingClientRect()
  const size = Math.max(r.width, r.height) * 2
  const s = document.createElement('span')
  s.className = 'absolute rounded-full bg-accent/50 animate-ripple pointer-events-none'
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`
  btn.appendChild(s)
  setTimeout(() => s.remove(), 600)
})
