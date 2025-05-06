// "use client";

// import { useState, useEffect } from 'react';
// import { FiRefreshCw, FiFile, FiCheckCircle, FiClock, FiUser, FiEdit2, FiEdit, FiSave, FiX, FiList } from 'react-icons/fi';

// export default function StaffManagerDashboard() {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Add state for editing application status
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [editingStatus, setEditingStatus] = useState("");
//   const [statusReason, setStatusReason] = useState("");
//   const [showReasonField, setShowReasonField] = useState(false);
  
//   // State to store combined status options for the current application being edited
//   const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);

//   // Modal state for staff assignment
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isStatusHistoryModalOpen, setIsStatusHistoryModalOpen] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [staffMembers, setStaffMembers] = useState([]);
//   const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);
//   const [staffLoading, setStaffLoading] = useState(false);

//   const API_BASE_URL = "http://localhost:3001/api/application";
//   const STAFF_API_URL = "https://dokument-guru-backend.vercel.app/api/admin/staff/fetch-all-staff";

//   // Global status options with color codes
//   const globalStatusOptions = [
//   ];

//   // Stats counters for dashboard
//   const [stats, setStats] = useState({
//     total: 0,
//     unassigned: 0,
//     inProgress: 0,
//     completed: 0
//   });

//   // Fetch all applications
//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/read`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch applications: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setApplications(data);
      
//       // Calculate stats
//       const unassignedApps = data.filter(app => !app.staff || app.staff === "Not Assigned").length;
//       const inProgressApps = data.filter(app => {
//         // Get status from currentStatus field or fallback to status field
//         const status = app.currentStatus?.name || app.status;
//         return status === "In Progress";
//       }).length;
      
//       const completedApps = data.filter(app => {
//         // Get status from currentStatus field or fallback to status field
//         const status = app.currentStatus?.name || app.status;
//         return status === "Completed";
//       }).length;
      
//       setStats({
//         total: data.length,
//         unassigned: unassignedApps,
//         inProgress: inProgressApps,
//         completed: completedApps
//       });
      
//     } catch (err) {
//       console.error("Error fetching applications:", err);
//       setError("Failed to load applications. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all staff members
//   const fetchStaffMembers = async () => {
//     try {
//       setStaffLoading(true);
//       const response = await fetch(STAFF_API_URL);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch staff members: ${response.status}`);
//       }
      
//       const data = await response.json();
//       // Assuming the response structure contains a data array with staff members
//       if (data && data.data && Array.isArray(data.data)) {
//         setStaffMembers(data.data.map(staff => ({
//           id: staff._id,
//           name: staff.name,
//           username: staff.username,
//           contactNo: staff.contactNo,
//           location: staff.location,
//           serviceGroups: staff.serviceGroups || [],
//           // Add a default status (this could be replaced with actual staff availability data)
//           status: "Available"
//         })));
//       } else {
//         throw new Error("Invalid staff data format");
//       }
//     } catch (err) {
//       console.error("Error fetching staff members:", err);
//       // Fallback to dummy data if API fails
//       setStaffMembers([
//         { id: 1, name: "John Doe", status: "Available", serviceGroups: [] },
//         { id: 2, name: "Sarah Smith", status: "Busy", serviceGroups: [] },
//         { id: 3, name: "Meera Shah", status: "Available", serviceGroups: [] },
//         { id: 4, name: "Alex Johnson", status: "Available", serviceGroups: [] }
//       ]);
//     } finally {
//       setStaffLoading(false);
//     }
//   };

//   // Filter staff based on application service
//   const filterStaffForApplication = (application) => {
//     if (!application || !application.service) {
//       return staffMembers; // Return all staff if no service specified
//     }

//     // Get the service name from the application
//     let serviceName;
//     if (typeof application.service === 'object') {
//       serviceName = application.service.name;
//     } else {
//       serviceName = application.service;
//     }

//     if (!serviceName) {
//       return staffMembers; // Return all staff if service name is not available
//     }

