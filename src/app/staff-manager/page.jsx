"use client";

import { useSession } from '@/context/SessionContext';
import { useState, useEffect } from 'react';
import { FiRefreshCw, FiFile,FiDownload , FiCheckCircle, FiClock, FiUser, FiEdit2, FiEdit, FiSave, FiX, FiList, FiMessageSquare, FiEye, FiPlus } from 'react-icons/fi';

export default function StaffManagerDashboard() {
  const {session} = useSession()
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
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);


 
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
      const [detailsApplication, setDetailsApplication] = useState(null);
   const [isDocRemarkModalOpen, setIsDocRemarkModalOpen] = useState(false);
     const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [docRemarks, setDocRemarks] = useState([]);
    const [newDocRemark, setNewDocRemark] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
      const [showRemarkModal, setShowRemarkModal] = useState(false);
     const [showDocumentRemarkModal, setShowDocumentRemarkModal] = useState(false);
      const [selectedDocument, setSelectedDocument] = useState(null);
      const [documentRemarks, setDocumentRemarks] = useState([]);
      const [newDocumentRemark, setNewDocumentRemark] = useState("");
  // Add state for remarks
    const [currentStaffName, setCurrentStaffName] = useState(session?.user?.name);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [isViewRemarksModalOpen, setIsViewRemarksModalOpen] = useState(false);
  const [newRemarkText, setNewRemarkText] = useState("");
    const [currentRemark, setCurrentRemark] = useState("");
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const API_BASE_URL = " https://dokument-guru-backend.vercel.app/api/application";
  const STAFF_API_URL = "https://dokument-guru-backend.vercel.app/api/admin/staff/fetch-all-staff";

  // Stats counters for dashboard
  const [stats, setStats] = useState({
    total: 0,
    unassigned: 0,
    inProgress: 0,
    completed: 0
  });
  console.log("sess = ",session)
  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/filter?location=${session?.user?.city}`);
      
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
console.log("appi",applications)
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
    console.log(application)
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
          reason: statusDetails.askreason ? reason : "",
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
  const addDocumentRemark = async () => {
  if (!newDocumentRemark.trim()) return;
  
  try {
    // Find the current document in the application and update it with the new remark
    const updatedDocuments = selectedApplication.document.map(doc => {
      if (doc._id === selectedDocument._id) {
        return { 
          ...doc, 
          remark: newDocumentRemark 
        };
      }
      return doc;
    });
    
    // Create new remark history entry
    const newRemarkHistory = {
      text: newDocumentRemark,
      documentId: selectedDocument._id,
      addedBy: session?.user?._id,
      addedAt: new Date()
    };

    // Prepare the update payload
    const updatePayload = {
      ...selectedApplication,
      document: updatedDocuments,
      remarkHistory: [...(selectedApplication.remarkHistory || []), newRemarkHistory]
    };

    const response = await fetch(`${API_BASE_URL}/update/${selectedApplication._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      throw new Error('Failed to update remarks');
    }

    const updatedApplication = await response.json();
    
    // Update local state
    setApplications(applications.map(app => 
      app._id === selectedApplication._id ? updatedApplication : app
    ));

    // Update the selected application state
    setSelectedApplication(updatedApplication);

    // Update document remarks in the modal
    setDocumentRemarks([newDocumentRemark]);
    
    // Clear input field
    setNewDocumentRemark("");
    
    // Show success message
    alert('Remark added successfully');
    setShowDocumentRemarkModal(false)
    setShowViewModal(false)

    fetchApplications()
  } catch (err) {
    console.error("Error adding document remark:", err);
    alert("Failed to add remark. Please try again.");
  }
};
   const openRemarkModal = (application) => {
    setSelectedApplicationId(application?._id);
    setCurrentRemark(application?.remark || "");
    setShowRemarkModal(true);
  };
  // Update staff assignment
  const updateAssignment = async (applicationId, staffId, staffName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          staff: {
            name: staffName,
            id: staffId
          } 
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
    console.log(filteredStaffMembers)
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
   const openViewModal = (application) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };
  const cancelEditStatus = () => {
    setEditingStatusId(null);
    setEditingStatus("");
    setStatusReason("");
    setShowReasonField(false);
    setCombinedStatusOptions([]);
  };
   const openDocumentRemarkModal = (document, application) => {
  // Find the document object from the application.document array
  // This is where the issue was - we need to properly find the document
  const docObj = application.document.find(doc => doc._id === document._id);
  
  setSelectedDocument({
    _id: document._id,
    name: document.name,
    remark: docObj?.remark || ""
  });
  
  // Set selected application for context
  setSelectedApplication(application);
  
  // If there is a remark, add it to documentRemarks array
  // This ensures we properly display existing remarks
  if (docObj?.remark) {
    setDocumentRemarks([docObj.remark]);
  } else {
    setDocumentRemarks([]);
  }
  
  setShowDocumentRemarkModal(true);
};
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEditingStatus(newStatus);
    const statusOption = combinedStatusOptions.find(option => option.name === newStatus);
    setShowReasonField(statusOption?.askreason || false);
  };

  const saveStatus = (id) => {
    const statusDetails = combinedStatusOptions.find(option => option.name === editingStatus);
  
  if (statusDetails?.askreason && !statusReason.trim()) {
    alert("Please provide a reason for this status change");
    return;
  }
    updateStatus(id, editingStatus, statusReason);
  };

  useEffect(() => {
    fetchApplications();
    fetchStaffMembers();
  }, []);
  
  const getCurrentStatus = (application) => {
    return application.initialStatus?.[0]?.name || "Initiated";
  };
  
  // Function to get staff name display (handles both string and object)
  const getStaffName = (staff) => {
    if (!staff) return "Not Assigned";
    if (typeof staff === 'string') return staff;
    if (typeof staff === 'object') return staff[0].name || "Not Assigned";
    return "Not Assigned";
  };
  
  // Add a new remark to application
  const addRemark = async () => {
    if (!selectedApplication || !newRemarkText.trim()) {
      alert("Please enter a remark");
      return;
    }

    try {
      const currentApp = applications.find(app => app._id === selectedApplication._id);
      if (!currentApp) throw new Error("Application not found");
      
      // Create a new remark object
      const newRemark = {
        id: Date.now().toString(), // Generate a temporary ID
        text: newRemarkText,
        createdAt: new Date().toISOString(),
        createdBy: "Staff Manager" // You can replace with actual user info
      };
      
      // Get existing remarks or initialize empty array
      const existingRemarks = currentApp.remarks || [];
      
      // Update with new remarks array including the new remark
      const updatePayload = {
        remarks: [...existingRemarks, newRemark]
      };

      const response = await fetch(`${API_BASE_URL}/update/${selectedApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      
      if (!response.ok) throw new Error(`Failed to add remark: ${response.status}`);
      
      const updatedApplication = await response.json();
      
      setApplications(applications.map(app => 
        app._id === updatedApplication._id ? {
          ...app,
          ...updatedApplication,
          remarks: updatedApplication.remarks || []
        } : app
      ));
      
      fetchApplications();
      
      setIsRemarkModalOpen(false);
      setNewRemarkText("");
      
    } catch (err) {
      console.error("Error adding remark:", err);
      alert("Failed to add remark. Please try again.");
    }
  };

  const handleAddRemark = (application) => {
    setSelectedApplication(application);
    setNewRemarkText("");
    setIsRemarkModalOpen(true);
  };
  
  const handleViewRemarks = (application) => {
    console.log(application)
    setSelectedApplication(application);
    setIsViewRemarksModalOpen(true);
  };

  // Get the latest remark for display in the table
  const getLatestRemark = (application) => {
    if (!application.remarks || !Array.isArray(application.remarks) || application.remarks.length === 0) {
      return application.remark || null; // Fallback to old remark field if exists
    }
    
    // Sort remarks by date and return the latest one
    const sortedRemarks = [...application.remarks].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    return sortedRemarks[0];
  };

  // Open details modal
  const handleViewDetails = (application) => {
    console.log(application)
    setDetailsApplication(application);
    setIsDetailsModalOpen(true);
  };

  // Open document remark modal
  const handleDocRemark = (docKey) => {
    setSelectedDoc(docKey);
    setDocRemarks(detailsApplication?.docRemarks?.[docKey] || []);
    setIsDocRemarkModalOpen(true);
  };

  // Add a remark to a document
  const addDocRemark = async () => {
    if (!newDocRemark.trim() || !selectedDoc || !detailsApplication) return;
    
    try {
      // Create the updated document array with the new remark
      const updatedDocuments = detailsApplication.document.map(doc => {
        if (doc._id === selectedDoc) {
          // Add the new remark to the document's remarks array
          return {
            ...doc,
            remark: newDocRemark
          };
        }
        return doc;
      });

      // Prepare the form data to send to the backend
      const updatePayload = {
        ...detailsApplication,
        document: updatedDocuments
      };

      const response = await fetch(`${API_BASE_URL}/update/${detailsApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      console.log(response)
      if (!response.ok) throw new Error(`Failed to add document remark: ${response.status}`);
      
      const updatedApplication = await response.json();
      
      // Update the local state
      setDetailsApplication(updatedApplication);
      setApplications(applications.map(app => 
        app._id === updatedApplication._id ? updatedApplication : app
      ));
      
      // Reset the remark input and close the modal
      setNewDocRemark("");
      setIsDocRemarkModalOpen(false);
      
    } catch (err) {
      console.error("Error adding document remark:", err);
      alert("Failed to add document remark. Please try again.");
    }
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
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
                      applications.slice().reverse().map((application, index) => {
                        const latestRemark = getLatestRemark(application);
                        const remarkCount = (application.remarks && Array.isArray(application.remarks)) 
                          ? application.remarks.length 
                          : (application.remark ? 1 : 0);
                        
                        return (
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
                                    reason={application.initialStatus?.[0]?.reason}
 
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
                                  {getStaffName(application.staff)}
                                </span>
                                <button 
                                  onClick={() => handleAssignStaff(application)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button onClick={() => openViewModal(application)} className="text-blue-600 hover:text-blue-900">
                                <FiEye />
                              </button>
                            </td>
                          </tr>
                        );
                      })
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
                      onClick={() => updateAssignment(selectedApplication._id, staff.id, staff.name)}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 
                        ${
                          // Compare staff name with the application's assigned staff
                          (typeof selectedApplication.staff === 'object' && selectedApplication.staff?.name === staff.name) ||
                          selectedApplication.staff === staff.name
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200'
                        }`}
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

       {/* {isStatusHistoryModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Status History
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 ? (
                  [...selectedApplication.statusHistory].reverse().map((status, idx) => (
                    <div key={idx} className="border-l-4 pl-3 py-2" style={{borderColor: status.hexcode || '#CBD5E0'}}>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">{status.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(status.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      {status.reason && (
                        <p className="text-sm text-gray-600 mt-1">Reason: {status.reason}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No status history available
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsStatusHistoryModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )} */}

{isStatusHistoryModalOpen && selectedApplication && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Status History
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 ? (
          [...selectedApplication.statusHistory].reverse().map((status, idx) => (
            <div key={idx} className="border-l-4 pl-3 py-2" style={{borderColor: status.hexcode || '#CBD5E0'}}>
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">{status.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(status.updatedAt).toLocaleString()}
                </span>
              </div>
              {status.reason && (
                <div className="mt-2">
                  <button 
                    onClick={() => alert(`Reason: ${status.reason}`)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiMessageSquare className="mr-1 h-3 w-3" />
                    View Reason
                  </button>
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
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsStatusHistoryModalOpen(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

        {/* Add Remark Modal */}
        {isRemarkModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Remark to Application
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark
                </label>
                <textarea
                  value={newRemarkText}
                  onChange={(e) => setNewRemarkText(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your remark here..."
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsRemarkModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={addRemark}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Remark
                </button>
              </div>
            </div>
          </div>
        )}

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
       
             {/* Add View Modal */}
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
                           
                           {/* Applicant Information */}
                           <div className="grid grid-cols-2 gap-4 mb-6">
                             <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                               <h4 className="text-sm font-medium text-gray-500">Applicant Name</h4>
                               <p className="mt-1 text-sm font-medium text-gray-900">{selectedApplication.name}</p>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                               <h4 className="text-sm font-medium text-gray-500">Application Date</h4>
                               <p className="mt-1 text-sm font-medium text-gray-900">{selectedApplication.date}</p>
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
                                       <div className="flex items-center space-x-2">
                                         <button
                                           onClick={() => openDocumentRemarkModal(doc, selectedApplication)}
                                           className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center"
                                         >
                                           <FiMessageSquare className="mr-1 h-3 w-3" /> 
                                           {doc.remark ? "View Remark" : "Add Remark"}
                                         </button>
                                         <button
                                           className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center"
                                         >
                                           <FiDownload className="mr-1 h-3 w-3" /> Download
                                         </button>
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
                           <div className="mb-6">
                             <h4 className="text-lg font-medium text-gray-700 mb-3">Application Remarks</h4>
                             <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                               {selectedApplication.remark ? (
                                 <div className="bg-white p-3 rounded border border-gray-200">
                                   <p className="text-sm">{selectedApplication.remark}</p>
                                   <div className="mt-2 flex items-center text-xs text-gray-500">
                                     <FiUserCheck className="mr-1" />
                                     <span>
                                       Added by: {currentStaffName || "Staff"} 
                                     </span>
                                   </div>
                                 </div>
                               ) : (
                                 <div className="text-center py-4">
                                   <p className="text-sm text-gray-500">No remarks added</p>
                                   <button
                                     onClick={() => openRemarkModal(selectedApplication)}
                                     className="mt-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded flex items-center mx-auto"
                                   >
                                     <FiMessageSquare className="mr-1 h-4 w-4" /> Add Remark
                                   </button>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                       <button
                         type="button"
                         className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                         onClick={() => setShowViewModal(false)}
                       >
                         Close
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             )}
       
             {/* Document Remark Modal */}
          {showDocumentRemarkModal && selectedDocument && (
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
                     <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                       {selectedDocument.name} - Document Remarks
                     </h3>
                     
                     {/* Existing remarks section - Fixed to properly display remarks */}
                     <div className="mt-4 max-h-40 overflow-y-auto">
                       {documentRemarks.length > 0 ? (
                         documentRemarks.map((remark, index) => (
                           <div key={index} className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
                             <p className="text-sm">{remark}</p>
                            
                           </div>
                         ))
                       ) : (
                         <p className="text-sm text-gray-500 italic">No remarks added for this document</p>
                       )}
                     </div>
                     
                     {/* Add new remark section */}
                     <div className="mt-4 w-full">
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Add New Remark
                       </label>
                       <textarea
                         className="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                         rows="3"
                         placeholder="Enter document remark here..."
                         value={newDocumentRemark}
                         onChange={(e) => setNewDocumentRemark(e.target.value)}
                       ></textarea>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                 <button
                   type="button"
                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                   onClick={addDocumentRemark}
                 >
                   Save Remark
                 </button>
                 <button
                   type="button"
                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                   onClick={() => setShowDocumentRemarkModal(false)}
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatusBadge Component
// function StatusBadge({ status, hexcode }) {
//   // Default color based on status names, fallback to hexcode if provided
//   const getDefaultColor = (status) => {
//     switch(status.toLowerCase()) {
//       case 'completed': return '#10B981'; // green
//       case 'in progress': return '#F59E0B'; // yellow
//       case 'initiated': return '#6366F1'; // indigo
//       case 'on hold': return '#EF4444'; // red
//       case 'rejected': return '#EF4444'; // red
//       case 'cancelled': return '#6B7280'; // gray
//       default: return '#6366F1'; // indigo as default
//     }
//   };
  
//   const bgColor = hexcode || getDefaultColor(status);
  
//   return (
//     <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
//       style={{ 
//         backgroundColor: `${bgColor}20`, // 20% opacity of the color
//         color: bgColor 
//       }}>
//       {status}
//     </span>
//   );
// }

function StatusBadge({ status, hexcode, reason }) {
  const [showReasonModal, setShowReasonModal] = useState(false);
  
  const getDefaultColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': return '#10B981'; // green
      case 'in progress': return '#F59E0B'; // yellow
      case 'initiated': return '#6366F1'; // indigo
      case 'on hold': return '#EF4444'; // red
      case 'rejected': return '#EF4444'; // red
      case 'cancelled': return '#6B7280'; // gray
      default: return '#6366F1'; // indigo as default
    }
  };
  
  const bgColor = hexcode || getDefaultColor(status);
  
  return (
    <>
      <div className="flex items-center">
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
          style={{ 
            backgroundColor: `${bgColor}20`, // 20% opacity of the color
            color: bgColor 
          }}>
          {status}
        </span>
        {reason && (
          <button 
            className="ml-1 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setShowReasonModal(true);
            }}
            title="View reason"
          >
            <FiMessageSquare className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowReasonModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiMessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg capitalize leading-6 font-medium text-gray-900">
                      Status : {status}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm capitalize text-gray-500">
                       Reason : {reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowReasonModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}