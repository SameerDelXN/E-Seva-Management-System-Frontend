"use client";

import { useSession } from '@/context/SessionContext';
import { useState, useEffect } from 'react';
import { FiRefreshCw, FiEye, FiX, FiFile, FiUpload, FiEdit, FiTrash2, FiClock, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

export default function DueApplications() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sortBy, setSortBy] = useState('daysOverdue'); // Default sort by days overdue
  const [sortDirection, setSortDirection] = useState('desc'); // Default sort direction

  // Stats for the due applications
  const [stats, setStats] = useState({
    total: 0,
    critical: 0, // More than 7 days overdue
    moderate: 0, // 3-7 days overdue
    recent: 0    // 0-2 days overdue
  });

  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }

  // Calculate days overdue
  function calculateDaysOverdue(deliveryDate) {
    if (!deliveryDate) return 0;
    
    const delivery = new Date(deliveryDate);
    if (isNaN(delivery.getTime())) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    // Calculate difference in days
    const diffTime = today.getTime() - delivery.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  // Get priority level based on days overdue
  function getPriorityLevel(daysOverdue) {
    if (daysOverdue > 7) return { level: 'Critical', color: 'text-red-600 bg-red-50' };
    if (daysOverdue >= 3) return { level: 'Moderate', color: 'text-orange-600 bg-orange-50' };
    return { level: 'Low', color: 'text-yellow-600 bg-yellow-50' };
  }

  // Fetch all applications and filter for past delivery dates
  const fetchDueApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/read`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter for applications with delivery date in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day
      
      const dueApps = data.filter(app => {
        if (!app.delivery) return false;
        console.log(app.delivery);
        
        // Parse the date correctly (assuming format is DD/MM/YYYY)
        const [day, month, year] = app.delivery.split('/').map(Number);
        const deliveryDate = new Date(year, month - 1, day); // Months are 0-indexed in JS
        
        if (isNaN(deliveryDate.getTime())) return false;
        console.log(deliveryDate);
        
        return deliveryDate < today;
      });
      
      // Add daysOverdue property to each application
      const appsWithOverdue = dueApps.map(app => {
        const [day, month, year] = app.delivery.split('/').map(Number);
        const deliveryDate = new Date(year, month - 1, day);
        return {
          ...app,
          daysOverdue: calculateDaysOverdue(deliveryDate)
        };
      });
      
      // Sort the applications based on the current sort criteria
      const sortedApps = sortApplications(appsWithOverdue, sortBy, sortDirection);
      setApplications(sortedApps);
      
      // Calculate stats
      const criticalApps = appsWithOverdue.filter(app => app.daysOverdue > 7).length;
      const moderateApps = appsWithOverdue.filter(app => app.daysOverdue >= 3 && app.daysOverdue <= 7).length;
      const recentApps = appsWithOverdue.filter(app => app.daysOverdue < 3).length;
      
      setStats({
        total: dueApps.length,
        critical: criticalApps,
        moderate: moderateApps,
        recent: recentApps
      });
      
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sort applications based on selected criteria
  const sortApplications = (apps, sortField, direction) => {
    return [...apps].sort((a, b) => {
      let compareA, compareB;
      
      switch (sortField) {
        case 'daysOverdue':
          compareA = a.daysOverdue || 0;
          compareB = b.daysOverdue || 0;
          break;
        case 'name':
          compareA = a.name || '';
          compareB = b.name || '';
          return direction === 'asc' 
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
        case 'deliveryDate':
          compareA = a.delivery ? new Date(a.delivery).getTime() : 0;
          compareB = b.delivery ? new Date(b.delivery).getTime() : 0;
          break;
        case 'amount':
          compareA = parseFloat(a.amount) || 0;
          compareB = parseFloat(b.amount) || 0;
          break;
        default:
          compareA = a.daysOverdue || 0;
          compareB = b.daysOverdue || 0;
      }
      
      return direction === 'asc' ? compareA - compareB : compareB - compareA;
    });
  };

  // Handle sort changes
  const handleSort = (field) => {
    if (sortBy === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, set new sort field and default direction
      setSortBy(field);
      setSortDirection('desc');
    }
    
    // Re-sort applications with new criteria
    const sorted = sortApplications(applications, field, 
      sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setApplications(sorted);
  };

  // Delete application
  const deleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete application: ${response.status}`);
      }
      
      await response.json(); // Process response if needed
      setApplications(applications.filter(app => app._id !== id));
      
      // Update stats
      const app = applications.find(a => a._id === id);
      if (app) {
        const daysOverdue = app.daysOverdue || 0;
        setStats(prevStats => ({
          total: prevStats.total - 1,
          critical: daysOverdue > 7 ? prevStats.critical - 1 : prevStats.critical,
          moderate: daysOverdue >= 3 && daysOverdue <= 7 ? prevStats.moderate - 1 : prevStats.moderate,
          recent: daysOverdue < 3 ? prevStats.recent - 1 : prevStats.recent
        }));
      }
      
      alert("Application deleted successfully");
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application. Please try again.");
    }
  };

  // Open application details modal
  const openViewModal = (application) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  // Get current status of application
  const getCurrentStatus = (application) => {
    return application.initialStatus?.[0]?.name || "Initiated";
  };

  // Load applications on component mount
  useEffect(() => {
    fetchDueApplications();
  }, []);

  // Update sort when sort criteria changes
  useEffect(() => {
    if (applications.length > 0) {
      const sorted = sortApplications(applications, sortBy, sortDirection);
      setApplications(sorted);
    }
  }, [sortBy, sortDirection]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Overdue Applications</h1>
            {/* <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
              Back to Dashboard
            </Link> */}
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Overdue" 
            value={stats.total} 
            icon={<FiClock className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard 
            title="Critical Priority" 
            value={stats.critical} 
            icon={<FiAlertTriangle className="h-6 w-6 text-red-500" />}
            color="bg-red-100"
            subtitle=">7 days overdue"
          />
          <StatCard 
            title="Moderate Priority" 
            value={stats.moderate} 
            icon={<FiAlertTriangle className="h-6 w-6 text-orange-500" />}
            color="bg-orange-100"
            subtitle="3-7 days overdue"
          />
          <StatCard 
            title="Low Priority" 
            value={stats.recent} 
            icon={<FiAlertTriangle className="h-6 w-6 text-yellow-500" />}
            color="bg-yellow-100"
            subtitle="<3 days overdue"
          />
        </div>

        {/* Applications Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Overdue Applications</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Total: {applications.length}</span>
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
              <p className="mt-2 text-gray-500">Loading applications...</p>
            </div>
          ) : (
            /* Table */
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sr.
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Applicant Name
                          {sortBy === 'name' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('deliveryDate')}
                      >
                        <div className="flex items-center">
                          Delivery Date
                          {sortBy === 'deliveryDate' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('daysOverdue')}
                      >
                        <div className="flex items-center">
                          Days Overdue
                          {sortBy === 'daysOverdue' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center">
                          Amount
                          {sortBy === 'amount' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                          No overdue applications found
                        </td>
                      </tr>
                    ) : (
                      applications.map((application, index) => {
                        const priority = getPriorityLevel(application.daysOverdue);
                        return (
                          <tr key={application._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {application.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {application?.provider?.[0]?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {application.delivery}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                              {application.daysOverdue} days
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priority.color}`}>
                                {priority.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={getCurrentStatus(application)} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {typeof application.service === 'object' 
                                ? application.service.name || JSON.stringify(application.service) 
                                : application.service}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{application.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                              <div className="flex justify-center space-x-2 gap-3">
                                <button 
                                  onClick={() => openViewModal(application)} 
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View Details"
                                >
                                  <FiEye className="h-5 w-5"/>
                                </button>
                                <button 
                                  onClick={() => deleteApplication(application._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete"
                                >
                                  <FiTrash2 className="h-5 w-5" />
                                </button>
                              </div>
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
                        Overdue Application Details
                      </h3>
                      <button
                        onClick={() => setShowViewModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="h-6 w-6" />
                      </button>
                    </div>
                    
                    {/* Alert for overdue */}
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FiAlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            This application is <span className="font-semibold">{selectedApplication.daysOverdue} days overdue</span>.
                            Priority level: <span className="font-semibold">{getPriorityLevel(selectedApplication.daysOverdue).level}</span>
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
                        <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(selectedApplication.date)}</p>
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
                          <StatusBadge status={getCurrentStatus(selectedApplication)} />
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
                                <div>
                                  {doc.remark && (
                                    <div className="text-xs text-gray-500 italic mt-1">
                                      Remark: {doc.remark}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No documents uploaded</p>
                        )}
                      </div>
                    </div>
                    
                 
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  href={`/dashboard`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Go to Dashboard
                </Link>
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
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, subtitle }) {
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
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
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