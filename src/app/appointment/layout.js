// "use client";
// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { AppointmentProvider } from '@/context/AppointmentContext';
// const AppointmentStepsLayout = ({ children }) => {
//   const pathname = usePathname();
  
//   // Determine active step based on current route
//   const getStepStatus = (stepPath) => {
//     if (pathname.endsWith(stepPath)) return 'active';
//     if (
//       (stepPath === 'select-service' && pathname !== '/demo-appointment') ||
//       (stepPath === 'date-time' && pathname.includes('details')) ||
//       (stepPath === 'details' && pathname.includes('summary'))
//     ) {
//       return 'completed';
//     }
//     return 'pending';
//   };

//   return (
//   <AppointmentProvider>
//       <div className="flex min-h-screen bg-gray-50">
//       {/* Sticky Sidebar */}
//       <div className="w-1/3 bg-white p-12 sticky top-0 h-screen overflow-y-hidden">
//         <div className="mb-16">
//           <h1 className="text-4xl font-bold">
//             <span className="text-black">DOKUMENT</span>{' '}
//             <span className="text-green-400">GURU</span>
//           </h1>
//           <div className="mt-2 w-64 h-px bg-gray-200"></div>
//         </div>
        
//         {/* Progress Steps */}
//         <div className="relative">
//           {/* Step 1 - Select Service */}
//           <StepItem 
//             stepNumber={1}
//             title="Select Service"
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             }
//             status={getStepStatus('select-service')}
//             href="/demo-appointment"
//           />
          
//           {/* Step 2 - Date & Time */}
//           <StepItem 
//             stepNumber={2}
//             title="Date & Time"
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//               </svg>
//             }
//             status={getStepStatus('date-time')}
//             href="/appointment/steps/date-time"
//           />
          
//           {/* Step 3 - Personal Details */}
//           <StepItem 
//             stepNumber={3}
//             title="Personal Details"
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//               </svg>
//             }
//             status={getStepStatus('details')}
//             href="demo-appointment/personal-information"
//           />
          
//           {/* Step 4 - Summary */}
//           <StepItem 
//             stepNumber={4}
//             title="Summary"
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//               </svg>
//             }
//             status={getStepStatus('summary')}
//             href="/appointment/steps/summary"
//           />
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="w-2/3 p-8 overflow-y-auto">
//         {children}
//       </div>
//     </div>
//   </AppointmentProvider>
//   );
// };

// const StepItem = ({ stepNumber, title, icon, status, href }) => {
//   const bgColor = status === 'active' ? 'bg-green-500' : 
//                  status === 'completed' ? 'bg-green-100' : 'bg-gray-100';
//   const textColor = status === 'active' ? 'text-white' : 
//                    status === 'completed' ? 'text-green-500' : 'text-gray-400';
//   const titleColor = status === 'active' ? 'text-black' : 'text-gray-400';
//   const statusText = status === 'active' ? 'In Progress' : '';
  
//   return (
//     <div className="flex items-start mb-8 relative">
//       <Link href={href} className="flex items-start w-full">
//         <div className={`flex-shrink-0 w-12 h-12 rounded-full ${bgColor} flex items-center justify-center z-10`}>
//           {React.cloneElement(icon, { className: `w-6 h-6 ${textColor}` })}
//         </div>
//         <div className="ml-4">
//           <p className="text-sm text-gray-500">Step {stepNumber}</p>
//           <h3 className={`text-xl font-medium ${titleColor}`}>{title}</h3>
//           {statusText && <p className="text-sm text-blue-400">{statusText}</p>}
//         </div>
//       </Link>
//       {stepNumber < 4 && (
//         <div className="absolute top-12 left-6 w-px h-24 bg-gray-200"></div>
//       )}
//     </div>
//   );
// };

// export default AppointmentStepsLayout;



// "use client";
// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { AppointmentProvider } from '@/context/AppointmentContext';
// import { motion, AnimatePresence } from 'framer-motion';

// const AppointmentStepsLayout = ({ children }) => {
//   const pathname = usePathname();
  
//   const getStepStatus = (stepPath) => {
//     if (pathname.endsWith(stepPath)) return 'active';
//     if (
//       (stepPath === 'select-service' && pathname !== '/demo-appointment/select-service') ||
//       (stepPath === 'date-time' && pathname.includes('details')) ||
//       (stepPath === 'details' && pathname.includes('summary'))
//     ) {
//       return 'completed';
//     }
//     return 'pending';
//   };

