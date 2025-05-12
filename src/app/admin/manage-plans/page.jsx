"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlusIcon, HomeIcon, Trash2Icon, PencilIcon, XIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react';
import AddSuccessPopup from '@/components/popups/addSucess';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
import LoadingSpinner from '@/components/Loading';

export default function App() {
  // State hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newService, setNewService] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  
  // Ref for service dropdown
  const serviceDropdownRef = useRef(null);
  const serviceInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: 365,
    durationUnit: 'days',
    services: [],
  });
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // Add validation errors state
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    duration: '',
    services: ''
  });

  // Initialize plans state
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  // Handle clicks outside of the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        serviceDropdownRef.current && 
        !serviceDropdownRef.current.contains(event.target) &&
        serviceInputRef.current &&
        !serviceInputRef.current.contains(event.target)
      ) {
        setShowServiceDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serviceDropdownRef, serviceInputRef]);

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/newService/fetch-all-services", {
        method: 'GET'
      });

      if (!response.ok) {
        console.log("Failed to fetch services. Status:", response.status);
        return [];
      }
      
      const data = await response.json();
      console.log("Fetched Services:", data);
      return data.servicesData || [];
    } catch (error) {
      console.error("Error fetching services:", error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/manage-plan/fetch-plans", {
        method: 'GET'
      });

      if (!response.ok) {
        console.log("Failed to fetch plans. Status:", response.status);
        return [];
      }
      
      const data = await response.json();
      console.log("Fetched Plans:", data);
      return data.plans || [];
    } catch (error) {
      console.error("Error fetching plans:", error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [plansData, servicesData] = await Promise.all([
          fetchPlans(),
          fetchServices()
        ]);
        
        if (plansData && plansData.length > 0) {
          setPlans(plansData);
          setFilteredPlans(plansData);
        }
        
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchPlans, fetchServices]);

  // Add useEffect for search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlans(plans);
    } else {
      const filtered = plans.filter(plan => {
        const searchLower = searchTerm.toLowerCase();
        return (
          plan.name.toLowerCase().includes(searchLower) ||
          (plan.services && plan.services.some(service => 
            service.name.toLowerCase().includes(searchLower)
          ))
        );
      });
      setFilteredPlans(filtered);
    }
  }, [searchTerm, plans]);

  // Filter services based on search term
  const filteredServices = React.useMemo(() => {
    if (!serviceSearchTerm.trim()) {
      return services;
    }
    
    return services.filter(service => 
      service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );
  }, [services, serviceSearchTerm]);

  // Sort plans
  const sortedPlans = React.useMemo(() => {
    let sortablePlans = [...filteredPlans];
    if (sortConfig !== null) {
      sortablePlans.sort((a, b) => {
        // If both plans have _id, sort by _id to maintain order
        if (a._id && b._id) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        // If one has _id and other doesn't, the one with _id comes first
        if (a._id && !b._id) return -1;
        if (!a._id && b._id) return 1;
        
        // If neither has _id, sort by name
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlans;
  }, [filteredPlans, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle opening the modal for adding a new plan
  const handleAddPlan = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      price: 0,
      duration: 365,
      durationUnit: 'days',
      services: [],
    });
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing plan
  const handleEditPlan = (plan) => {
    setIsEditing(true);
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      durationUnit: plan.durationUnit,
      services: [...plan.services],
    });
    setIsModalOpen(true);
  };

  // Handle opening the delete confirmation modal
  const handleDeleteClick = (plan) => {
    setCurrentPlan(plan);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentPlan) return;

    try {
      const response = await fetch(
        `https://dokument-guru-backend.vercel.app/api/admin/manage-plan/delete-plan/${currentPlan._id}`, 
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Update both plans and filteredPlans state
      setPlans(prevPlans => prevPlans.filter(plan => plan._id !== currentPlan._id));
      setFilteredPlans(prevPlans => prevPlans.filter(plan => plan._id !== currentPlan._id));
      setShowDeleteSuccess(true);
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      setShowDeleteConfirmation(false);
      setCurrentPlan(null);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === 'price' || name === 'duration' 
          ? value === '' ? 0 : parseFloat(value) || 0 
          : value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle adding a service to the plan from the dropdown
  const handleSelectService = (service) => {
    const serviceExists = formData.services.some(s => 
      s.name === service.name
    );
    
    if (!serviceExists) {
      setFormData(prevFormData => ({
        ...prevFormData,
        services: [...prevFormData.services, { name: service.name }],
      }));
      
      // Clear services error when adding a service
      if (errors.services) {
        setErrors({
          ...errors,
          services: ''
        });
      }
    }
    
    setServiceSearchTerm('');
    setShowServiceDropdown(false);
  };

  // Handle removing a service from the plan
  const handleRemoveService = (index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      services: prevFormData.services.filter((_, i) => i !== index),
    }));
  };

  const fetchAndSetPlans = async () => {
    try {
      const plansData = await fetchPlans();
      if (plansData && Array.isArray(plansData)) {
        setPlans(plansData);
        setFilteredPlans(plansData);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
      isValid = false;
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
      isValid = false;
    }
    
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
      isValid = false;
    }
    
    if (!formData.services || formData.services.length === 0) {
      newErrors.services = 'At least one service is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid) {
      return; // Stop form submission if validation fails
    }
    
    setIsLoading(true);

    try {
      if (isEditing && currentPlan) {
        // Update existing plan
        const response = await fetch(
          `https://dokument-guru-backend.vercel.app/api/admin/manage-plan/update-plan/${currentPlan._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update plan');
        }
        await fetchAndSetPlans();
        const updatedPlan = await response.json();
    
        // Update local state
        setPlans(prevPlans => prevPlans.map(plan => 
          plan._id === currentPlan._id ? updatedPlan : plan
        ));
        setFilteredPlans(prevPlans => prevPlans.map(plan => 
          plan._id === currentPlan._id ? updatedPlan : plan
        ));
        setShowUpdateSuccess(true);
      } else {
        // Add new plan
        const newPlan = {
          name: formData.name,
          price: formData.price,
          duration: formData.duration,
          durationUnit: formData.durationUnit,
          services: Array.isArray(formData.services) ? formData.services.map(service => ({ name: service.name })) : [],
        };

        const response = await fetch(
          `https://dokument-guru-backend.vercel.app/api/admin/manage-plan/add-plan`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPlan),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add plan');
        }

        const createdPlan = await response.json();
        console.log("updated plan with new addition",createdPlan);
        // Update both plans and filteredPlans state by adding the new plan at the end
        setPlans(prevPlans => [...prevPlans, createdPlan.plan]);
        setFilteredPlans(prevPlans => [...prevPlans, createdPlan]);

        setShowAddSuccess(true);
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setCurrentPlan(null);
      setFormData({
        name: '',
        price: 0,
        duration: 365,
        durationUnit: 'days',
        services: [],
      });
    }
  };

  // Toggle plan expansion
  const toggleExpandPlan = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  // Toggle the service dropdown
  const toggleServiceDropdown = () => {
    setShowServiceDropdown(!showServiceDropdown);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-green-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Subscription Plans</h1>
              <p className="text-gray-600 mt-1">Create and manage your service plans</p>
            </div>
            <button
              onClick={handleAddPlan}
              className="flex items-center px-5 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            >
              <PlusIcon size={18} className="mr-2" />
              Add New Plan
            </button>
          </div>

          {/* Search and filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search plans or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div className="space-y-4">
          {isLoading ? (
            <LoadingSpinner loadingText="Loading plans..." description="Please wait while we fetch your subscription plans" />
          ) : sortedPlans.length > 0 ? (
            sortedPlans.map((plan) => (
              <div
                key={plan._id || plan.id || `plan-${plan.name}-${plan.price}`}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Price:</span>
                          <span className="ml-1 font-bold text-green-700">
                            ₹{plan.price}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1">
                            {plan.duration} {plan.durationUnit}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Services:</span>
                          <span className="ml-1">{Array.isArray(plan.services) ? plan.services.length : 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="flex items-center justify-center px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition"
                      >
                        <PencilIcon size={16} className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(plan)}
                        className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2Icon size={16} className="mr-2" />
                        Delete
                      </button>
                      <button
                        onClick={() => toggleExpandPlan(plan._id || plan.id)}
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                      >
                        {expandedPlan === (plan._id || plan.id) ? (
                          <>
                            <ChevronUpIcon size={16} className="mr-2" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon size={16} className="mr-2" />
                            View
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded services view */}
                {expandedPlan === (plan._id || plan.id) && (
                  <div className="border-t border-gray-200 bg-gray-50 p-5">
                    <h3 className="font-medium text-gray-700 mb-3">Included Services:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Array.isArray(plan.services) && plan.services.map((service, index) => (
                        <li key={index} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                            <span className="text-gray-700">{service.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto max-w-md">
                <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No plans found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try a different search term' : 'Get started by creating a new plan'}
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddPlan}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-5 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Plan' : 'Add New Plan'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
              >
                <XIcon size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                      placeholder="e.g. Premium Plan"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-8 px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        className={`w-2/3 px-4 py-2 border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                      />
                      <select
                        name="durationUnit"
                        value={formData.durationUnit}
                        onChange={handleInputChange}
                        className="w-1/3 px-4 py-2 border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                    {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Services Count
                    </label>
                    <div className="px-4 py-2 bg-gray-100 rounded-lg">
                      <span className="font-medium">{formData.services.length}</span>
                      <span className="text-gray-600 ml-2">services added</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Services *
                  </label>
                  <div className="mb-4 space-y-2 max-h-60 overflow-y-auto p-2">
                    {formData.services.length > 0 ? (
                      formData.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                            <span className="text-gray-700">{service.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          >
                            <XIcon size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No services added yet
                      </div>
                    )}
                  </div>
                  {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
                  
                  {/* Service Selection - Improved Dropdown */}
                  <div className="relative">
                    <div className="flex">
                      <div className="relative flex-1">
                        <input
                          ref={serviceInputRef}
                          type="text"
                          value={serviceSearchTerm}
                          onChange={(e) => setServiceSearchTerm(e.target.value)}
                          onFocus={() => setShowServiceDropdown(true)}
                          placeholder="Search for a service to add..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {showServiceDropdown && (
                          <div 
                            ref={serviceDropdownRef}
                            className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                            style={{ maxHeight: '250px' }}
                          >
                            {filteredServices.length > 0 ? (
                              filteredServices.map((service) => (
                                <div
                                  key={service._id}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleSelectService(service)}
                                >
                                  {service.name}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">No services found</div>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={toggleServiceDropdown}
                        className="bg-gray-200 hover:bg-gray-300 px-4 rounded-r-lg flex items-center justify-center"
                      >
                        {showServiceDropdown ? (
                          <ChevronUpIcon size={20} />
                        ) : (
                          <ChevronDownIcon size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isEditing ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <DeleteConfirmationPopup
          itemName={currentPlan?.name}
          onCancel={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Success popups */}
      {showAddSuccess && (
        <AddSuccessPopup 
          message="Plan added successfully!" 
          onClose={() => setShowAddSuccess(false)} 
        />
      )}
      
      {showUpdateSuccess && (
        <UpdateSuccessPopup 
          message="Plan updated successfully!" 
          onClose={() => setShowUpdateSuccess(false)} 
        />
      )}
      
      {showDeleteSuccess && (
        <DeleteSuccessPopup 
          message="Plan deleted successfully!" 
          onClose={() => setShowDeleteSuccess(false)} 
        />
      )}
    </div>
  );
}