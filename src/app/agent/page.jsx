"use client";
import { useState, useEffect } from 'react';
import { FiFile,FiSave, FiPlus,FiPackage,FiClock, FiSearch, FiRefreshCw, FiUpload, FiX, FiCheck, FiEye, FiCalendar, FiUser, FiPhone, FiMail, FiMapPin, FiFileText, FiCreditCard, FiDownload, FiTrash2 } from 'react-icons/fi';
import { useSession } from '@/context/SessionContext';
import axios from 'axios';
export default function ServiceGroupsUI() {
  const { session } = useSession();
  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);

  // Agent's data from session
  const agentData = {
    location: session?.user?.location, // This should be dynamic in your actual app
    purchasePlan: session?.user?.purchasePlan // Extracted from session data
  };
  
  // Form data state - Modified to handle multiple documents
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    provider: {
      id:'',
      name:""
    }, 
    date: new Date().toISOString().split('T')[0],
    delivery: calculateDeliveryDate(new Date(), 7),
    status: {
      "name":"initiated",
      "hexcode":"#12fe11",
      "askreason":"no"
    },
    initialStatus: {
      "name":"initiated",
      "hexcode":"#12fe11",
      "askreason":false
    },
    service: '',
    serviceId: '', // Add serviceId field to store the _id
    staff: {
      id:"",
      name:"Not Assigned"
    },
    amount: '',
    // Changed from a single document to an array of documents
    documents: [],
    receipt: null,
    additional: {
      inputType: '',
      label: '',
      value: ''
    }
  });

  useEffect(() => {
    if (session?.user?._id) {
      const fetchApplications = async () => {
        try {
          const response = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session.user._id}`);
          const data = await response.json();
          setApplications(data.data || []);
        } catch (error) {
          console.error("Error fetching applications:", error);
        } finally {
          setAppLoading(false);
        }
      };
      
      fetchApplications();
    }
  }, [session]);

  // Calculate delivery date
  function calculateDeliveryDate(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return formatDisplayDate(d);
  }

  // Format display date function
  function formatDisplayDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // Fetch service groups
  useEffect(() => {
    const fetchServiceGroups = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/getAll-Groups');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch service groups: ${response.status}`);
        }
        
        const data = await response.json();
        setServiceGroups(data.serviceGroups || []);
      } catch (err) {
        console.error("Error fetching service groups:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceGroups();
  }, []);

  // Handle form input changes
  const handleInputChange = (e,label) => {
    const { name, value } = e.target;
  
    // For nested fields like "additional.value"
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [childKey]: value
        }
      }));
      setFormData((prevData) => ({
        ...prevData,
        additional: {
          ...prevData[parentKey],
          label: label
        }
      }));
      
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  
  console.log(serviceGroups)
  // Updated handle file change function to accept document type
  const handleFileChange = (e, documentType,name) => {
    const file = e.target.files[0];
    if (!file) return;

    if (documentType === 'receipt') {
      // Handle receipt upload
      setFormData({
        ...formData,
        receipt: {
          name: name,
          file: file,
          view: URL.createObjectURL(file)
        }
      });
    } else {
      // Handle document uploads
      const newDocuments = [...formData.documents];
      
      // Check if this document type already exists
      const existingDocIndex = newDocuments.findIndex(doc => doc.type === documentType);
      
      const newDoc = {
        type: documentType,
        name: name,
        file: file,
        view: URL.createObjectURL(file)
      };
      
      if (existingDocIndex >= 0) {
        // Replace existing document
        newDocuments[existingDocIndex] = newDoc;
      } else {
        // Add new document
        newDocuments.push(newDoc);
      }
      
      setFormData({
        ...formData,
        documents: newDocuments
      });
    }
  };

  // Function to remove a document
  const handleRemoveDocument = (documentType) => {
    if (documentType === 'receipt') {
      setFormData({
        ...formData,
        receipt: null
      });
    } else {
      setFormData({
        ...formData,
        documents: formData.documents.filter(doc => doc.type !== documentType)
      });
    }
  };

  // Check if a document has been uploaded
  const isDocumentUploaded = (documentType) => {
    if (documentType === 'receipt') {
      return formData.receipt !== null;
    }
    return formData.documents.some(doc => doc.type === documentType);
  };

  // Get uploaded document by type
  const getDocumentByType = (documentType) => {
    if (documentType === 'receipt') {
      return formData.receipt;
    }
    return formData.documents.find(doc => doc.type === documentType);
  };
  
  // Get price based on agent's plan
  const getPriceForAgentPlan = (service) => {
    console.log("price service", service);
    
    // Find pricing for agent's location - note the spelling of "Maharastra"
    const locationPricing = service.planPrices.find(
        pricing => pricing.state === "Maharastra" && 
                  pricing.district === agentData.location
    );
    
    if (!locationPricing) {
        console.log("No pricing found for location:", agentData.location);
        return 0;
    }
    
    console.log("Location Price", locationPricing);
    
    // Find the plan that matches the agent's purchased plan by planName
    const agentPlan = locationPricing.plans.find(
        plan => plan.planName.toLowerCase() === agentData.purchasePlan.toLowerCase()
    );
    
    if (!agentPlan) {
        console.log("No matching plan found, using default");
    }
    
    return agentPlan?.price || locationPricing.plans[0]?.price || 0;
  };

  // Open modal with selected service
  const handleOpenModal = (serviceGroup, service) => {
    
    const price = getPriceForAgentPlan(service);
    
    setSelectedService({
      groupName: serviceGroup.name,
      ...service,
      price: service.price
    });
    
    // Pre-populate form with service data including the service ID
    setFormData({
      ...formData,
      service: service.name,
      serviceId: service.serviceId,
      amount: service.price,
      status: service.status,
      delivery: calculateDeliveryDate(new Date(), 7),
      date: new Date().toISOString().split('T')[0],
      // Reset documents when opening a new form
      documents: [],
      receipt: null,
      additional: {
        inputType: '',
        label: '',
        value: ''
      }
    });
 
    setIsModalOpen(true);
  };
