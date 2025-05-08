"use client";

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiFile, FiCheckCircle, FiClock, FiUser, FiEdit2, FiEdit, FiSave, FiX, FiList, FiMessageSquare, FiEye, FiPlus } from 'react-icons/fi';

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

  // Add state for remarks
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [isViewRemarksModalOpen, setIsViewRemarksModalOpen] = useState(false);
  const [newRemarkText, setNewRemarkText] = useState("");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsApplication, setDetailsApplication] = useState(null);
  const [isDocRemarkModalOpen, setIsDocRemarkModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docRemarks, setDocRemarks] = useState([]);
  const [newDocRemark, setNewDocRemark] = useState("");

  const API_BASE_URL = "http://localhost:3001/api/application";
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
  // Add a remark to a document
const addDocRemark = async (applicationId,documentId) => {
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button onClick={() => handleViewDetails(application)} className="text-blue-600 hover:text-blue-900">
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

        {/* Add Remark Modal */}
        {isDocRemarkModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Document Remarks
      </h3>
      <div className="max-h-60 overflow-y-auto mb-4">
        {docRemarks.length > 0 ? (
          <ul className="space-y-3">
            {docRemarks.map((remark, idx) => (
              <li key={idx} className="border-b border-gray-100 pb-2">
                <p className="text-sm text-gray-800">{remark.text}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {remark.createdBy || 'Staff'} - {new Date(remark.date).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">No remarks available</div>
        )}
      </div>
      <textarea
        value={newDocRemark}
        onChange={e => setNewDocRemark(e.target.value)}
        rows={3}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-3"
        placeholder="Add a remark about this document..."
      />
      <div className="flex justify-end space-x-3">
        <button 
          onClick={() => {
            setIsDocRemarkModalOpen(false);
            setNewDocRemark("");
          }} 
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button 
          onClick={addDocRemark} 
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" 
          disabled={!newDocRemark.trim()}
        >
          Add Remark
        </button>
      </div>
    </div>
  </div>
)}

        {/* View Remarks Modal */}
        {isViewRemarksModalOpen && selectedApplication && (
          
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Remarks for {selectedApplication.name}
              </h3>
              
              <div className="max-h-96 overflow-y-auto">
                {selectedApplication.remarks && selectedApplication.remarks.length > 0 ? (
                  <ul className="space-y-4">
                    {selectedApplication.remarks.map((remark, index) => (
                      <li key={index} className="border-b border-gray-100 pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{remark.text}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {remark.createdBy || 'Staff'} - {new Date(remark.createdAt).toLocaleDateString()}
                              </span>
                              {remark.updatedAt && (
                                <span className="text-xs text-gray-400 ml-2">
                                  (Updated: {new Date(remark.updatedAt).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : selectedApplication.remark ? (
                  // Display old remark format if available
                  <div className="border-b border-gray-100 pb-3">
                    <p className="text-sm text-gray-800">{selectedApplication.remark}</p>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No remarks available
                  </div>
                )}
              </div>
              
              <div className="mt-5 flex justify-between">
                <button
                  onClick={() => handleAddRemark(selectedApplication)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                >
                  <FiPlus className="mr-1" /> Add New
                </button>
                <button
                  onClick={() => setIsViewRemarksModalOpen(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
{/* Details Modal */}
{isDetailsModalOpen && detailsApplication && (
  <div className="fixed inset-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
    <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-900">
          <span className="text-sm font-normal text-gray-500 block mb-1">Application Details</span>
          {detailsApplication.name}
        </h3>
        <button 
          onClick={() => setIsDetailsModalOpen(false)} 
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Applicant Info Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Name</p>
            <p className="font-medium text-gray-900">{detailsApplication.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone Number</p>
            <p className="font-medium text-gray-900">{detailsApplication.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-900">{detailsApplication.date ? new Date(detailsApplication.date).toLocaleDateString() : ''}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          {/* Removed phone number and address from here */}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
  <p className="text-sm font-medium text-gray-700 mb-3">Submitted Documents</p>
  <div className="space-y-3">
    {detailsApplication?.document?.map(doc => (
      <div key={doc._id} className="flex flex-col group">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{doc.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href={doc.view} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
            >
              View
            </a>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md transition-colors"
              onClick={() => {
                setSelectedDoc(doc._id);
                setDocRemarks(doc.remarks || []);
                setIsDocRemarkModalOpen(true);
              }}
            >
              {doc.remarks?.length ? `Remarks (${doc.remarks.length})` : 'Add Remark'}
            </button>
          </div>
        </div>
        {doc.remarks?.length > 0 && (
          <div className="ml-6 mt-1 text-xs text-gray-500">
            Latest remark: {doc.remarks[doc.remarks.length - 1].text}
          </div>
        )}
      </div>
    ))}
  </div>
</div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button 
          onClick={() => setIsDetailsModalOpen(false)} 
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors mr-3"
        >
          Close
        </button>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Approve Application
        </button>
      </div>
    </div>
  </div>
)}

        {/* Document Remark Modal */}
        {isDocRemarkModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Remarks for {selectedDoc}
              </h3>
              <div className="max-h-60 overflow-y-auto mb-4">
                {docRemarks.length > 0 ? (
                  <ul className="space-y-2">
                    {docRemarks.map((remark, idx) => (
                      <li key={idx} className="border-b border-gray-100 pb-2">
                        <p className="text-sm text-gray-800">{remark.text}</p>
                        <span className="text-xs text-gray-500">{new Date(remark.date).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500">No remarks available</div>
                )}
              </div>
              <textarea
                value={newDocRemark}
                onChange={e => setNewDocRemark(e.target.value)}
                rows={2}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2"
                placeholder="Add a remark..."
              />
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsDocRemarkModalOpen(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">Close</button>
                <button onClick={addDocRemark} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" disabled={!newDocRemark.trim()}>Add Remark</button>
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