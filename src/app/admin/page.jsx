// app/dashboard/page.jsx
"use client";

import { useSession } from '@/context/SessionContext';
import { useState, useEffect } from 'react';
import { FiRefreshCw,FiSave ,FiDownload ,FiMessageSquare ,FiPlus ,FiEye, FiX , FiUpload, FiFile, FiCheckCircle, FiClock, FiDollarSign, FiTrash2, FiEdit } from 'react-icons/fi';

export default function Dashboard() {
  const {data:session}=useSession()
  const [applications, setApplications] = useState([]);
  const [currentStaffName, setCurrentStaffName] = useState(session?.user?.name);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
   const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);
    const [editingStatusId, setEditingStatusId] = useState(null);
      const [editingStatus, setEditingStatus] = useState(combinedStatusOptions[0]?.name || '');
  const [statusReason, setStatusReason] = useState("");
  const [showReasonField, setShowReasonField] = useState(false);
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
  // Stats counters for dashboard
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    completed: 0,
    funding: 0
  });

  // Add state for editing application
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    delivery: "",
    status: "",
    service: "",
    staff: "",
    amount: ""
  });
const [formDate,setFomatDate]=useState("Loading")
  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";

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
      console.log("application",data);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayApps = data.filter(app => app.date?.includes(today)).length;
      const completedApps = data.filter(app => app.status === "Completed").length;
      const fundingApps = data.filter(app => !app.receipt).length;
      
      setStats({
        total: data.length,
        today: todayApps,
        completed: completedApps,
        funding: fundingApps
      });
      
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  function formatDate(dateString) {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }
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
   const handleDocRemark = (docKey) => {
    setSelectedDoc(docKey);
    setDocRemarks(detailsApplication?.docRemarks?.[docKey] || []);
    setIsDocRemarkModalOpen(true);
  };
  const saveStatus = (id) => {
    console.log(editingStatus)
    updateStatus(id, editingStatus, statusReason);
  };
  // Create new application
  const createApplication = async (applicationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create application: ${response.status}`);
      }
      
      const newApplication = await response.json();
      setApplications([...applications, newApplication]);
      return newApplication;
    } catch (err) {
      console.error("Error creating application:", err);
      throw err;
    }
  };

  // Update existing application
  const updateApplication = async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, ...updateData }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update application: ${response.status}`);
      }
      
      const updatedApplication = await response.json();
      setApplications(applications.map(app => 
        app._id === id ? updatedApplication : app
      ));
      return updatedApplication;
    } catch (err) {
      console.error("Error updating application:", err);
      throw err;
    }
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
  // Delete application
  const deleteApplication = async (id) => {
    console.log(id);
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete application: ${response.status}`);
      }
      else{
        alert(" deletion done");
      }
      
      await response.json(); // Process response if needed
      setApplications(applications.filter(app => app._id !== id));
      
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application. Please try again.");
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
      
      await updateApplication(id, fileData);
      
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
    return application.service.status;
  };
  // const updateStatus = async (id, newStatus) => {
  //   try {
  //     await updateApplication(id, { status: newStatus });
  //   } catch (err) {
  //     alert("Failed to update status. Please try again.");
  //   }
  // };
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
   const handleViewDetails = (application) => {
    console.log(application)
    setDetailsApplication(application);
    setIsDetailsModalOpen(true);
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
  const handleEdit = (application) => {
    setEditingApp(application);
    setFormData({
      name: application.name || "",
      provider: application.provider || "",
      delivery: application.delivery || "",
      status: application.status || "",
      service: application.service || "",
      staff: application.staff || "",
      amount: application.amount || ""
    });
  };
  const getCurrentStatus = (application) => {
    return application.initialStatus?.[0]?.name || "Initiated";
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  // Function to add document remark - Fixed implementation
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingApp) {
        await updateApplication(editingApp._id, formData);
      } else {
        await createApplication({
          ...formData,
          date: new Date().toISOString().split('T')[0] // Set current date
        });
      }
      
      // Reset form
      setEditingApp(null);
      setFormData({
        name: "",
        provider: "",
        delivery: "",
        status: "",
        service: "",
        staff: "",
        amount: ""
      });
      
    } catch (err) {
      alert(`Failed to ${editingApp ? 'update' : 'create'} application. Please try again.`);
    }
  };

  const cancelEdit = () => {
    setEditingApp(null);
    setFormData({
      name: "",
      provider: "",
      delivery: "",
      status: "",
      service: "",
      staff: "",
      amount: ""
    });
  };

  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);
  console.log(applications)
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
  const openViewModal = (application) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Applications" 
            value={stats.total} 
            icon={<FiFile className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard 
            title="Today's Applications" 
            value={stats.today} 
            icon={<FiClock className="h-6 w-6 text-green-500" />}
            color="bg-green-100"
          />
          <StatCard 
            title="Completed Applications" 
            value={stats.completed} 
            icon={<FiCheckCircle className="h-6 w-6 text-purple-500" />}
            color="bg-purple-100"
          />
          <StatCard 
            title="Pending Documents" 
            value={stats.funding} 
            icon={<FiDollarSign className="h-6 w-6 text-yellow-500" />}
            color="bg-yellow-100"
          />
        </div>

        {/* Application Form */}
        {/* <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingApp ? "Edit Application" : "Add New Application"}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Provider</label>
              <input
                type="text"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
              <input
                type="date"
                name="delivery"
                value={formData.delivery}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Status</option>
                <option value="Initiated">Initiated</option>
                <option value="In Progress">In Progress</option>
                <option value="HSM Authentication">HSM Authentication</option>
                <option value="In Pursuit">In Pursuit</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Staff</label>
              <input
                type="text"
                name="staff"
                value={formData.staff}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                step="0.01"
                required
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-3 mt-4">
              {editingApp && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                {editingApp ? "Update Application" : "Add Application"}
              </button>
            </div>
          </form>
        </div> */}

        {/* Applications Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="12" className="px-6 py-4 text-center text-gray-500">
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      applications.slice().reverse().map((application, index) => (
                        <tr key={application._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application?.provider[0]?.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  {formatDate(application.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
                          <td className="px-6 py-4 whitespace-nowrap"> {editingStatusId === application._id ? (
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
                                                       )}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {typeof application.service === 'object' 
    ? application.service.name || JSON.stringify(application.service) 
    : application.service}
</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.staff[0].name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{application.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <FileUpload 
                              id={application._id} 
                              type="document" 
                              onChange={handleFileChange} 
                              file={application.document}
                              status={application.status}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <FileUpload 
                              id={application._id} 
                              type="receipt" 
                              onChange={handleFileChange} 
                              file={application.receipt}
                              status={application.status}
                            />
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            <div className="flex justify-center space-x-2 gap-3">
                              {/* <button 
                                onClick={() => handleEdit(application)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <FiEdit className="h-5 w-5" />
                              </button> */}
                                 <button onClick={() => openViewModal(application)} className="text-blue-600 hover:text-blue-900">
                                                          <FiEye className="h-5 w-5"/>
                                                        </button>
                              <button 
                                onClick={() => deleteApplication(application._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                              
                              {/* {application.status !== "Completed" && (
                                <button 
                                  onClick={() => updateStatus(application._id, "Completed")}
                                  className="text-green-600 hover:text-green-900"
                                  title="Mark as Completed"
                                >
                                  <FiCheckCircle className="h-5 w-5" />
                                </button>
                              )} */}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
          )}
        </div>
      </div>
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
function StatusBadge({ status }) {
  let color = "bg-gray-100 text-gray-800";
  if (status === "Completed") color = "bg-green-100 text-green-800";
  if (status === "In Progress") color = "bg-blue-100 text-blue-800";
  if (status === "Rejected") color = "bg-red-100 text-red-800";
  if (status === "HSM Authentication") color = "bg-yellow-100 text-yellow-800";
  if (status === "Initiated") color = "bg-purple-100 text-purple-800";
  if (status === "In Pursuit") color = "bg-indigo-100 text-indigo-800";
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {status || "Unknown"}
    </span>
  );
}

// File Upload Component with conditional viewing
function FileUpload({ id, type, onChange, file, status }) {
  // Only show view document if status is Completed and it's a document
  const canViewDocument = status === "Completed" && type === "document";
  
  // Show view receipt if status is Completed or In Progress and it's a receipt
  const canViewReceipt = (status === "Completed" || status === "In Progress") && type === "receipt";

  return (
    <div className="flex items-center">
      {file ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Uploaded</span>
          {(canViewDocument || canViewReceipt) && (
            <button className="text-indigo-600 hover:text-indigo-900 text-sm">
              View
            </button>
          )}
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