console.log("select",selectedService)
  // Handle viewing application details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setSubmissionStatus(null);
    
    // Format the service field properly for the API
    const serviceData = {
      _id: formData.serviceId,
      name: formData.service,
      status: formData.status,
    };
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      service: serviceData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      provider: {
        id:session?.user?._id,
        name:session?.user?.fullName
      },
      // Format documents for API
      document: formData.documents.map(doc => ({
        name: doc.name,
        type: doc.type,
        view: doc.view
      }))
    };
    
    try {
      const response = await fetch("https://dokument-guru-backend.vercel.app/api/application/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create application: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Show success message
      setSubmissionStatus({ success: true, message: "Application submitted successfully!" });
      
      // Refresh applications list
      if (session?.user?._id) {
        try {
          const appResponse = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session.user._id}`);
          const appData = await appResponse.json();
          setApplications(appData.data || []);
        } catch (error) {
          console.error("Error refreshing applications:", error);
        }
      }
      
      // Reset form after short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          provider: 'Agent',
          date: new Date().toISOString().split('T')[0],
          delivery: calculateDeliveryDate(new Date(), 7),
          status: {
            "name":"initiated",
            "hexcode":"#12fe11",
            "askreason":"no"
          },
          initialStatus: {
            "name":"initiated",
            "hexcode":"#12fe11",
            "askreason":false
          },
          service: '',
          serviceId: '',
          staff: 'Not Assigned',
          amount: '',
          documents: [],
          receipt: null,
          additional: {
            inputType: '',
            label: '',
            value: ''
          }
        });
        setSubmissionStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmissionStatus({ success: false, message: `Failed to submit application: ${error.message}` });
    } finally {
      setFormLoading(false);
    }
  };

  // Filter service groups based on search term
  const filteredServiceGroups = serviceGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.services.some(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  console.log(applications)
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
  const [modifiedApplication, setModifiedApplication] = useState(null);
const [documentsModified, setDocumentsModified] = useState(false);
const [isUploading, setIsUploading] = useState(false);

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
  setIsUploading(true);
  
  try {
    // Create a new FormData instance
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload the file to your server
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Get the file URL from the response
    const fileUrl = response.data.url;
    
    // Update the document in the modified application
    const updatedDocuments = [...modifiedApplication.document];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      view: fileUrl,
      // Clear the remark since we're reuploading
      remark: ''
    };
    
    setModifiedApplication({
      ...modifiedApplication,
      document: updatedDocuments
    });
    
    setDocumentsModified(true);
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Failed to upload file. Please try again.");
  } finally {
    setIsUploading(false);
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
  // Application Table Component
  function ApplicationsTable({ applications }) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Applications</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track status and details of all customer applications
          </p>
        </div>
        
        {applications.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No applications submitted yet</p>
            <p className="text-sm text-gray-400 mt-1">Submit your first application using the services below</p>
          </div>
        ) : (
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
                {applications.map((application) => (
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
                      <span 
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full py-1"
                        style={{ 
                          backgroundColor: application.initialStatus[0]?.hexcode || '#e5e7eb',
                          color: getContrastColor(application.initialStatus[0]?.hexcode || '#e5e7eb')
                        }}
                      >
                        {application.initialStatus[0]?.name || 'Pending'}
                      </span>
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
        )}
      </div>
    );
  }

  // Component for document upload UI
  const DocumentUploadField = ({ documentType, label }) => {
    const isUploaded = isDocumentUploaded(documentType);
    const document = getDocumentByType(documentType);
    
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="mt-1">
          {isUploaded ? (
            <div className="flex items-center justify-between border border-green-300 rounded-md py-2 px-3 bg-green-50">
              <div className="flex items-center truncate">
                <FiFile className="flex-shrink-0 mr-2 text-green-500" />
                <span className="text-sm text-green-700 truncate">{document.name}</span>
              </div>
              <div className="flex-shrink-0 flex">
                {document.view && (
                  <a
                    href={document.view}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 mx-1"
                  >
                    <FiEye />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(documentType)}
                  className="text-red-600 hover:text-red-800 mx-1"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ) : (
            <label className="block w-full relative">
              <span className="sr-only">Choose file</span>
              <input 
                type="file"
                name={documentType}
                onChange={(e) => handleFileChange(e, documentType,label)}
                className="hidden"
              />
              <div className="flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 text-sm cursor-pointer bg-white hover:bg-gray-50">
                <div className="flex items-center">
                  <FiFile className="mr-2 text-gray-400" />
                  <span className="text-gray-500">Select {label.toLowerCase()}</span>
                </div>
                <FiUpload className="text-gray-400" />
              </div>
            </label>
          )}
        </div>
      </div>
    );
  };

  // Loading state for the entire page
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FiRefreshCw className="animate-spin h-10 w-10 mx-auto text-green-600 mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-lg w-full">
          <p className="font-medium text-lg mb-2">Error loading service groups</p>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
          >
            <FiRefreshCw className="mr-2" /> Retry Loading
          </button>
        </div>
      </div>
    );
  }
  console.log(agentData)
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dokument Guru Services</h1>
          <p className="text-gray-600 mt-2">Browse available services and track your applications</p>
          <div className="flex items-center mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              {agentData.location}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {agentData.purchasePlan} Plan
            </span>
          </div>
        </div>

        {/* Applications Table */}
        {appLoading ? (
          <div className="bg-white shadow-sm rounded-lg p-8 mb-8 flex justify-center">
            <FiRefreshCw className="animate-spin h-8 w-8 text-green-600" />
          </div>
        ) : (
          <ApplicationsTable applications={applications} />
        )}

        {/* Service Groups Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">Available Services</h2>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search service groups or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Service Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServiceGroups.map((group) => (
              <div 
                key={group._id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  {group.image ? (
                    <img 
                      src={group.image} 
                      alt={group.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <FiFileText className="h-12 w-12 text-green-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-white text-xl font-semibold p-4">{group.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  {group.services && group.services.length > 0 ? (
                    <div className="space-y-3">
                      {group.services.map((service) => (
                        <div key={service._id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-800">{service.name}</p>
                            {service.documentNames && service.documentNames.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Requires: {service.documentNames.slice(0, 2).join(', ')}
                                {service.documentNames.length > 2 && ' + ' + (service.documentNames.length - 2) + ' more'}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenModal(group, service)}
                            className="flex items-center text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-md font-medium"
                          >
                            ₹{getPriceForAgentPlan(service)}
                            <FiPlus className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No services available yet</p>
                  )}
                </div>
              </div>
            ))}
            
            {filteredServiceGroups.length === 0 && (
              <div className="col-span-1 md:col-span-3 bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <FiSearch className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 mb-1">No service groups match your search</p>
                <p className="text-gray-500 text-sm">Try a different search term or browse all services</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Application Form Modal */}
        {isModalOpen && selectedService && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Apply for {selectedService.name}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                  ₹{selectedService.price}
                </span>
                <span className="text-sm text-gray-600">
                  Service Group: {selectedService.groupName}
                </span>
              </div>
              
              {/* Required Documents */}
              {selectedService.documentNames && selectedService.documentNames.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm font-medium text-yellow-800">Required Documents:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
                    {selectedService.documentNames.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Form submission status */}
              {submissionStatus && (
                <div className={`mb-4 p-3 rounded ${submissionStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center">
                    {submissionStatus.success ? (
                      <FiCheck className="h-5 w-5 mr-2" />
                    ) : (
                      <FiX className="h-5 w-5 mr-2" />
                    )}
                    {submissionStatus.message}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applicant Name*</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                    {
                      selectedService.formData.map((data)=>{
                        return<div key={data.label}>
                          <label className="block text-sm font-medium text-gray-700">{data.label}</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                          
                          {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                          </div> */}
                         <input
  type={data.inputType}
  name="additional.value"
  value={formData.additional.value || ''}
  onChange={(e)=>handleInputChange(e,data.label)}
  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
/>

                        </div>
                        </div> 
                      })
                    }
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
               
                
                {/* Payment Details */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Payment Receipt</label>
                    <span className="text-xs text-gray-500">Upload payment confirmation</span>
                  </div>
                  <div className="mt-1">
                    <DocumentUploadField documentType="receipt" label="Payment Receipt" />
                  </div>
                </div>
                
                {/* Dynamic Document Upload Fields */}
                {selectedService.documentNames && selectedService.documentNames.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Required Documents</label>
                      <span className="text-xs text-gray-500">Upload all required documents</span>
                    </div>
                    <div className="space-y-3">
                      {selectedService.documentNames.map((docName, index) => (
                        <DocumentUploadField 
                          key={index} 
                          documentType={docName} 
                          label={docName}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? (
                      <>
                        <FiRefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
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
          onClick={() => setIsViewModalOpen(false)}
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
              color: getContrastColor(selectedApplication.initialStatus[0]?.hexcode || '#e5e7eb')
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
                s => s._id === selectedApplication.initialStatus[0]?._id
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
                    }`}>
                      {statusItem.name}
                      {isCurrent && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-normal rounded-full bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </p>
                    {isCompleted || isCurrent ? (
                      <p className="text-xs text-gray-500">
                        {isCurrent 
                          ? `Updated: ${new Date(selectedApplication.updatedAt).toLocaleString()}`
                          : `Completed: ${new Date(selectedApplication.updatedAt).toLocaleString()}`
                        }
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Pending</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Delivery Status - Only show if all statuses are completed */}
            {selectedApplication.initialStatus[0]?._id === 
              selectedApplication.service.status[selectedApplication.service.status.length - 1]?._id && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Service Completion</p>
                  <p className="text-xs text-gray-400">Estimated by {selectedApplication.delivery}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Documents Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <FiFileText className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Uploaded Documents</h4>
          </div>
          
          {/* Save Changes Button - Only show when documents have been modified */}
          {documentsModified && (
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <FiSave className="mr-2 -ml-1 h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
        
        {modifiedApplication?.document && modifiedApplication?.document.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modifiedApplication.document.map((doc, index) => (
              <div key={index} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="bg-gray-50 p-3 rounded-lg mr-4">
                      <FiFile className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h5>
                      {doc.remark && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-red-500 uppercase tracking-wider mb-1">
                            Remark:
                          </p>
                          <p className="text-xs text-gray-700 italic bg-red-50 p-2 rounded-md">
                            {doc.remark}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-between border-t border-gray-100">
                  {doc.view && (
                    <a
                      href={doc.view}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      <FiEye className="mr-1.5 h-4 w-4" />
                      View Document
                    </a>
                  )}
                  
                  {/* Reupload Button - Only show for documents with remarks */}
                  {doc.remark && (
                    <div className="relative">
                      <input
                        type="file"
                        id={`file-upload-${index}`}
                        onChange={(e) => handleViewFileChange(e, index)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 cursor-pointer"
                      >
                        <FiUpload className="mr-1.5 h-4 w-4" />
                        Reupload Document
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FiFile className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No documents uploaded</p>
          </div>
        )}
      </div>
      
      {/* Footer Actions */}
      {/* <div className="border-t border-gray-100 pt-5 flex flex-wrap justify-between items-center">
        <div className="mb-3 sm:mb-0">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(selectedApplication.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsViewModalOpen(false)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Close
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FiDownload className="mr-2 -ml-1 h-4 w-4" />
            Export Details
          </button>
        </div>
      </div> */}
    </div>
  </div>
)}
      </div>
    </div>
  );
}