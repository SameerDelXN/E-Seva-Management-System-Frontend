// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiUpload, FiFile, FiCheckCircle, FiClock, FiDollarSign, FiTrash2, FiEdit } from 'react-icons/fi';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
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

  const updateStatus = async (id, newStatus) => {
    try {
      await updateApplication(id, { status: newStatus });
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.provider}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.delivery}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={application.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {typeof application.service === 'object' 
    ? application.service.name || JSON.stringify(application.service) 
    : application.service}
</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.staff}</td>
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
                            <div className="flex justify-center space-x-2">
                              {/* <button 
                                onClick={() => handleEdit(application)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <FiEdit className="h-5 w-5" />
                              </button> */}
                              
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