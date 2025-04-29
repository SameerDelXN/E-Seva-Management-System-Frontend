"use client";
import React, { useState,useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, List, Calendar, User, Pencil, Check } from 'lucide-react';
import { FiUser, FiFile } from 'react-icons/fi';

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

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800">{service.name}</h2>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
         Demo service
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
      
      {/* <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
          <User className="w-4 h-4" /> Visibility
        </h3>
        <div className="flex gap-2">
          {['appointments', 'agents', 'both'].map((option) => (
            <button
              key={option}
              onClick={() => setVisibility(option)}
              className={`px-3 py-1 rounded-md text-sm capitalize ${
                visibility === option 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div> */}
      
      {/* <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Calendar className="w-4 h-4" /> Availability
        </h3>
        <div className="flex gap-2 flex-wrap">
          {['subscription', 'both'].map((option) => (
            <button
              key={option}
              onClick={() => setAvailability(option)}
              className={`px-3 py-1 rounded-md text-sm ${
                availability === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option === 'subscription' ? 'Subscription only' : 'With and Without Subscription'}
            </button>
          ))}
        </div>
      </div> */}
      
      <div className="mt-6 flex flex-wrap gap-2">
        <button 
          onClick={() => onEdit(service)}
          className="px-3 py-2 border border-amber-400 text-black rounded hover:bg-yellow-600 hover:text-white transition-colors flex items-center gap-1 text-sm shadow-yellow-50 shadow-lg"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
        {/* <button 
          onClick={() => onPreview(service)}
          className="px-3 py-2 border border-blue-300 text-black rounded hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1 text-sm shadow-blue-50 shadow-lg"
        >
          <Eye className="w-4 h-4" /> Preview
        </button> */}
        <button 
          onClick={() => onDelete(service)}
          className="px-3 py-2 border border-red-400 text-black rounded hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1 text-sm shadow-red-50 shadow-lg"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
        {/* <button 
          onClick={() => onManagePrices(service)}
          className="px-3 py-2 border border-green-400 text-black rounded hover:bg-green-600 hover:text-white transition-colors flex items-center gap-1 text-sm shadow-green-50 shadow-lg"
        >
          Manage Prices
        </button> */}
        {/* <button 
          onClick={() => onManageStatuses(service)}
          className="px-3 py-2 border border-purple-400 text-black rounded hover:bg-purple-600 hover:text-white transition-colors flex items-center gap-1 text-sm shadow-purple-50 shadow-lg"
        >
          <List className="w-4 h-4" />Manage Status
        </button> */}
      </div>
    </div>
  );
};




