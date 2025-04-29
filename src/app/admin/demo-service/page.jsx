

'use client'
import { useState, useEffect } from 'react';

const ServiceRegistrationForm = () => {
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
        
        // Initialize planPrices with all locations and plans
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
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Modified to update all plan prices when base price changes
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    
    if (name === 'price') {
      // Update the base price
      setFormData(prev => ({ 
        ...prev, 
        [name]: numericValue,
        // Also update all plan prices to match the new base price
        planPrices: prev.planPrices.map(location => ({
          location: location.location,
          plans: location.plans.map(plan => ({
            plan: plan.plan,
            price: numericValue
          }))
        }))
      }));
    } else {
      // For other numeric fields, just update normally
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
      // Clean document array (remove empty strings)
      const cleanedData = {
        ...formData,
        document: formData.document.filter(doc => doc.trim() !== '')
      };

      const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/newService/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save service');
      }

      setSuccessMessage('Service registered successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        document: [''],
        visibility: 'both',
        availablity: 'subscription',
        price: 0,
        planPrices: [...formData.planPrices.map(loc => ({
          location: loc.location,
          plans: loc.plans.map(p => ({ plan: p.plan, price: 0 }))
        }))],
        status: [
          {
            name: "Active",
            hexcode: "#4CAF50",
            askreason: false
          }
        ]
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error registering service');
    } finally {
      setLoading(false);
    }
  };

  if (loading && locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Register New Service</h1>
      
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
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
              // Reset form
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
  );
};

export default ServiceRegistrationForm;