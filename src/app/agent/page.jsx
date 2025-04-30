"use client";
import { useState, useEffect } from 'react';
import { FiFile, FiPlus, FiSearch, FiRefreshCw, FiUpload, FiX, FiCheck } from 'react-icons/fi';

export default function ServiceGroupsUI() {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Agent's data from session
  const agentData = {
    location: "Pune", // This should be dynamic in your actual app
    purchasePlan: "Lite" // Extracted from session data
  };
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    provider: 'Agent', 
    date: new Date().toISOString().split('T')[0],
    delivery: calculateDeliveryDate(new Date(), 7),
    status: 'Initiated',
    service: '',
    serviceId: '', // Add serviceId field to store the _id
    staff: 'Not Assigned',
    amount: '',
    document: null,
    receipt: null
  });

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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0].name
      });
    }
  };
  console.log("naisji",serviceGroups)
  // Get price based on agent's plan
  const getPriceForAgentPlan = (service) => {
    // Find pricing for agent's location
    const locationPricing = service.planPrices.find(
      pricing => pricing.state === "Maharashtra" && pricing.district === agentData.location
    );
    
    if (!locationPricing) return 0;
    
    // Find the plan that matches the agent's purchased plan
    const agentPlan = locationPricing.plans.find(
      plan => plan.plan.toLowerCase().includes(agentData.purchasePlan.toLowerCase())
    );
    
    return agentPlan?.price || locationPricing.plans[0]?.price || 0;
  };

  // Open modal with selected service
  const handleOpenModal = (serviceGroup, service) => {
    const price = getPriceForAgentPlan(service);
    console.log(service.serviceId)
    setSelectedService({
      groupName: serviceGroup.name,
      ...service,
      price: price
    });
    
    // Pre-populate form with service data including the service ID
    setFormData({
      ...formData,
      service: service.name,
      serviceId: service.serviceId, // Store the service ID
      amount: price,
      status: 'Initiated',
      delivery: calculateDeliveryDate(new Date(), 7),
      date: new Date().toISOString().split('T')[0]
    });
 
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setSubmissionStatus(null);
    
    // Format the service field properly for the API
    const serviceData = {
      _id: formData.serviceId, // Include the service ID
      name: formData.service,
      status: {
        name: formData.status || "Initiated",
        hexcode: "#34fc23",
        askreason: false
      }
    };
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      service: serviceData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };
    console.log("final",submissionData);
    try {
      // Update the API endpoint to your actual endpoint
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
      console.log('Application created:', result);
      
      // Show success message
      setSubmissionStatus({ success: true, message: "Application submitted successfully!" });
      
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
          status: 'Initiated',
          service: '',
          serviceId: '',
          staff: 'Not Assigned',
          amount: '',
          document: null,
          receipt: null
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FiRefreshCw className="animate-spin h-10 w-10 mx-auto text-green-600 mb-4" />
          <p className="text-gray-600">Loading service groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mx-auto max-w-3xl mt-8">
        <p className="font-medium">Error loading service groups</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dokument Guru Services</h1>
          <p className="text-gray-600">Browse available services and apply online</p>
          <p className="text-sm text-gray-500 mt-1">Showing prices for: {agentData.location} ({agentData.purchasePlan} Plan)</p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
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
                {group.image && (
                  <img 
                    src={group.image} 
                    alt={group.name} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <h3 className="text-white text-xl font-semibold p-4">{group.name}</h3>
                </div>
              </div>
              
              <div className="p-4">
                {group.services && group.services.length > 0 ? (
                  <div className="space-y-3">
                    {group.services.map((service) => {
                      const price = getPriceForAgentPlan(service);
                      
                      return (
                        <div key={service._id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-800">{service.name}</p>
                            {service.documentNames && service.documentNames.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Requires: {service.documentNames.join(', ')}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenModal(group, service)}
                            className="flex items-center text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-md"
                          >
                            ₹{price}
                            <FiPlus className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No services available yet</p>
                )}
              </div>
            </div>
          ))}
          
          {filteredServiceGroups.length === 0 && (
            <div className="col-span-3 bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No service groups match your search</p>
            </div>
          )}
        </div>
        
        {/* Application Form Modal */}
        {isModalOpen && selectedService && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Apply for {selectedService.name}
                </h3>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  ₹{selectedService.price}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Service Group: {selectedService.groupName}
              </p>
              
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
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address*</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Delivery</label>
                    <input
                      type="text"
                      disabled
                      value={formData.delivery}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-500"
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Required Documents*</label>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Upload Documents</span>
                        <input 
                          type="file" 
                          name="document"
                          onChange={handleFileChange}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Upload required documents listed above</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Receipt</label>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Upload Receipt</span>
                        <input 
                          type="file" 
                          name="receipt"
                          onChange={handleFileChange}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Upload payment receipt if available</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <FiRefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiUpload className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}