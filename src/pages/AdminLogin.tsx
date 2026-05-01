import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'

interface AdminLoginProps {
  onLogin: () => void
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // SHA-256 哈希验证（密码存储在环境变量中）
  const ADMIN_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH || ''

  const hashPassword = async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const hashedInput = await hashPassword(password)
      
      if (hashedInput === ADMIN_PASSWORD_HASH) {
        // 密码正确，保存到 sessionStorage
        sessionStorage.setItem('admin_authenticated', 'true')
        sessionStorage.setItem('admin_login_time', new Date().toISOString())
        onLogin()
      } else {
        setError('密码错误，请重试')
      }
    } catch (err) {
      setError('验证失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-wood/20 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-wood" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">管理员登录</h1>
          <p className="text-gray-400">Admin Dashboard Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                管理员密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wood focus:border-transparent transition-all"
                  placeholder="请输入管理员密码"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              className="w-full py-3 text-lg"
              disabled={loading || !password}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>验证中...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>登录管理后台</span>
                </span>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-wood flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">安全提示：</span>
                  此区域仅限管理员访问。所有操作都将被记录。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
