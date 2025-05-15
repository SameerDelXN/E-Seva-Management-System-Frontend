"use client";

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiHome, FiCheck, FiAlertCircle,FiCalendar, FiTruck, FiCreditCard, FiLock, FiUpload, FiChevronDown, FiShoppingBag, FiKey, FiEdit2, FiTrash2, FiPlus, FiSearch, FiDollarSign, FiBook, FiEdit, FiStar, FiZap, FiGlobe, FiShield, FiMapPin, FiFileText, FiEye,FiX,FiSave,FiLoader } from 'react-icons/fi';
// Import popup components
import AddSuccessPopup from '@/components/popups/addSucess';
import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import Loading from '@/components/Loading';

const StaffManagement = () => {
  // State for staff data and UI
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // Add this with your other state declarations
const [showServicesModal, setShowServicesModal] = useState(false);
const [selectedStaffServices, setSelectedStaffServices] = useState([]);
  const staffsPerPage = 10;
  
  // Popup states
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Initial data - in a real app, this would come from an API

  const fetchStaffs = async () => {
    try {
        const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/staff/fetch-all-staff", {
            method: 'GET'
        });

        if (!response.ok) {
            console.log("Failed to fetch staff managers. Status:", response.status);
            return [];
        }
        
        const data = await response.json();
        console.log("Fetched Staff Managers:", data);
        return data.data;
    } catch (error) {
        console.error("Error fetching staff managers:", error.message);
        return [];
    }
};
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch service groups
      const serviceGroupsResponse = await fetch('https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/getAll-Groups');
      const serviceGroupsData = await serviceGroupsResponse.json();
      
      if (serviceGroupsData && serviceGroupsData.serviceGroups) {
        setServiceGroups(serviceGroupsData.serviceGroups);
      }
      
      // Fetch locations
      const locationsResponse = await fetch('https://dokument-guru-backend.vercel.app/api/admin/location/fetch-all');
      const locationsData = await locationsResponse.json();
      
      if (locationsData && locationsData.locations) {
        setLocations(locationsData.locations);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
const ServicesModal = ({ services, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Services</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-2">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-3 rounded">
                <FiCheck className="text-green-500 mr-2" />
                <span className="text-gray-700">{service.serviceName}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No services assigned</p>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
  // Form validation schema
 

  // Custom error message component
  const ErrorMessage = ({ children }) => (
    <div className="text-red-500 text-xs mt-1 flex items-center bg-red-50 p-2 rounded-md">
      <FiAlertCircle className="mr-1" /> {children}
    </div>
  );

  // Load staff data (simulating API call)
  useEffect(() => {
   
    const loadStaffData = async () => {
      setIsLoading(true);
     
       const newdata= await fetchStaffs();
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStaffs(newdata);
      setIsLoading(false);

      
    };
    loadStaffData();
   
  }, []);

  // Handle form submission
 


  
  // Delete a staff member
  const handleDeleteStaff = async(id) => {
    setStaffToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // Confirm delete staff
  const confirmDeleteStaff = async () => {
    try {
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/staff/delete-staff/${staffToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Show success popup
        setShowDeleteSuccess(true);
        
        // Update staff list
        const updatedStaffs = await fetchStaffs();
        setStaffs(updatedStaffs);
      } else {
        alert("Failed to delete staff. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("An error occurred while deleting staff.");
    } finally {
      setShowDeleteConfirmation(false);
      setStaffToDelete(null);
    }
  };

  // Cancel delete staff
  const cancelDeleteStaff = () => {
    setShowDeleteConfirmation(false);
    setStaffToDelete(null);
  };

  // Edit staff member
  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setShowAddForm(true);
  };

  // Filter staff based on search term
  const filteredStaffs = staffs.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.contactNo.includes(searchTerm) ||
    staff.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.ServiceGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );
const[serviceGroups,setServiceGroups]=useState([]);
  const fetchServiceGroups = async () => {
    try {
      const res = await fetch("https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/fetch-group-names");
      const data = await res.json();

      if (res.ok) {
        
        console.log("✅ Service Groups:", data.serviceGroups);
        setServiceGroups(data.serviceGroups);
      } else {
        console.error("❌ Failed to fetch service groups:", data.message || data);
      }
    } catch (err) {
      console.error("❌ Error fetching service groups:", err);
    }
  };
 useEffect(() => {
  fetchServiceGroups();
  }, []);

  
  const calculateServiceCounts = (staffData) => {
    const serviceCounts = {
      'E-Seva Kendra': 0,
      'RTO Services': 0,
      'CA Services': 0,
      'Legal Services': 0,
      'Online Form Filling': 0,
      'Maha E-Seva Kendra': 0,
      'DocumentGuru Membership': 0,
      'Banking Services': 0,
      'Quick Services': 0,
      'ABHIMEX': 0
    };
  
     console.log(staffData);
    // staffData?.forEach(staff => {
    //   // Split the ServiceGroup string into individual services
    //   const services = staff.serviceGroups.split(',').map(s => s.trim());
      
    //   services.forEach(service => {
    //     if (serviceCounts.hasOwnProperty(service)) {
    //       serviceCounts[service]++;
    //     }
    //   });
    // });
  
    return serviceCounts;
  };
  // Pagination logic
  const indexOfLastStaff = currentPage * staffsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffsPerPage;
  const currentStaffs = filteredStaffs.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaffs.length / staffsPerPage);

  // Add/Edit staff form component

 const refetchStaffData = async () => {
    setIsLoading(true);
    const newData = await fetchStaffs();
    setStaffs(newData);
    setIsLoading(false);
  };

const StaffForm = ({ editingStaff, setShowAddForm, setEditingStaff,onSuccess  }) => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch service groups on component mount
  useEffect(() => {
    const fetchServiceGroups = async () => {
      try {
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/getAll-Groups');
        const data = await response.json();
        if (data && data.serviceGroups) {
          setServiceGroups(data.serviceGroups);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching service groups:', error);
        setIsLoading(false);
      }
    };

    fetchServiceGroups();
  }, []);

  // Initialize selected services when editing
  useEffect(() => {
    if (editingStaff && editingStaff.serviceGroups) {
      setSelectedServices(editingStaff.serviceGroups);
    }
  }, [editingStaff]);

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    contactNo: Yup.string().required('Contact number is required').matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    location: Yup.string().required('Location is required'),
    serviceGroups: Yup.array().min(1, 'Select at least one service'),
    selectedServiceGroup: Yup.string()
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Combine the form values with the selected services
      const submissionData = {
        ...values,
        serviceGroups: selectedServices
      };
      
      console.log("data", submissionData);
      
      // API call to save or update staff
      const url = editingStaff 
        ? ` https://dokument-guru-backend.vercel.app/api/admin/staff/update-staff/${editingStaff._id}` 
        : 'https://dokument-guru-backend.vercel.app/api/admin/staff/add-staff';
        
      const response = await fetch(url, {
        method: editingStaff ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log("asdf",data)
      if (data.message=="success") {

        resetForm();
        setSelectedGroup(null);
        setSelectedServices([]);
        setShowAddForm(false);
        fetchStaffs()
        setEditingStaff(null);
        // Handle success - reset form or close modal
        if (!editingStaff) resetForm();
        setShowAddForm(false);
        setEditingStaff(null);
        if (onSuccess) {
          onSuccess();
        }
        // You might want to add a toast notification here
        alert(editingStaff ? 'Staff updated successfully!' : 'Staff registered successfully!');
        
      } else {
        // Handle error response
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize form values
  const initialValues = editingStaff || {
    name: '',
    username: '',
    password: '',
    contactNo: '',
    location: '',
    selectedServiceGroup: '',
    serviceGroups: []
  };

  // Handle service group selection
  const handleServiceGroupChange = (e, setFieldValue) => {
    const groupId = e.target.value;
    setFieldValue('selectedServiceGroup', groupId);
    
    if (groupId) {
      const group = serviceGroups.find(g => g._id === groupId);
      setSelectedGroup(group);
    } else {
      setSelectedGroup(null);
    }
  };

  // Handle service selection
  const handleServiceSelection = (e, serviceId, serviceName, setFieldValue) => {
    if (e.target.checked) {
      // Add service to selection
      const updatedServices = [...selectedServices, {
        serviceId,
        serviceName
      }];
      setSelectedServices(updatedServices);
      setFieldValue('serviceGroups', updatedServices);
    } else {
      // Remove service from selection
      const updatedServices = selectedServices.filter(s => s.serviceId !== serviceId);
      setSelectedServices(updatedServices);
      setFieldValue('serviceGroups', updatedServices);
    }
  };

  // Check if a service is selected
  const isServiceSelected = (serviceId) => {
    return selectedServices.some(s => s.serviceId === serviceId);
  };

  // Remove a selected service
  const removeSelectedService = (serviceId, setFieldValue) => {
    const updatedServices = selectedServices.filter(s => s.serviceId !== serviceId);
    setSelectedServices(updatedServices);
    setFieldValue('serviceGroups', updatedServices);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {editingStaff ? 'Edit Staff Member' : 'Staff Registration'}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {editingStaff ? 'Update staff details below' : 'Complete the form below to register as an authorized staff'}
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form className="space-y-6">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 p-6">
              {/* Personal Information Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiUser className="text-green-600 text-xl" />
                  </div>
                  <h2 className="ml-4 text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Field
                      name="name"
                      type="text"
                      className={`w-full px-4 py-3 border ${
                        values.name ? 'border-green-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && touched.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <Field
                      name="contactNo"
                      type="tel"
                      className={`w-full px-4 py-3 border ${
                        values.contactNo ? 'border-green-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      placeholder="9876543210"
                      maxLength="10"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.contactNo && touched.contactNo && <ErrorMessage>{errors.contactNo}</ErrorMessage>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <div className="relative">
                      <Field
  as="select"
  name="location"
  className={`w-full px-4 py-3 border ${
    values.location ? 'border-green-300' : 'border-gray-300'
  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none transition-all bg-white`}
>
  <option value="">Select a location</option>
  {locations.map((location) => (
    <option key={location._id} value={location.district}>
      {location.district}, {location.state}
    </option>
  ))}
</Field>
                      <FiChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.location && touched.location && <ErrorMessage>{errors.location}</ErrorMessage>}
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiCheck className="text-green-600 text-xl" />
                  </div>
                  <h2 className="ml-4 text-xl font-semibold text-gray-800">
                    Service Groups
                  </h2>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <FiLoader className="animate-spin text-green-600 text-xl" />
                    <span className="ml-2 text-gray-600">Loading service groups...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Service Group Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Service Group *</label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="selectedServiceGroup"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none transition-all bg-white"
                          onChange={(e) => handleServiceGroupChange(e, setFieldValue)}
                        >
                          <option value="">Select a service group</option>
                          {serviceGroups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.name}
                            </option>
                          ))}
                        </Field>
                        <FiChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Services for Selected Group */}
                    {selectedGroup && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Services from {selectedGroup.name}
                        </label>
                        {selectedGroup.services && selectedGroup.services.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedGroup.services.map((service) => (
                              <div key={service.serviceId} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`service-${service.serviceId}`}
                                  checked={isServiceSelected(service.serviceId)}
                                  onChange={(e) => handleServiceSelection(e, service.serviceId, service.name, setFieldValue)}
                                  className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                                />
                                <label htmlFor={`service-${service.serviceId}`} className="ml-2 text-gray-700">
                                  {service.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No services available for this group.</p>
                        )}
                      </div>
                    )}
                    
                    {/* Selected Services Display */}
                    {selectedServices.length > 0 && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Selected Services:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedServices.map((service) => (
                            <div 
                              key={service.serviceId} 
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center"
                            >
                              <span>{service.serviceName}</span>
                              <button
                                type="button"
                                onClick={() => removeSelectedService(service.serviceId, setFieldValue)}
                                className="ml-2 text-green-600 hover:text-green-900"
                              >
                                <FiX />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {errors.serviceGroups && touched.serviceGroups && (
                      <div className="text-red-500 text-sm mt-1">{errors.serviceGroups}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Login Information Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiKey className="text-green-600 text-xl" />
                  </div>
                  <h2 className="ml-4 text-xl font-semibold text-gray-800">
                    Login Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <Field
                      name="username"
                      type="text"
                      className={`w-full px-4 py-3 border ${
                        values.username ? 'border-green-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      placeholder="johndoe123"
                    />
                    {errors.username && touched.username && <ErrorMessage>{errors.username}</ErrorMessage>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <Field
                        name="password"
                        type="text"
                        className={`w-full px-4 py-3 border ${
                          values.password ? 'border-green-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                       
                      />
                    </div>
                    {errors.password && touched.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStaff(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center transition-colors duration-200"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-lg shadow-sm text-white flex items-center transition-colors duration-200 ${
                    isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      {editingStaff ? 'Update Staff' : 'Save Staff'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
  const serviceCounts = calculateServiceCounts(staffs);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage all registered staff in your system</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingStaff(null);
            }}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            <FiPlus className="mr-2" />
            {showAddForm ? 'Cancel' : 'Add New Staff'}
          </button>
        </div>
      </div>

      {/* Staff Form (Conditionally Rendered) */}
      {/* {showAddForm && <StaffForm />} */}
      {showAddForm && (
  <StaffForm 
    editingStaff={editingStaff}
    setShowAddForm={setShowAddForm}
    setEditingStaff={setEditingStaff}
    onSuccess={refetchStaffData}
  />
)}

      {/* Service Cards */}
      {!showAddForm && (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  
  {serviceGroups.map((service, index) => (
  <div 
    key={index} 
    className="relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 group"
  >
    {/* Notification Badge - You can uncomment if needed */}
    {/* {service.notification && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {service.notification}
      </span>
    )} */}
    
    <div className="flex items-center space-x-4">
      {/* Icon/Image Container */}
      <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex-shrink-0 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors`}>
        {service.image ? (
          <img 
            src={service.image} 
            alt={service.name} 
            className="h-10 w-10 object-contain rounded-sm"
          />
        ) : (
          <div className="h-10 w-10 flex items-center justify-center">
            <FiFile className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className="text-lg font-semibold capitalize text-gray-800 truncate">
          {service.name}
        </span>
        
      </div>
    </div>
    
   
   
  </div>
))}
     </div>
     
      )}

      {/* Search Section */}
      {!showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff by name, phone, location or services..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Staff Table */}
      {!showAddForm && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {isLoading ? (
            <Loading loadingText="Loading Staff Data" description="Please wait while we fetch the staff information..." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Registration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile No.
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Services
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentStaffs.length > 0 ? (
                      currentStaffs.reverse().map((staff) => (
                        <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <FiUser className="text-green-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {/* {new Date(staff.registrationDate).toLocaleDateString('en-IN')} */}
                            {new Date(staff.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{staff.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{staff.contactNo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{staff.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-gray-900">
    {staff.serviceGroups.length > 0 ? (
      <button
        onClick={() => {
          setSelectedStaffServices(staff.serviceGroups);
          setShowServicesModal(true);
        }}
        className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-md shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        View Services
      </button>
    ) : (
      <span className="text-gray-400">No services</span>
    )}
  </div>
</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditStaff(staff)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(staff._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          {searchTerm ? 'No staff found matching your search' : 'No staff members available'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredStaffs.length > staffsPerPage && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstStaff + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastStaff, filteredStaffs.length)}</span> of{' '}
                      <span className="font-medium">{filteredStaffs.length}</span> staff
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {showServicesModal && (
  <ServicesModal 
    services={selectedStaffServices}
    onClose={() => setShowServicesModal(false)}
  />
)}

      {/* Popups */}
      {showAddSuccess && <AddSuccessPopup onClose={() => setShowAddSuccess(false)} />}
      {showDeleteSuccess && <DeleteSuccessPopup onClose={() => setShowDeleteSuccess(false)} />}
      {showUpdateSuccess && <UpdateSuccessPopup onClose={() => setShowUpdateSuccess(false)} />}
      {showDeleteConfirmation && (
        <DeleteConfirmationPopup 
          onConfirm={confirmDeleteStaff} 
          onCancel={cancelDeleteStaff} 
        />
      )}
    </div>
  );
};

export default StaffManagement;