"use client";
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiHome,FiX,FiSettings,FiSave ,FiMapPin,FiFileText, FiUserPlus, FiCalendar, FiFile,FiCreditCard, FiLock, FiUpload, FiChevronDown, FiShoppingBag, FiKey, FiEdit2, FiTrash2, FiPlus, FiSearch, FiDollarSign, FiEye, FiRefreshCw, FiPackage, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '@/components/Loading';
// Import popup components
import AddSuccessPopup from '@/components/popups/addSucess';
import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import toast,{Toaster} from 'react-hot-toast';

// Validation Constants
const VALIDATION_RULES = {
  username: {
    pattern: /^[a-zA-Z0-9_]+$/,
    maxLength: 100,
    message: 'Username can only contain letters, numbers, and underscores'
  },
  phone: {
    pattern: /^\d{10}$/,
    message: 'Phone number must be 10 digits'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  maxLengths: {
    fullName: 100,
    shopName: 100,
    address: 500,
    shopAddress: 500,
    password: 100,
    location: 200,
    referralCode: 50
  },
  fileUpload: {
    maxSize: 1 * 1024 * 1024, // 1MB in bytes (default max size)
    documentSizes: {
      aadharCard: 1 * 1024 * 1024,    // 1MB for Aadhar Card
      shopLicense: 1 * 1024 * 1024,    // 1MB for Shop License
      ownerPhoto: 1 * 1024 * 1024,     // 1MB for Owner Photo
      supportingDocument: 1 * 1024 * 1024  // 1MB for Supporting Documents
    },
    messages: {
      size: 'File size must be less than 1MB',
      sizeWithName: (fileName, maxSize) => 
        `${fileName} exceeds maximum file size of ${(maxSize / (1024 * 1024)).toFixed(0)}MB`,
      generic: 'Error uploading file. Please try again'
    }
  },
  documents: {
    required: ['aadharCard', 'shopLicense', 'ownerPhoto'],
    labels: {
      aadharCard: 'Aadhar Card',
      shopLicense: 'Shop License',
      ownerPhoto: 'Owner Photo',
      supportingDocument: 'Supporting Document'
    }
  }
};

// Required Fields Configuration
const REQUIRED_FIELDS = {
  fullName: 'Full Name',
  email: 'Email',
  phone: 'Phone Number',
  shopName: 'Shop Name',
  shopAddress: 'Shop Address',
  location: 'Location',
  username: 'Username',
  password: 'Password'
};

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  // Add state variables for popups
  const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showDeleteConfirmationPopup, setShowDeleteConfirmationPopup] = useState(false);
  const [showUpdateSuccessPopup, setShowUpdateSuccessPopup] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/location/fetch-all");
        if (!response.ok) {
          console.error("Failed to fetch locations");
          return;
        }
        const data = await response.json();
        setLocations(data.locations || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
  
    fetchLocations();
  }, []);
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/agent/fetch-agents",{
          method:'GET'
        });
        
        if (!response.ok) {
          console.error("Failed to fetch agents. Status:", response.status);
          return;
        }
        console.log(response.data)
        const data = await response.json();
        setAgents(data.data); // Store fetched data in state
      } catch (error) {
        console.error("Error fetching agents:", error.message);
      }
    };

    fetchAgents();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First'); // Set default value
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [lastRecharge, setlastRecharge] = useState('');


  const [showViewEditModal, setShowViewEditModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const ViewEditModal = () => {
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      shopName: '',
      shopAddress: '',
      location: '',
      referralCode: '',
      purchasePlan: '',
      paymentMethod: '',
      paidAmount: '',
      unpaidAmount: '',
      lastRecharge: '',
      balance: '',
      status: 'active',
      username: '',
      documents: {
        aadharCard: '',
        shopLicense: '',
        ownerPhoto: '',
        supportingDocument: ''
      }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [activeSection, setActiveSection] = useState('personal');
    const [previewImages, setPreviewImages] = useState({});
    const [plans, setPlans] = useState([]);
    const fileInputRefs = {
      aadharCard: useRef(null),
      shopLicense: useRef(null),
      ownerPhoto: useRef(null),
      supportingDocument: useRef(null),
    };
    const fetchPlans=async()=>{

      try {
        const fetchResponse = await fetch("https://dokument-guru-backend.vercel.app/api/admin/manage-plan/fetch-plans", {
          method: 'GET'
        });
        
        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json();
          console.log("sdfg",fetchData.plans);
          setPlans(fetchData.plans || []);
        }
      } catch (fetchError) {
        console.error("Error fetching updated agents:", fetchError.message);
      }

    }

   fetchPlans();
    useEffect(() => {
      if (editingAgent) {
        setIsLoading(true);
        setFormData({
          fullName: editingAgent.fullName || '',
          email: editingAgent.email || '',
          phone: editingAgent.phone || '',
          address: editingAgent.address || '',
          shopName: editingAgent.shopName || '',
          shopAddress: editingAgent.shopAddress || '',
          location: editingAgent.location || '',
          referralCode: editingAgent.referralCode || '',
          purchasePlan: editingAgent.purchasePlan || '',
          paymentMethod: editingAgent.paymentMethod || '',
          paidAmount: editingAgent.paidAmount || '',
          unpaidAmount: editingAgent.unpaidAmount || '',
          lastRecharge: editingAgent.lastRecharge || '',
          balance: editingAgent.balance || '',
          status: editingAgent.status || 'active',
          username: editingAgent.username || '',
          documents: {
            aadharCard: editingAgent.documents?.aadharCard || '',
            shopLicense: editingAgent.documents?.shopLicense || '',
            ownerPhoto: editingAgent.documents?.ownerPhoto || '',
            supportingDocument: editingAgent.documents?.supportingDocument || ''
          }
        });
        setIsLoading(false);
      }
    }, [editingAgent]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      
      if (name === 'phone') {
        // Remove any non-numeric characters
        const numericValue = value.replace(/\D/g, '');
        
        // Limit to exactly 10 digits
        const phoneValue = numericValue.slice(0, 10);
        
        setFormData(prev => ({
          ...prev,
          [name]: phoneValue
        }));

        // Show validation message if trying to enter more than 10 digits
        if (numericValue.length > 10) {
          toast.error('Phone number cannot be more than 10 digits');
        } else if (numericValue.length > 0 && numericValue.length < 10) {
          // Show warning for incomplete phone number
          toast.warning(`Phone number must be 10 digits (${10 - numericValue.length} more needed)`);
        }
        return;
      }

      // Update form data first
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Then perform validations
      if (name === 'username' && value) {
        if (!VALIDATION_RULES.username.pattern.test(value)) {
          toast.error(VALIDATION_RULES.username.message);
        }
        if (value.length > VALIDATION_RULES.username.maxLength) {
          toast.error(`Username cannot be longer than ${VALIDATION_RULES.username.maxLength} characters`);
        }
      }

      // Check max lengths for text fields
      if (VALIDATION_RULES.maxLengths[name] && value.length > VALIDATION_RULES.maxLengths[name]) {
        toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} cannot be longer than ${VALIDATION_RULES.maxLengths[name]} characters`);
      }
    };
  
    const handleDocumentChange = (e, field) => {
      const file = e.target.files[0];
      if (!file) return;
  
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [field]: reader.result
          }
        }));
        setIsLoading(false);
        setAlertMessage({ type: 'success', text: 'Document updated successfully!' });
        setTimeout(() => setAlertMessage(null), 3000);
      };
      reader.onerror = () => {
        setIsLoading(false);
        setAlertMessage({ type: 'error', text: 'Failed to read document' });
        setTimeout(() => setAlertMessage(null), 3000);
      };
      reader.readAsDataURL(file);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate email before submission
      if (formData.email && !VALIDATION_RULES.email.pattern.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate phone number before submission
      if (formData.phone && formData.phone.length !== 10) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://dokument-guru-backend.vercel.app/api/admin/agent/update-agent/${editingAgent._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        
        const result = await response.json();
        if (result.success) {
          // Fetch updated agents list
          try {
            const fetchResponse = await fetch("https://dokument-guru-backend.vercel.app/api/admin/agent/fetch-agents", {
              method: 'GET'
            });
            
            if (fetchResponse.ok) {
              const fetchData = await fetchResponse.json();
              setAgents(fetchData.data);
            }
          } catch (fetchError) {
            console.error("Error fetching updated agents:", fetchError.message);
          }
          
          setShowUpdateSuccessPopup(true);
          setTimeout(() => {
            setShowViewEditModal(false);
          }, 1500);
        } else {
          setAlertMessage({ type: 'error', text: result.message || 'Update failed. Please try again.' });
        }
      } catch (error) {
        console.error('Error updating agent:', error);
        setAlertMessage({ type: 'error', text: 'Error updating agent. Please try again.' });
      } finally {
        setIsLoading(false);
        setTimeout(() => setAlertMessage(null), 3000);
      }
    };
  
    const handleViewDocument = (docUrl) => {
      if (docUrl) {
        window.open(docUrl, '_blank');
      }
    };
  
    const getStatusColor = (status) => {
      switch (status) {
        case 'active':
          return 'bg-green-500';
        case 'suspended':
          return 'bg-red-500';
        default:
          return 'bg-yellow-400';
      }
    };
  
    const sections = [
      { id: 'personal', label: 'Personal Info', icon: <FiUser /> },
      { id: 'shop', label: 'Shop Details', icon: <FiPackage /> },
      { id: 'account', label: 'Account', icon: <FiSettings /> },
      { id: 'financial', label: 'Financial', icon: <FiDollarSign /> },
      { id: 'documents', label: 'Documents', icon: <FiFile /> },
    ];
  
    const renderSection = () => {
      switch (activeSection) {
        case 'personal':
          return (
            <div className="space-y-6 animate-fadeIn">
              <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiUser className="text-blue-500" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter full name"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                      onBlur={handleEmailBlur}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  {formData.phone && formData.phone.length !== 10 && (
                    <p className="mt-1 text-sm text-red-600">Phone number must be 10 digits</p>
                  )}
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter residential address"
                  />
                </div>
              </div>
            </div>
          );
        
        case 'shop':
          return (
            <div className="space-y-6 animate-fadeIn">
              <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiPackage className="text-purple-500" />
                Shop Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                  <input
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter shop name"
                  />
                </div>
  
                <div>
  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
    Location <span className="text-red-500">*</span>
    <span className="text-xs text-gray-500 ml-2">
      ({formData.location.length}/{VALIDATION_RULES.maxLengths.location} characters)
    </span>
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiMapPin className="text-gray-400" />
    </div>
    <select
      id="location"
      name="location"
      value={formData.location}
      onChange={handleChange}
      required
      className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
    >
      <option value="">Select a location</option>
      {locations.map((loc) => (
        <option key={loc._id} value={loc.district}>
          {loc.district}, {loc.state}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <FiChevronDown />
    </div>
  </div>
</div>
  
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address</label>
                  <textarea
                    name="shopAddress"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter shop address"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                  <input
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter referral code"
                  />
                </div>
              </div>
            </div>
          );
  
        case 'account':
          return (
            <div className="space-y-6 animate-fadeIn">
              <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiSettings className="text-indigo-500" />
                Account Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter username"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <FiChevronDown className="text-gray-400" />
                    </div>
                  </div>
                </div>
  
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Plan</label>
                  <input
                    name="purchasePlan"
                    value={formData.purchasePlan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter plan details"
                  />
                </div> */}
                <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Plan</label>
          <div className="relative">
            <select
              name="purchasePlan"
              value={formData.purchasePlan}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan._id} value={plan.name}>
                  {plan.name} (₹{plan.price})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>
        </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Purchase</label>
                  <input
                    value={editingAgent?.dateOfPurchasePlan || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          );
  
        case 'financial':
          return (
            <div className="space-y-6 animate-fadeIn">
              <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiDollarSign className="text-green-500" />
                Financial Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <input
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter payment method"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balance (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      name="balance"
                      type="number"
                      value={formData.balance}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      name="paidAmount"
                      type="number"
                      value={formData.paidAmount}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unpaid Amount (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      name="unpaidAmount"
                      type="number"
                      value={formData.unpaidAmount}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Recharge (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      name="lastRecharge"
                      type="number"
                      value={formData.lastRecharge}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
  
        case 'documents':
          return (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <FiFile size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Required Documents</h3>
                </div>
                {VALIDATION_RULES.documents.required.some(doc => !formData.documents[doc]) && (
                  <div className="text-red-500 text-sm flex items-center">
                    <FiAlertCircle className="mr-1" />
                    Missing required documents
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    field: 'aadharCard', 
                    label: 'Aadhar Card', 
                    type: 'aadhar', 
                    icon: <FiCreditCard />, 
                    color: 'bg-blue-100 text-blue-600',
                    maxSize: '1MB'
                  },
                  { 
                    field: 'shopLicense', 
                    label: 'Shop License', 
                    type: 'pan', 
                    icon: <FiPackage />, 
                    color: 'bg-purple-100 text-purple-600',
                    maxSize: '1MB'
                  },
                  { 
                    field: 'ownerPhoto', 
                    label: 'Owner Photo', 
                    type: 'profile', 
                    icon: <FiUser />, 
                    color: 'bg-pink-100 text-pink-600',
                    maxSize: '1MB'
                  },
                  { 
                    field: 'supportingDocument', 
                    label: 'Supporting Document', 
                    type: 'support', 
                    icon: <FiFile />, 
                    color: 'bg-amber-100 text-amber-600',
                    maxSize: '1MB'
                  }
                ].map(({ field, label, type, icon, color, maxSize }) => (
                  <div key={field} className={`bg-gray-50 p-5 rounded-xl border transition-colors ${
                    !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
                      ? 'border-red-200'
                      : 'border-gray-100 hover:border-blue-200'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {label} {VALIDATION_RULES.documents.required.includes(field) && <span className="text-red-500">*</span>}
                      </label>
                      {!formData.documents[field] && VALIDATION_RULES.documents.required.includes(field) && (
                        <span className="text-red-500 text-xs flex items-center">
                          <FiAlertCircle className="mr-1" />
                          Required
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${color} flex items-center justify-center`}>
                        {React.cloneElement(icon, { size: 20 })}
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor={field} className="cursor-pointer">
                          <div className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl transition-colors ${
                            !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
                              ? 'border-red-200 bg-red-50 hover:bg-red-100'
                              : 'border-gray-200 hover:bg-gray-100'
                          }`}>
                            {previewImages[field] ? (
                              <span className="text-sm font-medium text-gray-700">Change File</span>
                            ) : (
                              <>
                                <FiUpload className={`mr-2 ${
                                  !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                                }`} />
                                <span className={`text-sm ${
                                  !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }`}>
                                  Upload File
                                </span>
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
                          />
                        </label>
                      </div>
                    </div>
                    
                    {previewImages[field] ? (
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
                          {label} uploaded successfully
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">
                        {VALIDATION_RULES.documents.required.includes(field)
                          ? 'This document is required'
                          : 'Optional document'}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Maximum file size: {maxSize}
                      {formData.documents[field] && (
                        <span className="ml-2">
                          • Current file: {
                            (formData.documents[field].size / (1024 * 1024)).toFixed(2)
                          }MB
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
  
        default:
          return null;
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {formData.fullName || 'Agent Details'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(formData.status)}`}></div>
                  <span className="text-gray-500 text-sm capitalize">{formData.status || 'Pending'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowViewEditModal(false)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              <FiX className="text-gray-600" size={20} />
            </button>
          </div>
  
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="p-4 bg-white rounded-lg shadow-lg flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <span className="text-gray-700 font-medium">Processing...</span>
              </div>
            </div>
          )}
  
          {/* Alert Message */}
          {alertMessage && (
            <div 
              className={`absolute top-4 right-4 z-20 py-3 px-4 rounded-lg shadow-lg flex items-center space-x-2 ${
                alertMessage.type === 'success' 
                  ? 'bg-green-100 text-green-700 border-l-4 border-green-500' 
                  : 'bg-red-100 text-red-700 border-l-4 border-red-500'
              }`}
            >
              {alertMessage.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
              <span>{alertMessage.text}</span>
            </div>
          )}
  
          <div className="flex h-[calc(90vh-76px)]">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id 
                        ? 'bg-green-200 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
  
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit}>
                {renderSection()}
  
                <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowViewEditModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow flex items-center justify-center min-w-[140px]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const togglePasswordVisibility = (id) => {
    console.log(id);
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  // Filter and sort agents
  const filteredAgents = agents.filter(agent =>
    (selectedStatus === 'All' || agent.status === selectedStatus) &&
    (agent.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone?.includes(searchTerm) ||
    agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'Newest First':
        const dateA = a.dateOfPurchasePlan ? new Date(a.dateOfPurchasePlan) : new Date(0);
        const dateB = b.dateOfPurchasePlan ? new Date(b.dateOfPurchasePlan) : new Date(0);
        return dateB - dateA;
      case 'Oldest First':
        const dateAOld = a.dateOfPurchasePlan ? new Date(a.dateOfPurchasePlan) : new Date(0);
        const dateBOld = b.dateOfPurchasePlan ? new Date(b.dateOfPurchasePlan) : new Date(0);
        return dateAOld - dateBOld; // This is the correct opposite of Newest First
      case 'Name (A-Z)':
        const nameA = (a.fullName || '').toLowerCase();
        const nameB = (b.fullName || '').toLowerCase();
        return nameB.localeCompare(nameA);
      case 'Name (Z-A)':
        const nameAZ = (a.fullName || '').toLowerCase();
        const nameBZ = (b.fullName || '').toLowerCase();
        return nameAZ.localeCompare(nameBZ);
      default:
        return 0;
    }
  });
  // Delete an agent
  const handleDeleteAgent = async(id) => {
    setAgentToDelete(id);
    setShowDeleteConfirmationPopup(true);
  };
  // Add a new function to handle the actual deletion after confirmation
  const confirmDeleteAgent = async() => {
    if (agentToDelete) {
      try {
        const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/agent/delete-agent/${agentToDelete}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          // Fetch updated agents list instead of manually filtering
          try {
            const fetchResponse = await fetch("https://dokument-guru-backend.vercel.app/api/admin/agent/fetch-agents", {
              method: 'GET'
            });
            
            if (fetchResponse.ok) {
              const fetchData = await fetchResponse.json();
              setAgents(fetchData.data); // Update agents list with fresh data
            }
          } catch (fetchError) {
            console.error("Error fetching updated agents:", fetchError.message);
          }
          
          setShowDeleteSuccessPopup(true);
        } else {
          console.error("Failed to delete agent");
        }
      } catch (error) {
        console.error("Error deleting agent:", error);
      } finally {
        setShowDeleteConfirmationPopup(false);
        setAgentToDelete(null);
      }
    }
  };
  const handleShowDetails = (agent) => {
    // console.log(agent);
    setEditingAgent(agent);
    setShowViewEditModal(true);
  };

  const handleOpenRecharge = (agent) => {
    setCurrentAgent(agent);
    setlastRecharge('');
    setShowRechargeModal(true);
  };

  const handleRechargeSubmit = () => {
    if (!lastRecharge || isNaN(lastRecharge) || parseFloat(lastRecharge) <= 0) {
      alert('Please enter a valid recharge amount');
      return;
    }

    const updatedAgents = agents.map(agent => {
      if (agent.id === currentAgent.id) {
        return {
          ...agent,
          lastRecharge: (parseFloat(agent.lastRecharge) + parseFloat(lastRecharge)).toString(),
          balance: (parseFloat(agent.balance) + parseFloat(lastRecharge)).toString()
        };
      }
      return agent;
    });

    setAgents(updatedAgents);
    setShowRechargeModal(false);
    alert(`Successfully recharged ₹${lastRecharge} for ${currentAgent.name}`);
  };

  const handleOpenChangePlan = (agent) => {
    setCurrentAgent(agent);
    setShowChangePlanModal(true);
  };
  // Recharge Modal
  const RechargeModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recharge Agent Account</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent: <span className="font-semibold">{currentAgent?.name}</span>
            </label>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Balance: <span className="font-semibold">₹{currentAgent?.balance}</span>
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="lastRecharge" className="block text-sm font-medium text-gray-700 mb-1">
              Recharge Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="lastRecharge"
              value={lastRecharge}
              onChange={(e) => setlastRecharge(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRechargeModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRechargeSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            >
              Confirm Recharge
            </button>
          </div>
        </div>
      </div>
    );
  };
  const AddAgentForm = () => {
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      shopName: '',
      shopAddress: '',
      referralCode:'',
      location:'',
      documents: {
        aadharCard: '',
        shopLicense: '',
        ownerPhoto: '',
        supportingDocument: '',
      },
      username: '',
      password: '',
      status:''
    });
    const [previewImages, setPreviewImages] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const fileInputRefs = {
      aadharCard: useRef(null),
      shopLicense: useRef(null),
      ownerPhoto: useRef(null),
      supportingDocument: useRef(null),
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      
      if (name === 'phone') {
        // Remove any non-numeric characters
        const numericValue = value.replace(/\D/g, '');
        
        // Limit to exactly 10 digits
        const phoneValue = numericValue.slice(0, 10);
        
        setFormData(prev => ({
          ...prev,
          [name]: phoneValue
        }));

        // Show validation message if trying to enter more than 10 digits
        if (numericValue.length > 10) {
          toast.error('Phone number cannot be more than 10 digits');
        } else if (numericValue.length > 0 && numericValue.length < 10) {
          // Show warning for incomplete phone number
          toast.warning(`Phone number must be 10 digits (${10 - numericValue.length} more needed)`);
        }
        return;
      }

      // Update form data first
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Then perform validations
      if (name === 'username' && value) {
        if (!VALIDATION_RULES.username.pattern.test(value)) {
          toast.error(VALIDATION_RULES.username.message);
        }
        if (value.length > VALIDATION_RULES.username.maxLength) {
          toast.error(`Username cannot be longer than ${VALIDATION_RULES.username.maxLength} characters`);
        }
      }

      if (name === 'email' && value) {
        // if (!VALIDATION_RULES.email.pattern.test(value)) {
        //   toast.error(VALIDATION_RULES.email.message);
        // }
        if (value.length > VALIDATION_RULES.email.maxLength) {
          toast.error(`Email cannot be longer than ${VALIDATION_RULES.email.maxLength} characters`);
        }
      }

      // Check max lengths for text fields
      if (VALIDATION_RULES.maxLengths[name] && value.length > VALIDATION_RULES.maxLengths[name]) {
        toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} cannot be longer than ${VALIDATION_RULES.maxLengths[name]} characters`);
      }
    };
  
    const handleFileChange = async (e, fieldName, type) => {
      const file = e.target.files[0];
      if (!file) return;

      // Get the specific size limit for this document type
      const maxSize = VALIDATION_RULES.fileUpload.documentSizes[fieldName] || VALIDATION_RULES.fileUpload.maxSize;

      // File size validation
      if (file.size > maxSize) {
        toast.error(VALIDATION_RULES.fileUpload.sizeWithName(file.name, maxSize));
        e.target.value = ''; // Clear the file input
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Uploading file...');

      try {
        // Create FormData and append file
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('type', type);

        // Calculate file size in MB for display
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

        try {
          const response = await axios.post('/api/upload', fileData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              toast.loading(
                `Uploading ${file.name} (${fileSizeMB}MB): ${percentCompleted}%`, 
                { id: loadingToast }
              );
            }
          });

          setFormData((prev) => ({
            ...prev,
            documents: { ...prev.documents, [fieldName]: response.data.url },
          }));
          setPreviewImages((prev) => ({ ...prev, [fieldName]: response.data.url }));

          // Success message
          toast.success(`${file.name} uploaded successfully`, { id: loadingToast });

        } catch (error) {
          toast.error(
            error.response?.data?.message || VALIDATION_RULES.fileUpload.generic, 
            { id: loadingToast }
          );
          console.error('Upload failed:', error.response?.data || error.message);
          e.target.value = '';
        }
      } catch (error) {
        toast.error(VALIDATION_RULES.fileUpload.generic);
        console.error('File handling error:', error);
        e.target.value = '';
      }
    };
    
    const handleAddAgentSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        // Phone number validation first - must be exactly 10 digits
        if (!formData.phone) {
          toast.error('Phone number is required');
          document.getElementById('phone').focus();
          setIsLoading(false);
          return;
        }

        if (formData.phone.length !== 10) {
          toast.error('Phone number must be exactly 10 digits');
          document.getElementById('phone').focus();
          setIsLoading(false);
          return;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
          toast.error('Phone number must contain only digits');
          document.getElementById('phone').focus();
          setIsLoading(false);
          return;
        }

        // Validate required fields
        const emptyFields = Object.entries(REQUIRED_FIELDS)
          .filter(([key]) => !formData[key])
          .map(([_, label]) => label);

        if (emptyFields.length > 0) {
          toast.error(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
          setIsLoading(false);
          return;
        }

        // Validate required documents
        const missingDocuments = VALIDATION_RULES.documents.required
          .filter(doc => !formData.documents[doc])
          .map(doc => VALIDATION_RULES.documents.labels[doc]);

        if (missingDocuments.length > 0) {
          toast.error(`Please upload the following required documents: ${missingDocuments.join(', ')}`);
          setIsLoading(false);
          return;
        }

        const submissionData = {
          ...formData,
          status: 'active'
        };

        const response = await fetch(
          'https://dokument-guru-backend.vercel.app/api/admin/agent/add-agent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
          }
        );

        const result = await response.json();

        if (result.message === 'Agent registered successfully') {
          // Reset form and show success
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
          
          // Clear file inputs
          Object.keys(fileInputRefs).forEach((key) => {
            if (fileInputRefs[key].current) {
              fileInputRefs[key].current.value = '';
            }
          });

          // Show success message and update agents list
          toast.success('Agent registered successfully!');
          setShowAddSuccessPopup(true);
          setShowAddForm(false);

          // Fetch updated agents list
          try {
            const fetchResponse = await fetch("https://dokument-guru-backend.vercel.app/api/admin/agent/fetch-agents", {
              method: 'GET'
            });
            
            if (fetchResponse.ok) {
              const fetchData = await fetchResponse.json();
              setAgents(fetchData.data);
            }
          } catch (fetchError) {
            console.error("Error fetching updated agents:", fetchError.message);
          }
        } else if (result.error === "Agent with this email, phone or username already exists") {
          toast.error('An agent with this email, phone number, or username already exists');
        } else {
          toast.error(result.error || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred during registration. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Register New Agent</h2>
            <p className="text-gray-500 mt-1">Fill in the details below to register a new agent</p>
          </div>
          <button
            onClick={() => setShowAddForm(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-gray-500" size={20} />
          </button>
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
              <span className="text-xs text-gray-500 ml-2">
                ({formData.fullName.length}/{VALIDATION_RULES.maxLengths.fullName} characters)
              </span>
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
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.email.length}/{VALIDATION_RULES.email.maxLength} characters)
                </span>
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
                  onBlur={handleEmailBlur}
                  required
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className={`${
                    formData.phone && formData.phone.length === 10 
                      ? 'text-green-500' 
                      : formData.phone 
                        ? 'text-red-500' 
                        : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength="10"
                  minLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={(e) => {
                    if (e.target.value && e.target.value.length !== 10) {
                      toast.error('Phone number must be exactly 10 digits');
                    }
                  }}
                  required
                  aria-invalid={formData.phone && formData.phone.length !== 10}
                  aria-describedby="phone-error"
                  className={`block w-full pl-10 pr-4 py-3 border ${
                    formData.phone 
                      ? formData.phone.length === 10
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg transition-colors`}
                  placeholder="Enter 10-digit phone number"
                />
                {formData.phone && formData.phone.length !== 10 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiAlertCircle className="text-red-500" />
                  </div>
                )}
              </div>
              {formData.phone && (
                <p id="phone-error" className={`mt-1 text-sm ${
                  formData.phone.length === 10 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.phone.length === 10 
                    ? 'Valid phone number' 
                    : `Phone number must be 10 digits (${10 - formData.phone.length} more digit${10 - formData.phone.length === 1 ? '' : 's'} needed)`
                }
                </p>
              )}
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
              <span className="text-xs text-gray-500 ml-2">
                ({formData.shopName.length}/{VALIDATION_RULES.maxLengths.shopName} characters)
              </span>
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
              <span className="text-xs text-gray-500 ml-2">
                ({formData.shopAddress.length}/{VALIDATION_RULES.maxLengths.shopAddress} characters)
              </span>
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
  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiMapPin className="text-gray-400" />
    </div>
    <select
      name="location"
      value={formData.location}
      onChange={handleChange}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
    >
      <option value="">Select a location</option>
      {locations.map((loc) => (
        <option key={loc._id} value={loc.district}>
          {loc.district}, {loc.state}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
      <FiChevronDown className="text-gray-400" />
    </div>
  </div>
</div>
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                Referral Code
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.referralCode.length}/{VALIDATION_RULES.maxLengths.referralCode} characters)
                </span>
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
          { 
            field: 'aadharCard', 
            label: 'Aadhar Card', 
            type: 'aadhar', 
            icon: <FiCreditCard />, 
            color: 'bg-blue-100 text-blue-600',
            maxSize: '1MB'
          },
          { 
            field: 'shopLicense', 
            label: 'Shop License', 
            type: 'pan', 
            icon: <FiPackage />, 
            color: 'bg-purple-100 text-purple-600',
            maxSize: '1MB'
          },
          { 
            field: 'ownerPhoto', 
            label: 'Owner Photo', 
            type: 'profile', 
            icon: <FiUser />, 
            color: 'bg-pink-100 text-pink-600',
            maxSize: '1MB'
          },
          { 
            field: 'supportingDocument', 
            label: 'Supporting Document', 
            type: 'support', 
            icon: <FiFile />, 
            color: 'bg-amber-100 text-amber-600',
            maxSize: '1MB'
          }
        ].map(({ field, label, type, icon, color, maxSize }) => (
          <div key={field} className={`bg-gray-50 p-5 rounded-xl border transition-colors ${
            !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
              ? 'border-red-200'
              : 'border-gray-100 hover:border-blue-200'
          }`}>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {label} {VALIDATION_RULES.documents.required.includes(field) && <span className="text-red-500">*</span>}
              </label>
              {!formData.documents[field] && VALIDATION_RULES.documents.required.includes(field) && (
                <span className="text-red-500 text-xs flex items-center">
                  <FiAlertCircle className="mr-1" />
                  Required
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${color} flex items-center justify-center`}>
                {React.cloneElement(icon, { size: 20 })}
              </div>
              
              <div className="flex-1">
                <label htmlFor={field} className="cursor-pointer">
                  <div className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl transition-colors ${
                    !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
                      ? 'border-red-200 bg-red-50 hover:bg-red-100'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}>
                    {previewImages[field] ? (
                      <span className="text-sm font-medium text-gray-700">Change File</span>
                    ) : (
                      <>
                        <FiUpload className={`mr-2 ${
                          !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          !formData.documents[field] && VALIDATION_RULES.documents.required.includes(field)
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          Upload File
                        </span>
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
                  />
                </label>
              </div>
            </div>
            
            {previewImages[field] ? (
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
                  {label} uploaded successfully
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                {VALIDATION_RULES.documents.required.includes(field)
                  ? 'This document is required'
                  : 'Optional document'}
              </p>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Maximum file size: {maxSize}
              {formData.documents[field] && (
                <span className="ml-2">
                  • Current file: {
                    (formData.documents[field].size / (1024 * 1024)).toFixed(2)
                  }MB
                </span>
              )}
            </div>
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
            <span className="text-xs text-gray-500 ml-2">
              ({formData.username.length}/{VALIDATION_RULES.username.maxLength} characters)
            </span>
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
              maxLength={VALIDATION_RULES.username.maxLength}
              required
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Choose a username (letters, numbers, underscores only)"
            />
          </div>
          {formData.username && !VALIDATION_RULES.username.pattern.test(formData.username) && (
            <p className="mt-1 text-sm text-red-600">{VALIDATION_RULES.username.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">
              ({formData.password.length}/{VALIDATION_RULES.maxLengths.password} characters)
            </span>
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
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
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
 
    );
  };

  // Add ChangePlanModal component
  const ChangePlanModal = () => {
    const [selectedPlan, setSelectedPlan] = useState(currentAgent?.purchasePlan || '');
    const [isLoading, setIsLoading] = useState(false);

    const plans = [
      { id: 'basic', name: 'Basic Plan', price: '999' },
      { id: 'standard', name: 'Standard Plan', price: '1999' },
      { id: 'premium', name: 'Premium Plan', price: '2999' },
      { id: 'enterprise', name: 'Enterprise Plan', price: '4999' }
    ];

    const handlePlanChange = async () => {
      if (!selectedPlan) {
        toast.error('Please select a plan');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://dokument-guru-backend.vercel.app/api/admin/agent/update-agent/${currentAgent._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              purchasePlan: selectedPlan,
              dateOfPurchasePlan: new Date().toISOString()
            }),
          }
        );

        const result = await response.json();
        if (result.success) {
          // Update the local state immediately
          const updatedAgents = agents.map(agent => {
            if (agent._id === currentAgent._id) {
              return {
                ...agent,
                purchasePlan: selectedPlan,
                dateOfPurchasePlan: new Date().toISOString()
              };
            }
            return agent;
          });
          setAgents(updatedAgents);

          // Show success message
          toast.success('Plan updated successfully!');
          setShowChangePlanModal(false);
        } else {
          toast.error(result.message || 'Failed to update plan');
        }
      } catch (error) {
        console.error('Error updating plan:', error);
        toast.error('An error occurred while updating the plan');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Update Plan</h3>
            <button
              onClick={() => setShowChangePlanModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Current Plan: <span className="font-medium text-gray-900">{currentAgent?.purchasePlan || 'No Plan'}</span>
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Plan
            </label>
            <div className="space-y-3">
              {plans.map((plan) => (
                <label
                  key={plan.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPlan === plan.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.name}
                      checked={selectedPlan === plan.name}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium text-gray-900">{plan.name}</span>
                  </div>
                  <span className="text-green-600 font-medium">₹{plan.price}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowChangePlanModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handlePlanChange}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Plan'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add handleEmailBlur function for email validation
  const handleEmailBlur = (e) => {
    const { value } = e.target;
    if (value && !VALIDATION_RULES.email.pattern.test(value)) {
      toast.error(VALIDATION_RULES.email.message);
    }
  };

  // Add a utility function to check image dimensions
  const checkImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve({
            width: img.width,
            height: img.height,
            isValid: (
              img.width >= VALIDATION_RULES.fileUpload.minWidth &&
              img.width <= VALIDATION_RULES.fileUpload.maxWidth &&
              img.height >= VALIDATION_RULES.fileUpload.minHeight &&
              img.height <= VALIDATION_RULES.fileUpload.maxHeight
            )
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          reject(new Error('Failed to load image'));
        };
      } else {
        resolve({ isValid: true }); // For non-image files like PDFs
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster/>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agent Management</h1>
          <p className="text-gray-600 mt-2">Manage all registered agents in your system</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            <FiPlus className="mr-2" />
            {showAddForm ? 'Cancel' : 'Add New Agent'}
          </button>
        </div>
      </div>

      {/* Add Agent Form (Conditionally Rendered) */}
      {showAddForm && <AddAgentForm />}

      {/* Recharge Modal */}
      {showRechargeModal && <RechargeModal />}

      {/* Change Plan Modal */}
      {showChangePlanModal && <ChangePlanModal />}

      {showViewEditModal && <ViewEditModal />}

      {/* Popups */}
      {showAddSuccessPopup && <AddSuccessPopup onClose={() => setShowAddSuccessPopup(false)} />}
      {showDeleteSuccessPopup && <DeleteSuccessPopup onClose={() => setShowDeleteSuccessPopup(false)} />}
      {showDeleteConfirmationPopup && (
        <DeleteConfirmationPopup 
          onConfirm={confirmDeleteAgent} 
          onCancel={() => {
            setShowDeleteConfirmationPopup(false);
            setAgentToDelete(null);
          }} 
        />
      )}
      {showUpdateSuccessPopup && <UpdateSuccessPopup onClose={() => setShowUpdateSuccessPopup(false)} />}

      {/* Stats Cards */}
      {!showAddForm && (<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
              <FiUser />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Agents</p>
              <p className="text-2xl font-semibold text-gray-900">{agents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <FiUser />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Agents</p>
              <p className="text-2xl font-semibold text-gray-900">{agents.filter(a => a.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
              <FiUser />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Agents</p>
              <p className="text-2xl font-semibold text-gray-900">{agents.filter(a => a.status === 'Pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
              <FiUser />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Suspended Agents</p>
              <p className="text-2xl font-semibold text-gray-900">{agents.filter(a => a.status === 'Suspended').length}</p>
            </div>
          </div>
        </div>
      </div>)}

      {/* Search and Filter Section */}
      {!showAddForm && (<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search agents..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Name (A-Z)">Name (A-Z)</option>
              <option value="Name (Z-A)">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>)}
    
      {/* Agents Table */}
      {!showAddForm && (<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr. No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Registration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Purchased Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Amount (₹)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Recharge (₹)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unpaid Amount (₹)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance (₹)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.length > 0 ? (
                filteredAgents.reverse().map((agent, index) => (
                  <tr key={agent._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <FiUser className="text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agent.fullName}</div>
                          <div className="text-sm text-gray-500">{agent.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.dateOfPurchasePlan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {showPassword[agent._id] ? agent.password : '••••••••'}
                        <button 
                          onClick={() => togglePasswordVisibility(agent._id)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {agent.purchasePlan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.dateOfPurchasePlan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ₹{agent.paidAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      ₹{agent.lastRecharge}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      ₹{agent.unpaidAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                      ₹{agent.balance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleShowDetails(agent)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Details"
                        >
                          <span>Edit / View</span>
                        </button>
                        <button
                          onClick={() => handleOpenRecharge(agent)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                          title="Recharge"
                        >
                          <span>Recharge</span>
                        </button>
                        <button
                          onClick={() => handleOpenChangePlan(agent)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50"
                          title="Change Plan"
                        >
                          <span>Update Plan</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
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
                  <td colSpan="13" className="px-6 py-4 text-center text-gray-500">
                  <LoadingSpinner  />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAgents.length}</span> of{' '}
              <span className="font-medium">{filteredAgents.length}</span> agents
            </div>
            <div className="flex space-x-2">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default AgentManagement;