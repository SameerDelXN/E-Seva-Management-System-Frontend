// "use client";

// import { useState, useEffect } from 'react';
// import { FiRefreshCw, FiUpload, FiFile,FiList, FiCheckCircle, FiClock, FiUserCheck, FiEdit, FiSave, FiX } from 'react-icons/fi';
// import { useSession } from '@/context/SessionContext';
// export default function StaffDashboard() {
//   const {session} = useSession()
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedReceipt, setSelectedReceipt] = useState(null);
//   const [currentStaffName, setCurrentStaffName] = useState(session?.user?.name)
//   const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);
//   const [showReasonField, setShowReasonField] = useState(false);
//   const [statusReason, setStatusReason] = useState("");
//   // Add state for editing application status
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [editingStatus, setEditingStatus] = useState("");

//   const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";
//   const globalStatusOptions = [
//   ];
//   console.log("sess",session)
//   // Stats counters for dashboard
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     completed: 0
//   });

//   // Fetch all applications assigned to current staff
//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/read`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch applications: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log("data ",data  )
//       // Filter applications assigned to current staff
//       const filteredApplications = data.filter(app => app.staff === session?.user?.name);
//       console.log("filter ,",filteredApplications)
//       setApplications(filteredApplications);
      
//       // Calculate stats
//       const pendingApps = filteredApplications.filter(app => app.status !== "Completed").length;
//       const completedApps = filteredApplications.filter(app => app.status === "Completed").length;
      
//       setStats({
//         total: filteredApplications.length,
//         pending: pendingApps,
//         completed: completedApps
//       });
      
//     } catch (err) {
//       console.error("Error fetching applications:", err);
//       setError("Failed to load applications");
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log("my =",applications)
//   // Update application status
//   // const updateStatus = async (id, newStatus) => {
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/update`, {
//   //       method: 'PUT',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ _id: id, status: newStatus }),
//   //     });
      
//   //     if (!response.ok) {
//   //       throw new Error(`Failed to update status: ${response.status}`);
//   //     }
      
//   //     const updatedApplication = await response.json();
//   //     setApplications(applications.map(app => 
//   //       app._id === id ? updatedApplication : app
//   //     ));
      
//   //     // Reset editing state
//   //     setEditingStatusId(null);
//   //     setEditingStatus("");
      
//   //   } catch (err) {
//   //     console.error("Error updating status:", err);
//   //     alert("Failed to update status. Please try again.");
//   //   }
//   // };
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
      
//       // if (!response.ok) {
//       //   throw new Error(`Failed to update status: ${response.status}`);
//       // }
      
//       const updatedApplication = await response.json();
      
//       // Update local state
//       setApplications(applications.map(app => 
//         app._id === id ? updatedApplication : app
//       ));
//       fetchApplications();
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

//   const handleFileChange = async (e, id, type) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     try {
//       // In a real implementation, you would upload the file to your server
//       // and get back a URL or file path
//       const fileFieldName = type === 'document' ? 'document' : 'receipt';
//       const fileData = { [fileFieldName]: file.name }; // In real app, this would be file URL
      
//       const response = await fetch(`${API_BASE_URL}/update`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ _id: id, ...fileData }),
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to upload ${type}: ${response.status}`);
//       }
      
//       const updatedApplication = await response.json();
//       setApplications(applications.map(app => 
//         app._id === id ? updatedApplication : app
//       ));
      
//       if (type === 'document') {
//         setSelectedFile(file);
//       } else {
//         setSelectedReceipt(file);
//       }
      
//     } catch (err) {
//       console.error(`Error uploading ${type}:`, err);
//       alert(`Failed to upload ${type}. Please try again.`);
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

//   // Handle edit status mode
//   // const startEditStatus = (application) => {
//   //   console.log(application);
//   //   setEditingStatusId(application._id);
//   //   setEditingStatus(application.status);
//   // };

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
//     setEditingStatus(e.target.value);
//   };

//   const saveStatus = (id) => {
//     updateStatus(id, editingStatus);
//   };

//   // Load applications on component mount
//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
//         </div>
//       </header>

