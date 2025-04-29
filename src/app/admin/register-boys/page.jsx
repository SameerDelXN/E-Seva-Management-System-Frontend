"use client";

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiHome, FiAlertCircle, FiCalendar, FiTruck, FiMapPin, FiLock, FiUpload, FiChevronDown, FiShoppingBag, FiKey, FiEdit2, FiTrash2, FiPlus, FiSearch, FiDollarSign, FiBook, FiEdit, FiStar, FiZap, FiGlobe, FiShield, FiFileText, FiEye, FiX, FiSave, FiLoader } from 'react-icons/fi';
import AddSuccessPopup from '@/components/popups/addSucess';
import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import LoadingSpinner from '@/components/Loading';

const FieldBoysManagement = () => {
    // State for field boys data and UI
    const [fieldBoys, setFieldBoys] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingFieldBoy, setEditingFieldBoy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const fieldBoysPerPage = 10;

    // Popup states
    const [showAddSuccess, setShowAddSuccess] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    const [fieldBoyToDelete, setFieldBoyToDelete] = useState(null);

    // Initial data - in a real app, this would come from an API
    const initialFieldBoys = [
        {
            id: 1,
            name: 'Amit Patel',
            contactNo: '9876543210',
            registrationDate: '2023-01-15',
            aadharNo: '123456789012',
            panCard: 'ABCDE1234F',
            location: 'North',
            address: 'Wakad, Pune'
        },
        {
            id: 2,
            name: 'Suresh Kumar',
            contactNo: '8765432109',
            registrationDate: '2023-02-20',
            aadharNo: '234567890123',
            panCard: 'FGHIJ5678K',
            location: 'South',
            address: 'Kothrud, Pune'
        },
    ];

    // Form validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Full name is required').min(3, 'Minimum 3 characters'),
        contactNo: Yup.string().required('Phone number is required').matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
        aadharNo: Yup.string().required('Aadhar number is required').matches(/^[0-9]{12}$/, 'Aadhar must be 12 digits'),
        panCard: Yup.string().required('PAN Card is required').matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
        location: Yup.string().required('Location is required'),
        address: Yup.string().required('Address is required'),
    });

    const fetchFieldBoys = async () => {
        try {
            // For testing purposes, return the initial data
            return initialFieldBoys;
        } catch (error) {
            console.error("Error fetching field boys:", error);
            alert("Failed to fetch field boys. Please try again later.");
            return [];
        }
    };

    // Load field boys data (simulating API call)
    useEffect(() => {
        const loadFieldBoysData = async () => {
            setIsLoading(true);

            // In a real application, uncomment this to fetch actual data
            // const newdata = await fetchFieldBoys();

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // For demo purposes, use initial data
            setFieldBoys(initialFieldBoys);
            setIsLoading(false);
        };
        loadFieldBoysData();
    }, []);

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            console.log("Form Submitted with values:", values);

            let url, method;
            if (editingFieldBoy) {
                // Update existing field boy
                url = `/api/admin/field-boys/update-boy/${editingFieldBoy._id}`;
                method = 'PATCH';
            } else {
                // Add new field boy
                url = '/api/admin/field-boys/add-boy';
                method = 'POST';
            }

            // For testing purposes, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful response
            const mockResponse = {
                success: true,
                message: editingFieldBoy ? 'Field boy updated successfully' : 'Field boy added successfully',
                fieldBoy: {
                    ...values,
                    id: editingFieldBoy ? editingFieldBoy.id : Date.now(),
                    registrationDate: new Date().toISOString()
                }
            };

            // Show appropriate success popup
            if (editingFieldBoy) {
                setShowUpdateSuccess(true);
            } else {
                setShowAddSuccess(true);
            }

            // Update local state
            if (editingFieldBoy) {
                setFieldBoys(prevBoys =>
                    prevBoys.map(boy =>
                        boy.id === editingFieldBoy.id ? mockResponse.fieldBoy : boy
                    )
                );
            } else {
                setFieldBoys(prevBoys => [...prevBoys, mockResponse.fieldBoy]);
            }

            // Reset form and UI state
            resetForm();
            setEditingFieldBoy(null);
            setShowAddForm(false);

        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`Failed to ${editingFieldBoy ? 'update' : 'register'} field boy. Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete a field boy
    const handleDeleteFieldBoy = async (id) => {
        setFieldBoyToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/field-boys/delete-boy/${fieldBoyToDelete}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const updatedFieldBoys = await fetchFieldBoys();
                setFieldBoys(updatedFieldBoys);
                setShowDeleteSuccess(true);
            } else {
                console.error("Failed to delete field boy");
                alert("Failed to delete field boy. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting field boy:", error);
            alert("Network error. Please check your connection.");
        } finally {
            setShowDeleteConfirm(false);
            setFieldBoyToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setFieldBoyToDelete(null);
    };

    // Edit field boy
    const handleEditFieldBoy = (fieldBoy) => {
        setEditingFieldBoy(fieldBoy);
        setShowAddForm(true);
    };

    // Filter field boys based on search term
    const filteredFieldBoys = fieldBoys.filter(fieldBoy =>
        fieldBoy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fieldBoy.contactNo.includes(searchTerm) ||
        fieldBoy.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fieldBoy.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastFieldBoy = currentPage * fieldBoysPerPage;
    const indexOfFirstFieldBoy = indexOfLastFieldBoy - fieldBoysPerPage;
    const currentFieldBoys = filteredFieldBoys.slice(indexOfFirstFieldBoy, indexOfLastFieldBoy);
    const totalPages = Math.ceil(filteredFieldBoys.length / fieldBoysPerPage);

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

    // Add/Edit field boy form component
    const FieldBoyForm = () => {
        const initialValues = editingFieldBoy || {
            name: '',
            contactNo: '',
            aadharNo: '',
            panCard: '',
            location: '',
            address: '',
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {editingFieldBoy ? 'Edit Field Boy' : 'Field Boy Registration'}
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto justify-center items-center">
                            {editingFieldBoy ? 'Update field boy details below' : 'Complete the form below to register a new field boy'}
                        </p>
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <div className="relative">
                                        <Field
                                            name="name"
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter full name"
                                        />
                                        <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                    <CustomErrorMessage name="name" />
                                </div>

                                {/* Contact Number Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                                    <div className="relative">
                                        <Field
                                            name="contactNo"
                                            type="tel"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter contact number"
                                        />
                                        <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                    <CustomErrorMessage name="contactNo" />
                                </div>

                                {/* Aadhar Number Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
                                    <div className="relative">
                                        <Field
                                            name="aadharNo"
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter Aadhar number"
                                        />
                                        <FiKey className="absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                    <CustomErrorMessage name="aadharNo" />
                                </div>

                                {/* PAN Card Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card *</label>
                                    <div className="relative">
                                        <Field
                                            name="panCard"
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase"
                                            placeholder="Enter PAN number"
                                        />
                                        <FiFileText className="absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                    <CustomErrorMessage name="panCard" />
                                </div>

                                {/* Location Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="location"
                                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                                        >
                                            <option value="">Select a location</option>
                                            <option value="North">North</option>
                                            <option value="South">South</option>
                                            <option value="East">East</option>
                                            <option value="West">West</option>
                                            <option value="Central">Central</option>
                                        </Field>
                                        <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                                        <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                    <CustomErrorMessage name="location" />
                                </div>

                                {/* Address Field */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                    <div className="relative">
                                        <Field
                                            as="textarea"
                                            name="address"
                                            rows="3"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Enter address"
                                        />
                                        <FiHome className="absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                    <CustomErrorMessage name="address" />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center transition-colors duration-200"
                                >
                                    <FiX className="mr-2" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-5 py-2.5 rounded-lg shadow-sm text-white flex items-center transition-colors duration-200 ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
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
                                            {editingFieldBoy ? 'Update Field Boy' : 'Add Field Boy'}
                                        </>
                                    )}
                                </button>
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
                    <h1 className="text-3xl font-bold text-gray-800">Field Boys Management</h1>
                    <p className="text-gray-600 mt-2">Manage all field personnel in your system</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setEditingFieldBoy(null);
                        }}
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
                    >
                        <FiPlus className="mr-2" />
                        {showAddForm ? 'Cancel' : 'Add New Field Boy'}
                    </button>
                </div>
            </div>

            {/* Field Boy Form (Conditionally Rendered) */}
            {showAddForm && <FieldBoyForm />}

            {/* Search Section */}
            {!showAddForm && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, phone, zone or address..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Field Boys Table */}
            {!showAddForm && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    {isLoading ? (
                        <LoadingSpinner
                            loadingText="Loading Field Boys Data"
                            description="Please wait while we fetch the field personnel information..."
                        />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Field Boy
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mobile No.
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Address
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentFieldBoys.length > 0 ? (
                                            currentFieldBoys.map((fieldBoy) => (
                                                <tr key={fieldBoy.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                                <FiUser className="text-green-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{fieldBoy.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(fieldBoy.registrationDate).toLocaleDateString('en-IN')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{fieldBoy.contactNo}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {fieldBoy.location}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 max-w-xs truncate">{fieldBoy.address}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-3">
                                                            <button
                                                                onClick={() => handleEditFieldBoy(fieldBoy)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="Edit"
                                                            >
                                                                <FiEdit2 />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteFieldBoy(fieldBoy.id)}
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
                                                    {searchTerm ? 'No field boys found matching your search' : 'No field boys available'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredFieldBoys.length > fieldBoysPerPage && (
                                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                    <div className="flex-1 flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{indexOfFirstFieldBoy + 1}</span> to{' '}
                                            <span className="font-medium">{Math.min(indexOfLastFieldBoy, filteredFieldBoys.length)}</span> of{' '}
                                            <span className="font-medium">{filteredFieldBoys.length}</span> field boys
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

export default FieldBoysManagement;