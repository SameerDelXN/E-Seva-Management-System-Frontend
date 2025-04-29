"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackApplication() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (showDetailPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDetailPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate mobile number
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      setIsLoading(false);
      return;
    }

    try {
      // Call the API to fetch applications based on mobile number
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/application/fetchAll?phone=${mobileNumber}`);
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setApplications(result.data);
      } else {
        setError(result.message || 'Failed to fetch applications');
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('An error occurred while fetching your applications');
      setApplications([]);
    } finally {
      setSubmitted(true);
      setIsLoading(false);
    }
  };

  const openDetailPopup = (application) => {
    setSelectedApplication(application);
    setShowDetailPopup(true);
  };

  const closeDetailPopup = () => {
    setShowDetailPopup(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'In Progress':
        return 'bg-emerald-100 text-emerald-600';
      case 'Visited':
        return 'bg-cyan-100 text-cyan-600';
      case 'Rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString; // Return the original string if parsing fails
    }
  };

  // Define the tracking stages and check if each stage is complete based on the status
  const trackingStages = [
    { name: 'Initiated', description: 'Application submitted' },
    { name: 'In Progress', description: 'Processing documents' },
    { name: 'Visited', description: 'Client visited office' },
    { name: 'Completed', description: 'Application processed successfully' }
  ];

  const getCurrentStageIndex = (status) => {
    const statusIndex = trackingStages.findIndex(stage => stage.name === status);
    return statusIndex !== -1 ? statusIndex : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header with decorative element */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-white"></div>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Track Your Application
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-green-100 text-lg"
            >
              Monitor the status of your document applications
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <p className="text-gray-600 text-center mb-8">
                Enter your registered mobile number to view the status of your applications
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      +91
                    </span>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      className="flex-1 min-w-0 block w-full px-4 py-2 rounded-r-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter 10-digit number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg text-center shadow-md transition-all duration-300 flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : "Track Applications"}
                  </button>
                </motion.div>
                
                {!submitted && (
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Secure and instant tracking
                  </p>
                )}
              </form>
            </motion.div>

            {/* Results Section */}
            {submitted && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Applications</h2>
                
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-start flex-wrap">
                          <div>
                            <h3 className="font-medium text-gray-800">{app.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">Service: {app.serviceGroup}</p>
                            <p className="text-gray-500 text-sm">
                              Appointment: {formatDate(app.date)}, {app.timeSlot}
                            </p>
                            {app.price && (
                              <p className="text-gray-600 text-sm mt-2">Price: {app.price}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusBadgeClass(app.status)}`}>
                              {app.status}
                            </span>
                            <motion.button 
                              whileHover={{ x: 3 }}
                              className="text-green-600 text-sm mt-3 hover:underline flex items-center"
                              onClick={() => openDetailPopup(app)}
                            >
                              View Details
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 p-8 rounded-xl text-center"
                  >
                    <div className="mb-3">
                      <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-700 font-medium text-lg mb-2">No applications found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We couldn't find any applications associated with this mobile number. 
                      Please verify the number or contact our support team for assistance.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Details Popup */}
        <AnimatePresence>
          {showDetailPopup && selectedApplication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={closeDetailPopup}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="bg-white rounded-2xl max-w-lg w-full shadow-2xl my-8 mx-auto max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Popup Header - Fixed at top */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white opacity-10"></div>
                  <div className="absolute -bottom-16 -left-8 w-36 h-36 rounded-full bg-white opacity-10"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h2 className="text-white text-xl font-bold tracking-tight">{selectedApplication.name}</h2>
                      <p className="text-green-100 mt-1 opacity-90">Application Details</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeDetailPopup}
                      className="text-white rounded-full p-1.5 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                  {/* Top Card Info */}
                  <div className="bg-gray-50 bg-opacity-80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4 justify-between mb-4">
                      {/* Status pill */}
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedApplication.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-1.5"></span>
                        {selectedApplication.status}
                      </span>
                      
                      {/* Created date */}
                      <div className="text-gray-500 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Created: {formatDate(selectedApplication.createdAt)}
                      </div>
                    </div>
                    
                    {/* Application details with subtle icons */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-2 p-1.5 bg-emerald-100 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Service Group</p>
                          <p className="font-medium">{selectedApplication.serviceGroup}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-2 p-1.5 bg-blue-100 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Price</p>
                          <p className="font-medium">{selectedApplication.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-2 p-1.5 bg-purple-100 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Appointment Date</p>
                          <p className="font-medium">{selectedApplication.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-2 p-1.5 bg-amber-100 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Time Slot</p>
                          <p className="font-medium">{selectedApplication.timeSlot}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-8">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Contact Information
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">Name</p>
                          <p className="font-medium">{selectedApplication.contactInfo?.name || 'N/A'}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="font-medium">{selectedApplication.contactInfo?.phone || 'N/A'}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="font-medium truncate">{selectedApplication.contactInfo?.email || 'N/A'}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">City</p>
                          <p className="font-medium">{selectedApplication.contactInfo?.city || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Tracker - Modern Design */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Application Progress
                    </h3>
                    
                    <div className="relative mt-6">
                      {/* Progress Line */}
                      <div className="absolute left-6 top-0 w-1 h-full bg-gray-200 rounded-full z-0"></div>
                      
                      {/* Status Steps */}
                      <div className="relative z-10">
                        {trackingStages.map((stage, index) => {
                          const currentIndex = getCurrentStageIndex(selectedApplication.status);
                          const isCompleted = index <= currentIndex;
                          const isCurrent = index === currentIndex;
                          
                          return (
                            <div key={stage.name} className="flex mb-12 last:mb-0">
                              <div className="relative">
                                <motion.div 
                                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 border-2 ${
                                    isCompleted 
                                      ? 'bg-green-500 text-white border-green-500' 
                                      : 'bg-white text-gray-400 border-gray-200'
                                  }`}
                                  initial={false}
                                  animate={isCurrent ? { 
                                    scale: [1, 1.1, 1], 
                                    boxShadow: ['0px 0px 0px rgba(16, 185, 129, 0)', '0px 0px 15px rgba(16, 185, 129, 0.4)', '0px 0px 0px rgba(16, 185, 129, 0)']
                                  } : {}}
                                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                >
                                  {isCompleted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <span className="font-medium text-lg">{index + 1}</span>
                                  )}
                                </motion.div>
                                
                                {/* Current indicator - pulsing dot */}
                                {isCurrent && (
                                  <motion.div 
                                    className="absolute -right-1 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                    animate={{ 
                                      scale: [1, 1.5, 1],
                                      opacity: [1, 0.6, 1]
                                    }}
                                    transition={{ 
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatType: "reverse"
                                    }}
                                  />
                                )}
                              </div>
                              
                              <div className="pt-2">
                                <div className="flex items-center">
                                  <h4 className={`font-medium text-lg ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                    {stage.name}
                                  </h4>
                                  
                                  {isCurrent && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                      Current
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-gray-500 text-sm mt-1">{stage.description}</p>
                                
                                {isCompleted && index < trackingStages.length - 1 && (
                                  <p className={`text-xs mt-2 ${index === currentIndex ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                    {index === currentIndex ? 'In progress' : 'Completed'}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-end bg-gray-50 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={closeDetailPopup}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="relative">
          <motion.div 
            className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 opacity-70 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-r from-emerald-100 to-green-200 opacity-70 blur-xl"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 10, 0],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Need help? Contact our support team at support@dokumentguru.com</p>
        </div>
      </motion.div>
    </div>
  );
}