//   return (
//     <AppointmentProvider>
//       <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         {/* Modern Glass Sidebar */}
//         <motion.div 
//           className="w-1/3 p-12 sticky top-0 h-screen overflow-y-hidden backdrop-blur-lg bg-white/80 border-r border-gray-200/50"
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="mb-16">
//             <motion.h1 
//               className="text-4xl font-bold"
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <span className="text-gray-900">DOKUMENT</span>{' '}
//               <span className="text-indigo-500">GURU</span>
//             </motion.h1>
//             <motion.div 
//               className="mt-2 w-64 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ delay: 0.3, duration: 0.8 }}
//             />
//           </div>
          
//           {/* Animated Progress Steps */}
//           <div className="relative space-y-8">
//             <StepItem 
//               stepNumber={1}
//               title="Select Service"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               }
//               status={getStepStatus('select-service')}
//               href="/demo-appointment"
//               delay={0.4}
//             />
            
//             <StepItem 
//               stepNumber={2}
//               title="Date & Time"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                 </svg>
//               }
//               status={getStepStatus('date-time')}
//               href="/appointment/steps/date-time"
//               delay={0.5}
//             />
            
//             <StepItem 
//               stepNumber={3}
//               title="Personal Details"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                 </svg>
//               }
//               status={getStepStatus('details')}
//               href="demo-appointment/personal-information"
//               delay={0.6}
//             />
            
//             <StepItem 
//               stepNumber={4}
//               title="Summary"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                 </svg>
//               }
//               status={getStepStatus('summary')}
//               href="/appointment/steps/summary"
//               delay={0.7}
//             />
//           </div>
//         </motion.div>
        
//         {/* Main Content with Floating Card */}
//         <div className="w-2/3 p-8 overflow-y-auto">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={pathname}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.4, ease: "easeInOut" }}
//               className="bg-white rounded-2xl shadow-xl p-8 h-full"
//             >
//               {children}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </AppointmentProvider>
//   );
// };

// const StepItem = ({ stepNumber, title, icon, status, href, delay = 0 }) => {
//   const bgColor = status === 'active' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 
//                  status === 'completed' ? 'bg-indigo-100' : 'bg-gray-100';
//   const textColor = status === 'active' ? 'text-white' : 
//                    status === 'completed' ? 'text-indigo-600' : 'text-gray-400';
//   const titleColor = status === 'active' ? 'text-gray-900 font-semibold' : 'text-gray-500';
//   const statusText = status === 'active' ? 'Current Step' : '';
  
//   return (
//     <motion.div 
//       className="flex items-start relative group"
//       initial={{ y: 20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ delay, duration: 0.5 }}
//     >
//       <Link href={href} className="flex items-start w-full">
//         <motion.div 
//           className={`flex-shrink-0 w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center z-10 shadow-md group-hover:shadow-lg transition-all duration-300`}
//         //   whileHover={{ scale: 1.05 }}
//           animate={{
//             scale: status === 'active' ? [1, 1.05, 1] : 1,
//             transition: status === 'active' ? { 
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             } : {}
//           }}
//         >
//           {React.cloneElement(icon, { className: `w-6 h-6  ${textColor}` })}
//           {status === 'completed' && (
//             <motion.div 
//               className="absolute inset-0 flex items-right justify-center"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             </motion.div>
//           )}
//         </motion.div>
//         <div className="ml-4">
//           <p className="text-xs uppercase tracking-wider text-gray-400">Step {stepNumber}</p>
//           <h3 className={`text-lg ${titleColor} transition-colors duration-300`}>{title}</h3>
//           {statusText && (
//             <motion.p 
//               className="text-xs mt-1 text-indigo-400 font-medium tracking-wide"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               {statusText}
//             </motion.p>
//           )}
//         </div>
//       </Link>
//       {stepNumber < 4 && (
//         <motion.div 
//           className="absolute top-14 left-7 w-0.5 h-16 bg-gradient-to-b from-gray-200 to-transparent"
//           initial={{ scaleY: 0, originY: 0 }}
//           animate={{ scaleY: 1 }}
//           transition={{ delay: delay + 0.2, duration: 0.6 }}
//         />
//       )}
//     </motion.div>
//   );
// };

// export default AppointmentStepsLayout;



// "use client";
// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { AppointmentProvider } from '@/context/AppointmentContext';
// import { motion, AnimatePresence } from 'framer-motion';

// const AppointmentStepsLayout = ({ children }) => {
//   const pathname = usePathname();
  
