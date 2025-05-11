"use client"
import React, { useState } from 'react';
import { 
  User, 
  LogOut, 
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useSession } from '@/context/SessionContext';
import { FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import NotificationSystem from './NotificationSystem';
import { useEffect } from 'react';

const StaffManagerNavbar = ({ toggleMobileSidebar, isMobileSidebarOpen }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { session, signOut } = useSession();
  const router = useRouter();
const [currentUser,setCurrentUser]=useState({
    id:"",
    name:"",
    role:""
  })
  useEffect(()=>{
    const handleCheckUser =()=>{
      setCurrentUser({
        name:session?.user?.name,
        id:session?.user?.city,
        role:session?.user?.role
      })
    }
    handleCheckUser()
  },[session])
  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
  };
  console.log("myrole = ",currentUser.role)
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left side - Menu button (mobile only) */}
      <div className="flex items-center">
        <button 
          onClick={toggleMobileSidebar}
          className="mr-4 text-gray-700 focus:outline-none lg:hidden"
          aria-label="Toggle sidebar"
        >
          {isMobileSidebarOpen ? (
            <X size={24} />
          ) : (
            <FiMenu size={24} />
          )}
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Staff Management</h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
         <div className="flex items-center">
                              {/* Notification Component */}
                              <NotificationSystem userRole={currentUser.role} userId={currentUser.id} />
                            </div>
        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <Image
              width={32}
              height={32} 
              src="/images/avatar.jpg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 hidden md:inline">
              {session?.user?.name || 'Staff Manager'}
            </span>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <button 
                  onClick={() => {
                    router.push('/staff-manager/profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  <User className="mr-2" size={16} /> Your Profile
                </button>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  <LogOut className="mr-2" size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default StaffManagerNavbar;