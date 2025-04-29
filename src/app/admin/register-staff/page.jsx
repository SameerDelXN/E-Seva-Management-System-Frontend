"use client";

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiHome, FiAlertCircle,FiCalendar, FiTruck, FiCreditCard, FiLock, FiUpload, FiChevronDown, FiShoppingBag, FiKey, FiEdit2, FiTrash2, FiPlus, FiSearch, FiDollarSign, FiBook, FiEdit, FiStar, FiZap, FiGlobe, FiShield, FiMapPin, FiFileText, FiEye,FiX,FiSave,FiLoader } from 'react-icons/fi';
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
  const staffsPerPage = 10;
  
  // Popup states
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Initial data - in a real app, this would come from an API
  const initialStaffs = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      username: 'rajesh_k',
      password: 'password123',
      contactNo: '9876543210',
      registrationDate: '2023-01-15',
      location: 'Pune',
      ServiceGroup: 'E-Seva Kendra, RTO Services'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      username: 'priya_s',
      password: 'password123',
      contactNo: '8765432109',
      registrationDate: '2023-02-20',
      location: 'Mumbai',
      ServiceGroup: 'CA Services, Legal Services'
    },
    // ... more initial staff data
  ];
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
  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full name is required')
      .min(3, 'Minimum 3 characters'),
    username: Yup.string()
      .required('Username is required')
      .min(4, 'Minimum 4 characters')
      .test('unique-username', 'Username already exists', function(value) {
        if (!value) return true;
        // Check if username exists in current staff list
        const isDuplicate = staffs.some(staff => 
          staff.username.toLowerCase() === value.toLowerCase() && 
          (!editingStaff || staff._id !== editingStaff._id)
        );
        return !isDuplicate;
      }),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Minimum 8 characters'),
    contactNo: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .test('unique-phone', 'Phone number already exists', function(value) {
        if (!value) return true;
        // Check if phone exists in current staff list
        const isDuplicate = staffs.some(staff => 
          staff.contactNo === value && 
          (!editingStaff || staff._id !== editingStaff._id)
        );
        return !isDuplicate;
      }),
    location: Yup.string()
      .required('City is required'),
    ServiceGroup: Yup.string()
      .required('Services are required'),
  });

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
     
    
      // const fetchStaffManager = async () => {
      //   try {
      //     const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/staff-manager/fetch-manager",{
      //       method:'GET'
      //     });
          
      //     if (!response.ok) {
      //       console.log("Failed to fetch agents. Status:", response.status);
      //       return;
      //     }
      //     const data = await response.json();  // ✅ Parse JSON
      //   console.log("Fetched Staff Managers:", data.managers);
      //   return data.managers;
      //     // const data = await response.json();
      //     // setAgents(data.data); // Store fetched data in state
      //   } catch (error) {
      //     console.error("Error fetching agents:", error.message);
      //   }
      // };

       const newdata= await fetchStaffs();
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStaffs(newdata);
      setIsLoading(false);

      
    };
    loadStaffData();
   
  }, []);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Check for duplicates in the current staff list
      const usernameExists = staffs.some(staff => 
        staff.username.toLowerCase() === values.username.toLowerCase() && 
        (!editingStaff || staff._id !== editingStaff._id)
      );

      if (usernameExists) {
        alert('Username already exists. Please choose a different username.');
        setSubmitting(false);
        return;
      }

      const phoneExists = staffs.some(staff => 
        staff.contactNo === values.contactNo && 
        (!editingStaff || staff._id !== editingStaff._id)
      );

      if (phoneExists) {
        alert('Phone number already exists. Please use a different phone number.');
        setSubmitting(false);
        return;
      }

      console.log(values);

      let url, method;

      if (editingStaff) {
        // Update existing staff
        url = `https://dokument-guru-backend.vercel.app/api/admin/staff/update-staff/${editingStaff._id}`;
        method = 'PUT';
      } else {
        // Add new staff
        url = 'https://dokument-guru-backend.vercel.app/api/admin/staff/add-staff';
        method = 'POST';
      }
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("API Response:", data);
        
        // Show appropriate success popup
        if (editingStaff) {
          setShowUpdateSuccess(true);
        } else {
          setShowAddSuccess(true);
        }
        
        // Refresh the staff list after successful operation
        const updatedStaffs = await fetchStaffs();
        setStaffs(updatedStaffs);
        
        // Reset form and UI state
        resetForm();
        setEditingStaff(null);
        setShowAddForm(false);
      } else {
        console.error("API Error:", data);
        alert(`Failed to ${editingStaff ? 'update' : 'register'} staff. Please try again.`);
      }
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('An error occurred while saving staff. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
  
    staffData.forEach(staff => {
      // Split the ServiceGroup string into individual services
      const services = staff.ServiceGroup.split(',').map(s => s.trim());
      
      services.forEach(service => {
        if (serviceCounts.hasOwnProperty(service)) {
          serviceCounts[service]++;
        }
      });
    });
  
    return serviceCounts;
  };
  // Pagination logic
  const indexOfLastStaff = currentPage * staffsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffsPerPage;
  const currentStaffs = filteredStaffs.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaffs.length / staffsPerPage);

  // Add/Edit staff form component
  const StaffForm = () => {
    const initialValues = editingStaff || {
      name: '',
      username: '',
      password: '',
      contactNo: '',
      location: '',
      ServiceGroup: ''
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
    {({ isSubmitting, values }) => (
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
                  className={`w-full px-4 py-3 border ${values.name ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  placeholder="John Doe"
                />
                <FormikErrorMessage name="name" component={ErrorMessage} />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <Field
                  name="contactNo"
                  type="tel"
                  className={`w-full px-4 py-3 border ${values.contactNo ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  placeholder="9876543210"
                  maxLength="10"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <FormikErrorMessage name="contactNo" component={ErrorMessage} />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">location *</label>
                <div className="relative">
                  <Field
                    as="select"
                    name="location"
                    className={`w-full px-4 py-3 border ${values.location ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none transition-all bg-white`}
                  >
                    <option value="">Select a location</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="AhilyaNagar">AhilyaNagar</option>
                    <option value="SambhajiNagar">SambhajiNagar</option>
                    <option value="Delhi">Delhi</option>
                  </Field>
                  <FiChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                </div>
                <FormikErrorMessage name="location" component={ErrorMessage} />
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services *</label>
                <div className="relative">
                  <Field
                    as="select"
                    name="ServiceGroup"
                    className={`w-full px-4 py-3 border ${values.ServiceGroup ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none transition-all bg-white`}
                  >
                    <option value="">Select services</option>
                    <option value="E-Seva Kendra">E-Seva Kendra</option>
                    <option value="RTO Services">RTO Services</option>
                    <option value="CA Services">CA Services</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Quick Services">Quick Services</option>
                    <option value="Banking Services">Banking Services</option>
                    <option value="Maha E-Seva Kendra">Maha E-Seva Kendra</option>
                    <option value="DocumentGuru Membership">DocumentGuru Membership</option>
                    <option value="ABIMEX">ABIMEX</option>
                    <option value="Multiple Services">Multiple Services</option>
                  </Field>
                  <FiChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                </div>
                <FormikErrorMessage name="ServiceGroup" component={ErrorMessage} />
              </div>
            </div>
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
                  className={`w-full px-4 py-3 border ${values.username ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  placeholder="johndoe123"
                />
                <FormikErrorMessage name="username" component={ErrorMessage} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <Field
                    name="password"
                    type="password"
                    className={`w-full px-4 py-3 border ${values.password ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                    placeholder="••••••••"
                  />
                  <button type="button" className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  </button>
                </div>
                <FormikErrorMessage name="password" component={ErrorMessage} />
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
      {showAddForm && <StaffForm />}

      {/* Service Cards */}
      {!showAddForm && (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
       {[
    { icon: <FiHome />, name: 'E-Seva Kendra', color: 'green' },
    { icon: <FiTruck />, name: 'RTO Services', color: 'blue' },
    { icon: <FiDollarSign />, name: 'CA Services', color: 'yellow' },
    { icon: <FiBook />, name: 'Legal Services', color: 'red' },
    { icon: <FiEdit />, name: 'Online Form Filling', color: 'purple' },
    { icon: <FiHome />, name: 'Maha E-Seva Kendra', color: 'green' },
    { icon: <FiFileText />, name: 'DocumentGuru Membership', color: 'blue' },
    { icon: <FiCreditCard />, name: 'Banking Services', color: 'yellow' },
    { icon: <FiZap />, name: 'Quick Services', color: 'red' },
    { icon: <FiGlobe />, name: 'ABHIMEX', color: 'purple' },
  ].map((service, index) => {
    const count = serviceCounts[service.name] || 0;
    
    return (
      <div key={index} className="relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        {/* Notification Badge */}
        {count > 0 && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${service.color}-100 text-${service.color}-600 mr-4`}>
            {service.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{service.name}</p>
          </div>
        </div>
      </div>
    );
  })}
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
                              {staff.ServiceGroup}
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