//   const getStepStatus = (stepPath) => {
//     if (pathname.endsWith(stepPath)) return 'active';
//     if (
//       (stepPath === 'select-service' && pathname !== '/demo-appointment/select-service') ||
//       (stepPath === 'date-time' && pathname.includes('details')) ||
//       (stepPath === 'details' && pathname.includes('summary'))
//     ) {
//       return 'completed';
//     }
//     return 'pending';
//   };

//   return (
//     <AppointmentProvider>
//       <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
//         {/* Modern Glass Sidebar */}
//         <motion.div 
//           className="w-1/3 p-12 sticky top-0 h-screen overflow-y-hidden backdrop-blur-lg bg-white/80 border-r border-gray-200/50"
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="mb-16">
//             <motion.h1 
//               className="text-4xl font-bold"
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <span className="text-gray-900">DOKUMENT</span>{' '}
//               <span className="text-green-500">GURU</span>
//             </motion.h1>
//             <motion.div 
//               className="mt-2 w-64 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ delay: 0.3, duration: 0.8 }}
//             />
//           </div>
          
//           {/* Animated Progress Steps */}
//           <div className="relative space-y-8">
//             <StepItem 
//               stepNumber={1}
//               title="Select Service"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               }
//               status={getStepStatus('select-service')}
//               href="/demo-appointment/select-service"
//               delay={0.4}
//             />
            
//             <StepItem 
//               stepNumber={2}
//               title="Date & Time"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                 </svg>
//               }
//               status={getStepStatus('date-time')}
//               href="/appointment/steps/date-time"
//               delay={0.5}
//             />
            
//             <StepItem 
//               stepNumber={3}
//               title="Personal Details"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                 </svg>
//               }
//               status={getStepStatus('details')}
//               href="/demo-appointment/personal-information"
//               delay={0.6}
//             />
            
//             <StepItem 
//               stepNumber={4}
//               title="Summary"
//               icon={
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                 </svg>
//               }
//               status={getStepStatus('summary')}
//               href="/appointment/steps/summary"
//               delay={0.7}
//             />
//           </div>
//         </motion.div>
        
//         {/* Main Content with Floating Card */}
//         <div className="w-2/3 p-8 overflow-y-auto">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={pathname}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.4, ease: "easeInOut" }}
//               className="bg-white rounded-2xl shadow-lg p-8 h-full border border-green-100"
//             >
//               {children}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </AppointmentProvider>
//   );
// };

// const StepItem = ({ stepNumber, title, icon, status, href, delay = 0 }) => {
//   const bgColor = status === 'active' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
//                  status === 'completed' ? 'bg-green-100' : 'bg-gray-100';
//   const textColor = status === 'active' ? 'text-white' : 
//                    status === 'completed' ? 'text-green-600' : 'text-gray-400';
//   const titleColor = status === 'active' ? 'text-gray-900 font-semibold' : 'text-gray-500';
//   const statusText = status === 'active' ? 'Current Step' : '';
  
//   return (
//     <motion.div 
//       className="flex items-start relative group"
//       initial={{ y: 20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ delay, duration: 0.5 }}
//     >
//       <Link href={href} className="flex items-start w-full">
//         <motion.div 
//           className={`flex-shrink-0 w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center z-10 shadow-md group-hover:shadow-lg transition-all duration-300`}
//           animate={{
//             scale: status === 'active' ? [1, 1.05, 1] : 1,
//             transition: status === 'active' ? { 
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             } : {}
//           }}
//         >
//           {React.cloneElement(icon, { className: `w-6 h-6 ${textColor}` })}
//           {status === 'completed' && (
//             <motion.div 
//               className="absolute inset-0 flex pl-24 items-center justify-center"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             </motion.div>
//           )}
//         </motion.div>
//         <div className="ml-4">
//           <p className="text-xs uppercase tracking-wider text-gray-400">Step {stepNumber}</p>
//           <h3 className={`text-lg ${titleColor} transition-colors duration-300`}>{title}</h3>
//           {statusText && (
//             <motion.p 
//               className="text-xs mt-1 text-green-400 font-medium tracking-wide"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               {statusText}
//             </motion.p>
//           )}
//         </div>
//       </Link>
//       {stepNumber < 4 && (
//         <motion.div 
//           className="absolute top-14 left-7 w-0.5 h-16 bg-gradient-to-b from-green-200 to-transparent"
//           initial={{ scaleY: 0, originY: 0 }}
//           animate={{ scaleY: 1 }}
//           transition={{ delay: delay + 0.2, duration: 0.6 }}
//         />
//       )}
//     </motion.div>
//   );
// };

