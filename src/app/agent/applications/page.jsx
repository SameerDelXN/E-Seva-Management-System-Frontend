"use client";
import { useState, useEffect } from 'react';
import { FiFile, FiEye,FiList, FiCalendar, FiX, FiPackage,FiCreditCard, FiClock, FiFileText, FiUser, FiPhone, FiMail, FiMapPin, 
  FiDownload, FiTrash2, FiChevronLeft, FiChevronRight, FiSave, FiUpload, FiSearch, FiFilter } from 'react-icons/fi';
import { useSession } from '@/context/SessionContext';
import axios from 'axios';

export default function ApplicationsPage() {
  const { session } = useSession();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modifiedApplication, setModifiedApplication] = useState(null);
  const [documentsModified, setDocumentsModified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState([]);
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    service: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  
  const applicationsPerPage = 5;
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  // Extract unique services and statuses for filter dropdowns
  const uniqueServices = [...new Set(applications.map(app => app.service?.name))];
  const uniqueStatuses = [...new Set(applications.flatMap(app => 
    app.initialStatus?.map(status => status.name)
  ))].filter(Boolean);

  // Fetch applications
  useEffect(() => {
    if (session?.user?._id) {
      const fetchApplications = async () => {
        try {
          const response = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session.user._id}`);
          const data = await response.json();
          const applicationsData = data.data || [];
          setApplications(applicationsData);
          setFilteredApplications(applicationsData);
        } catch (error) {
          console.error("Error fetching applications:", error);
        } finally {
          setAppLoading(false);
        }
      };
      
      fetchApplications();
    }
  }, [session]);

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, applications]);

  // Filter applications based on current filters
  const applyFilters = () => {
    let result = [...applications];
    
    // Apply search term (matches name or phone)
    if (filters.searchTerm) {
  const searchLower = filters.searchTerm.toLowerCase();
  result = result.filter(app => 
    app.name?.toLowerCase().includes(searchLower) || 
    (app.phone !== undefined && app.phone.toString().includes(filters.searchTerm))
  );
}
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(app => 
        app.initialStatus[0]?.name === filters.status
      );
    }
    
    // Apply service filter
    if (filters.service) {
      result = result.filter(app => 
        app.service.name === filters.service
      );
    }
    
    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(app => {
        const appDate = new Date(app.createdAt);
        let matchesStart = true;
        let matchesEnd = true;
        
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          matchesStart = appDate >= startDate;
        }
        
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          endDate.setHours(23, 59, 59); // Set to end of day
          matchesEnd = appDate <= endDate;
        }
        
        return matchesStart && matchesEnd;
      });
    }
    
    setFilteredApplications(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: '',
      service: '',
      dateRange: {
        start: '',
        end: ''
      }
    });
  };

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get contrast color for status badges
  function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return dark or light color based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  // Reset state when the modal opens
  useEffect(() => {
    if (selectedApplication) {
      setModifiedApplication({...selectedApplication});
      setDocumentsModified(false);
    }
  }, [selectedApplication, isViewModalOpen]);

  // Handle file upload change
 const handleViewFileChange = async (e, index) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Set uploading state for this specific document
  setUploadingDocuments(prev => {
    const newUploading = [...prev];
    newUploading[index] = true;
    return newUploading;
  });
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      'https://dokument-guru-backend.vercel.app/api/upload/doc',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    if (response.data.success) {
      const documentUrl = response.data.documentUrl;
      const updatedDocuments = [...modifiedApplication.document];
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        view: documentUrl,
        remark: ''
      };
      
      setModifiedApplication({
        ...modifiedApplication,
        document: updatedDocuments,
        initialStatus: [{
          name: "Initiated",
          hexcode: "#9C27B0",
          askreason: true,
          reason: "Document is Replaced by Admin as per Remark",
        }]
      });
      
      // Check if all required documents have been replaced
      const allReplaced = selectedApplication.document.every((doc, i) => {
        // If document had a remark, check if it's been replaced
        if (doc.remark) {
          return updatedDocuments[i].view && !updatedDocuments[i].remark;
        }
        return true; // No remark means no need to replace
      });
      
      setDocumentsModified(allReplaced);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Failed to upload file. Please try again.");
  } finally {
    // Clear uploading state for this document
    setUploadingDocuments(prev => {
      const newUploading = [...prev];
      newUploading[index] = false;
      return newUploading;
    });
  }
};

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!modifiedApplication) return;
    
    try {
      // Send the updated application to your API
      const response = await axios.put(
        `https://dokument-guru-backend.vercel.app/api/application/update/${modifiedApplication._id}`,
        modifiedApplication
      );
      
      if (response.data) {
        // Update the selected application with the response data
        setSelectedApplication(response.data);
        // Reset modification flags
        setDocumentsModified(false);
        
        // Update the application in the applications list
        const updatedApplications = applications.map(app => 
          app._id === modifiedApplication._id ? response.data : app
        );
        setApplications(updatedApplications);
        // Re-apply filters to update filtered applications
        applyFilters();
        
        // Show success message
        alert("Application updated successfully!");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application. Please try again.");
    }
  };

  // Add a confirmation before closing if there are unsaved changes
  const handleCloseModal = () => {
    if (documentsModified) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        setIsViewModalOpen(false);
      }
    } else {
      setIsViewModalOpen(false);
    }
  };

  // Handle viewing application details
  const handleViewDetails = (application) => {
    console.log("appi = ",application)
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Applications</h1>
          <p className="text-gray-600 mt-2">Track status and details of all customer applications</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <FiFilter className="mr-2 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Filter Applications</h3>
            </div>
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {filterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {filterOpen && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Term */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search (Name/Phone)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="search"
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                      className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search applications..."
                    />
                    {filters.searchTerm && (
                      <button 
                        onClick={() => setFilters({...filters, searchTerm: ''})}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <FiX className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Service Filter */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <select
                    id="service"
                    value={filters.service}
                    onChange={(e) => setFilters({...filters, service: e.target.value})}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">All Services</option>
                    {uniqueServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => setFilters({
                          ...filters, 
                          dateRange: {...filters.dateRange, start: e.target.value}
                        })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => setFilters({
                          ...filters, 
                          dateRange: {...filters.dateRange, end: e.target.value}
                        })}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4"
                >
                  Clear Filters
                </button>
              </div>
              
              {/* Filter Stats */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredApplications.length} of {applications.length} applications
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Application History</h2>
            <p className="mt-1 text-sm text-gray-500">
              All submitted applications and their current status
            </p>
          </div>
          
          {appLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">
                {applications.length === 0 
                  ? "No applications submitted yet" 
                  : "No applications match your filter criteria"}
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentApplications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {application.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{application.name}</div>
                              <div className="text-sm text-gray-500">{application.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.service.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-center">
                             <span 
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full py-1"
                            style={{ 
                              backgroundColor: application.initialStatus[0]?.hexcode || '#e5e7eb',
                              color: getContrastColor(application.initialStatus[0]?.hexcode || '#e5e7eb')
                            }}
                          >
                            {application.initialStatus[0]?.name || 'Pending'}
                          </span>
                          <span className='text-red-500 text-xs'>{application.initialStatus[0]?.reason ? application.initialStatus[0]?.reason : null }</span>
                        
                          </div>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{application.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.delivery}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(application)}
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          >
                            <FiEye className="mr-1" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination controls */}
              <div className="mt-4 flex items-center justify-between p-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstApplication + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastApplication, filteredApplications.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredApplications.length}</span> applications
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FiChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                    <FiChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Application Modal */}
     {isViewModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {selectedApplication.name}'s Application
                  </h3>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 transition-colors p-1 -m-1"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              {/* Status Bar */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="px-3 py-1 text-sm font-medium rounded-full shadow-sm"
                    style={{ 
                      backgroundColor: selectedApplication.initialStatus[0]?.hexcode || '#e5e7eb',
                      color: getContrastColor(selectedApplication.initialStatus?.[0]?.hexcode || '#e5e7eb')
                    }}
                  >
                    {selectedApplication.initialStatus[0]?.name || 'Processing'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedApplication.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Expected Delivery</p>
                  <p className="text-sm text-indigo-600 font-semibold">
                    {selectedApplication.delivery}
                  </p>
                </div>
              </div>
              
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Service Details Card */}
                <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <FiPackage className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Service Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.service.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">₹{selectedApplication.amount}</p>
                    </div>
                  </div>
                </div>
                
                {/* Applicant Details Card */}
                <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FiUser className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Applicant Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Card */}
                <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <FiClock className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Application Timeline</h4>
                  </div>
                  <div className="space-y-4">
                    {/* Submitted Status - Always completed */}
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                        <div className="w-px h-full bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedApplication.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Status Timeline from Service Status */}
                    {selectedApplication.service.status.map((statusItem, index) => {
                      // Find the current status index
                      const currentStatusIndex = selectedApplication.service.status.findIndex(
                        s =>
                          s.name.toLowerCase() === selectedApplication.initialStatus[0]?.name.toLowerCase()
                      );
                      
                      // Check if this status is completed (before current status)
                      const isCompleted = index < currentStatusIndex;
                      // Check if this is the current status
                      const isCurrent = index === currentStatusIndex;
                      // Check if this is a future status
                      const isFuture = index > currentStatusIndex;

                      return (
                        <div key={statusItem._id} className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div 
                              className={`w-3 h-3 rounded-full mt-1 ${
                                isCompleted || isCurrent ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            ></div>
                            {index !== selectedApplication.service.status.length - 1 && (
                              <div className={`w-px h-full ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-200'
                              }`}></div>
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${
                             isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                            }`}>{statusItem.name}</p>
                            {isCurrent && (
                              <p className="text-xs text-green-600">Current Status</p>
                            )}
                            {isFuture && (
                              <p className="text-xs text-gray-500">Pending</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Delivery Timeline */}
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expected Delivery</p>
                        <p className="text-xs text-gray-500">{selectedApplication.delivery}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <FiList className="text-indigo-500 mr-2" />
                  Form Data
                </h4>
                
                {selectedApplication.formData && selectedApplication.formData.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 border-b border-gray-100">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr.</div>
                        <div className="col-span-7 text-xs font-semibold text-gray-600 uppercase tracking-wider">Label</div>
                        <div className="col-span-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Price</div>
                      </div>
                    </div>
                    
                    {/* Form Data Items */}
                    <div className="divide-y divide-gray-100">
                      {selectedApplication.formData.map((item, index) => (
                        <div key={item._id || index} className="px-6 py-4 transition-colors hover:bg-gray-50">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-1">
                              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="col-span-7">
                              <span className="text-sm font-medium text-gray-800">{item.label || `Item ${index + 1}`}</span>
                            </div>
                            <div className="col-span-4 text-right">
                              <span className="text-sm font-bold text-gray-800 bg-green-50 px-3 py-1 rounded-full">
                                ₹{item.price || '0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary Footer */}
                    
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
                    <div className="bg-indigo-50 p-3 rounded-full mb-3">
                      <FiList className="h-6 w-6 text-indigo-500" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">No Form Data Available</p>
                    <p className="text-xs text-gray-400">Form details will appear here when available</p>
                  </div>
                )}
              </div>

              {/* Receipt Section */}
            

              {/* Document Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg mr-3">
                      <FiFileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Required Documents</h4>
                  </div>
                  {documentsModified && (
                    <button 
                      onClick={handleSaveChanges}
                      disabled={isUploading}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                        isUploading ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-1 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Document List */}
                <div className="space-y-4">
                  {selectedApplication.document.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="p-2 bg-white border border-gray-200 rounded-lg mr-3">
                            <FiFile className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{doc.name}</h5>
                            {doc.view ? (
                              <div className="mt-2 flex items-center space-x-3">
                                <a 
                                  href={doc.view} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                  <FiEye className="mr-1 h-3 w-3" />
                                  View Document
                                </a>
                                {/* <a 
                                  href={doc.view} 
                                  download
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <FiDownload className="mr-1 h-3 w-3" />
                                  Download
                                </a> */}
                              </div>
                            ) : (
                              <p className="text-xs text-red-500 mt-1">Document not uploaded yet</p>
                            )}
                            
                            {doc.remark && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                                <p className="text-xs text-yellow-800">
                                  <span className="font-medium">Remark:</span> {doc.remark}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* <h1>{selectedApplication.initialStatus[0].name}</h1> */}
                        {/* Upload Button */}
                       {
                        selectedApplication.initialStatus[0]?.name==="Objection" ? 
                         <div>
                         <label 
  htmlFor={`fileUpload-${index}`}
  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
    uploadingDocuments[index] 
      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
  } transition-colors`}
  disabled={uploadingDocuments[index]}
>
  {uploadingDocuments[index] ? (
    <>
      <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
      Uploading...
    </>
  ) : (
    <>
      <FiUpload className="mr-1 h-4 w-4" /> 
      {doc.view ? 'Replace' : 'Upload'}
    </>
  )}
  
  <input 
    id={`fileUpload-${index}`}
    type="file" 
    className="hidden"
    onChange={(e) => handleViewFileChange(e, index)}
    disabled={uploadingDocuments[index]}
  />
</label>
                        </div> : null
                       }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-center mb-5">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <FiCreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Receipt</h4>
                </div>
                
                {selectedApplication.receipt && selectedApplication.receipt.length > 0 ? (
                  <div className="space-y-4">
                    {selectedApplication.receipt.map((receiptUrl, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg mr-3">
                              <FiCreditCard className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">Receipt {index + 1}</h5>
                              <div className="mt-2 flex items-center space-x-3">
                                <a 
                                  href={receiptUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                >
                                  <FiEye className="mr-1 h-3 w-3" />
                                  View Receipt
                                </a>
                                <a 
                                  href={receiptUrl} 
                                  download
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <FiDownload className="mr-1 h-3 w-3" />
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
                    <div className="bg-green-50 p-3 rounded-full mb-3">
                      <FiCreditCard className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">No Receipt Available</p>
                    <p className="text-xs text-gray-400">Payment receipt will appear here when available</p>
                  </div>
                )}
              </div>
  
           
              
              {/* Action Footer */}
              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  Close
                </button>
            {documentsModified && (
  <button 
    onClick={handleSaveChanges}
    disabled={isUploading || uploadingDocuments.some(status => status)}
    className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
      isUploading || uploadingDocuments.some(status => status) 
        ? 'bg-gray-200 text-gray-500' 
        : 'bg-indigo-600 text-white hover:bg-indigo-700'
    }`}
  >
    {isUploading ? (
      <>
        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        Saving...
      </>
    ) : (
      <>
        <FiSave className="mr-1 h-4 w-4" />
        Save Changes
      </>
    )}
  </button>
)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}