//       {/* Stats Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           <StatCard 
//             title="My Applications" 
//             value={stats.total} 
//             icon={<FiFile className="h-6 w-6 text-blue-500" />}
//             color="bg-blue-100"
//           />
//           <StatCard 
//             title="Pending Applications" 
//             value={stats.pending} 
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
//             <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
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
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
//                       {/* <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {applications.length === 0 ? (
//                       <tr>
//                         <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
//                           No applications found
//                         </td>
//                       </tr>
//                     ) : (
//                       applications.slice().reverse().map((application, index) => (
//                         <tr key={application._id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.date}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
//                           {/* <td className="px-6 py-4 whitespace-nowrap">
//                             {editingStatusId === application._id ? (
//                               <div className="flex items-center space-x-2">
//                                 <select
//                                   value={editingStatus}
//                                   onChange={handleStatusChange}
//                                   className="text-xs border border-gray-300 rounded p-1"
//                                 >
//                                   <option value="Initiated">Initiated</option>
//                                   <option value="In Progress">In Progress</option>
//                                   <option value="HSM Authentication">HSM Authentication</option>
//                                   <option value="In Pursuit">In Pursuit</option>
//                                   <option value="Completed">Completed</option>
//                                   <option value="Rejected">Rejected</option>
//                                 </select>
//                                 <button 
//                                   onClick={() => saveStatus(application._id)}
//                                   className="text-green-600 hover:text-green-900"
//                                 >
//                                   <FiSave className="h-4 w-4" />
//                                 </button>
//                                 <button 
//                                   onClick={cancelEditStatus}
//                                   className="text-red-600 hover:text-red-900"
//                                 >
//                                   <FiX className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="flex items-center space-x-2">
//                                 <StatusBadge status={application.status} />
//                                 <button 
//                                   onClick={() => startEditStatus(application)}
//                                   className="text-indigo-600 hover:text-indigo-900"
//                                 >
//                                   <FiEdit className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             )}
//                           </td> */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                                                       {editingStatusId === application._id ? (
//                                                         <div className="flex flex-col space-y-2">
//                                                           <div className="flex items-center space-x-2">
//                                                             <select
//                                                               value={editingStatus}
//                                                               onChange={handleStatusChange}
//                                                               className="text-xs border border-gray-300 rounded p-1"
//                                                             >
//                                                               {combinedStatusOptions.map(option => (
//                                                                 <option key={option.name} value={option.name}>
//                                                                   {option.name}
//                                                                 </option>
//                                                               ))}
//                                                             </select>
//                                                             <button 
//                                                               onClick={() => saveStatus(application._id)}
//                                                               className="text-green-600 hover:text-green-900"
//                                                             >
//                                                               <FiSave className="h-4 w-4" />
//                                                             </button>
//                                                             <button 
//                                                               onClick={cancelEditStatus}
//                                                               className="text-red-600 hover:text-red-900"
//                                                             >
//                                                               <FiX className="h-4 w-4" />
//                                                             </button>
//                                                           </div>
                                                          
//                                                           {showReasonField && (
//                                                             <input
//                                                               type="text"
//                                                               placeholder="Enter reason"
//                                                               value={statusReason}
//                                                               onChange={(e) => setStatusReason(e.target.value)}
//                                                               className="text-xs border border-gray-300 rounded p-1 w-full"
//                                                             />
//                                                           )}
//                                                         </div>
//                                                       ) : (
//                                                         <div className="flex items-center space-x-2">
//                                                           <StatusBadge status={getCurrentStatus(application)} hexcode={application.initialStatus?.[0]?.hexcode} />
//                                                           <button 
//                                                             onClick={() => startEditStatus(application)}
//                                                             className="text-indigo-600 hover:text-indigo-900"
//                                                             title="Edit Status"
//                                                           >
//                                                             <FiEdit className="h-4 w-4" />
//                                                           </button>
//                                                           {(application.statusHistory?.length > 0 || application.currentStatus) && (
//                                                             <button
//                                                               onClick={() => handleViewStatusHistory(application)}
//                                                               className="text-gray-600 hover:text-gray-900"
//                                                               title="View Status History"
//                                                             >
//                                                               <FiList className="h-4 w-4" />
//                                                             </button>
//                                                           )}
//                                                         </div>
//                                                       )}
//                                                     </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//   {typeof application.service === 'object' 
//     ? application.service.name || JSON.stringify(application.service) 
//     : application.service}
// </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{application.amount}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <FileUpload 
//                               id={application._id} 
//                               type="document" 
//                               onChange={handleFileChange} 
//                               file={application.document}
//                               status={application.status}
//                             />
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <FileUpload 
//                               id={application._id} 
//                               type="receipt" 
//                               onChange={handleFileChange} 
//                               file={application.receipt}
//                               status={application.status}
//                             />
//                           </td>
//                           {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
//                             <div className="flex justify-center">
//                               {application.status !== "Completed" && (
//                                 <button 
//                                   onClick={() => updateStatus(application._id, "Completed")}
//                                   className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs"
//                                 >
//                                   Complete
//                                 </button>
//                               )}
//                               {application.status === "Completed" && (
//                                 <button 
//                                   onClick={() => updateStatus(application._id, "In Progress")}
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
//       </div>
//     </div>
//   );
// }