// export default AppointmentStepsLayout;


"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppointmentProvider } from '@/context/AppointmentContext';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentStepsLayout = ({ children }) => {
  const pathname = usePathname();
  
  const getStepStatus = (stepPath) => {
    if (pathname.endsWith(stepPath)) return 'active';
    if (
      (stepPath === 'select-service' && pathname !== '/demo-appointment/select-service') ||
      (stepPath === 'date-time' && pathname.includes('details')) ||
      (stepPath === 'details' && pathname.includes('summary'))
    ) {
      return 'completed';
    }
    return 'pending';
  };

  return (
    <AppointmentProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Modern Glass Sidebar - Mobile First */}
        <motion.div 
          className="w-full lg:w-1/3 p-6 lg:p-12 sticky top-0 lg:h-screen lg:overflow-y-hidden backdrop-blur-lg bg-white/80 border-b lg:border-b-0 lg:border-r border-gray-200/50 z-10"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 lg:mb-16">
            <motion.h1 
              className="text-3xl lg:text-4xl font-bold"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">DOKUMENT</span>{' '}
              <span className="text-green-500">GURU</span>
            </motion.h1>
            <motion.div 
              className="mt-2 w-full lg:w-64 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
          
          {/* Responsive Progress Steps - Horizontal on mobile, vertical on desktop */}
          <div className="flex lg:block overflow-x-auto pb-4 lg:pb-0">
            <div className="flex lg:flex-col lg:relative lg:space-y-8 min-w-max lg:min-w-0">
              <StepItem 
                stepNumber={1}
                title="Select Service"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                }
                status={getStepStatus('select-service')}
                href="/demo-appointment/select-service"
                delay={0.4}
                isMobile={true}
              />
              
              <StepItem 
                stepNumber={2}
                title="Date & Time"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                }
                status={getStepStatus('date-time')}
                href="/appointment/steps/date-time"
                delay={0.5}
                isMobile={true}
              />
              
              <StepItem 
                stepNumber={3}
                title="Personal Details"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                }
                status={getStepStatus('details')}
                href="/demo-appointment/personal-information"
                delay={0.6}
                isMobile={true}
              />
              
              <StepItem 
                stepNumber={4}
                title="Summary"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                }
                status={getStepStatus('summary')}
                href="/appointment/steps/summary"
                delay={0.7}
                isMobile={true}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Main Content with Floating Card */}
        <div className="w-full lg:w-2/3 p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg p-4 lg:p-8 h-full border border-green-100"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppointmentProvider>
  );
};

const StepItem = ({ stepNumber, title, icon, status, href, delay = 0, isMobile = false }) => {
  const bgColor = status === 'active' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
                 status === 'completed' ? 'bg-green-100' : 'bg-gray-100';
  const textColor = status === 'active' ? 'text-white' : 
                   status === 'completed' ? 'text-green-600' : 'text-gray-400';
  const titleColor = status === 'active' ? 'text-gray-900 font-semibold' : 'text-gray-500';
  const statusText = status === 'active' ? 'Current Step' : '';
  
  return (
    <motion.div 
      className={`flex items-start relative group ${isMobile ? 'mr-6 lg:mr-0' : ''}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link href={href} className="flex items-start w-full">
        <motion.div 
          className={`flex-shrink-0 w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl ${bgColor} flex items-center justify-center z-10 shadow-md group-hover:shadow-lg transition-all duration-300`}
          animate={{
            scale: status === 'active' ? [1, 1.05, 1] : 1,
            transition: status === 'active' ? { 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}
          }}
        >
          {React.cloneElement(icon, { className: `w-5 h-5 lg:w-6 lg:h-6 ${textColor}` })}
          {status === 'completed' && (
            <motion.div 
              className="absolute inset-0 flex pl-16 lg:pl-24 items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </motion.div>
        <div className="ml-3 lg:ml-4">
          <p className="text-xs uppercase tracking-wider text-gray-400">Step {stepNumber}</p>
          <h3 className={`text-sm lg:text-lg ${titleColor} transition-colors duration-300`}>{title}</h3>
          {statusText && (
            <motion.p 
              className="text-xs mt-1 text-green-400 font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {statusText}
            </motion.p>
          )}
        </div>
      </Link>
      {!isMobile && stepNumber < 4 && (
        <motion.div 
          className="absolute top-14 left-7 w-0.5 h-16 bg-gradient-to-b from-green-200 to-transparent"
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.6 }}
        />
      )}
    </motion.div>
  );
};

export default AppointmentStepsLayout;