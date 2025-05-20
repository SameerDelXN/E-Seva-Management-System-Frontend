// "use client";

// import { useState, useEffect } from 'react';
// import { FiRefreshCw, FiFile, FiClock, FiCheckCircle, FiEdit, FiSave, FiX, FiMessageSquare, FiEye, FiList } from 'react-icons/fi';
// import { useSession } from '@/context/SessionContext';

// export default function DueApplications() {
//   const { session } = useSession();
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [editingStatus, setEditingStatus] = useState("");
//   const [showReasonField, setShowReasonField] = useState(false);
//   const [statusReason, setStatusReason] = useState("");
//   const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showReasonModal, setShowReasonModal] = useState(false);
//   const [currentReason, setCurrentReason] = useState("");
  
//   // Stats counters
//   const [stats, setStats] = useState({
//     total: 0,
//     critical: 0, // More than 7 days overdue
//     overdue: 0   // 1-7 days overdue
//   });

//   const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";
//   const globalStatusOptions = [];

//   // Parse date properly
//   const parseDateString = (dateStr) => {
//     if (dateStr instanceof Date) return dateStr;
    
//     // Check if date is in DD/MM/YYYY format
//     if (typeof dateStr === 'string' && dateStr.includes('/')) {
//       const [day, month, year] = dateStr.split('/');
//       return new Date(year, month - 1, day); // month is 0-indexed in JS Date
//     }
    
//     // Otherwise try standard Date constructor
//     return new Date(dateStr);
//   };

//   // Calculate days overdue
//   const getDaysOverdue = (deliveryDate) => {
//     if (!deliveryDate) return 0;
    
//     const today = new Date();
//     const delivery = parseDateString(deliveryDate);
    
//     // Validate that we have a valid date
//     if (isNaN(delivery.getTime())) {
//       console.error('Invalid date format:', deliveryDate);
//       return 0;
//     }
    
//     const diffTime = today - delivery;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     return diffDays > 0 ? diffDays : 0; // Only return positive values
//   };

//   // Fetch all overdue applications assigned to current staff
//   const fetchDueApplications = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/read`);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch applications: ${response.status}`);
//       }

//       const data = await response.json();

//       // Filter applications assigned to current staff
//       let filteredApplications = data.filter(app => app.staff[0].id === session?.user?._id);

//       // Further filter for only applications with passed delivery dates
//       const today = new Date();
//       filteredApplications = filteredApplications.filter(app => {
//         if (!app.delivery) return false;
        
//         // Skip applications that are already completed
//         if (app.status === "Completed" || app.initialStatus?.[0]?.name === "Completed") {
//           return false;
//         }
        
//         const deliveryDate = parseDateString(app.delivery);
//         return !isNaN(deliveryDate.getTime()) && deliveryDate < today;
//       });

//       // Sort by most overdue first
//       filteredApplications.sort((a, b) => {
//         const daysOverdueA = getDaysOverdue(a.delivery);
//         const daysOverdueB = getDaysOverdue(b.delivery);
//         return daysOverdueB - daysOverdueA; // Most overdue first
//       });

//       setApplications(filteredApplications);

//       // Calculate stats
//       const criticalApps = filteredApplications.filter(app => getDaysOverdue(app.delivery) > 7).length;
//       const overdueApps = filteredApplications.filter(app => {
//         const daysOverdue = getDaysOverdue(app.delivery);
//         return daysOverdue > 0 && daysOverdue <= 7;
//       }).length;

//       setStats({
//         total: filteredApplications.length,
//         critical: criticalApps,
//         overdue: overdueApps
//       });

//     } catch (err) {
//       console.error("Error fetching overdue applications:", err);
//       setError("Failed to load overdue applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, newStatus, reason = "") => {
//     try {
//       // Find the status option details from combined status options
//       const statusDetails = combinedStatusOptions.find(option => option.name === newStatus);
//       if (!statusDetails) {
//         throw new Error("Invalid status selected");
//       }

//       // Find current application to add to history
//       const currentApp = applications.find(app => app._id === id);
//       if (!currentApp) {
//         throw new Error("Application not found");
//       }

//       // Prepare current status for history
//       const currentStatusEntry = {
//         name: currentApp.initialStatus?.[0]?.name || currentApp.status || "Initiated",
//         hexcode: currentApp.initialStatus?.[0].hexcode || "#A78BFA",
//         reason: currentApp.initialStatus?.[0].reason || "",
//         updatedAt: new Date(),
//         updatedBy: "Admin" // Should be replaced with actual logged-in user
//       };