//     // Filter staff who can provide this service
//     const filtered = staffMembers.filter(staff => {
//       if (!staff.serviceGroups || !Array.isArray(staff.serviceGroups)) {
//         return false;
//       }
      
//       return staff.serviceGroups.some(group => 
//         group.serviceName === serviceName || 
//         group.serviceName === serviceName.trim()
//       );
//     });

//     return filtered.length > 0 ? filtered : staffMembers; // Fallback to all staff if no matches
//   };

//   // Update application status
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
//         name: currentApp.currentStatus?.name || currentApp.status || "Initiated",
//         hexcode: currentApp.currentStatus?.hexcode || "#A78BFA",
//         reason: currentApp.currentStatus?.reason || "",
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
//       // const updatePayload = {
      
//       //  // Update legacy status field
//       //   initialStatus: newCurrentStatus,
       
//       // };
//       const updatePayload = {
//         initialStatus: [{
//           name: newStatus,
//           hexcode: statusDetails.hexcode,
//           askreason: statusDetails.askreason,
         
//         }]
//       };

      
//       const response = await fetch(`${API_BASE_URL}/update/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatePayload),
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to update status: ${response.status}`);
//       }
      
//       const updatedApplication = await response.json();
      
//       // Update local state
//       setApplications(applications.map(app => 
//         app._id === id ? updatedApplication : app
//       ));
      
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

//   // Update staff assignment
//   const updateAssignment = async (applicationId, staffName) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/update/${applicationId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ _id: applicationId, staff: staffName }),
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to update staff assignment: ${response.status}`);
//       }
      
//       const updatedApplication = await response.json();
//       setApplications(applications.map(app => 
//         app._id === applicationId ? updatedApplication : app
//       ));
      
//       setIsModalOpen(false);
//       setSelectedApplication(null);
      
//     } catch (err) {
//       console.error("Error updating staff assignment:", err);
//       alert("Failed to update staff assignment. Please try again.");
//     }
//   };

//   const handleAssignStaff = (application) => {
//     setSelectedApplication(application);
//     // Filter staff members based on the application's service
//     setFilteredStaffMembers(filterStaffForApplication(application));
//     setIsModalOpen(true);
//   };

//   const handleViewStatusHistory = (application) => {
//     setSelectedApplication(application);
//     setIsStatusHistoryModalOpen(true);
//   };

//   // Helper function to get service-specific status options
//   // const getServiceStatusOptions = (application) => {
//   //   if (!application.service || !application.service.status || !Array.isArray(application.service.status)) {
//   //     return [];
//   //   }
    
//   //   return application.service.status.map(status => ({
//   //     name: status.name,
//   //     hexcode: status.hexcode,
//   //     askreason: status.askreason || false
//   //   }));
//   // };
//   const getServiceStatusOptions = (application) => {
//     if (!application.service || !application.service.status || !Array.isArray(application.service.status)) {
//       return [];
//     }
//     return application.service.status;
//   };

//   // Handle edit status mode
//   const startEditStatus = (application) => {
//     // Always use currentStatus if available, otherwise fall back to status
//     const currentStatusName = application.initialStatus[0]?.name  || "Initiated";
    
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
//     setStatusReason("");
//     setShowReasonField(false);
//     setCombinedStatusOptions([]);
//   };

//   const handleStatusChange = (e) => {
//     const newStatus = e.target.value;
//     setEditingStatus(newStatus);
    
//     // Check if this status requires a reason
//     const statusOption = combinedStatusOptions.find(option => option.name === newStatus);
//     setShowReasonField(statusOption?.askreason || false);
//   };

//   const saveStatus = (id) => {
//     console.log(id);
//     updateStatus(id, editingStatus, statusReason);
//   };

//   // Load applications and staff members on component mount
//   useEffect(() => {
//     fetchApplications();
//     fetchStaffMembers();
//   }, []);
  
//   // Helper function to get current status of an application
//   const getCurrentStatus = (application) => {
//     return application.initialStatus?.[0]?.name || "Initiated";
//   };
  