// // Stat Card Component
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className={`${color} overflow-hidden rounded-lg shadow`}>
//       <div className="p-5">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             {icon}
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
//             <dd className="flex items-baseline">
//               <div className="text-2xl font-semibold text-gray-900">{value}</div>
//             </dd>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Status Badge Component

// function StatusBadge({ status, hexcode = null }) {
//   const defaultColors = {
//     "Active": "#4CAF50",
//     "pending": "#cbb62a",
//     "final": "#1db7b9",
//     "Initiated": "#A78BFA",
//     "In Progress": "#F59E0B",
//     "Completed": "#10B981",
//     "Rejected": "#EF4444",
//     "On Hold": "#6B7280",
//     "Pending": "#3B82F6",
//     "Cancelled": "#1F2937"
//   };

//   const colorHex = hexcode || defaultColors[status] || "#A78BFA";
  
//   const isLightColor = (hexColor) => {
//     const hex = hexColor.replace('#', '');
//     const r = parseInt(hex.slice(0, 2), 16);
//     const g = parseInt(hex.slice(2, 4), 16);
//     const b = parseInt(hex.slice(4, 6), 16);
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

// // File Upload Component with conditional viewing
// function FileUpload({ id, type, onChange, file, status }) {
//   // Only show view document if status is Completed and it's a document
//   const canViewDocument = status === "Completed" && type === "document";
  
//   // Show view receipt if status is Completed or In Progress and it's a receipt
//   const canViewReceipt = (status === "Completed" || status === "In Progress") && type === "receipt";

//   return (
//     <div className="flex items-center">
//       {file ? (
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-gray-500">Uploaded</span>
//           {(canViewDocument || canViewReceipt) && (
//             <button className="text-indigo-600 hover:text-indigo-900 text-sm">
//               View
//             </button>
//           )}
//         </div>
//       ) : (
//         <label className="cursor-pointer">
//           <div className="flex items-center space-x-1">
//             <FiUpload className="h-4 w-4 text-gray-500" />
//             <span className="text-sm text-gray-700">Choose File</span>
//           </div>
//           <input 
//             type="file" 
//             className="hidden" 
//             onChange={(e) => onChange(e, id, type)}
//           />
//         </label>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiUpload, FiFile, FiList, FiCheckCircle, FiClock, FiUserCheck, FiEdit, FiSave, FiX, FiMessageSquare, FiEye, FiDownload } from 'react-icons/fi';
import { useSession } from '@/context/SessionContext';

