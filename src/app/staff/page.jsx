"use client";

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiUpload, FiFile, FiCheckCircle, FiClock, FiUserCheck, FiEdit, FiSave, FiX } from 'react-icons/fi';

export default function StaffDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  // Add state for editing application status
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");

  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";

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
      
      // Filter applications assigned to current staff ("You")
      // In a real app, you'd use authenticated user data
      setApplications(data);
      
      // Calculate stats
      const pendingApps = data.filter(app => app.status !== "Completed").length;
      const completedApps = data.filter(app => app.status === "Completed").length;
      
      setStats({
        total: data.length,
        pending: pendingApps,
        completed: completedApps
      });
      
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log("my =",applications)
  // Update application status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }
      
      const updatedApplication = await response.json();
      setApplications(applications.map(app => 
        app._id === id ? updatedApplication : app
      ));
      
      // Reset editing state
      setEditingStatusId(null);
      setEditingStatus("");
      
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
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

  // Handle edit status mode
  const startEditStatus = (application) => {
    setEditingStatusId(application._id);
    setEditingStatus(application.status);
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
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <tr key={application._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingStatusId === application._id ? (
                              <div className="flex items-center space-x-2">
                                <select
                                  value={editingStatus}
                                  onChange={handleStatusChange}
                                  className="text-xs border border-gray-300 rounded p-1"
                                >
                                  <option value="Initiated">Initiated</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="HSM Authentication">HSM Authentication</option>
                                  <option value="In Pursuit">In Pursuit</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Rejected">Rejected</option>
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
                            ) : (
                              <div className="flex items-center space-x-2">
                                <StatusBadge status={application.status} />
                                <button 
                                  onClick={() => startEditStatus(application)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
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
                            <div className="flex justify-center">
                              {application.status !== "Completed" && (
                                <button 
                                  onClick={() => updateStatus(application._id, "Completed")}
                                  className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs"
                                >
                                  Complete
                                </button>
                              )}
                              {application.status === "Completed" && (
                                <button 
                                  onClick={() => updateStatus(application._id, "In Progress")}
                                  className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs"
                                >
                                  Reopen
                                </button>
                              )}
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