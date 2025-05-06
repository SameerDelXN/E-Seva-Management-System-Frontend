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
    // Check if status is an object with hexcode
    if (status && typeof status === 'object' && status.hexcode) {
      // Return inline style based on the hexcode
      return {
        backgroundColor: `${status.hexcode}20`, // Adding transparency to hexcode
        color: status.hexcode
      };
    }
    
    // For backward compatibility with string status
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'Pending':
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'In Progress':
        return 'bg-emerald-100 text-emerald-600';
      case 'Visited':
        return 'bg-cyan-100 text-cyan-600';
      case 'Rejected':
        return 'bg-red-100 text-red-600';
      case 'Initiated':
        return 'bg-purple-100 text-purple-600';
      case 'Active':
        return 'bg-green-100 text-green-600';
      case 'created':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Get display status name
  const getStatusName = (status) => {
    return status && typeof status === 'object' ? status.name : status;
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
  const getTrackingStages = (application) => {
    // If we have status array in the service, use that
    if (application?.service?.status && Array.isArray(application.service.status)) {
      return application.service.status.map(status => ({
        name: status.name,
        description: `Application ${status.name.toLowerCase()}`,
        hexcode: status.hexcode
      }));
    }
    
    // Fallback to default stages
    return [
      { name: 'Initiated', description: 'Application submitted' },
      { name: 'In Progress', description: 'Processing documents' },
      { name: 'Visited', description: 'Client visited office' },
      { name: 'Completed', description: 'Application processed successfully' }
    ];
  };

  const getCurrentStageIndex = (currentStatus, stages) => {
    const statusName = getStatusName(currentStatus);
    const statusIndex = stages.findIndex(stage => stage.name === statusName);
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
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-start flex-wrap">
                          <div>
                            <h3 className="font-medium text-gray-800">{app.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">Service: {app.service?.name || 'N/A'}</p>
                            <p className="text-gray-500 text-sm">
                              Appointment: {formatDate(app.date || app.createdAt)}
                            </p>
                            {app.delivery && (
                              <p className="text-gray-500 text-sm">
                                Expected Delivery: {app.delivery}
                              </p>
                            )}
                            {app.amount > 0 && (
                              <p className="text-gray-600 text-sm mt-2">Amount: ₹{app.amount}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            {app?.initialStatus ? (
                              <span 
                                className="text-sm px-3 py-1 rounded-full font-medium"
                                style={{
                                  backgroundColor: `${app.initialStatus[0].hexcode}20`, 
                                  color: app?.initialStatus[0].hexcode
                                }}
                              >
                                {app.initialStatus[0].name}
                              </span>
                            ) : (
                              <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusBadgeClass(app.status)}`}>
                                {app.initialStatus[0].name}
                              </span>
                            )}
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
                      {selectedApplication.initialStatus[0] ? (
                        <span 
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium" 
                          style={{
                            backgroundColor: `${selectedApplication.initialStatus[0].hexcode}20`, 
                            color: selectedApplication.initialStatus[0].hexcode
                          }}
                        >
                          <span 
                            className="w-2 h-2 rounded-full mr-1.5" 
                            style={{ backgroundColor: selectedApplication.initialStatus[0].hexcode }}
                          ></span>
                          {selectedApplication.initialStatus[0].name}
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedApplication.initialStatus[0].name)}`}>
                          <span className="w-2 h-2 rounded-full bg-current mr-1.5"></span>
                          {selectedApplication.initialStatus[0].name}
                        </span>
                      )}
                      
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
                          <p className="text-xs text-gray-500 mb-0.5">Service</p>
                          <p className="font-medium">{selectedApplication.service?.name || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-2 p-1.5 bg-blue-100 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Amount</p>
                          <p className="font-medium">₹{selectedApplication.amount || '0'}</p>
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
                          <p className="font-medium">{formatDate(selectedApplication.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-2 p-1.5 bg-amber-100 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Expected Delivery</p>
                          <p className="font-medium">{selectedApplication.delivery || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Status Options - NEW SECTION */}
                  {selectedApplication.service?.status && selectedApplication.service.status.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Available Status Options
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.service.status.map((status, idx) => (
                          <div 
                            key={status._id || idx} 
                            className="px-3 py-1 rounded-full text-sm"
                            style={{ 
                              backgroundColor: `${status.hexcode}20`,
                              color: status.hexcode
                            }}
                          >
                            {status.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provider Info */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Service Information
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">Provider</p>
                          <p className="font-medium">{selectedApplication.provider || 'Not Specified'}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">Staff</p>
                          <p className="font-medium">{selectedApplication.staff || 'Not Assigned'}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="font-medium">{selectedApplication.phone || 'N/A'}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">Documents</p>
                          <p className="font-medium">{selectedApplication.document?.length || 0} submitted</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status History (if available) */}
                  {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Status History
                      </h3>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                        <div className="space-y-3">
                          {selectedApplication.statusHistory.map((statusItem, idx) => (
                            <div key={idx} className="flex items-center">
                              <span 
                                className="w-2.5 h-2.5 rounded-full mr-2"
                                style={{ backgroundColor: statusItem.hexcode }}
                              ></span>
                              <span className="text-sm font-medium text-gray-700">{statusItem.name}</span>
                              <span className="text-xs text-gray-500 ml-auto">{formatDate(statusItem.updatedAt)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                 {/* Status Tracker - Modern Design */}
                 <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Application Progress
                    </h3>
                    
                    <div className="relative">
                      {/* Timeline Steps */}
                      <div className="relative">
                        {(() => {
                          const stages = getTrackingStages(selectedApplication);
                          const currentStageIndex = getCurrentStageIndex(
                            selectedApplication.initialStatus[0].name ,
                            stages
                          );
                          
                          return stages.map((stage, index) => {
                            const isCompleted = index <= currentStageIndex;
                            const isCurrentStage = index === currentStageIndex;
                            
                            // Default colors if not provided in stage
                            const defaultColor = '#10B981';
                            const stageColor = stage.hexcode || defaultColor;
                            
                            return (
                              <div key={index} className="flex items-start mb-4 last:mb-0">
                                <div className="flex flex-col items-center mr-4">
                                  <div 
                                    className={`w-7 h-7 rounded-full flex items-center justify-center relative ${
                                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                    style={{ 
                                      backgroundColor: isCompleted ? stageColor : '#E5E7EB' 
                                    }}
                                  >
                                    {isCompleted ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <span className="text-xs text-gray-500">{index + 1}</span>
                                    )}
                                    
                                    {/* Pulsating effect for current stage */}
                                    {isCurrentStage && (
                                      <motion.div
                                        className="absolute inset-0 rounded-full"
                                        style={{ 
                                          backgroundColor: stageColor,
                                          opacity: 0.3 
                                        }}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ 
                                          repeat: Infinity,
                                          duration: 2,
                                          ease: "easeInOut"
                                        }}
                                      />
                                    )}
                                  </div>
                                  
                                  {/* Connector line */}
                                  {index < stages.length - 1 && (
                                    <div 
                                      className="w-0.5 h-10 rounded"
                                      style={{ 
                                        backgroundColor: isCompleted ? stageColor : '#E5E7EB' 
                                      }}
                                    ></div>
                                  )}
                                </div>
                                
                                <div className="pt-1">
                                  <h4 className="font-medium text-gray-800">
                                    {stage.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {stage.description}
                                  </p>
                                  
                                  {/* If we have a date for this status */}
                                  {selectedApplication.statusHistory && 
                                   selectedApplication.statusHistory.find(s => s.name === stage.name) && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatDate(selectedApplication.statusHistory.find(s => s.name === stage.name).updatedAt)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes Section (if available) */}
                  {selectedApplication.notes && selectedApplication.notes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Notes & Updates
                      </h3>
                      <div className="space-y-3">
                        {selectedApplication.notes.map((note, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                            <p className="text-gray-600 text-sm">{note.content}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{note.createdBy || 'Staff'}</span>
                              <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Uploaded Documents (if available) */}
                  {selectedApplication.document && selectedApplication.document.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Documents Submitted
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedApplication.document.map((doc, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center">
                            <div className="p-2 rounded-md bg-blue-100 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{doc.name || `Document ${idx + 1}`}</p>
                              <p className="text-xs text-gray-500">{doc.type || 'Document'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No additional information message */}
                  {!selectedApplication.notes?.length && 
                   !selectedApplication.document?.length && 
                   !selectedApplication.statusHistory?.length && (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-gray-700 font-medium">No additional information</h4>
                      <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                        No detailed history or additional information is available for this application at this time.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Footer - Contact Section */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Need help with this application?
                    </p>
                    <div className="flex justify-center space-x-3">
                      <a href="tel:+918976541234" className="flex items-center text-sm text-green-600 hover:text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call support
                      </a>
                      <a href="mailto:support@dokumentguru.com" className="flex items-center text-sm text-green-600 hover:text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email us
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <div className="text-center text-gray-500 text-xs mt-10">
          <p>&copy; 2023 DokumentGuru. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}