//   // Helper function to get status color from status name
//   const getStatusColorByName = (statusName) => {
//     const statusOption = globalStatusOptions.find(option => option.name === statusName);
//     return statusOption?.hexcode || "#A78BFA"; // Default purple color if not found
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Staff Manager Dashboard</h1>
//         </div>
//       </header>

//       {/* Stats Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           <StatCard 
//             title="Total Applications" 
//             value={stats.total} 
//             icon={<FiFile className="h-6 w-6 text-blue-500" />}
//             color="bg-blue-100"
//           />
//           <StatCard 
//             title="Unassigned Applications" 
//             value={stats.unassigned} 
//             icon={<FiUser className="h-6 w-6 text-red-500" />}
//             color="bg-red-100"
//           />
//           <StatCard 
//             title="In Progress" 
//             value={stats.inProgress} 
//             icon={<FiClock className="h-6 w-6 text-yellow-500" />}
//             color="bg-yellow-100"
//           />
//           <StatCard 
//             title="Completed Applications" 
//             value={stats.completed} 
//             icon={<FiCheckCircle className="h-6 w-6 text-green-500" />}
//             color="bg-green-100"
//           />
//         </div>

//         {/* Applications Section */}
//         <div className="mt-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">All Applications</h2>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-600">Total: {applications.length}</span>
//               <button 
//                 onClick={fetchApplications}
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
//               <p className="mt-2 text-gray-500">Loading applications...</p>
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
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
//                       {/* <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {applications.length === 0 ? (
//                       <tr>
//                         <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
//                           No applications found
//                         </td>
//                       </tr>
//                     ) : (
//                       applications.slice().reverse().map((application, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {new Date(application.date).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
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
//                                 {/* <StatusBadge status={getCurrentStatus(application)} hexcode={application.initialStatus[0]?.hexcode} /> */}

//                                 <StatusBadge 
//   status={getCurrentStatus(application)} 
//   hexcode={application.initialStatus?.[0]?.hexcode} 
// />
//                                 <button 
//                                   onClick={() => startEditStatus(application)}
//                                   className="text-indigo-600 hover:text-indigo-900"
//                                   title="Edit Status"
//                                 >
//                                   <FiEdit className="h-4 w-4" />
//                                 </button>
//                                 {(application.statusHistory?.length > 0 || application.currentStatus) && (
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
//                             ₹{typeof application.amount === 'number' ? application.amount : 0}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center space-x-2">
//                               <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                                 ${!application.staff || application.staff === "Not Assigned" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
//                                 {application.staff || "Not Assigned"}
//                               </span>
//                               <button 
//                                 onClick={() => handleAssignStaff(application)}
//                                 className="text-indigo-600 hover:text-indigo-900"
//                               >
//                                 <FiEdit className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </td>
//                           {/* <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                             <div className="flex justify-center space-x-2">
//                               {getCurrentStatus(application) !== "Completed" && (
//                                 <button 
//                                   onClick={() => {
//                                     // Get all possible status options for this application
//                                     const serviceStatusOptions = getServiceStatusOptions(application);
//                                     const allOptions = [...globalStatusOptions, ...serviceStatusOptions];
                                    
//                                     // Find the Completed status with its details
//                                     const completedStatus = allOptions.find(option => option.name === "Completed");
//                                     if (completedStatus) {
//                                       updateStatus(application._id, "Completed");
//                                     }
//                                   }}
//                                   className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs"
//                                 >
//                                   Complete
//                                 </button>
//                               )}
//                               {getCurrentStatus(application) === "Completed" && (
//                                 <button 
//                                   onClick={() => {
//                                     // Get all possible status options for this application
//                                     const serviceStatusOptions = getServiceStatusOptions(application);
//                                     const allOptions = [...globalStatusOptions, ...serviceStatusOptions];
                                    
//                                     // Find the In Progress status with its details
//                                     const inProgressStatus = allOptions.find(option => option.name === "In Progress");
//                                     if (inProgressStatus) {
//                                       updateStatus(application._id, "In Progress");
//                                     }
//                                   }}
//                                   className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs"
//                                 >
//                                   Reopen
//                                 </button>
//                               )}
//                             </div>
//                           </td> */}
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Staff Assignment Modal */}
//         {isModalOpen && selectedApplication && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 Assign Staff to Application
//               </h3>
              
