"use client";

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiHome,FiAlertCircle, FiCalendar, FiTruck, FiCreditCard, FiLock, FiUpload, FiChevronDown, FiShoppingBag, FiKey, FiEdit2, FiTrash2, FiPlus, FiSearch, FiDollarSign, FiBook, FiEdit, FiStar, FiZap, FiGlobe, FiShield, FiMapPin, FiFileText, FiEye,FiX,FiSave,FiLoader } from 'react-icons/fi';
import AddSuccessPopup from '@/components/popups/addSucess';
import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import LoadingSpinner from '@/components/Loading';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
      city: 'Pune'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      username: 'priya_s',
      password: 'password123',
      contactNo: '8765432109',
      registrationDate: '2023-02-20',
      city: 'Mumbai'
    },
  ];

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required').min(3, 'Minimum 3 characters'),
    username: Yup.string().required('Username is required').min(4, 'Minimum 4 characters'),
    password: Yup.string().required('Password is required').min(8, 'Minimum 8 characters'),
    contactNo: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    city: Yup.string().required('City is required'),
  });
  const fetchStaffManager = async () => {
    try {
        const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/staff-manager/fetch-manager", {
            method: 'GET'
        });

        if (!response.ok) {
            console.log("Failed to fetch staff managers. Status:", response.status);
            return [];
        }
        
        const data = await response.json();
        console.log("Fetched Staff Managers:", data.managers);
        return data.managers;
    } catch (error) {
        console.error("Error fetching staff managers:", error.message);
        return [];
    }
};

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

       const newdata= await fetchStaffManager();
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStaffs(newdata);
      console.log(`------${staffs}-------`);
      
      setIsLoading(false);

      
    };
    loadStaffData();
   
  }, []);

  // Handle form submission
  // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  //   try {
  //     console.log("Form Submitted with values:", values); 
  //     // Simulate API call delay
  //     await new Promise(resolve => setTimeout(resolve, 500));

  //     if (editingStaff) {
  //       // Update existing staff
  //       setStaffs(staffs.map(staff =>
  //         staff.id === editingStaff.id ? { ...values, id: editingStaff.id } : staff
  //       ));
  //     } else {
  //       // Add new staff
  //       const newStaff = {
  //         ...values,
  //         id: Math.max(...staffs.map(s => s.id), 0) + 1,
  //         registrationDate: new Date().toISOString().split('T')[0]
  //       };
  //       setStaffs([...staffs, newStaff]);
  //     }

  //     // Reset form and UI state
  //     resetForm();
  //     setEditingStaff(null);
  //     setShowAddForm(false);
  //   } catch (error) {
  //     console.error('Error saving staff:', error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  //   try {
  //     console.log("Form Submitted with values:", values); // Log form values
  
  //     const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/staff-manager/add-manager', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(values),
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       console.log("API Response:", data);
  //       alert("Staff registered successfully!"); // Notify user
  
  //       // Reset form and UI state
  //       resetForm();
  //       setEditingStaff(null);
  //       setShowAddForm(false);
  //     } else {
  //       console.error("API Error:", data);
  //       alert("Failed to register staff. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Network Error:", error);
  //     alert("Network error. Please check your connection.");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Form Submitted with values:", values);
      
      let url, method;
      if (editingStaff) {
        // Update existing staff
        url = ` https://dokument-guru-backend.vercel.app/api/admin/staff-manager/update-manager/${editingStaff._id}`;
        method = 'PATCH';
      } else {
        // Add new staff
        url = ' https://dokument-guru-backend.vercel.app/api/admin/staff-manager/add-manager';
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
        const updatedStaffs = await fetchStaffManager();
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
      console.error("Network Error:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };
  // Delete a staff member
  const handleDeleteStaff = async(id) => {
    setStaffToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/staff-manager/delete-manager/${staffToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedStaffs = await fetchStaffManager();
        setStaffs(updatedStaffs);
        setShowDeleteSuccess(true);
      } else {
        console.error("Failed to delete staff");
        alert("Failed to delete staff. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setShowDeleteConfirm(false);
      setStaffToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
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
    staff.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastStaff = currentPage * staffsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffsPerPage;
  const currentStaffs = filteredStaffs.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaffs.length / staffsPerPage);

  // Custom error message component
  const CustomErrorMessage = ({ name }) => (
    <ErrorMessage name={name}>
      {msg => (
        <div className="text-red-600 text-xs mt-1 flex items-center font-medium">
          <FiAlertCircle className="mr-1" />
          <span style={{ color: 'red' }}>{msg}</span>
        </div>
      )}
    </ErrorMessage>
  );

  // Add/Edit staff form component
  const StaffForm = () => {
    const initialValues = editingStaff || {
      name: '',
      username: '',
      password: '',
      contactNo: '',
      city: '',
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 w-full">
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {editingStaff ? 'Edit Staff Member' : 'Staff Manager Registration'}
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
                <CustomErrorMessage name="name" />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <Field
                  name="contactNo"
                  type="tel"
                  className={`w-full px-4 py-3 border ${values.contactNo ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                  placeholder="+91 9876543210"
                />
                <CustomErrorMessage name="contactNo" />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <div className="relative">
                  <Field
                    as="select"
                    name="city"
                    className={`w-full px-4 py-3 border ${values.city ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none transition-all bg-white`}
                  >
                    <option value="">Select a city</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="AhilyaNagar">AhilyaNagar</option>
                    <option value="SambhajiNagar">SambhajiNagar</option>
                    <option value="Delhi">Delhi</option>
                  </Field>
                  <FiChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                </div>
                <CustomErrorMessage name="city" />
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
                <CustomErrorMessage name="username" />
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
                <CustomErrorMessage name="password" />
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
            {showAddForm ? 'Cancel' : 'Add New Staff Manager'}
          </button>
        </div>
      </div>

      {/* Staff Form (Conditionally Rendered) */}
      {showAddForm && <StaffForm />}

      {/* Search Section */}
      {!showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff by name, phone or city.."
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
            <LoadingSpinner 
              loadingText="Loading Staff Data" 
              description="Please wait while we fetch the staff information..."
            />
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
                        City
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentStaffs.length > 0 ? (
                      currentStaffs.map((staff) => (
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
                            {(() => {
                              console.log('Registration Date:', staff.registrationDate);
                              if (!staff.registrationDate) return 'N/A';
                              const date = new Date(staff.registrationDate);
                              return date instanceof Date && !isNaN(date) 
                                ? date.toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'N/A';
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{staff.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{staff.contactNo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{staff.city}</div>
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
      {showDeleteConfirm && (
        <DeleteConfirmationPopup
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default StaffManagement;