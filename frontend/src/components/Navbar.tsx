import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎯</span>
        <div>
          <h1 className="font-extrabold text-xl tracking-tight leading-none">SmartHire</h1>
          <p className="text-xs text-blue-200">AI Job Application Tracker</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm font-medium text-blue-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-500/40 flex items-center justify-center font-bold text-white uppercase text-xs">
              {user.name.charAt(0)}
            </span>
            <span>{user.name}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}