//               {/* Display application service information */}
//               <div className="mb-4 bg-blue-50 p-3 rounded">
//                 <p className="text-sm text-blue-800">
//                   <span className="font-medium">Service Required:</span> {
//                     typeof selectedApplication.service === 'object' 
//                       ? selectedApplication.service.name 
//                       : selectedApplication.service
//                   }
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Showing staff members who can provide this service
//                 </p>
//               </div>
              
//               <div className="space-y-3">
//                 {staffLoading ? (
//                   <div className="text-center py-4">
//                     <FiRefreshCw className="animate-spin h-5 w-5 mx-auto text-gray-500" />
//                     <p className="mt-2 text-sm text-gray-500">Loading staff members...</p>
//                   </div>
//                 ) : filteredStaffMembers.length === 0 ? (
//                   <div className="text-center py-4 text-gray-500">
//                     No staff members available for this service
//                   </div>
//                 ) : (
//                   filteredStaffMembers.map(staff => (
//                     <button
//                       key={staff.id}
//                       onClick={() => updateAssignment(selectedApplication._id, staff.name)}
//                       className={`w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 
//                         ${selectedApplication.staff === staff.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
//                     >
//                       <div className="flex items-center">
//                         <FiUser className="h-5 w-5 text-gray-500 mr-3" />
//                         <div>
//                           <span className="font-medium text-gray-900">{staff.name}</span>
//                           <p className="text-xs text-gray-500">Location: {staff.location}</p>
//                         </div>
//                       </div>
//                       <span className={`text-sm ${staff.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
//                         {staff.status}
//                       </span>
//                     </button>
//                   ))
//                 )}
//               </div>
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Status History Modal */}
//         {isStatusHistoryModalOpen && selectedApplication && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Status History for {selectedApplication.name}
//                 </h3>
//                 <button 
//                   onClick={() => setIsStatusHistoryModalOpen(false)}
//                   className="text-gray-500 hover:text-gray-800"
//                 >
//                   <FiX className="h-5 w-5" />
//                 </button>
//               </div>
              
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {/* Current Status */}
//                 {selectedApplication.initialStatus[0] && (
//                   <div className="border border-green-300 bg-green-50 p-3 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <span className="font-medium">Current Status: </span>
//                         <StatusBadge 
//                           status={selectedApplication.initialStatus[0].name} 
//                           hexcode={selectedApplication.initialStatus[0].hexcode} 
//                         />
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {new Date(selectedApplication.initialStatus[0].updatedAt).toLocaleString()}
//                       </span>
//                     </div>
//                     {selectedApplication.initialStatus[0].reason && (
//                       <div className="mt-2 text-sm text-gray-700">
//                         <span className="font-medium">Reason: </span>
//                         {selectedApplication.initialStatus[0].reason}
//                       </div>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Status History */}
//                 {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 ? (
//                   selectedApplication.statusHistory.slice().reverse().map((status, index) => (
//                     <div key={index} className="border border-gray-200 p-3 rounded-lg">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <span className="font-medium">Status: </span>
//                           <StatusBadge 
//                             status={status.name} 
//                             hexcode={status.hexcode} 
//                           />
//                         </div>
//                         <span className="text-xs text-gray-500">
//                           {new Date(status.updatedAt).toLocaleString()}
//                         </span>
//                       </div>
//                       {status.reason && (
//                         <div className="mt-2 text-sm text-gray-700">
//                           <span className="font-medium">Reason: </span>
//                           {status.reason}
//                         </div>
//                       )}
//                       {status.updatedBy && (
//                         <div className="mt-1 text-xs text-gray-500">
//                           Updated by: {status.updatedBy}
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-4 text-gray-500">
//                     No status history available
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // StatCard component for dashboard metrics
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white overflow-hidden shadow rounded-lg">
//       <div className="px-4 py-5 sm:p-6">
//         <div className="flex items-center">
//           <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
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