//       // Create new status object
//       const newCurrentStatus = {
//         name: newStatus,
//         hexcode: statusDetails.hexcode,
//         askreason: statusDetails.askreason,
//         reason: reason,
//         updatedAt: new Date()
//       };

//       // Prepare update payload
//       const updatePayload = {
//         ...currentApp,
//         initialStatus: [{
//           name: newStatus,
//           hexcode: statusDetails.hexcode,
//           askreason: statusDetails.askreason,
//           reason: reason,
//           updatedAt: new Date()
//         }]
//       };

//       const response = await fetch(`${API_BASE_URL}/update/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatePayload),
//       });

//       const updatedApplication = await response.json();

//       // Update local state
//       setApplications(applications.map(app =>
//         app._id === id ? updatedApplication : app
//       ));
      
//       // If status changed to "Completed", remove from the list
//       if (newStatus === "Completed") {
//         setApplications(applications.filter(app => app._id !== id));
//         // Update stats
//         setStats(prevStats => ({
//           ...prevStats,
//           total: prevStats.total - 1,
//           critical: getDaysOverdue(currentApp.delivery) > 7 ? prevStats.critical - 1 : prevStats.critical,
//           overdue: getDaysOverdue(currentApp.delivery) <= 7 ? prevStats.overdue - 1 : prevStats.overdue
//         }));
//       } else {
//         fetchDueApplications(); // Refresh the data
//       }
      
//       // Reset editing state
//       setEditingStatusId(null);
//       setEditingStatus("");
//       setStatusReason("");
//       setShowReasonField(false);
//       setCombinedStatusOptions([]);

//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   const getServiceStatusOptions = (application) => {
//     if (!application.service || !application.service.status || !Array.isArray(application.service.status)) {
//       return [];
//     }

//     return application.service.status.map(status => ({
//       name: status.name,
//       hexcode: status.hexcode,
//       askreason: status.askreason || false
//     }));
//   };

//   const getCurrentStatus = (application) => {
//     // Always use currentStatus.name if available, otherwise fall back to status
//     return application.initialStatus?.[0]?.name || application.status || "Initiated";
//   };

//   const startEditStatus = (application) => {
//     // Always use currentStatus if available, otherwise fall back to status
//     const currentStatusName = application.initialStatus?.[0]?.name || application.status || "Initiated";

//     // Get service-specific status options
//     const serviceStatusOptions = getServiceStatusOptions(application);

//     // Combine global and service-specific status options
//     // Avoid duplicates by checking names
//     const allStatusOptions = [...globalStatusOptions];

//     serviceStatusOptions.forEach(serviceStatus => {
//       if (!allStatusOptions.some(option => option.name === serviceStatus.name)) {
//         allStatusOptions.push(serviceStatus);
//       }
//     });

//     setCombinedStatusOptions(allStatusOptions);
//     setEditingStatusId(application._id);
//     setEditingStatus(currentStatusName);

//     // Check if this status requires a reason
//     const statusOption = allStatusOptions.find(option => option.name === currentStatusName);
//     setShowReasonField(statusOption?.askreason || false);
//   };

//   const cancelEditStatus = () => {
//     setEditingStatusId(null);
//     setEditingStatus("");
//   };

//   const handleStatusChange = (e) => {
//     const newStatus = e.target.value;
//     setEditingStatus(newStatus);

//     // Check if the new status requires a reason
//     const selectedOption = combinedStatusOptions.find(option => option.name === newStatus);
//     setShowReasonField(selectedOption?.askreason || false);

//     // Clear reason when switching to a status that doesn't require it
//     if (!selectedOption?.askreason) {
//       setStatusReason("");
//     }
//   };

//   const saveStatus = (id) => {
//     // Only pass reason if the status requires it
//     const reason = showReasonField ? statusReason : "";
//     updateStatus(id, editingStatus, reason);
//   };

//   // Function to open view modal
//   const openViewModal = (application) => {
//     setSelectedApplication(application);
//     setShowViewModal(true);
//   };

//   // Function to handle view status history
//   const handleViewStatusHistory = (application) => {
//     // Implementation for viewing status history
//     alert("Status history feature would open here");
//   };

