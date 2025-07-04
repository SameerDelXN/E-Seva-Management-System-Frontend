"use client"
import React, { useState ,useEffect} from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Mail, 
  X,
  HelpCircle 
} from 'lucide-react';
import Image from 'next/image';
import { useSession } from '@/context/SessionContext';
import { FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import NotificationSystem from './NotificationSystem';

const StaffNavbar = ({ toggleMobileSidebar, isMobileSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
          name:session.user.name,
          id:session.user._id,
          role:session.user.role
        })
      }
      handleCheckUser()
    },[session])

  const notifications = [
    { id: 1, message: "New document uploaded", time: "5 mins ago" },
    { id: 2, message: "Processing completed", time: "15 mins ago" }
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left side - Menu button and search (hidden on mobile) */}
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
        
        <div className="hidden md:flex items-center relative">
          {/* Hidden search bar - commented out to match admin navbar
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          /> */}
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications - commented out to match admin navbar
        <div className="relative hidden md:block">
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <Bell className="text-gray-600" size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
              </div>
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* Profile */}
        <div className="flex items-center">
                              {/* Notification Component */}
                              <NotificationSystem userRole="staff" userId={currentUser.id} />
                            </div>
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
              {session?.user?.name || 'Staff'}
            </span>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                {/* <button 
                  onClick={() => {
                    router.push('/staff/profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  <User className="mr-2" size={16} /> Your Profile
                </button> */}
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

export default StaffNavbar;