// // StatusBadge component for displaying application status
// function StatusBadge({ status, hexcode = null }) {
//   // Default color mapping if no hexcode is provided
//   const defaultColors = {
//     "Initiated": "#A78BFA", // Purple
//     "In Progress": "#F59E0B", // Yellow
//     "Completed": "#10B981", // Green
//     "Rejected": "#EF4444", // Red
//     "On Hold": "#6B7280", // Gray
//     "Pending": "#3B82F6", // Blue
//     "Cancelled": "#1F2937" // Dark Gray
//   };

//   // Use provided hexcode or get from default colors or use purple as fallback
//   const colorHex = hexcode || defaultColors[status] || "#A78BFA";
  
//   // Calculate text color based on background brightness
//   // Simple approach: for dark backgrounds use white text, for light backgrounds use dark text
//   const isLightColor = (hexColor) => {
//     // Convert hex to RGB
//     const hex = hexColor.replace('#', '');
//     const r = parseInt(hex.slice(0, 2), 16);
//     const g = parseInt(hex.slice(2, 4), 16);
//     const b = parseInt(hex.slice(4, 6), 16);
    
//     // Calculate brightness according to YIQ formula
//     return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128;
//   };
  
//   const textColor = isLightColor(colorHex) ? '#1F2937' : '#FFFFFF';
  
//   return (
//     <span 
//       className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
//       style={{ 
//         backgroundColor: colorHex,
//         color: textColor
//       }}
//     >
//       {status}
//     </span>
//   );
// }


"use client";

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiFile, FiCheckCircle, FiClock, FiUser, FiEdit2, FiEdit, FiSave, FiX, FiList } from 'react-icons/fi';