//   // Load applications on component mount
//   useEffect(() => {
//     fetchDueApplications();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Overdue Applications</h1>
//         </div>
//       </header>

//       {/* Stats Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//           <StatCard
//             title="Total Overdue Applications"
//             value={stats.total}
//             icon={<FiFile className="h-6 w-6 text-red-500" />}
//             color="bg-red-100"
//           />
//           <StatCard
//             title="Critical (>7 days)"
//             value={stats.critical}
//             icon={<FiClock className="h-6 w-6 text-red-500" />}
//             color="bg-red-100"
//           />
//           <StatCard
//             title="Overdue (1-7 days)"
//             value={stats.overdue}
//             icon={<FiCheckCircle className="h-6 w-6 text-yellow-500" />}
//             color="bg-yellow-100"
//           />
//         </div>

//         {/* Overdue Applications Section */}
//         <div className="mt-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">Overdue Applications</h2>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-600">Total: {applications.length}</span>
//               <button
//                 onClick={fetchDueApplications}
//                 className="flex items-center bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded"
//               >
//                 <FiRefreshCw className="mr-1" /> Refresh
//               </button>
//             </div>
//           </div>

//           {/* Error message */}
//           {error && (
//             <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//               {error}
//             </div>
//           )}

//           {/* Loading state */}
//           {loading ? (
//             <div className="text-center py-10">
//               <FiRefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-500" />
//               <p className="mt-2 text-gray-500">Loading overdue applications...</p>
//             </div>
//           ) : (
//             /* Table */
//             <div className="bg-white shadow rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {applications.length === 0 ? (
//                       <tr>
//                         <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
//                           No overdue applications found
//                         </td>
//                       </tr>
//                     ) : (
//                       applications.map((application, index) => (
//                         <tr key={index} className={`hover:bg-gray-50 ${getDaysOverdue(application.delivery) > 7 ? 'bg-red-50' : ''}`}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(application.date).toLocaleDateString('en-GB')}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDaysOverdue(application.delivery) > 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                               {getDaysOverdue(application.delivery)} days
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {editingStatusId === application._id ? (
//                               <div className="flex flex-col space-y-2">
//                                 <div className="flex items-center space-x-2">
//                                   <select
//                                     value={editingStatus}
//                                     onChange={handleStatusChange}
//                                     className="text-xs border border-gray-300 rounded p-1"
//                                   >
//                                     {combinedStatusOptions.map(option => (
//                                       <option key={option.name} value={option.name}>
//                                         {option.name}
//                                       </option>
//                                     ))}
//                                   </select>
//                                   <button
//                                     onClick={() => saveStatus(application._id)}
//                                     className="text-green-600 hover:text-green-900"
//                                   >
//                                     <FiSave className="h-4 w-4" />
//                                   </button>
//                                   <button
//                                     onClick={cancelEditStatus}
//                                     className="text-red-600 hover:text-red-900"
//                                   >
//                                     <FiX className="h-4 w-4" />
//                                   </button>
//                                 </div>

//                                 {showReasonField && (
//                                   <input
//                                     type="text"
//                                     placeholder="Enter reason"
//                                     value={statusReason}
//                                     onChange={(e) => setStatusReason(e.target.value)}
//                                     className="text-xs border border-gray-300 rounded p-1 w-full"
//                                   />
//                                 )}
//                               </div>
//                             ) : (
//                               <div className="flex items-center space-x-2">
//                                 <StatusBadge
//                                   status={getCurrentStatus(application)}
//                                   hexcode={application.initialStatus?.[0]?.hexcode}
//                                   reason={application.initialStatus?.[0]?.reason}
//                                   setShowReasonModal={setShowReasonModal}
//                                   setCurrentReason={setCurrentReason}
//                                 />
//                                 <button
//                                   onClick={() => startEditStatus(application)}
//                                   className="text-indigo-600 hover:text-indigo-900"
//                                   title="Edit Status"
//                                 >
//                                   <FiEdit className="h-4 w-4" />
//                                 </button>
//                                 {(application.statusHistory?.length > 0) && (
//                                   <button
//                                     onClick={() => handleViewStatusHistory(application)}
//                                     className="text-gray-600 hover:text-gray-900"
//                                     title="View Status History"
//                                   >
//                                     <FiList className="h-4 w-4" />
//                                   </button>
//                                 )}
//                               </div>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {typeof application.service === 'object'
//                               ? application.service.name || JSON.stringify(application.service)
//                               : application.service}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <button
//                               onClick={() => openViewModal(application)}
//                               className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
//                             >
//                               <FiEye className="h-3 w-3 mr-1" />
//                               VIEW DETAILS
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* View Modal */}
//       {showViewModal && selectedApplication && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>

//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                     <div className="flex justify-between items-center mb-6">
//                       <h3 className="text-xl font-semibold text-gray-900">
//                         Application Details
//                       </h3>
//                       <button
//                         onClick={() => setShowViewModal(false)}
//                         className="text-gray-400 hover:text-gray-500"
//                       >
//                         <FiX className="h-6 w-6" />
//                       </button>
//                     </div>

//                     {/* Overdue Alert */}
//                     <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
//                       <div className="flex">
//                         <div className="flex-shrink-0">
//                           <FiClock className="h-5 w-5 text-red-500" />
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm text-red-700">
//                             This application is <span className="font-bold">{getDaysOverdue(selectedApplication.delivery)} days overdue</span>. 
//                             The delivery date was {selectedApplication.delivery}.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Applicant Information */}
//                     <div className="grid grid-cols-2 gap-4 mb-6">
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
//                         <h4 className="text-sm font-medium text-gray-500">Applicant Name</h4>
//                         <p className="mt-1 text-sm font-medium text-gray-900">{selectedApplication.name}</p>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
//                         <h4 className="text-sm font-medium text-gray-500">Application Date</h4>
//                         <p className="mt-1 text-sm font-medium text-gray-900">{new Date(selectedApplication.date).toLocaleDateString('en-GB')}</p>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
//                         <h4 className="text-sm font-medium text-gray-500">Service Type</h4>
//                         <p className="mt-1 text-sm font-medium text-gray-900">
//                           {typeof selectedApplication.service === 'object'
//                             ? selectedApplication.service.name
//                             : selectedApplication.service}
//                         </p>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
//                         <h4 className="text-sm font-medium text-gray-500">Delivery Date</h4>
//                         <p className="mt-1 text-sm font-medium text-gray-900">{selectedApplication.delivery}</p>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
//                         <h4 className="text-sm font-medium text-gray-500">Amount</h4>
//                         <p className="mt-1 text-sm font-medium text-gray-900">₹{selectedApplication.amount}</p>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
//                         <h4 className="text-sm font-medium text-gray-500">Status</h4>
//                         <div className="mt-1">
//                           <StatusBadge
//                             status={getCurrentStatus(selectedApplication)}
//                             hexcode={selectedApplication.initialStatus?.[0]?.hexcode}
//                             reason={selectedApplication.initialStatus?.[0]?.reason}
//                             setShowReasonModal={setShowReasonModal}
//                             setCurrentReason={setCurrentReason}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Documents Section */}
//                     <div className="mb-6">
//                       <h4 className="text-lg font-medium text-gray-700 mb-3">Documents</h4>
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                         {selectedApplication.document && selectedApplication.document.length > 0 ? (
//                           <div className="space-y-3">
//                             {selectedApplication.document.map((doc, index) => (
//                               <div key={doc._id || index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
//                                 <div className="flex items-center">
//                                   <FiFile className="text-indigo-500 mr-2" />
//                                   <span className="text-sm font-medium">{doc.name || `Document ${index + 1}`}</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-500">No documents uploaded</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Remarks Section */}
//                     {selectedApplication.remark && (
//                       <div className="mb-6">
//                         <h4 className="text-lg font-medium text-gray-700 mb-3">Remarks</h4>
//                         <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//                           <div className="bg-white p-3 rounded border border-gray-200">
//                             <p className="text-sm">{selectedApplication.remark}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => {
//                     startEditStatus(selectedApplication);
//                     setShowViewModal(false);
//                   }}
//                 >
//                   Update Status
//                 </button>
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => setShowViewModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reason Modal */}
//       {showReasonModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                    <h3 className="text-lg leading-6 font-medium text-gray-900">
//                       Status Reason
//                     </h3>
//                     <div className="mt-4">
//                       <p className="text-sm text-gray-500">{currentReason}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => setShowReasonModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Component for stat cards
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white overflow-hidden shadow rounded-lg">
//       <div className="p-5">
//         <div className="flex items-center">
//           <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
//             {icon}
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
//               <dd>
//                 <div className="text-lg font-medium text-gray-900">{value}</div>
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Component for status badges
// function StatusBadge({ status, hexcode, reason, setShowReasonModal, setCurrentReason }) {
//   const defaultColor = "#A78BFA"; // Default color if hexcode is not provided
//   const bgColor = hexcode || defaultColor;
  
//   // Calculate text color based on background color brightness
//   const isLightColor = (hexColor) => {
//     // Convert hex to RGB
//     const r = parseInt(hexColor.slice(1, 3), 16);
//     const g = parseInt(hexColor.slice(3, 5), 16);
//     const b = parseInt(hexColor.slice(5, 7), 16);
    
//     // Calculate luminance - a simple formula to determine if we should use dark or light text
//     const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//     return luminance > 0.5;
//   };
  
//   const textColor = isLightColor(bgColor) ? "#1F2937" : "#FFFFFF"; // Dark or light text based on bg color
  
//   const handleReasonClick = () => {
//     if (reason) {
//       setCurrentReason(reason);
//       setShowReasonModal(true);
//     }
//   };
  
//   return (
//     <div className="flex items-center">
//       <span
//         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
//         style={{ backgroundColor: `${bgColor}25`, color: bgColor }} // 25 is for 25% opacity in hex
//       >
//         {status}
//       </span>
//       {reason && (
//         <button
//           onClick={handleReasonClick}
//           className="ml-1 text-gray-400 hover:text-gray-500"
//           title="View Reason"
//         >
//           <FiMessageSquare className="h-3 w-3" />
//         </button>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiFile, FiClock, FiCheckCircle, FiEdit, FiSave, FiX, FiMessageSquare, FiEye, FiList } from 'react-icons/fi';
import { useSession } from '@/context/SessionContext';

export default function DueApplications() {
  const { session } = useSession();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [showReasonField, setShowReasonField] = useState(false);
  const [statusReason, setStatusReason] = useState("");
  const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [currentReason, setCurrentReason] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "critical", or "overdue"
  
  // Stats counters
  const [stats, setStats] = useState({
    total: 0,
    critical: 0, // More than 7 days overdue
    overdue: 0   // 1-7 days overdue
  });

  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";
  const globalStatusOptions = [];

  // Parse date properly
  const parseDateString = (dateStr) => {
    if (dateStr instanceof Date) return dateStr;
    
    // Check if date is in DD/MM/YYYY format
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day); // month is 0-indexed in JS Date
    }
    
    // Otherwise try standard Date constructor
    return new Date(dateStr);
  };

  // Calculate days overdue
  const getDaysOverdue = (deliveryDate) => {
    if (!deliveryDate) return 0;
    
    const today = new Date();
    const delivery = parseDateString(deliveryDate);
    
    // Validate that we have a valid date
    if (isNaN(delivery.getTime())) {
      console.error('Invalid date format:', deliveryDate);
      return 0;
    }
    
    const diffTime = today - delivery;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0; // Only return positive values
  };

  // Fetch all overdue applications assigned to current staff
  const fetchDueApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/read`);

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const data = await response.json();

      // Filter applications assigned to current staff
      let filteredApplications = data.filter(app => app.staff[0].id === session?.user?._id);

      // Further filter for only applications with passed delivery dates
      const today = new Date();
      filteredApplications = filteredApplications.filter(app => {
        if (!app.delivery) return false;
        
        // Skip applications that are already completed
        if (app.status === "Completed" || app.initialStatus?.[0]?.name === "Completed") {
          return false;
        }
        
        const deliveryDate = parseDateString(app.delivery);
        return !isNaN(deliveryDate.getTime()) && deliveryDate < today;
      });

      // Sort by most overdue first
      filteredApplications.sort((a, b) => {
        const daysOverdueA = getDaysOverdue(a.delivery);
        const daysOverdueB = getDaysOverdue(b.delivery);
        return daysOverdueB - daysOverdueA; // Most overdue first
      });

      setApplications(filteredApplications);

      // Calculate stats
      const criticalApps = filteredApplications.filter(app => getDaysOverdue(app.delivery) > 7).length;
      const overdueApps = filteredApplications.filter(app => {
        const daysOverdue = getDaysOverdue(app.delivery);
        return daysOverdue > 0 && daysOverdue <= 7;
      }).length;

      setStats({
        total: filteredApplications.length,
        critical: criticalApps,
        overdue: overdueApps
      });

      // Apply current filter
      applyFilter(activeFilter, filteredApplications);

    } catch (err) {
      console.error("Error fetching overdue applications:", err);
      setError("Failed to load overdue applications");
    } finally {
      setLoading(false);
    }
  };

  // Apply filtering based on selected filter
  const applyFilter = (filter, apps = applications) => {
    let filtered;
    
    switch (filter) {
      case "critical":
        filtered = apps.filter(app => getDaysOverdue(app.delivery) > 7);
        break;
      case "overdue":
        filtered = apps.filter(app => {
          const daysOverdue = getDaysOverdue(app.delivery);
          return daysOverdue > 0 && daysOverdue <= 7;
        });
        break;
      case "all":
      default:
        filtered = apps;
        break;
    }
    
    setFilteredApplications(filtered);
    setActiveFilter(filter);
  };

  const updateStatus = async (id, newStatus, reason = "") => {
    try {
      // Find the status option details from combined status options
      const statusDetails = combinedStatusOptions.find(option => option.name === newStatus);
      if (!statusDetails) {
        throw new Error("Invalid status selected");
      }

      // Find current application to add to history
      const currentApp = applications.find(app => app._id === id);
      if (!currentApp) {
        throw new Error("Application not found");
      }

      // Prepare current status for history
      const currentStatusEntry = {
        name: currentApp.initialStatus?.[0]?.name || currentApp.status || "Initiated",
        hexcode: currentApp.initialStatus?.[0].hexcode || "#A78BFA",
        reason: currentApp.initialStatus?.[0].reason || "",
        updatedAt: new Date(),
        updatedBy: "Admin" // Should be replaced with actual logged-in user
      };

      // Create new status object
      const newCurrentStatus = {
        name: newStatus,
        hexcode: statusDetails.hexcode,
        askreason: statusDetails.askreason,
        reason: reason,
        updatedAt: new Date()
      };

      // Prepare update payload
      const updatePayload = {
        ...currentApp,
        initialStatus: [{
          name: newStatus,
          hexcode: statusDetails.hexcode,
          askreason: statusDetails.askreason,
          reason: reason,
          updatedAt: new Date()
        }]
      };

      const response = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      const updatedApplication = await response.json();

      // Update local state
      const updatedApplications = applications.map(app =>
        app._id === id ? updatedApplication : app
      );
      
      // If status changed to "Completed", remove from the list
      if (newStatus === "Completed") {
        const newApplications = applications.filter(app => app._id !== id);
        setApplications(newApplications);
        
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          total: prevStats.total - 1,
          critical: getDaysOverdue(currentApp.delivery) > 7 ? prevStats.critical - 1 : prevStats.critical,
          overdue: getDaysOverdue(currentApp.delivery) <= 7 ? prevStats.overdue - 1 : prevStats.overdue
        }));
        
        // Update filtered applications
        applyFilter(activeFilter, newApplications);
      } else {
        setApplications(updatedApplications);
        // Update filtered applications
        applyFilter(activeFilter, updatedApplications);
      }
      
      // Reset editing state
      setEditingStatusId(null);
      setEditingStatus("");
      setStatusReason("");
      setShowReasonField(false);
      setCombinedStatusOptions([]);

    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const getServiceStatusOptions = (application) => {
    if (!application.service || !application.service.status || !Array.isArray(application.service.status)) {
      return [];
    }

    return application.service.status.map(status => ({
      name: status.name,
      hexcode: status.hexcode,
      askreason: status.askreason || false
    }));
  };

  const getCurrentStatus = (application) => {
    // Always use currentStatus.name if available, otherwise fall back to status
    return application.initialStatus?.[0]?.name || application.status || "Initiated";
  };

  const startEditStatus = (application) => {
    // Always use currentStatus if available, otherwise fall back to status
    const currentStatusName = application.initialStatus?.[0]?.name || application.status || "Initiated";

    // Get service-specific status options
    const serviceStatusOptions = getServiceStatusOptions(application);

    // Combine global and service-specific status options
    // Avoid duplicates by checking names
    const allStatusOptions = [...globalStatusOptions];

    serviceStatusOptions.forEach(serviceStatus => {
      if (!allStatusOptions.some(option => option.name === serviceStatus.name)) {
        allStatusOptions.push(serviceStatus);
      }
    });

    setCombinedStatusOptions(allStatusOptions);
    setEditingStatusId(application._id);
    setEditingStatus(currentStatusName);

    // Check if this status requires a reason
    const statusOption = allStatusOptions.find(option => option.name === currentStatusName);
    setShowReasonField(statusOption?.askreason || false);
  };

  const cancelEditStatus = () => {
    setEditingStatusId(null);
    setEditingStatus("");
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEditingStatus(newStatus);

    // Check if the new status requires a reason
    const selectedOption = combinedStatusOptions.find(option => option.name === newStatus);
    setShowReasonField(selectedOption?.askreason || false);

    // Clear reason when switching to a status that doesn't require it
    if (!selectedOption?.askreason) {
      setStatusReason("");
    }
  };

  const saveStatus = (id) => {
    // Only pass reason if the status requires it
    const reason = showReasonField ? statusReason : "";
    updateStatus(id, editingStatus, reason);
  };

  // Function to open view modal
  const openViewModal = (application) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  // Function to handle view status history
  const handleViewStatusHistory = (application) => {
    // Implementation for viewing status history
    alert("Status history feature would open here");
  };

  // Load applications on component mount
  useEffect(() => {
    fetchDueApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Overdue Applications</h1>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            title="Total Overdue Applications"
            value={stats.total}
            icon={<FiFile className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
            active={activeFilter === "all"}
            onClick={() => applyFilter("all")}
          />
          <StatCard
            title="Critical (>7 days)"
            value={stats.critical}
            icon={<FiClock className="h-6 w-6 text-red-500" />}
            color="bg-red-100"
            active={activeFilter === "critical"}
            onClick={() => applyFilter("critical")}
          />
          <StatCard
            title="Overdue (1-7 days)"
            value={stats.overdue}
            icon={<FiCheckCircle className="h-6 w-6 text-yellow-500" />}
            color="bg-yellow-100"
            active={activeFilter === "overdue"}
            onClick={() => applyFilter("overdue")}
          />
        </div>

        {/* Overdue Applications Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilter === "all" ? "All Overdue Applications" : 
               activeFilter === "critical" ? "Critical Applications (>7 days)" : 
               "Overdue Applications (1-7 days)"}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Showing: {filteredApplications.length} of {applications.length}
              </span>
              <button
                onClick={fetchDueApplications}
                className="flex items-center bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded"
              >
                <FiRefreshCw className="mr-1" /> Refresh
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-10">
              <FiRefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-500" />
              <p className="mt-2 text-gray-500">Loading overdue applications...</p>
            </div>
          ) : (
            /* Table */
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                          No overdue applications found
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application, index) => (
                        <tr key={index} className={`hover:bg-gray-50 ${getDaysOverdue(application.delivery) > 7 ? 'bg-red-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(application.date).toLocaleDateString('en-GB')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDaysOverdue(application.delivery) > 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {getDaysOverdue(application.delivery)} days
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingStatusId === application._id ? (
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                  <select
                                    value={editingStatus}
                                    onChange={handleStatusChange}
                                    className="text-xs border border-gray-300 rounded p-1"
                                  >
                                    {combinedStatusOptions.map(option => (
                                      <option key={option.name} value={option.name}>
                                        {option.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => saveStatus(application._id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <FiSave className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={cancelEditStatus}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FiX className="h-4 w-4" />
                                  </button>
                                </div>

                                {showReasonField && (
                                  <input
                                    type="text"
                                    placeholder="Enter reason"
                                    value={statusReason}
                                    onChange={(e) => setStatusReason(e.target.value)}
                                    className="text-xs border border-gray-300 rounded p-1 w-full"
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <StatusBadge
                                  status={getCurrentStatus(application)}
                                  hexcode={application.initialStatus?.[0]?.hexcode}
                                  reason={application.initialStatus?.[0]?.reason}
                                  setShowReasonModal={setShowReasonModal}
                                  setCurrentReason={setCurrentReason}
                                />
                                <button
                                  onClick={() => startEditStatus(application)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Edit Status"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                                {(application.statusHistory?.length > 0) && (
                                  <button
                                    onClick={() => handleViewStatusHistory(application)}
                                    className="text-gray-600 hover:text-gray-900"
                                    title="View Status History"
                                  >
                                    <FiList className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof application.service === 'object'
                              ? application.service.name || JSON.stringify(application.service)
                              : application.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => openViewModal(application)}
                              className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                            >
                              <FiEye className="h-3 w-3 mr-1" />
                              VIEW DETAILS
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Application Details
                      </h3>
                      <button
                        onClick={() => setShowViewModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Overdue Alert */}
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FiClock className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            This application is <span className="font-bold">{getDaysOverdue(selectedApplication.delivery)} days overdue</span>. 
                            The delivery date was {selectedApplication.delivery}.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Applicant Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                        <h4 className="text-sm font-medium text-gray-500">Applicant Name</h4>
                        <p className="mt-1 text-sm font-medium text-gray-900">{selectedApplication.name}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                        <h4 className="text-sm font-medium text-gray-500">Application Date</h4>
                        <p className="mt-1 text-sm font-medium text-gray-900">{new Date(selectedApplication.date).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                        <h4 className="text-sm font-medium text-gray-500">Service Type</h4>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {typeof selectedApplication.service === 'object'
                            ? selectedApplication.service.name
                            : selectedApplication.service}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                        <h4 className="text-sm font-medium text-gray-500">Delivery Date</h4>
                        <p className="mt-1 text-sm font-medium text-gray-900">{selectedApplication.delivery}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                        <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                        <p className="mt-1 text-sm font-medium text-gray-900">₹{selectedApplication.amount}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <div className="mt-1">
                          <StatusBadge
                            status={getCurrentStatus(selectedApplication)}
                            hexcode={selectedApplication.initialStatus?.[0]?.hexcode}
                            reason={selectedApplication.initialStatus?.[0]?.reason}
                            setShowReasonModal={setShowReasonModal}
                            setCurrentReason={setCurrentReason}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documents Section */}
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-700 mb-3">Documents</h4>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        {selectedApplication.document && selectedApplication.document.length > 0 ? (
                          <div className="space-y-3">
                            {selectedApplication.document.map((doc, index) => (
                              <div key={doc._id || index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                                <div className="flex items-center">
                                  <FiFile className="text-indigo-500 mr-2" />
                                  <span className="text-sm font-medium">{doc.name || `Document ${index + 1}`}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No documents uploaded</p>
                        )}
                      </div>
                    </div>

                    {/* Remarks Section */}
                    {selectedApplication.remark && (
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-700 mb-3">Remarks</h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <p className="text-sm">{selectedApplication.remark}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    startEditStatus(selectedApplication);
                    setShowViewModal(false);
                  }}
                >
                  Update Status
                </button>
                <button
                  type="button"
                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Status Reason
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">{currentReason || "No reason provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowReasonModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon, color, active, onClick }) {
  return (
    <div 
      className={`cursor-pointer bg-white overflow-hidden shadow rounded-lg border ${active ? 'border-indigo-500' : 'border-gray-200'}`}
      onClick={onClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            {icon}
          </div>
          <div className="ml-5">
            <dt className="text-sm font-medium text-gray-500">
              {title}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {value}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatusBadge Component
function StatusBadge({ status, hexcode, reason, setShowReasonModal, setCurrentReason }) {
  // Default colors if hexcode is not provided
  const defaultColors = {
    "Initiated": "#3B82F6", // blue
    "In Progress": "#8B5CF6", // purple
    "Completed": "#10B981", // green
    "On Hold": "#F59E0B", // yellow/amber
    "Cancelled": "#EF4444", // red
    "Rejected": "#DC2626", // darker red
    "Pending": "#6B7280", // gray
  };

  const color = hexcode || defaultColors[status] || "#6B7280";
  
  const handleClick = () => {
    if (reason) {
      setCurrentReason(reason);
      setShowReasonModal(true);
    }
  };

  const badgeStyle = {
    backgroundColor: `${color}20`, // 20% opacity version of the color
    color: color,
    borderColor: `${color}40`, // 40% opacity version of the color
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded border flex items-center ${reason ? 'cursor-pointer hover:opacity-80' : ''}`}
      style={badgeStyle}
      onClick={reason ? handleClick : undefined}
      title={reason ? "Click to view reason" : undefined}
    >
      {status}
      {reason && <FiMessageSquare className="ml-1 h-3 w-3" />}
    </span>
  );
}