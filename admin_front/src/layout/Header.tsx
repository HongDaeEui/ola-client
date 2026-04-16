import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth_store'

export default function Header() {
  const navigate = useNavigate()
  const { admin, logOut } = useAuthStore()

  const handleLogout = async () => {
    await logOut()
    navigate('/login')
  }

  return (
    <header className="bg-[var(--Stone-700)] px-6 flex items-center justify-between text-white" style={{ height: '48px'}}>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <span className="text-lg font-semibold tracking-tight">Admin</span>
      </div>
      <div className="flex items-center space-x-4">
        {admin && (
          <>
            <span className="text-sm text-white">
              { admin.name || admin.loginId}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}
