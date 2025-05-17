"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, List, Calendar, User, Pencil, Check } from 'lucide-react';
import { FiUser, FiFile } from "react-icons/fi";


const ServiceModal = ({ 
  isOpen, 
  onClose, 
  service, 
  fetchServices,
  serviceGroups,
  onSave,
  isEdit,
  showUpdateSection,
  setShowUpdateSection,
  selectedPlan,
  setSelectedPlan,
  selectedPlanPrices,
  setSelectedPlanPrices
}) => {
  console.log("groups",serviceGroups)
  const [formData, setFormData] = useState({
    name: '',
    documents: [],
    note: '',
    price: '',
    visibility:'',
    planPrices: [],
    group: '',
    status: [],
    formData: []
  });
  console.log("SIRE + ",service)
  const [locations, setLocations] = useState(service?.planPrice || []);
  const [plans, setPlans] = useState([]);
  const [newplan, selectnewplan] = useState([]);
  const [activeSection, setActiveSection] = useState('services');
  const [loading,setLoading] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState(null);
const [tempPrice, setTempPrice] = useState('');
  
  const [statuses, setStatuses] = useState(service?.status || [
    { id: 1, status: 'OFFICE VR CARD ALE AHE', color: '#32a852', askReason: false },
    { id: 2, status: 'E PAN GENERATED', color: '#b3f542', askReason: false },
    { id: 3, status: 'Delivered', color: '#EB6C02', askReason: false },
    { id: 4, status: 'Objection', color: '#F78888', askReason: true },
    { id: 5, status: 'Approved', color: '#5FF404', askReason: false },
    { id: 6, status: 'Under Process', color: '#076AF8', askReason: false },
    { id: 7, status: 'Pending', color: '#FF0404', askReason: false },
  ]);

  console.log("dummy is", service);

  const [newStatus, setNewStatus] = useState({
    name: '',
    hexcode: '#32a852',
    askReason: false,
    priority: 0
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingFormField, setEditingFormField] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        documents: service.documents || [],
        note: service.note || '',
        price: service.price || '',
        group: service.group || '',
        visibility:service.visibility || "",
        planPrices: service.planPrice,
        id: service.id || '',
        status: service.status || [],
        formData: service.formData || []
      });
    }
  }, [service]);

  const handleAddPricesClick = (plan) => {
    setSelectedPlanPrices(plan);
    selectnewplan([plan]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const handleEditPrice = (planId, currentPrice) => {
  setEditingPriceId(planId);
  // console.log("this is id",planId)
  setTempPrice(currentPrice);
};

const handlePriceChange = (e) => {
  setTempPrice(e.target.value);
};

// const handleSavePrice = async (planId) => {
//   try {
//     // Update the price in your state
//     const updatedPlans = newplan.map(plan => 
//       plan.plan_id === planId ? { ...plan, price: tempPrice } : plan
//     );
    
//     // Update the local state first for immediate UI feedback
//     selectnewplan(updatedPlans);
    
//     // Call your API to update the price in the backend
//     const response = await fetch(`YOUR_API_ENDPOINT_TO_UPDATE_PRICE`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         planId,
//         newPrice: tempPrice
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update price');
//     }

//     // Reset editing state
//     setEditingPriceId(null);
//     setTempPrice('');
    
//     // Optionally show success message
//     console.log('Price updated successfully');
    
//   } catch (error) {
//     console.error('Error updating price:', error);
//     // Optionally show error message and revert local state
//   }
// };
  

const handleSavePrice = async (planId) => {
    try {
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/newService/update-plan-price/${formData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          district: selectedPlan.name,
          state: selectedPlan.state,
          planId: planId,
          newPrice: tempPrice
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      const data = await response.json();
      
      // Update the local state with the new price
      const updatedPlans = newplan.map(plan => 
        plan._id === planId ? { ...plan, price: tempPrice } : plan
      );
      
      selectnewplan(updatedPlans);
      
      // Also update the locations state if needed
      const updatedLocations = locations.map(location => {
        if (location.district === selectedPlan.name && location.state === selectedPlan.state) {
          return {
            ...location,
            plans: location.plans.map(plan => 
              plan._id === planId ? { ...plan, price: tempPrice } : plan
            )
          };
        }
        return location;
      });
      
      setLocations(updatedLocations);
      
      // Reset editing state
      setEditingPriceId(null);
      setTempPrice('');
      
      // Show success message
      console.log('Price updated successfully');
      
    } catch (error) {
      console.error('Error updating price:', error);
      // Optionally show error message to user
    }
  };


const handleDocChange = (index, value) => {
    const newDocs = [...formData.documents];
    newDocs[index] = value;
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  const addDocumentField = () => {
    setFormData(prev => ({ 
      ...prev, 
      documents: [...prev.documents, ''] 
    }));
  };

  console.log("new - ", newplan);
  
  const removeDocumentField = (index) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

 const handleFormDataChange = (index, field, value) => {
  const newFormData = [...(formData.formData || [])];
  
  // Only keep price if it's a checkbox
  const updatedField = {
    ...newFormData[index],
    [field]: value
  };
  
  if (updatedField.inputType !== 'checkbox' && field === 'price') {
    delete updatedField.price;
  }
  
  // Generate a unique name if label changes and name doesn't exist yet
  if (field === 'label' && !updatedField.name) {
    updatedField.name = value.toLowerCase().replace(/\s+/g, '_');
  }
  
  newFormData[index] = updatedField;
  
  setFormData(prev => ({
    ...prev,
    formData: newFormData
  }));
};

  const addFormDataField = () => {
    const newField = {
      inputType: 'text',
      label: '',
      name: '',
      placeholder: '',
      required: false,
      defaultValue: null,
      options: [],
      validation: {},
      metadata: {}
    };
    
    setFormData(prev => ({
      ...prev,
      formData: [...(prev.formData || []), newField]
    }));
  };

  const removeFormDataField = (index) => {
    const newFormData = [...(formData.formData || [])].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      formData: newFormData
    }));
  };

  const handleEditFormField = (index) => {
    setEditingFormField(index);
  };

  const handleSaveFormField = (index) => {
    setEditingFormField(null);
    // Any additional save logic can go here
  };

  // const handleAddStatus = async() => {
  //   setLoading(true)
  //   console.log("id is ", formData.id);
  //   // if (newStatus.status.trim() === '') return;
    
  //   if (editingStatus) {
  //     // Update existing status
  //     setStatuses(statuses.map(status => 
  //       status._id === editingStatus.id 
  //         ? { ...newStatus, id: status.id }
  //         : status
  //     ));
  //     setEditingStatus(null);
  //   } else {
  //     console.log("asdfaef this", newStatus);
  //     try {
  //       const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/newService/update-service/${formData.id}`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({ newStatus })
  //       });
    
  //       const result = await response.json();
    
  //       if (response.ok) {
  //         setLoading(false)
  //         onClose()
  //         console.log("✅ Status added:", result);
  //         fetchServices();
  //         // Optional: Update local state or show success message
  //       } else {
  //         console.error("❌ Error:", result.message);
  //         // Optional: Show error message
  //       }
  //     } catch (error) {
  //       console.error("❌ Exception:", error);
  //     }
  //   }
    
  //   setNewStatus({
  //     status: '',
  //     color: '#32a852',
  //     askReason: false,
  //      priority: 0
  //   });
  //   setIsAdding(false);
  // };

  // const handleEditStatus = (status) => {
  //   setEditingStatus(status);
  //   setNewStatus({
  //     name: status.status,
  //     hexcode: status.color,
  //     askReason: status.askReason
  //   });
  //   setIsAdding(true);
  // };
  
  
  const handleAddStatus = async () => {
  setLoading(true);
  
  // Prepare the status data
  const statusData = {
    status: newStatus.name,
    color: newStatus.hexcode,
    askReason: newStatus.askReason,
    priority: newStatus.priority
  };

  try {
    const url = editingStatus 
      ? ` https://dokument-guru-backend.vercel.app/api/admin/newService/update-status/${formData.id}/${editingStatus._id || editingStatus.id}`
      : `https://dokument-guru-backend.vercel.app/api/admin/newService/update-service/${formData.id}`;

    const method = editingStatus ? "PATCH" : "PATCH";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editingStatus ? statusData : { newStatus: statusData })
    });

    const result = await response.json();

    if (response.ok) {
      setLoading(false);
      fetchServices(); // Refresh the services list
      setIsAdding(false);
      setEditingStatus(null);
      setNewStatus({
        name: '',
        hexcode: '#32a852',
        askReason: false,
        priority: 0
      });
    } else {
      console.error("Error:", result.message);
      // Show error message to user
    }
  } catch (error) {
    console.error("Exception:", error);
    setLoading(false);
  }
};

  const handleEditStatus = (status) => {
      console.log("sdf",status);
  setEditingStatus(status);

  setNewStatus({
    name: status.status || status.name, // Some statuses use 'status' key, others use 'name'
    hexcode: status.color || status.hexcode,
    askReason: status.askReason || status.askreason, // Check both possible keys
    priority: status.priority || 0
  });
  setIsAdding(true);
};

  const handleNoteChange = (e) => {
    setFormData(prev => ({
      ...prev,
      note: e.target.value
    }));
  };

  const handleDeleteStatus = (statusId) => {
    console.log(statusId);
    // Remove from both statuses state and formData.status
    const updatedStatuses = statuses.filter(status => status.name !== statusId);
    console.log(updatedStatuses);
    setStatuses(updatedStatuses);
   
    // Update formData with the new status array
    setFormData(prev => ({
      ...prev,
      status: updatedStatuses
    }));
  };

  const handleSubmit = async(e) => {
    if (e) e.preventDefault();
    
    setIsSaving(true);
    const preparedFormData = formData.formData.map(field => {
    if (field.inputType === 'checkbox' && field.price) {
      return {
        ...field,
        price: Number(field.price)
      };
    }
    // Remove price for non-checkbox fields
    const { price, ...rest } = field;
    return rest;
  });
    console.log("Saving data:", formData);

    try {
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/newService/update-namedoc/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          document: formData.documents,
          planPrices: formData.planPrices,
          serviceGroup: formData.group,
          status: formData.status,
          price: formData.price,
          formData: preparedFormData ,
          visibility:formData.visibility// Include formData in the submission
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('✅ Updated successfully:', data);
        setSaveSuccess(true);
        // Show success message
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
        setTimeout(() => {
          onClose(); // This will close the modal
        }, 1500);
      } else {
        console.error('❌ Failed to update:', data.message);
        // Optionally: show error message to user
      }
    } catch (error) {
      console.error('🔥 Error in handleSubmit:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvailablePlansClick = (plan) => {
    console.log("plans in location", plan);
    setSelectedPlan(plan);
    selectnewplan(plan.plans);
    console.log("updated", plan.plans);
    setActiveSection('without-subscription');
  };

  const renderManageServices = () => (
    <div className="space-y-6">
      <div className="mb-4">
        <button 
          onClick={() => {
            setEditingStatus(null);
            setNewStatus({
              name: '',
              hexcode: '#32a852',
              askreason: false
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
      <div className="col-span-3 md:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <input
          type="number"
          value={newStatus.priority}
          onChange={(e) => setNewStatus({...newStatus, priority: Number(e.target.value)})}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter priority"
        />
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={() => {
          setIsAdding(false);
          setEditingStatus(null);
          setNewStatus({
            name: '',
            hexcode: '#32a852',
            askReason: false,
            priority: 0
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
            {statuses.sort((a, b) => a.priority - b.priority).map((status, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{status.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span 
                      className="inline-block w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: status.hexcode }}
                    ></span>
                    <span className="text-xs font-mono">{status.hexcode}</span>
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
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditStatus(status)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteStatus(status.name)}
                      className="text-red-600 hover:text-red-800 transition duration-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Changes Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm transition duration-200 hover:bg-blue-700 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Changes have been saved successfully.</span>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{formData.name}</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
              {formData.group}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Active
            </span>
          </div>
        </div>

        {/* Form Data Configuration Section */}
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <List className="w-5 h-5 text-blue-500" />
            Form Configuration
          </h3>
          
          <div className="space-y-4">
            {formData.formData?.map((field, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Input Type</label>
                    <select
                      value={field.inputType}
                      onChange={(e) => handleFormDataChange(index, 'inputType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                      <option value="date">Date</option>
                      <option value="email">Email</option>
                      <option value="password">Password</option>
                      <option value="file">File</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Input Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleFormDataChange(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter label text"
                    />
                  </div>
                </div>
                {field.inputType === 'checkbox' && (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Price</label>
      <input
        type="number"
        value={field.price || ''}
        onChange={(e) => handleFormDataChange(index, 'price', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter price for this option"
      />
    </div>
  )}

                <div className="flex justify-end">
                  <button
                    onClick={() => removeFormDataField(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                    title="Remove field"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={addFormDataField}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Form Field
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <List className="w-5 h-5 text-blue-500" />
            Added Fields
          </h3>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.formData?.map((field, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {field.name || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {field.inputType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.label || 'No label'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        {editingFormField === index ? (
                          <button
                            onClick={() => handleSaveFormField(index)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditFormField(index)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => removeFormDataField(index)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm transition duration-200 hover:bg-blue-700 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Changes have been saved successfully.</span>
        </div>
      )}
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
              <h2 className="text-xl font-semibold text-gray-800">{formData.name}</h2>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Details</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter service name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Group</label>
                      {/* <input
                        type="text"
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter service group"
                      /> */}
                      <div>
 
  <select
    name="group"  // Make sure this matches your formData field name
    value={formData.group}  // This should be the ID of the selected group
    onChange={(e) => setFormData({...formData, group: e.target.value})}
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
                    </div>
                    <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
  <select
    name="visibility"
    value={formData.visibility}
    onChange={handleChange}
    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="">Select visibility</option>
    <option value="agent">Agent</option>
    <option value="customer">Customer</option>
    <option value="both">Both</option>
  </select>
</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-4">Required Documents</h3>
                  <div className="space-y-4">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={doc}
                          onChange={(e) => handleDocChange(index, e.target.value)}
                          className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Document name"
                        />
                        <button
                          onClick={() => removeDocumentField(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition duration-200"
                          title="Remove document"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addDocumentField}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm transition duration-200 hover:bg-blue-700 shadow-sm hover:shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Document
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-4">Price</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter service price"
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm transition duration-200 hover:bg-blue-700 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message */}
                {saveSuccess && (
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Changes have been saved successfully.</span>
                  </div>
                )}
              </div>
            </div>
          ) : activeSection === 'statuses' ? (
            renderManageServices()
) : activeSection === 'preview' ? (
  renderPreview()
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
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                    <button 
                      onClick={handleSubmit}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
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
                      {/* <tbody className="divide-y divide-gray-200">
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
                      </tbody> */}

{/* <tbody className="divide-y divide-gray-200">
  {locations.map((item, index) => (
    <tr key={item._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location?.district}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location?.state}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <button
          onClick={() => handleAvailablePlansClick({
            id: item._id,
            name: item.location?.district,
            state: item.location?.state,
            plans: item.plans // send plans if needed
          })}
          className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
        >
          Available Plans
        </button>
      </td>
    </tr>
  ))}
</tbody> */}

<tbody className="divide-y divide-gray-200">
  {locations.map((item, index) => (
    <tr key={item._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.district}</td> 
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.state}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <button
          onClick={() => handleAvailablePlansClick({
            id: item._id,
            name: item.district,
            state: item.state,
            plans: item.plans
          })}
          className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
        >
          Available Plans
        </button>
      </td>
    </tr>
  ))}
</tbody>

                    </table>
                  </div>
                </div>
              </div>
            </div>
          ): activeSection === 'without-subscription' ? (
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
                
                <div className="mt-8">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
               

<tbody className="divide-y divide-gray-200">
  {newplan?.map((planItem, index) => (
    <tr key={index}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{planItem.planName}</td>
         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-12">
  {editingPriceId === planItem._id ? (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={tempPrice}
        onChange={handlePriceChange}
        className="w-24 p-1 border border-gray-300 rounded"
      />
      <button 
        onClick={() => handleSavePrice(planItem._id)}
        className="px-2 py-1 bg-green-500 text-white rounded text-xs"
      >
        Save
      </button>
      <button 
        onClick={() => {
          setEditingPriceId(null);
          setTempPrice('');
        }}
        className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
      >
        Cancel
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      ₹ {planItem.price}
      {/* <button 
        onClick={() => handleEditPrice(planItem._id, planItem.price)}
        className="ml-2 text-blue-500 hover:text-blue-700"
        title="Edit price"
      >
        <Pencil className="w-4 h-4" />
      </button> */}
    </div>
  )}
</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <button 
          onClick={() => handleEditPrice(planItem._id, planItem.price)}
          // onClick={() =>
          //    handleAddPricesClick({
          //   id: planItem.plan_id,
          //   name: planItem.planName,
          //   govtPrice: planItem.price,
          //   commissionPrice: '43.00',
          //   taxPercentage: '0.00',
          //   tatkalGovtPrice: planItem.price,
          //   tatkalCommissionPrice: '43.00',
          //   tatkalTaxPercentage: '0.00'
          // })}
          className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
        >
          Update Price
        </button>
      </td>
    </tr>
  ))}
</tbody>

                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;