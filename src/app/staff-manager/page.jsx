"use client";

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiFile, FiCheckCircle, FiClock, FiUser, FiEdit2, FiEdit, FiSave, FiX } from 'react-icons/fi';

export default function StaffManagerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add state for editing application status
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");

  // Modal state for staff assignment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [staffMembers] = useState([
    { id: 1, name: "John Doe", status: "Available" },
    { id: 2, name: "Sarah Smith", status: "Busy" },
    { id: 3, name: "Meera Shah", status: "Available" },
    { id: 4, name: "Alex Johnson", status: "Available" }
  ]);

  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";

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
      const inProgressApps = data.filter(app => app.status === "In Progress").length;
      const completedApps = data.filter(app => app.status === "Completed").length;
      
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

  // Update staff assignment
  const updateAssignment = async (applicationId, staffName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: applicationId, staff: staffName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update staff assignment: ${response.status}`);
      }
      
      const updatedApplication = await response.json();
      setApplications(applications.map(app => 
        app._id === applicationId ? updatedApplication : app
      ));
      
      setIsModalOpen(false);
      setSelectedApplication(null);
      
    } catch (err) {
      console.error("Error updating staff assignment:", err);
      alert("Failed to update staff assignment. Please try again.");
    }
  };

  const handleAssignStaff = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
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
  console.log(applications)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Manager Dashboard</h1>
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

        {/* Applications Section */}
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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

        {/* Staff Assignment Modal */}
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assign Staff to Application #{selectedApplication._id}
              </h3>
              <div className="space-y-3">
                {staffMembers.map(staff => (
                  <button
                    key={staff.id}
                    onClick={() => updateAssignment(selectedApplication._id, staff.name)}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 
                      ${selectedApplication.staff === staff.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center">
                      <FiUser className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="font-medium text-gray-900">{staff.name}</span>
                    </div>
                    <span className={`text-sm ${staff.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                      {staff.status}
                    </span>
                  </button>
                ))}
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