const AddServiceModal = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {




  
  const [formData, setFormData] = useState({
    name: '',
    document: [''],
    visibility: 'both',
    availablity: 'subscription',
    price: 0,
    planPrices: [],
    status: [
      {
        name: "Active",
        hexcode: "#4CAF50",
        askreason: false
      }
    ]
  });
  
  const [locations, setLocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/prepare');
        
        if (!response.ok) {
          throw new Error('Failed to fetch required data');
        }
        
        const data = await response.json();
        setLocations(data.locations);
        setPlans(data.plans);
        
        const initialPlanPrices = data.locations.map(location => ({
          location: location._id,
          plans: data.plans.map(plan => ({
            plan: plan._id,
            price: 0
          }))
        }));
        
        setFormData(prev => ({
          ...prev,
          planPrices: initialPlanPrices
        }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data');
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    
    if (name === 'price') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: numericValue,
        planPrices: prev.planPrices.map(location => ({
          location: location.location,
          plans: location.plans.map(plan => ({
            plan: plan.plan,
            price: numericValue
          }))
        }))
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleDocChange = (index, value) => {
    const newDocs = [...formData.document];
    newDocs[index] = value;
    setFormData(prev => ({ ...prev, document: newDocs }));
  };

  const addDocumentField = () => {
    setFormData(prev => ({ ...prev, document: [...prev.document, ''] }));
  };

  const removeDocumentField = (index) => {
    const newDocs = formData.document.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, document: newDocs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const cleanedData = {
        ...formData,
        document: formData.document.filter(doc => doc.trim() !== '')
      };

      // Call the onSave prop with the form data
      await onSave(cleanedData);
      
      setSuccessMessage('Service registered successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        document: [''],
        visibility: 'both',
        availablity: 'subscription',
        price: 0,
        planPrices: locations.map(location => ({
          location: location._id,
          plans: plans.map(plan => ({
            plan: plan._id,
            price: 0
          }))
        })),
        status: [
          {
            name: "Active",
            hexcode: "#4CAF50",
            askreason: false
          }
        ]
      });
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error registering service');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading && locations.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Register New Service</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            <p>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter service name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documents Required</label>
            {formData.document.map((doc, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => handleDocChange(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Document requirement"
                />
                {formData.document.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocumentField(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDocumentField}
              className="mt-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="both">Both</option>
                <option value="appointments">Appointments Only</option>
                <option value="agents">Agents Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                name="availablity"
                value={formData.availablity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="subscription">Subscription Only</option>
                <option value="both">With and Without Subscription</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleNumericChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500 italic">
              Changing base price will update all plan prices automatically
            </p>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  document: [''],
                  visibility: 'both',
                  availablity: 'subscription',
                  price: 0,
                  planPrices: locations.map(location => ({
                    location: location._id,
                    plans: plans.map(plan => ({
                      plan: plan._id,
                      price: 0
                    }))
                  })),
                  status: [
                    {
                      name: "Active",
                      hexcode: "#4CAF50",
                      askreason: false
                    }
                  ]
                });
                setError(null);
                setSuccessMessage('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : 'Register Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const ServiceModal = ({ 
  isOpen, 
  onClose, 
  service, 
  onSave,
  isEdit,
  showUpdateSection,
  setShowUpdateSection,
  selectedPlan,
  setSelectedPlan,
  selectedPlanPrices,
  setSelectedPlanPrices
}) => {
  
  const [formData, setFormData] = useState([]);
  useEffect(() => {
    if (service) {
      setFormData([service]); // Wrap the object in an array
    }
  }, [service]);
  console.log("my =- ",formData )
  const [activeSection, setActiveSection] = useState('services');
  const [statuses, setStatuses] = useState(service?.status ||[
    { id: 1, status: 'OFFICE VR CARD ALE AHE', color: '#32a852', askReason: false },
    { id: 2, status: 'E PAN GENERATED', color: '#b3f542', askReason: false },
    { id: 3, status: 'Delivered', color: '#EB6C02', askReason: false },
    { id: 4, status: 'Objection', color: '#F78888', askReason: true },
    { id: 5, status: 'Approved', color: '#5FF404', askReason: false },
    { id: 6, status: 'Under Process', color: '#076AF8', askReason: false },
    { id: 7, status: 'Pending', color: '#FF0404', askReason: false },
  ]);

  const [newStatus, setNewStatus] = useState({
    name: '',
    hexcode: '#32a852',
    askreason: false
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);

  const handleAddPricesClick = (plan) => {
    setSelectedPlanPrices(plan);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocChange = (index, value) => {
    const newDocs = [...formData.documents];
    newDocs[index] = value;
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  const addDocumentField = () => {
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ''] }));
  };

  const removeDocumentField = (index) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  const handleAddStatus = () => {
    if (newStatus.status.trim() === '') return;
    
    if (editingStatus) {
      // Update existing status
      setStatuses(statuses.map(status => 
        status._id === editingStatus.id 
          ? { ...newStatus, id: status.id }
          : status
      ));
      setEditingStatus(null);
    } else {
      // Add new status
      const statusToAdd = {
        id: Date.now(),
        ...newStatus
      };
      setStatuses([...statuses, statusToAdd]);
    }
    
    setNewStatus({
      status: '',
      color: '#32a852',
      askReason: false
    });
    setIsAdding(false);
  };

  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setNewStatus({
      status: status.status,
      color: status.color,
      askReason: status.askReason
    });
    setIsAdding(true);
  };

  const handleNoteChange = (e) => {
    setFormData(prev => ({
      ...prev,
      note: e.target.value
    }));
  };

  const handleInputChange = (index, field, value) => {
    const newFormInputs = [...(formData.formInputs || [])];
    newFormInputs[index] = {
      ...newFormInputs[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      formInputs: newFormInputs
    }));
  };

  const addFormInput = () => {
    setFormData(prev => ({
      ...prev,
      formInputs: [...(prev.formInputs || []), { type: 'text', label: '' }]
    }));
  };

  const removeFormInput = (index) => {
    setFormData(prev => ({
      ...prev,
      formInputs: (prev.formInputs || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAvailablePlansClick = (plan) => {
    console.log('Navigating to prices without subscription for plan:', plan);
    setSelectedPlan(plan);
    setActiveSection('without-subscription');
  };

  const renderManageServices = () => (
    <div className="space-y-6">
      <div className="mb-4">
        <button 
          onClick={() => {
            setEditingStatus(null);
            setNewStatus({
              status: '',
              color: '#32a852',
              askReason: false
            });
            setIsAdding(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm transition duration-200 hover:bg-blue-700 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Status
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-inner border border-gray-200">
          <h3 className="font-medium mb-4 text-lg text-gray-700">
            {editingStatus ? 'Edit Status' : 'Add New Status'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Name</label>
              <input
                type="text"
                value={newStatus.name}
                onChange={(e) => setNewStatus({...newStatus, status: e.target.value})}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter status name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Code</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newStatus.hexcode}
                  onChange={(e) => setNewStatus({...newStatus, color: e.target.value})}
                  className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{newStatus.color}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ask Reason</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newStatus.askReason}
                    onChange={() => setNewStatus({...newStatus, askReason: !newStatus.askReason})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Require reason for this status
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingStatus(false);
                setNewStatus({
                  status: '',
                  color: '#32a852',
                  askReason: false
                });
              }}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm transition duration-200 hover:bg-gray-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddStatus}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm transition duration-200 hover:bg-green-700 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {editingStatus ? 'Save Changes' : 'Add Status'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ask Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statuses.map((status, index) => (
              <tr key={status._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{status.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span 
                      className="inline-block w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: status.hexcode }}
                    ></span>
                    <span className="text-xs font-mono">{status.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {status.askreason ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <button 
                    onClick={() => handleEditStatus(status)}
                    className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 p-6 border-r border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{formData[0]?.name || ""}</h2>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Active
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveSection('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'services' 
                  ? 'bg-green-100 text-green-900' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <FiUser className="w-5 h-5" />
              Manage Services
            </button>
            <button
              onClick={() => setActiveSection('statuses')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'statuses' 
                  ? 'bg-green-100 text-green-900' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <FiFile className="w-5 h-5" />
              Manage Statuses
            </button>
            <button
              onClick={() => setActiveSection('preview')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'preview' 
                  ? 'bg-green-100 text-green-900' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
            <button
              onClick={() => setActiveSection('with-subscription')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'with-subscription' 
                  ? 'bg-green-100 text-green-900' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Manage Prices
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              {activeSection === 'services' && (
                <>
                  <FiUser className="text-blue-500" />
                  Manage Services
                </>
              )}
              {activeSection === 'statuses' && (
                <>
                  <FiFile className="text-blue-500" />
                  Manage Statuses
                </>
              )}
              {activeSection === 'preview' && (
                <>
                  <Eye className="text-purple-500" />
                  Preview
                </>
              )}
              {activeSection === 'with-subscription' && (
                <>
                  <DollarSign className="text-purple-500" />
                  Manage Prices
                </>
              )}
              {activeSection === 'without-subscription' && (
                <>
                  <DollarSign className="text-purple-500" />
                  Prices without Subscription
                </>
              )}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {activeSection === 'services' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Service</h2>

              {/* Service Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter service name"
                />
              </div>

              {/* Document Requirements */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Document Requirements</label>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      documents: [...prev.documents, '']
                    }))}
                    className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>
                <div className="space-y-3">
                  {formData?.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={doc}
                          onChange={(e) => {
                            const newDocs = [...formData.documents];
                            newDocs[index] = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              documents: newDocs
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors group-hover:border-gray-400"
                          placeholder={`Document #${index + 1}`}
                        />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            onClick={() => {
                              const newDocs = formData.documents.filter((_, i) => i !== index);
                              setFormData(prev => ({
                                ...prev,
                                documents: newDocs
                              }));
                            }}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {formData?.documents?.length === 0 && (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                    <div className="flex flex-col items-center gap-2">
                      <FiFile className="w-8 h-8 text-gray-400" />
                      <p>No documents added yet</p>
                      <p className="text-sm text-gray-400">Click "Add Document" to start adding requirements</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Data Section */}
              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-bold text-gray-800">Form Data</h3>
                
                {formData.map((input, index) => (
                  <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Input Type</label>
                      <select
                        value={input.type}
                        onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="file">File</option>
                        <option value="select">Select</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Input Label</label>
                      <input
                        type="text"
                        value={input.label}
                        onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter input label"
                      />
                    </div>

                    <button
                      onClick={() => removeFormInput(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={addFormInput}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Add Input
                </button>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Update Service
                </button>
              </div>
            </div>
          ) : activeSection === 'statuses' ? (
            <div className="space-y-6">
              {renderManageServices()}
            </div>
          ) : activeSection === 'preview' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{formData.name || 'Service Name'}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                      {formData.group || 'Service Group'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Active
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-500" />
                    Note
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <textarea
                      className="w-full min-h-[150px] p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter note about the service..."
                      value={formData.note || ''}
                      onChange={handleNoteChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : activeSection === 'with-subscription' ? (
            <div className="space-y-6">
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-lg font-semibold">Appointment Price:</h3>
                  <div className="flex items-center">
                    <span className="text-gray-600 text-lg mr-2">₹</span>
                    <input
                      type="number"
                      className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="300.00"
                      value="300.00"
                    />
                    <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Update
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Prices with Subscription</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pune</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maharashtra</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button 
                              onClick={() => handleAvailablePlansClick({
                                id: 1,
                                name: 'Pune',
                                state: 'Maharashtra'
                              })}
                              className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              Available Plans
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Beed</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maharashtra</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button 
                              onClick={() => handleAvailablePlansClick({
                                id: 2,
                                name: 'Beed',
                                state: 'Maharashtra'
                              })}
                              className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              Available Plans
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : activeSection === 'without-subscription' ? (
            <div className="space-y-6">
              <div className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Prices without Subscription {selectedPlan && `- ${selectedPlan.name}, ${selectedPlan.state}`}
                  </h2>
                  <button
                    onClick={() => {
                      setActiveSection('with-subscription');
                      setSelectedPlan(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Default Prices Section */}
                  {/* <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Default Prices</h3>
                    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Govt Price:</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="107.00"
                          value="107.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Price:</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="43.00"
                          value="43.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage:</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          value="0.00"
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* Tatkal Prices Section */}
                  {/* <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Tatkal Prices</h3>
                    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Govt Price:</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="107.00"
                          value="107.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Price:</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="43.00"
                          value="43.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage:</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          value="0.00"
                        />
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* <div className="mt-6">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Update
                  </button>
                </div> */}

                <div className="mt-8">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Amol Awari</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button 
                            onClick={() => handleAddPricesClick({
                              id: 1,
                              name: 'Amol Awari',
                              govtPrice: '107.00',
                              commissionPrice: '43.00',
                              taxPercentage: '0.00',
                              tatkalGovtPrice: '107.00',
                              tatkalCommissionPrice: '43.00',
                              tatkalTaxPercentage: '0.00'
                            })}
                            className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Add Prices
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Driving School</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button 
                            onClick={() => handleAddPricesClick({
                              id: 2,
                              name: 'Driving School',
                              govtPrice: '107.00',
                              commissionPrice: '43.00',
                              taxPercentage: '0.00',
                              tatkalGovtPrice: '107.00',
                              tatkalCommissionPrice: '43.00',
                              tatkalTaxPercentage: '0.00'
                            })}
                            className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Add Prices
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">maha e seva monthly Suscription</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button 
                            onClick={() => handleAddPricesClick({
                              id: 3,
                              name: 'maha e seva monthly Suscription',
                              govtPrice: '107.00',
                              commissionPrice: '43.00',
                              taxPercentage: '0.00',
                              tatkalGovtPrice: '107.00',
                              tatkalCommissionPrice: '43.00',
                              tatkalTaxPercentage: '0.00'
                            })}
                            className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Add Prices
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dokument Guru Gold</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button 
                            onClick={() => handleAddPricesClick({
                              id: 4,
                              name: 'Dokument Guru Gold',
                              govtPrice: '107.00',
                              commissionPrice: '43.00',
                              taxPercentage: '0.00',
                              tatkalGovtPrice: '107.00',
                              tatkalCommissionPrice: '43.00',
                              tatkalTaxPercentage: '0.00'
                            })}
                            className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Add Prices
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Driving School Pro</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button 
                            onClick={() => handleAddPricesClick({
                              id: 5,
                              name: 'Driving School Pro',
                              govtPrice: '107.00',
                              commissionPrice: '43.00',
                              taxPercentage: '0.00',
                              tatkalGovtPrice: '107.00',
                              tatkalCommissionPrice: '43.00',
                              tatkalTaxPercentage: '0.00'
                            })}
                            className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Add Prices
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const StatusModal = ({ isOpen, onClose, service }) => {
  console.log("this is me",service);
  const [statuses, setStatuses] = useState(service?.status ||[
    { id: 1, status: 'OFFICE VR CARD ALE AHE', color: '#32a852', askReason: false },
    { id: 2, status: 'E PAN GENERATED', color: '#b3f542', askReason: false },
    { id: 3, status: 'Delivered', color: '#EB6C02', askReason: false },
    { id: 4, status: 'Objection', color: '#F78888', askReason: true },
    { id: 5, status: 'Approved', color: '#5FF404', askReason: false },
    { id: 6, status: 'Under Process', color: '#076AF8', askReason: false },
    { id: 7, status: 'Pending', color: '#FF0404', askReason: false },
  ]);
  console.log(service?.status)
  const [newStatus, setNewStatus] = useState({
    status: '',
    color: '#32a852',
    askReason: false
  });
  console.log(newStatus)

  const [isAdding, setIsAdding] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  useEffect(() => {
    if (service?.status) {
      setStatuses(service.status);
    }
  }, [service]);
  
  const handleAddStatus = () => {
    // Basic validation (optional)
    if (!newStatus.name.trim()) {
      alert("Status name is required");
      return;
    }
  
    // Simulate API call or local update
    const statusToAdd = {
      name: newStatus.name,
      hexcode: newStatus.hexcode,
      askreason: newStatus.askreason,
    };
    console.log("statustoadd = ",statusToAdd)
   
    setStatuses((prev) => [...prev, statusToAdd]);

  
    // Reset form
    setNewStatus({
      name: "",
      hexcode: "#000000", // or your default color
      askreason: false,
    });
  
    // Hide form
    setIsAdding(false);
  
    // Optional: Show success message
    console.log("Status added:", statusToAdd);
  };
  
  const handleDeleteStatus = async (id) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      setStatuses(statuses.filter(status => status._id !== id));
    }
  };

  
  const handleSaveStatuses = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/newService/update-service-statuses/${service.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ statuses }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Statuses updated successfully:', data);
        onClose();
      } else {
        console.error('❌ Failed to update statuses:', data.message);
        alert(`Failed to update statuses: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ Error updating statuses:', error);
      alert('Something went wrong while updating statuses.');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Service Statuses</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition duration-200 text-2xl"
        >
          &times;
        </button>
      </div>
  
      <div className="mb-4">
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm transition duration-200 hover:bg-blue-700 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Status
        </button>
      </div>
  
      {/* {isAdding && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-inner border border-gray-200">
          <h3 className="font-medium mb-4 text-lg text-gray-700">Add New Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Name</label>
              <input
                type="text"
                value={newStatus.name}
                onChange={(e) => setNewStatus({...newStatus, name: e.target.value})}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter status name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Code</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newStatus.hexcode}
                  onChange={(e) => setNewStatus({...newStatus, hexcode: e.target.value})}
                  className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{newStatus.hexcode}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ask Reason</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="askReasonYes"
                    checked={newStatus.askreason}
                    onChange={() => setNewStatus({...newStatus, askreason: true})}
                    className="hidden peer"
                  />
                  <label 
                    htmlFor="askReasonYes"
                    className={`px-4 py-2 border rounded-l-lg cursor-pointer transition-colors duration-200 ${
                      newStatus.askreason 
                        ? 'bg-green-500 text-white border-green-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Yes
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsAdding(false)}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm transition duration-200 hover:bg-gray-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStatus}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm transition duration-200 hover:bg-green-700 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Add Status
            </button>
          </div>
        </div>
      )} */}
      {isAdding && (
  <form
    onSubmit={(e) => {
      e.preventDefault(); // Prevent page reload
      handleAddStatus();
    }}
    className="bg-gray-50 p-6 rounded-lg mb-6 shadow-inner border border-gray-200"
  >
    <h3 className="font-medium mb-4 text-lg text-gray-700">Add New Status</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status Name</label>
        <input
          type="text"
          value={newStatus.name}
          onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter status name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color Code</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={newStatus.hexcode}
            onChange={(e) => setNewStatus({ ...newStatus, hexcode: e.target.value })}
            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
          />
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{newStatus.hexcode}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ask Reason</label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="askReasonYes"
              checked={newStatus.askreason}
              onChange={() => setNewStatus({ ...newStatus, askreason: !newStatus.askreason })}
              className="hidden peer"
            />
            <label
              htmlFor="askReasonYes"
              className={`px-4 py-2 border rounded-lg cursor-pointer transition-colors duration-200 ${
                newStatus.askreason
                  ? 'bg-green-500 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {newStatus.askreason ? 'Yes' : 'No'}
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={() => setIsAdding(false)}
        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm transition duration-200 hover:bg-gray-300 shadow-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm transition duration-200 hover:bg-green-700 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <Check className="w-4 h-4" />
        Add Status
      </button>
    </div>
  </form>
)}

  
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ask Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statuses.map((status, index) => (
              <tr key={status.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{status.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span 
                      className="inline-block w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: status.color }}
                    ></span>
                    <span className="text-xs font-mono">{status.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`askReasonYes-${status.id}`}
                        checked={status.askreason}
                        onChange={() => handleAskReasonChange(status.id, true)}
                        className="hidden peer"
                      />
                      <label 
                        htmlFor={`askReasonYes-${status.id}`}
                        className={`px-3 py-1 text-sm border rounded-l-lg cursor-pointer transition-colors duration-200 ${
                          status.askReason 
                            ? 'bg-green-500 text-white border-green-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`askReasonNo-${status.id}`}
                        checked={!status.askReason}
                        onChange={() => handleAskReasonChange(status.id, false)}
                        className="hidden peer"
                      />
                      <label 
                        htmlFor={`askReasonNo-${status.id}`}
                        className={`px-3 py-1 text-sm border rounded-r-lg cursor-pointer transition-colors duration-200 ${
                          !status.askReason 
                            ? 'bg-red-500 text-white border-red-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        No
                      </label>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <button 
                    onClick={() => handleEditStatus(status.id)}
                    className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  );
};




const App = () => {
  const [services, setServices] = useState([
   
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [selectedPlanPrices, setSelectedPlanPrices] = useState(null);



 
  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/admin/newService/fetch-all-services");
      const data = await res.json();

      if (res.ok) {
        console.log("✅ All Services:", data.servicesData); // assuming 'servicesData' is an array

        const formattedServices = data.servicesData.map(service => ({
          id: service._id,
          name: service.name,
          documents: service.document,
          group: service.group || "E Seva Kendra",
          status: service.status || [] // Optional fallback
        }));

        setServices(formattedServices);
        console.log("new",services);
      } else {
        console.error("❌ Failed to fetch services:", data.message || data);
      }
    } catch (err) {
      console.error("❌ Error fetching services:", err);
    }
  };
useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/admin/newService/fetch-all-services");
      const data = await res.json();

      if (res.ok) {
        console.log("✅ All Services:", data.servicesData); // assuming 'servicesData' is an array

        const formattedServices = data.servicesData.map(service => ({
          id: service._id,
          name: service.name,
          documents: service.document,
          status:service.status,
          group: service.group || "E Seva Kendra", // Optional fallback
        }));

        setServices(formattedServices);
      } else {
        console.error("❌ Failed to fetch services:", data.message || data);
      }
    } catch (err) {
      console.error("❌ Error fetching services:", err);
    }
  };

  fetchServices();
}, []);

  const allGroups = [
    'E Seva Kendra',
    'RTO Services',
    'Legal Services',
    'Banking Services',
    'DocumentGuru Membership',
    'ABHIMEX'
  ];

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
      // group: '',
      documents: ['']


    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setIsEdit(true);
    setModalOpen(true);
  };


  const handleDeleteService = async (serviceToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${serviceToDelete.name}"?`)) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/admin/newService/delete-service/${serviceToDelete.id}`,
          {
            method: 'DELETE',
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          console.log('✅ Service deleted:', data);
          fetchServices();

          // Remove the deleted service from local state
         
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
  
    const cleanedData = {
      name: serviceData.name,
      document: serviceData.document, // array of strings
      visibility: serviceData.visibility || "both",
      availablity: serviceData.availablity || "subscription",
      price: serviceData.price || 0,
      planPrices: serviceData.planPrices.map(planPrice => ({
        location: planPrice.locationId, // should be ObjectId (string)
        plans: planPrice.plans.map(p => ({
          plan: p.planId, // should be ObjectId (string)
          price: p.price
        }))
      })),
      status: serviceData.status.map(s => ({
        name: s.name,
        hexcode: s.hexcode,
        askreason: s.askreason
      }))
    };
  
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
      } else {
        console.error("❌ Failed to add service:", result.message || result);
      }
    } catch (error) {
      console.error("🚨 Error adding service:", error);
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
  console.log("current = ",currentService)
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
                {/* {serviceGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))} */}
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
        key={currentService?._id || 'new'}

          isOpen={modalOpen}
          onClose={() => {setModalOpen(false)
            setCurrentService(null);}
          }
          service={currentService}
          onSave={handleSaveService}
          isEdit={isEdit}
          showUpdateSection={showUpdateSection}
          setShowUpdateSection={setShowUpdateSection}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          selectedPlanPrices={selectedPlanPrices}
          setSelectedPlanPrices={setSelectedPlanPrices}
        />
      ) : (
        <AddServiceModal
        key="add" 
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setCurrentService(null); // Add this line
          }}
          onSave={handleSaveService}
        />
      )}
      
      <StatusModal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setCurrentService(null); // Add this line
        }}
        service={currentService}
      />

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
    </div>
  );
};

export default App;