export default function StaffDashboard() {
  const {session} = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [currentStaffName, setCurrentStaffName] = useState(session?.user?.name);
  const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);
  const [showReasonField, setShowReasonField] = useState(false);
  const [statusReason, setStatusReason] = useState("");
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  
  // Add states for remark functionality
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [currentRemark, setCurrentRemark] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";
  const globalStatusOptions = [];
  
  // Stats counters for dashboard
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });

  // Fetch all applications assigned to current staff
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/read`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter applications assigned to current staff
      const filteredApplications = data.filter(app => app.staff === session?.user?._id);
      setApplications(filteredApplications);
      
      // Calculate stats
      const pendingApps = filteredApplications.filter(app => app.status !== "Completed").length;
      const completedApps = filteredApplications.filter(app => app.status === "Completed").length;
      
      setStats({
        total: filteredApplications.length,
        pending: pendingApps,
        completed: completedApps
      });
      
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
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
      setApplications(applications.map(app => 
        app._id === id ? updatedApplication : app
      ));
      fetchApplications();
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
  console.log(session)
  // New function to add or update remark
  const updateRemark = async (id, remark) => {
    try {
      // Find current application
      const currentApp = applications.find(app => app._id === id);
      if (!currentApp) {
        throw new Error("Application not found");
      }
      
      // Prepare update payload
      const updatePayload = {
        ...currentApp,
        remark: remark,
        remarkAuthorId:session?.user?._id
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
      setApplications(applications.map(app => 
        app._id === id ? updatedApplication : app
      ));
      
      // Close modal and reset states
      setShowRemarkModal(false);
      setCurrentRemark("");
      setSelectedApplicationId(null);
      
    } catch (err) {
      console.error("Error updating remark:", err);
      alert("Failed to update remark. Please try again.");
    }
  };

  const handleFileChange = async (e, id, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // In a real implementation, you would upload the file to your server
      // and get back a URL or file path
      const fileFieldName = type === 'document' ? 'document' : 'receipt';
      const fileData = { [fileFieldName]: file.name }; // In real app, this would be file URL
      
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, ...fileData }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload ${type}: ${response.status}`);
      }
      
      const updatedApplication = await response.json();
      setApplications(applications.map(app => 
        app._id === id ? updatedApplication : app
      ));
      
      if (type === 'document') {
        setSelectedFile(file);
      } else {
        setSelectedReceipt(file);
      }
      
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      alert(`Failed to upload ${type}. Please try again.`);
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
    setEditingStatus(e.target.value);
  };

  const saveStatus = (id) => {
    updateStatus(id, editingStatus);
  };

  // Function to open the remark modal
  const openRemarkModal = (application) => {
    setSelectedApplicationId(application._id);
    setCurrentRemark(application.remark || "");
    setShowRemarkModal(true);
  };

  // Function to handle view status history
  const handleViewStatusHistory = (application) => {
    // Implementation for viewing status history
    alert("Status history feature would open here");
  };

  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="My Applications" 
            value={stats.total} 
            icon={<FiFile className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard 
            title="Pending Applications" 
            value={stats.pending} 
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

        {/* Applications Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
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
              <p className="mt-2 text-gray-500">Loading applications...</p>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      applications.slice().reverse().map((application, index) => (
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.date}</td>
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
                                <StatusBadge status={getCurrentStatus(application)} hexcode={application.initialStatus?.[0]?.hexcode} />
                                <button 
                                  onClick={() => startEditStatus(application)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Edit Status"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                                {(application.statusHistory?.length > 0 || application.currentStatus) && (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{application.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.document ? (
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500">Uploaded</span>
                              </div>
                            ) : (
                              <FileUpload 
                                id={application._id} 
                                type="document" 
                                onChange={handleFileChange} 
                                file={application.document}
                                status={application.status}
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.receipt ? (
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500">Uploaded</span>
                              </div>
                            ) : (
                              <FileUpload 
                                id={application._id} 
                                type="receipt" 
                                onChange={handleFileChange} 
                                file={application.receipt}
                                status={application.status}
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => openRemarkModal(application)}
                              className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                            >
                              <FiMessageSquare className="h-3 w-3 mr-1" /> 
                              {application.remark ? "EDIT REMARK" : "ADD REMARK"}
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

      {/* Remark Modal */}
      {showRemarkModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add Remark
                    </h3>
                    <div className="mt-4 w-full">
                      <textarea
                        className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                        rows="4"
                        placeholder="Enter your remark here..."
                        value={currentRemark}
                        onChange={(e) => setCurrentRemark(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => updateRemark(selectedApplicationId, currentRemark)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRemarkModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`${color} overflow-hidden rounded-lg shadow`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
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

// File Upload Component with conditional viewing
function FileUpload({ id, type, onChange, file, status }) {
  return (
    <div className="flex items-center">
      {file ? (
        <div className="flex items-center">
          <span className="text-sm text-gray-500">Uploaded</span>
        </div>
      ) : (
        <label className="cursor-pointer">
          <div className="flex items-center space-x-1">
            <FiUpload className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Choose File</span>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => onChange(e, id, type)}
          />
        </label>
      )}
    </div>
  );
}