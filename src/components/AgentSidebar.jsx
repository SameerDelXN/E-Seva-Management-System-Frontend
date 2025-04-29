"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const AgentSidebar = ({ onToggle, isMobileOpen, setIsMobileOpen }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMobileContent, setShowMobileContent] = useState(false);
  const pathname = usePathname();
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show mobile content immediately if sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      setShowMobileContent(true);
    } else {
      // Reset when closed
      setShowMobileContent(false);
    }
  }, [isMobileOpen]);

  // Notify parent component when sidebar state changes
  useEffect(() => {
    if (onToggle) {
      onToggle(isExpanded);
    }
  }, [isExpanded, onToggle]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Define the sidebar width variants
  const sidebarVariants = {
    expanded: {
      width: "14rem",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut"
      }
    },
    collapsed: {
      width: "4rem",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Text animation variants
  const textVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2
      }
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  // Create SidebarItem component
  const SidebarItemComponent = ({ icon: Icon, label, href }) => {
    const isActive = pathname === href;
    
    return (
      <Link 
        href={href} 
        className={`flex items-center p-3 cursor-pointer rounded-lg mx-2 transition-all duration-300 ease-in-out group
                    ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsMobileOpen(false);
          }
        }}
      >
        <motion.div
          className="relative flex items-center"
          initial={false}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={{
            expanded: { width: "100%" },
            collapsed: { width: "auto" }
          }}
        >
          <div className="flex-shrink-0">
            <Icon className={`${isActive ? 'text-blue-700' : 'text-gray-600'} group-hover:text-blue-600 transition-all duration-300 ${isExpanded ? 'mr-3' : ''}`} size={20} />
          </div>
          
          {!isExpanded && (
            <motion.div
              className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded pointer-events-none whitespace-nowrap z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.div>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                className={`text-sm font-medium whitespace-nowrap ${isActive ? 'text-blue-700' : 'text-gray-700'} group-hover:text-blue-700`}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    );
  };

  // Create the memoized SidebarItem with proper displayName assignment
  const SidebarItem = React.memo(SidebarItemComponent);
  SidebarItem.displayName = 'SidebarItem';

  // Simple mobile sidebar item without complex animations
  const MobileSidebarItem = ({ icon: Icon, label, href }) => {
    const isActive = pathname === href;
    
    return (
      <Link 
        href={href} 
        className={`flex items-center p-3 rounded-lg mx-2 transition-all duration-300 ease-in-out group
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        onClick={() => setIsMobileOpen(false)}
      >
        <Icon className={`${isActive ? 'text-blue-700' : 'text-gray-600'} group-hover:text-blue-600 transition-all duration-300 mr-3`} size={20} />
        <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'} group-hover:text-blue-700`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        className="fixed left-0 top-0 z-40 bg-white border-r border-gray-200 shadow-xl flex flex-col h-screen overflow-hidden hidden md:flex"
        variants={sidebarVariants}
        initial={isExpanded ? "expanded" : "collapsed"}
        animate={isExpanded ? "expanded" : "collapsed"}
        style={{
          willChange: "transform, width",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden"
        }}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                className="flex items-center overflow-hidden"
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  layoutId="logo-icon"
                >
                  <Image
                    width={40}
                    height={40}
                    src="/images/logo.svg"
                    alt="Agent Portal Logo"
                    className="w-10 h-10 mr-3 rounded-full flex-shrink-0"
                  />
                </motion.div>
                <motion.span
                  className="text-lg font-bold text-gray-800 truncate"
                  variants={textVariants}
                >
                  Agent Portal
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                className="w-10 mx-auto"
                key="mini-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                layoutId="logo-icon"
              >
                <Image
                  width={40}
                  height={40}
                  src="/images/logo.svg"
                  alt="Agent Portal Logo"
                  className="w-10 h-10 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 hidden lg:block"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="chevron-left"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="text-gray-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="chevron-right"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Sidebar Content */}
        <motion.nav
          className="flex-1 pt-4 overflow-y-auto scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Apply custom scrollbar styling */}
          <style jsx global>{`
            /* Hide scrollbar for Chrome, Safari and Opera */
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            
            /* Hide scrollbar for IE, Edge and Firefox */
            .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
          `}</style>
          
          {/* Main Navigation */}
          <SidebarItem 
            icon={Home} 
            label="Dashboard" 
            href="/agent"
          />
        </motion.nav>

        {/* Footer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="p-4 border-t border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-gray-500">© 2025 Dokument Guru</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            
            {/* Mobile sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl flex flex-col md:hidden"
            >
              {/* Mobile sidebar header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Image
                    width={40}
                    height={40}
                    src="/images/logo.svg"
                    alt="Agent Portal Logo"
                    className="w-10 h-10 mr-3 rounded-full"
                  />
                  <span className="text-lg font-bold text-gray-800">Agent Portal</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Mobile sidebar content */}
              <nav className="flex-1 pt-4 overflow-y-auto">
                {/* Main Navigation */}
                <MobileSidebarItem
                  icon={Home}
                  label="Dashboard"
                  href="/agent"
                />
              </nav>

              {/* Mobile footer */}
              <div className="p-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">© 2025 Dokument Guru</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Assign displayName to the main component
AgentSidebar.displayName = 'AgentSidebar';

export default AgentSidebar;