"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiUser,FiCreditCard,FiPackage, FiMail, FiPhone, FiHome, FiX, FiMapPin, FiFileText, FiUserPlus, FiKey, FiEye, FiTrash2, FiShoppingBag, FiUpload, FiFile, FiLock } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
const AddAgentForm = () => {

    const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    shopName: '',
    shopAddress: '',
    referralCode: '',
    location: '',
    documents: {
      aadharCard: '',
      shopLicense: '',
      ownerPhoto: '',
      supportingDocument: '',
    },
    username: '',
    password: '',
    status: ''
  });
  
  const [previewImages, setPreviewImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRefs = {
    aadharCard: useRef(null),
    shopLicense: useRef(null),
    ownerPhoto: useRef(null),
    supportingDocument: useRef(null),
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e, fieldName, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('file', file);
    fileData.append('type', type);

    try {
      const response = await axios.post('/api/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [fieldName]: response.data.url },
      }));
      setPreviewImages((prev) => ({ ...prev, [fieldName]: response.data.url }));
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
    }
  };
  
  const handleAddAgentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://dokument-guru-backend.vercel.app/api/admin/agent/add-agent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      ); 
      const result = await response.json();
     
      console.log('Response from API:', result);
      
      if (result.message === 'Agent registered successfully') {
        // Reset form data
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          shopName: '',
          shopAddress: '',
          referralCode: '',
          location: '',
          documents: {
            aadharCard: '',
            shopLicense: '',
            ownerPhoto: '',
            supportingDocument: '',
          },
          username: '',
          password: '',
        });
        setPreviewImages({});

        // Clear file input values
        Object.keys(fileInputRefs).forEach((key) => {
          fileInputRefs[key].current.value = '';
        });

        toast.success('Agent added successfully!');
        router.push('/');
      } 
      else if(result.error === "Agent with this email, phone or username already exists") {
        toast.error(result.error);
      }
      else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster/>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Register New Agent</h2>
            <p className="text-gray-500 mt-1">Fill in the details below to register a new agent</p>
          </div>
        </div>
        
        <form onSubmit={handleAddAgentSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FiUser size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <FiHome className="text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter residential address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <FiShoppingBag size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Shop Information</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiShoppingBag className="text-gray-400" />
                    </div>
                    <input
                      id="shopName"
                      name="shopName"
                      type="text"
                      value={formData.shopName}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter shop name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <FiHome className="text-gray-400" />
                    </div>
                    <textarea
                      id="shopAddress"
                      name="shopAddress"
                      value={formData.shopAddress}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter shop address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiKey className="text-gray-400" />
                      </div>
                      <input
                        id="referralCode"
                        name="referralCode"
                        type="text"
                        value={formData.referralCode}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="REF123 (optional)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <FiFileText size={20} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Required Documents</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { field: 'aadharCard', label: 'Aadhar Card', type: 'aadhar', icon: <FiCreditCard />, color: 'bg-blue-100 text-blue-600' },
                { field: 'shopLicense', label: 'Shop License', type: 'pan', icon: <FiPackage />, color: 'bg-purple-100 text-purple-600' },
                { field: 'ownerPhoto', label: 'Owner Photo', type: 'profile', icon: <FiUser />, color: 'bg-pink-100 text-pink-600' },
                { field: 'supportingDocument', label: 'Supporting Document', type: 'support', icon: <FiFile />, color: 'bg-amber-100 text-amber-600' },
              ].map(({ field, label, type, icon, color }) => (
                <div key={field} className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {label} {<span className="text-red-500">*</span>}
                  </label>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${color} flex items-center justify-center`}>
                      {React.cloneElement(icon, { size: 20 })}
                    </div>
                    
                    <div className="flex-1">
                      <label htmlFor={field} className="cursor-pointer">
                        <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                          {previewImages[field] ? (
                            <span className="text-sm font-medium text-gray-700">Change File</span>
                          ) : (
                            <>
                              <FiUpload className="mr-2 text-gray-500" />
                              <span className="text-sm text-gray-600">Upload File</span>
                            </>
                          )}
                        </div>
                        <input
                          id={field}
                          ref={fileInputRefs[field]}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, field, type)}
                          className="hidden"
                          required={field !== 'supportingDocument'}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {previewImages[field] && (
                    <div className="mt-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImages(prev => {
                                const newPreviews = {...prev};
                                delete newPreviews[field];
                                return newPreviews;
                              });
                              setFormData(prev => ({
                                ...prev,
                                documents: { ...prev.documents, [field]: '' }
                              }));
                              if (fileInputRefs[field].current) {
                                fileInputRefs[field].current.value = '';
                              }
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        <img
                          src={previewImages[field]}
                          alt={label}
                          className="h-28 w-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 truncate">
                        {field.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').slice(1)} uploaded
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Login Requirements */}
          <div className="mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <FiLock size={20} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Login Credentials</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Choose a username"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Create a password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FiEye className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Minimum 8 characters with numbers and symbols</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    address: '',
                    shopName: '',
                    shopAddress: '',
                    referralCode: '',
                    location: '',
                    documents: {
                      aadharCard: '',
                      shopLicense: '',
                      ownerPhoto: '',
                      supportingDocument: '',
                    },
                    username: '',
                    password: '',
                  });
                  setPreviewImages({});
                }}
                className="px-6 py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors"
                disabled={isLoading}
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <div className="flex items-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="mr-2" />
                      Register Agent
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </form>
        
        {/* Overlay Loading Animation */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-gray-700 font-medium">Registering agent...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait, this may take a moment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAgentForm;