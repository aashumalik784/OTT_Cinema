import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Lazy load App for better performance
const App = lazy(() => import('./App.jsx'))

// ==================== PRELOADER ====================
const Preloader = () => (
  <div className="fixed inset-0 bg-[#141414] flex items-center justify-center z-50">
    <div className="text-center">
      {/* Animated Logo */}
      <div className="mb-8 relative">
        <h1 className="text-6xl md:text-8xl font-black gradient-text animate-pulse-slow">
          OTT CINEMA
        </h1>
        <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-transparent blur-3xl animate-pulse" />
      </div>
      
      {/* Loading Bar */}
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
        <div className="h-full bg-gradient-to-r from-red-600 to-red-400 animate-shimmer" />
      </div>
      
      {/* Loading Text */}
      <p className="text-gray-400 mt-6 text-sm animate-pulse">
        Loading your entertainment...
      </p>
    </div>
  </div>
)

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 App Error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-red-600/30">
              {/* Error Icon */}
              <div className="text-8xl mb-6 text-center">💥</div>
              
              {/* Error Title */}
              <h1 className="text-4xl md:text-5xl font-black text-center mb-4 gradient-text">
                Oops! Something Went Wrong
              </h1>
              
              {/* Error Description */}
              <p className="text-gray-400 text-center mb-8 text-lg">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              {/* Error Details - Dev Only */}
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-black/50 rounded-lg p-4 mb-6 overflow-x-auto">
                  <p className="text-red-400 text-sm font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  <details className="text-gray-500 text-xs">
                    <summary className="cursor-pointer hover:text-gray-300">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-x-auto">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all hover:scale-105"
                >
                  🔄 Reload Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-lg transition-all hover:scale-105"
                >
                  🏠 Go Home
                </button>
              </div>
              
              {/* Support Link */}
              <p className="text-center text-gray-500 text-sm mt-8">
                Still having issues? <a href="#" className="text-red-600 hover:underline">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// ==================== PERFORMANCE MONITOR ====================
const reportWebVitals = (metric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`📊 ${metric.name}:`, metric.value.toFixed(2), metric)
  }
  
  // Send to analytics in production
  if (import.meta.env.PROD) {
    // Example: Send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.value),
    //   metric_id: metric.id,
    //   metric_value: metric.value,
    //   metric_delta: metric.delta,
    // })
  }
}

// ==================== PWA UPDATE PROMPT ====================
const checkForUpdates = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New update available
            if (confirm('🎉 New version available! Reload to update?')) {
              window.location.reload()
            }
          }
        })
      })
    })
  }
}

// ==================== ROOT ELEMENT CHECK ====================
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    '❌ Root element not found. Make sure index.html contains <div id="root"></div>'
  )
}

// ==================== CREATE REACT ROOT ====================
const root = ReactDOM.createRoot(rootElement)

// ==================== RENDER APP ====================
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<Preloader />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
)

// ==================== POST-RENDER TASKS ====================

// 1. Remove initial splash screen
window.addEventListener('load', () => {
  const splash = document.getElementById('splash')
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hide')
      setTimeout(() => splash.remove(), 500)
    }, 300)
  }
})

// 2. Check for PWA updates
checkForUpdates()

// 3. Report web vitals
if ('web-vitals' in window) {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals)
    getFID(reportWebVitals)
    getFCP(reportWebVitals)
    getLCP(reportWebVitals)
    getTTFB(reportWebVitals)
  })
}

// 4. Development console message
if (import.meta.env.DEV) {
  console.log(
    '%c🎬 OTT CINEMA',
    'color: #E50914; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);'
  )
  console.log(
    '%cVite + React + Tailwind CSS',
    'color: #808080; font-size: 14px; font-weight: 600;'
  )
  console.log(
    '%cEnvironment: Development',
    'color: #4CAF50; font-size: 12px;'
  )
  console.log(
    '%cAPI Endpoint:',
    'color: #2196F3; font-size: 12px;',
    'https://api.themoviedb.org/3'
  )
}

// 5. Production console message
if (import.meta.env.PROD) {
  console.log(
    '%c🎬 OTT CINEMA',
    'color: #E50914; font-size: 20px; font-weight: bold;'
  )
  console.log(
    '%cPowered by TMDB API',
    'color: #808080; font-size: 12px;'
  )
}

// 6. Prevent right-click in production (optional)
if (import.meta.env.PROD) {
  // Uncomment to disable right-click
  // document.addEventListener('contextmenu', (e) => e.preventDefault())
}

// 7. Online/Offline detection
window.addEventListener('online', () => {
  console.log('%c✅ Back Online', 'color: #4CAF50; font-weight: bold;')
})

window.addEventListener('offline', () => {
  console.log('%c❌ Offline Mode', 'color: #F44336; font-weight: bold;')
})

// 8. Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const searchInput = document.querySelector('input[type="text"]')
    searchInput?.focus()
  }
  
  // ESC to close modals
  if (e.key === 'Escape') {
    const closeButton = document.querySelector('[aria-label="Close"]')
    closeButton?.click()
  }
})

// 9. Page visibility API
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('⏸️ Page hidden - Pausing videos')
  } else {
    console.log('▶️ Page visible - Resuming')
  }
})

// 10. Performance observer
if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (import.meta.env.DEV) {
          console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`)
        }
      }
    })
    observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] })
  } catch (e) {
    // Performance observer not supported
  }
                }