export default function StaffManagerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add state for editing application status
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [showReasonField, setShowReasonField] = useState(false);
  
  // State to store combined status options for the current application being edited
  const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);

  // Modal state for staff assignment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusHistoryModalOpen, setIsStatusHistoryModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);

  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";
  const STAFF_API_URL = "https://dokument-guru-backend.vercel.app/api/admin/staff/fetch-all-staff";

  // Stats counters for dashboard
  const [stats, setStats] = useState({
    total: 0,
    unassigned: 0,
    inProgress: 0,
    completed: 0
  });

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/read`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }
      
      const data = await response.json();
      setApplications(data);
      
      // Calculate stats
      const unassignedApps = data.filter(app => !app.staff || app.staff === "Not Assigned").length;
      const inProgressApps = data.filter(app => {
        const status = app.initialStatus?.[0]?.name || app.status || "Initiated";
        return status === "In Progress";
      }).length;
      
      const completedApps = data.filter(app => {
        const status = app.initialStatus?.[0]?.name || app.status || "Initiated";
        return status === "Completed";
      }).length;
      
      setStats({
        total: data.length,
        unassigned: unassignedApps,
        inProgress: inProgressApps,
        completed: completedApps
      });
      
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all staff members
  const fetchStaffMembers = async () => {
    try {
      setStaffLoading(true);
      const response = await fetch(STAFF_API_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch staff members: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setStaffMembers(data.data.map(staff => ({
          id: staff._id,
          name: staff.name,
          username: staff.username,
          contactNo: staff.contactNo,
          location: staff.location,
          serviceGroups: staff.serviceGroups || [],
          status: "Available"
        })));
      } else {
        throw new Error("Invalid staff data format");
      }
    } catch (err) {
      console.error("Error fetching staff members:", err);
      setStaffMembers([
        { id: 1, name: "John Doe", status: "Available", serviceGroups: [] },
        { id: 2, name: "Sarah Smith", status: "Busy", serviceGroups: [] },
        { id: 3, name: "Meera Shah", status: "Available", serviceGroups: [] },
        { id: 4, name: "Alex Johnson", status: "Available", serviceGroups: [] }
      ]);
    } finally {
      setStaffLoading(false);
    }
  };

  // Filter staff based on application service
  const filterStaffForApplication = (application) => {
    if (!application || !application.service) return staffMembers;

    const serviceName = typeof application.service === 'object' 
      ? application.service.name 
      : application.service;

    if (!serviceName) return staffMembers;

    const filtered = staffMembers.filter(staff => {
      if (!staff.serviceGroups || !Array.isArray(staff.serviceGroups)) return false;
      return staff.serviceGroups.some(group => 
        group.serviceName === serviceName || 
        group.serviceName === serviceName.trim()
      );
    });

    return filtered.length > 0 ? filtered : staffMembers;
  };

  // Update application status
  const updateStatus = async (id, newStatus, reason = "") => {
    try {
      const statusDetails = combinedStatusOptions.find(option => option.name === newStatus);
      if (!statusDetails) throw new Error("Invalid status selected");
      
      const currentApp = applications.find(app => app._id === id);
      if (!currentApp) throw new Error("Application not found");
      
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
      
      if (!response.ok) throw new Error(`Failed to update status: ${response.status}`);
      
      const updatedApplication = await response.json();
      
      setApplications(applications.map(app => 
        app._id === id ? { 
          ...app, 
          ...updatedApplication,
          initialStatus: updatedApplication.initialStatus || app.initialStatus
        } : app
      ));
      fetchApplications();
      
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

  // Update staff assignment
  const updateAssignment = async (applicationId, staffName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          staff: staffName 
        }),
      });
      
      if (!response.ok) throw new Error(`Failed to update staff assignment: ${response.status}`);
      
      const updatedApplication = await response.json();
      console.log(updatedApplication)
      setApplications(applications.map(app => 
        app._id === updatedApplication._id ? updatedApplication : app
      ));
      fetchApplications()
      setIsModalOpen(false);
      setSelectedApplication(null);
      
    } catch (err) {
      console.error("Error updating staff assignment:", err);
      alert("Failed to update staff assignment. Please try again.");
    }
  };

  const handleAssignStaff = (application) => {
    setSelectedApplication(application);
    setFilteredStaffMembers(filterStaffForApplication(application));
    setIsModalOpen(true);
  };

  const handleViewStatusHistory = (application) => {
    setSelectedApplication(application);
    setIsStatusHistoryModalOpen(true);
  };

  const getServiceStatusOptions = (application) => {
    if (!application.service || !application.service.status || !Array.isArray(application.service.status)) {
      return [];
    }
    return application.service.status;
  };

  const startEditStatus = (application) => {
    const currentStatusName = application.initialStatus?.[0]?.name || "Initiated";
    const serviceStatusOptions = getServiceStatusOptions(application);
    
    const allStatusOptions = [...serviceStatusOptions];
    
    setCombinedStatusOptions(allStatusOptions);
    setEditingStatusId(application._id);
    setEditingStatus(currentStatusName);
    
    const statusOption = allStatusOptions.find(option => option.name === currentStatusName);
    setShowReasonField(statusOption?.askreason || false);
  };

  const cancelEditStatus = () => {
    setEditingStatusId(null);
    setEditingStatus("");
    setStatusReason("");
    setShowReasonField(false);
    setCombinedStatusOptions([]);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEditingStatus(newStatus);
    const statusOption = combinedStatusOptions.find(option => option.name === newStatus);
    setShowReasonField(statusOption?.askreason || false);
  };

  const saveStatus = (id) => {
    updateStatus(id, editingStatus, statusReason);
  };

  useEffect(() => {
    fetchApplications();
    fetchStaffMembers();
  }, []);
  
  const getCurrentStatus = (application) => {
    return application.initialStatus?.[0]?.name || "Initiated";
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Manager Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Applications" 
            value={stats.total} 
            icon={<FiFile className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard 
            title="Unassigned Applications" 
            value={stats.unassigned} 
            icon={<FiUser className="h-6 w-6 text-red-500" />}
            color="bg-red-100"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={<FiClock className="h-6 w-6 text-yellow-500" />}
            color="bg-yellow-100"
          />
          <StatCard 
            title="Completed Applications" 
            value={stats.completed} 
            icon={<FiCheckCircle className="h-6 w-6 text-green-500" />}
            color="bg-green-100"
          />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">All Applications</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Total: {applications.length}</span>
              <button 
                onClick={fetchApplications}
                className="flex items-center bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded"
              >
                <FiRefreshCw className="mr-1" /> Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-10">
              <FiRefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-500" />
              <p className="mt-2 text-gray-500">Loading applications...</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      applications.slice().reverse().map((application, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
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
                            ₹{typeof application.amount === 'number' ? application.amount : 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${!application.staff || application.staff === "Not Assigned" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                                {application.staff || "Not Assigned"}
                              </span>
                              <button 
                                onClick={() => handleAssignStaff(application)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                            </div>
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

        {/* Staff Assignment Modal */}
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Assign Staff to Application
              </h3>
              
              <div className="mb-4 bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Service Required:</span> {
                    typeof selectedApplication.service === 'object' 
                      ? selectedApplication.service.name 
                      : selectedApplication.service
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Showing staff members who can provide this service
                </p>
              </div>
              
              <div className="space-y-3">
                {staffLoading ? (
                  <div className="text-center py-4">
                    <FiRefreshCw className="animate-spin h-5 w-5 mx-auto text-gray-500" />
                    <p className="mt-2 text-sm text-gray-500">Loading staff members...</p>
                  </div>
                ) : filteredStaffMembers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No staff members available for this service
                  </div>
                ) : (
                  filteredStaffMembers.map(staff => (
                    <button
                      key={staff.id}
                      onClick={() => updateAssignment(selectedApplication._id, staff.name)}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 
                        ${selectedApplication.staff === staff.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center">
                        <FiUser className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <span className="font-medium text-gray-900">{staff.name}</span>
                          <p className="text-xs text-gray-500">Location: {staff.location}</p>
                        </div>
                      </div>
                      <span className={`text-sm ${staff.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                        {staff.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status History Modal */}
        {isStatusHistoryModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Status History for {selectedApplication.name}
                </h3>
                <button 
                  onClick={() => setIsStatusHistoryModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedApplication.initialStatus?.[0] && (
                  <div className="border border-green-300 bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">Current Status: </span>
                        <StatusBadge 
                          status={selectedApplication.initialStatus[0].name} 
                          hexcode={selectedApplication.initialStatus[0].hexcode} 
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(selectedApplication.initialStatus[0].updatedAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedApplication.initialStatus[0].reason && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Reason: </span>
                        {selectedApplication.initialStatus[0].reason}
                      </div>
                    )}
                  </div>
                )}
                
                {selectedApplication.statusHistory?.length > 0 ? (
                  selectedApplication.statusHistory.slice().reverse().map((status, index) => (
                    <div key={index} className="border border-gray-200 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium">Status: </span>
                          <StatusBadge 
                            status={status.name} 
                            hexcode={status.hexcode} 
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(status.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      {status.reason && (
                        <div className="mt-2 text-sm text-gray-700">
                          <span className="font-medium">Reason: </span>
                          {status.reason}
                        </div>
                      )}
                      {status.updatedBy && (
                        <div className="mt-1 text-xs text-gray-500">
                          Updated by: {status.updatedBy}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No status history available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, hexcode = null }) {
  const defaultColors = {
    "Active": "#4CAF50",
    "pending": "#cbb62a",
    "final": "#1db7b9",
    "Initiated": "#A78BFA",
    "In Progress": "#F59E0B",
    "Completed": "#10B981",
    "Rejected": "#EF4444",
    "On Hold": "#6B7280",
    "Pending": "#3B82F6",
    "Cancelled": "#1F2937"
  };

  const colorHex = hexcode || defaultColors[status] || "#A78BFA";
  
  const isLightColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128;
  };
  
  const textColor = isLightColor(colorHex) ? '#1F2937' : '#FFFFFF';
  
  return (
    <span 
      className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
      style={{ 
        backgroundColor: colorHex,
        color: textColor
      }}
    >
      {status}
    </span>
  );
}