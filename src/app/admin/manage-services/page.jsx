
"use client";
import React, { useState,useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, List, Calendar, User, Pencil, Check ,PlusCircle} from 'lucide-react';
import { FiUser, FiFile } from 'react-icons/fi';
import ServiceModal from './serviceModal'

const ServiceCard = ({ 
  service, 
  onEdit, 
  onDelete, 
  onPreview, 
  onManagePrices, 
  onManageStatuses 
}) => {
  const [visibility, setVisibility] = useState('both');
  const [availability, setAvailability] = useState('subscription');
  // console.log(service);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800">{service.name}</h2>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
     {service.group}
        </span>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
          <List className="w-4 h-4" /> Document Requirements:
        </h3>
        <ul className="space-y-2">
          {service.documents.map((doc, index) => (
            <li key={index} className="p-2 bg-gray-50 rounded text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              {doc}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <button 
          onClick={() => onEdit(service)}
          className="px-3 py-2 border border-amber-400 text-black rounded hover:bg-yellow-600 hover:text-white transition-colors flex items-center gap-1 text-sm shadow-yellow-50 shadow-lg"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
        <button 
          onClick={() => onDelete(service)}
          className="px-3 py-2 border border-red-400 text-black rounded hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1 text-sm shadow-red-50 shadow-lg"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
};

const AddServiceModal = ({ isOpen, onClose, onSave, serviceGroups }) => {
  const [formData, setFormData] = useState({
    name: "",
    serviceGroupId: serviceGroups && serviceGroups.length > 0 ? serviceGroups[0]?._id : "",
    document: [""],
    visibility: "both",
    availablity: "subscription",
    price: 0,
    planPrices: [],
    status:
    [
  {
    name: "Initiated",
    hexcode: "#2196F3", // Blue - information/start
    askreason: false,
    priority: 1
  },
  {
    name: "Inprocess",
    hexcode: "#FFC107", // Amber - processing/waiting
    askreason: false,
    priority: 2
  },
  {
    name: "Rejected",
    hexcode: "#F44336", // Red - rejection/error
    askreason: true,
    priority: 3
  },
  {
    name: "Completed",
    hexcode: "#4CAF50", // Green - success/completed
    askreason: false,
    priority: 4
  },
  {
    name: "Objection",
    hexcode: "#9C27B0", // Purple - requires attention/objection
    askreason: true,
    priority: 5
  }
]

    
  });
const [locations,setLocations]=useState(null);
const [plans,setPlans]=useState(null);
  useEffect(() => {
    if (!isOpen) return;

    const fetchPrepareData = async () => {
      try {
        // setLoading(true);
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/prepare');
        
        if (!response.ok) {
          throw new Error('Failed to fetch prepare data');
        }
        
        const data = await response.json();
        setLocations(data.locations || []);
        setPlans(data.plans || []);
        
        // Initialize planPrices structure
        const initialPlanPrices = data.locations?.map(location => ({
          location: location._id,
          state:location.state,
          district:location.district,
          plans: data.plans?.map(plan => ({
            plan: plan._id,
            planName:plan.name,
            price: formData.price || 0
          })) || []
        })) || [];

        console.log("dasf",initialPlanPrices);
        
        setFormData(prev => ({
          ...prev,
          planPrices: initialPlanPrices
        }));
        console.log("data with locatiosn is ",formData);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching prepare data:', error);
        // setError('Failed to load required data');
        // setLoading(false);
      }
    };
    
    fetchPrepareData();
  }, [isOpen]);

  // Update formData.serviceGroupId when serviceGroups changes and it's empty
  useEffect(() => {
    if (serviceGroups && serviceGroups.length > 0 && !formData.serviceGroupId) {
      setFormData(prev => ({
        ...prev,
        serviceGroupId: serviceGroups[0]?._id
      }));
    }
  }, [serviceGroups]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      document: [...formData.document, ""]
    });
  };

  const handleDocumentChange = (index, value) => {
    const newDocuments = [...formData.document];
    newDocuments[index] = value;
    setFormData({
      ...formData,
      document: newDocuments
    });
  };

  const removeDocument = (index) => {
    const newDocuments = formData.document.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      document: newDocuments
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("main",formData);
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Add New Service</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Service Group Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Group</label>
            <select
              name="serviceGroupId"
              value={formData.serviceGroupId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {serviceGroups && serviceGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
              {(!serviceGroups || serviceGroups.length === 0) && (
                <option value="">No groups available</option>
              )}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Required Documents</label>
              <button
                type="button"
                onClick={addDocument}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Document
              </button>
            </div>
            
            {formData.document.map((doc, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => handleDocumentChange(index, e.target.value)}
                  placeholder="Document name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.document.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="both">Both</option>
                <option value="b2b">Agent</option>
                <option value="b2c">Customer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                name="availablity"
                value={formData.availablity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="subscription">Subscription</option>
                <option value="oneTime">One Time</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const App = () => {
  const [services, setServices] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [selectedPlanPrices, setSelectedPlanPrices] = useState(null);
  
  // Fetch service groups when component mounts
  useEffect(() => {
    const fetchServiceGroups = async () => {
      try {
        const res = await fetch("https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/fetch-group-names");
        const data = await res.json();

        if (res.ok) {
          
          console.log("✅ Service Groups:", data.serviceGroups);
          setServiceGroups(data.serviceGroups || []);
        } else {
          console.error("❌ Failed to fetch service groups:", data.message || data);
        }
      } catch (err) {
        console.error("❌ Error fetching service groups:", err);
      }
    };

    fetchServiceGroups();
  }, []);
 
  const fetchServices = async () => {
    try {
      const res = await fetch(" https://dokument-guru-backend.vercel.app/api/admin/newService/fetch-all-services");
      const data = await res.json();

      if (res.ok) {
        console.log("✅ All Services:", data.servicesData);

        const formattedServices = data.servicesData.map(service => ({
          id: service._id,
          name: service.name,
          visibility:service.visibility,
          documents: service.document,
          price: service.price,
          planPrice: service.planPrices,
          group: service.serviceGroup?.name || "Uncategorized", // Get group name from group object
          groupId: service.serviceGroup?.id,
           serviceGroup: service.serviceGroup, // Store the group ID
          status: service.status || [],
          formData : service.formData || []
        }));

        setServices(formattedServices);
      } else {
        console.error("❌ Failed to fetch services:", data.message || data);
      }
    } catch (err) {
      console.error("❌ Error fetching services:", err);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || service.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const handleAddService = () => {
    setCurrentService({
      id: Date.now(),
      name: '',
      serviceGroupId: serviceGroups.length > 0 ? serviceGroups[0]?._id : '',
      documents: ['']
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService({
      ...service,
      serviceGroupId: service.groupId || (serviceGroups.length > 0 ? serviceGroups[0]?._id : ''),
      serviceGroup: service.serviceGroup
    });
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleDeleteService = async (serviceToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${serviceToDelete.name}"?`)) {
      try {
        const response = await fetch(
          `https://dokument-guru-backend.vercel.app/api/admin/newService/delete-service/${serviceToDelete.id}`,
          {
            method: 'DELETE',
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          console.log('✅ Service deleted:', data);
          fetchServices();
        } else {
          console.error('❌ Failed to delete:', data.message);
          alert(`Failed to delete service: ${data.message}`);
        }
      } catch (error) {
        console.error('❌ Error deleting service:', error);
        alert('Something went wrong while deleting the service.');
      }
    }
  };
  
  const handleSaveService = async (serviceData) => {
    console.log("Raw serviceData:", serviceData);
    // console.log("names",selectedGroup?.name);
  
    // Extract just the required IDs from the nested objects to match the schema
    const cleanedData = {
      name: serviceData.name,
      serviceGroupId: serviceData.serviceGroupId,
       // Send the service group ID
      document: serviceData.document, // array of strings
      visibility: serviceData.visibility || "both",
      availablity: serviceData.availablity || "subscription",
      price: serviceData.price || 0,
      planPrices: serviceData.planPrices && Array.isArray(serviceData.planPrices) 
        ? serviceData.planPrices.map(planPrice => ({
            location: planPrice.location,
            state:planPrice.state,
            district:planPrice.district,
            plans: planPrice.plans && Array.isArray(planPrice.plans) 
              ? planPrice.plans.map(p => ({

                  plan: p.plan,
                  planName:p.planName,
                  price: serviceData.price
                }))
              : [
  {
    name: "Initiated",
    hexcode: "#2196F3", // Blue - information/start
    askreason: false,
    priority: 1
  },
  {
    name: "Inprocess",
    hexcode: "#FFC107", // Amber - processing/waiting
    askreason: false,
    priority: 2
  },
  {
    name: "Rejected",
    hexcode: "#F44336", // Red - rejection/error
    askreason: true,
    priority: 3
  },
  {
    name: "Completed",
    hexcode: "#4CAF50", // Green - success/completed
    askreason: false,
    priority: 4
  },
  {
    name: "Objection",
    hexcode: "#9C27B0", // Purple - requires attention/objection
    askreason: true,
    priority: 5
  }
]

          }))
        : [],
      status: serviceData.status && Array.isArray(serviceData.status)
        ? serviceData.status.map(s => ({
            name: s.name,
            hexcode: s.hexcode,
            askreason: s.askreason,
            priority:s.priority
          }))
        : [
          
        ]
    };
    
    console.log("Cleaned data for API:", cleanedData);
    
    try {
      const res = await fetch('https://dokument-guru-backend.vercel.app/api/admin/newService/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        console.log("✅ Service added successfully:", result);
        fetchServices();
        setModalOpen(false);
        setCurrentService(null);
      } else {
        console.error("❌ Failed to add service:", result.message || result);
        alert(`Failed to add service: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("🚨 Error adding service:", error);
      alert("Something went wrong while adding the service.");
    }
  };


  
  const handlePreview = (service) => {
    alert(`Previewing form for: ${service.name}`);
  };

  const handleManagePrices = (service) => {
    alert(`Managing prices for: ${service.name}`);
  };

  const handleManageStatuses = (service) => {
    setCurrentService(service);
    setStatusModalOpen(true);
  };

  const handleAvailablePlansClick = (plan) => {
    console.log('Navigating to prices without subscription for plan:', plan);
    setSelectedPlan(plan);
    setActiveSection('without-subscription');
  };
    console.log("grop = ",serviceGroups)
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Services Management</h1>
          <p className="text-gray-600">Manage all your services and their configurations</p>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All Groups</option>
                {serviceGroups?.map(group => (
                  <option key={group._id} value={group.name}>{group.name}</option>
                ))}
              </select>
              
              <button 
                onClick={handleAddService}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Service
              </button>
            </div>
          </div>
        </div>
        
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <p className="text-gray-500">No services found matching your criteria</p>
            <button 
              onClick={handleAddService}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add New Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onPreview={handlePreview}
                onManagePrices={handleManagePrices}
                onManageStatuses={handleManageStatuses}
              />
            ))}
          </div>
        )}
      </div>
      
      {isEdit ? (
        <ServiceModal
          key={currentService?.id || 'new'}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            
            setCurrentService(null);
            fetchServices(); 
          }}
          service={currentService}
          onSave={handleSaveService}
          isEdit={isEdit}
          showUpdateSection={showUpdateSection}
          setShowUpdateSection={setShowUpdateSection}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          selectedPlanPrices={selectedPlanPrices}
          setSelectedPlanPrices={setSelectedPlanPrices}
          serviceGroups={serviceGroups}
          fetchServices={fetchServices} 
        />
      ) : (
        <AddServiceModal
          key="add" 
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setCurrentService(null);
          }}
          onSave={handleSaveService}
          serviceGroups={serviceGroups}
        />
      )}
      
      {/* Update Section */}
      {showUpdateSection && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Prices for {selectedPlan.name}</h2>
              <button
                onClick={() => {
                  setShowUpdateSection(false);
                  setSelectedPlan(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={selectedPlan.price}
                  onChange={(e) => setSelectedPlan({...selectedPlan, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time (days)</label>
                <input
                  type="number"
                  value={selectedPlan.processingTime}
                  onChange={(e) => setSelectedPlan({...selectedPlan, processingTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowUpdateSection(false);
                    setSelectedPlan(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle save logic here
                    setShowUpdateSection(false);
                    setSelectedPlan(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add this modal for showing plan prices */}
      {selectedPlanPrices && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Prices without Subscription - {selectedPlanPrices.name}</h2>
              <button
                onClick={() => setSelectedPlanPrices(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Default Prices Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Default Prices</h3>
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Govt Price:</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedPlanPrices.govtPrice}
                      onChange={(e) => setSelectedPlanPrices({...selectedPlanPrices, govtPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Price:</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedPlanPrices.commissionPrice}
                      onChange={(e) => setSelectedPlanPrices({...selectedPlanPrices, commissionPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage:</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedPlanPrices.taxPercentage}
                      onChange={(e) => setSelectedPlanPrices({...selectedPlanPrices, taxPercentage: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Tatkal Prices Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Tatkal Prices</h3>
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Govt Price:</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedPlanPrices.tatkalGovtPrice}
                      onChange={(e) => setSelectedPlanPrices({...selectedPlanPrices, tatkalGovtPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Price:</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedPlanPrices.tatkalCommissionPrice}
                      onChange={(e) => setSelectedPlanPrices({...selectedPlanPrices, tatkalCommissionPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage:</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedPlanPrices.tatkalTaxPercentage}
                      onChange={(e) => setSelectedPlanPrices({...selectedPlanPrices, tatkalTaxPercentage: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedPlanPrices(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save logic here
                  setSelectedPlanPrices(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Status Management Modal */}
        {statusModalOpen && currentService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Statuses for {currentService.name}</h2>
                <button
                  onClick={() => {
                    setStatusModalOpen(false);
                    setCurrentService(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Current Statuses</h3>
                  <button
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Status
                  </button>
                </div>
                
                {currentService.status && currentService.status.length > 0 ? (
                  <div className="space-y-3">
                    {currentService.status.map((status, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ backgroundColor: status.hexcode || '#cccccc' }}
                          ></div>
                          <span className="font-medium">{status.name}</span>
                          {status.askreason && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Requires reason
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No statuses added yet</p>
                    <button
                      className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 mx-auto"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Your First Status
                    </button>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setStatusModalOpen(false);
                      setCurrentService(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default App;