"use client"
import { createContext, useContext, useState, useEffect } from 'react'

const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem('session')
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession))
      } catch (error) {
        console.error('Error parsing session:', error)
        localStorage.removeItem('session')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (username, password, role) => {
    try {
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      })
      if (!response.ok) {
        throw new Error('Login failed',response)
      }

      const data = await response.json()
      console.log("sessu = ",data)
      const userSession = {
        user: data.user,
        role: data.user.role,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }

      setSession(userSession)
      localStorage.setItem('session', JSON.stringify(userSession))
      return { success: true }
    } catch (error) {
      console.error('SignIn error:', error)
      return { success: false, error: error.message }
    }
  }

  const signOut = () => {
    setSession(null)
    localStorage.removeItem('session')
  }

  return (
    <SessionContext.Provider value={{ session, signIn, signOut, loading }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}