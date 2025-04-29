"use client"
import React, { useState } from 'react';
import { Lock, User, ChevronRight, Shield } from 'lucide-react';
import { useSession } from '@/context/SessionContext'
import { useRouter } from 'next/navigation'
import { Toaster,toast } from 'react-hot-toast';
const SignInPage = () => {
  const [activeEntity, setActiveEntity] = useState(null);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useSession()
  const router = useRouter()
  const roleMap = {
    'Admin': 'admin',
    'Staff': 'staff',
    'Staff Manager': 'staff_manager',
    'Agent': 'agent',
    'Customer': 'customer'
  }
  // Login entities with more descriptive icons
  const entities = [
    { name: 'Admin', icon: <Shield className="w-8 h-8 text-green-600" />, color: 'green' },
    { name: 'Staff', icon: <User className="w-8 h-8 text-teal-600" />, color: 'teal' },
    { name: 'Staff Manager', icon: <User className="w-8 h-8 text-emerald-600" />, color: 'emerald' },
    { name: 'Agent', icon: <User className="w-8 h-8 text-lime-600" />, color: 'lime' },
    { name: 'Customer', icon: <User className="w-8 h-8 text-green-500" />, color: 'green' }
  ];
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!activeEntity || !username || !password) {
      setError('Please fill all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn(
        username,
        password,
        roleMap[activeEntity]
      )
      console.log(result)

      if (result.success) {
        // Redirect based on role
        const redirectPath = {
          admin: '/admin',
          staff: '/staff',
          staff_manager: '/staff-manager',
          agent: '/agent',
          customer: '/admin'
        }[roleMap[activeEntity]]
        
        router.push(redirectPath)
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Toaster/>
      {/* Left Side - Illustration (Hidden on Mobile) */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-500 via-teal-500 to-emerald-600 flex items-center justify-center relative overflow-hidden h-full">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="text-center text-white z-10 p-8 w-full h-full flex flex-col items-center justify-center">
          <img 
            src="/images/login-illustration.svg" 
            alt="Management Illustration" 
            className="mx-auto mb-8 rounded-xl shadow-2xl max-w-2/3 h-auto transform hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Dokument Guru</h2>
          <p className="text-xl opacity-80 max-w-md mx-auto">
            Fast, Reliable, Hassle-Free e-Seva with Dokument Guru!
          </p>
        </div>
      </div>

      {/* Right Side - Login Form (Full Width on Mobile) */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4 md:p-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-200 via-green-100 to-white"></div>
        
        <div className="w-full max-w-md z-10">
          {/* Company Logo */}
          <div className="mb-10 text-center">
            <div className="flex justify-center items-center mb-4">
              <img 
                src="/images/logo.svg" 
                alt="Company Logo" 
                className="max-h-16 max-w-full object-contain hover:scale-105 transition-transform"
              />
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 mt-4">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Select your access level</p>
          </div>

          {/* Entity Selection */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {entities.map((entity) => (
              <button
                key={entity.name}
                onClick={() => setActiveEntity(entity.name)}
                className={`
                  flex flex-col items-center justify-center 
                  p-4 rounded-xl transition-all duration-300 group
                  ${activeEntity === entity.name 
                    ? `bg-${entity.color}-500 text-black shadow-lg` 
                    : 'bg-white text-gray-700 hover:bg-green-50 border hover:border-green-300'}
                  transform hover:-translate-y-1 hover:shadow-md
                `}
              >
                {entity.icon}
                <span className="text-sm font-medium mt-2 group-hover:text-green-700">
                  {entity.name}
                </span>
              </button>
            ))}
          </div>

          {/* Login Form */}
          {activeEntity && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`${activeEntity} Username`}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 text-black focus:ring-green-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 text-black focus:ring-green-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <ChevronRight className="ml-2" />}
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-green-600 hover:text-green-800 hover:underline transition-colors">
              Forgot Password?
            </a>
          </div>
        </form>
      )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;