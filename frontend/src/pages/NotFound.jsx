import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-card shadow-clay rounded-3xl p-8 sm:p-12 text-center max-w-md w-full animate-pop-in">
      <h1 className="text-7xl font-bold text-link">404</h1>
      <p className="mt-4 text-xl font-semibold text-ink">Page not found</p>
      <p className="mt-2 text-ink-2">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/dashboard" className="inline-block mt-6 px-8 py-3 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-accent text-on-accent shadow-clay-btn hover:bg-accent-hover hover:text-[#eae5d3] active:shadow-clay-press">Go to dashboard</Link>
    </div>
  </div>
)

export default NotFound
