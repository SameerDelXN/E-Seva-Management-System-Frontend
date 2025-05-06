"use client"
import React from 'react'
import StaffNavbar from '@/components/StaffMangerNavbar'
import StaffSidebar from '@/components/StaffMangerSidebar' 
import { useSession } from '@/context/SessionContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/Loading'

const StaffLayout = ({children}) => {
  const { session, loading } = useSession()
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  console.log(session)
  
  // Check if user is authenticated and has staff role
  useEffect(() => {
    if (!loading && (!session)) {
      router.push('/auth/signin')
    }
  }, [session, loading, router])

  // Check screen size and update state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // 768px is standard breakpoint for mobile
      if (window.innerWidth < 768) {
        setSidebarExpanded(false)
      }
    }
    
    // Initialize on first load
    checkScreenSize()
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize)
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleSidebarToggle = (expanded) => {
    setSidebarExpanded(expanded)
  }

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner description="Verifying Your Access" />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen'>
      {/* Hide sidebar on mobile screens when not expanded */}
      <div className="hidden md:block">
        <StaffSidebar 
          onToggle={handleSidebarToggle}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"
            onClick={toggleMobileSidebar}
          />
          <div className="relative z-50">
            <StaffSidebar 
              onToggle={handleSidebarToggle}
              isMobileOpen={isMobileSidebarOpen}
              setIsMobileOpen={setIsMobileSidebarOpen}
            />
          </div>
        </div>
      )}
      
      <div
        className={`
          flex flex-col flex-grow
          transition-all duration-300 ease-in-out
          ${isMobile ? 'w-full' : 'w-5/6'}
          ${!isMobile && sidebarExpanded ? 'ml-52' : !isMobile ? 'ml-16' : 'ml-0'}
        `}
      >
        <StaffNavbar 
          toggleMobileSidebar={toggleMobileSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />
        <div className='p-5 bg-white w-full h-full text-black'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default StaffLayout