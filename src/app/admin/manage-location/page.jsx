"use client";
import { useState, useEffect } from 'react';
import { FiEdit2, FiPlus, FiX, FiSave, FiLoader, FiMapPin, FiSearch } from 'react-icons/fi';
import AddSuccessPopup from '@/components/popups/addSucess';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import Loading from '@/components/Loading';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [newLocation, setNewLocation] = useState({
    district: '',
    state: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/location/fetch-all');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data.locations);
        setError(null);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations. Please try again later.');
        // Fallback to empty array in case of error
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations based on search term
  const filteredLocations = locations.filter(location => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (location.district && location.district.toLowerCase().includes(searchLower)) ||
      (location.state && location.state.toLowerCase().includes(searchLower))
    );
  });

  // Handle add location
  const handleAddLocation = async () => {
    if (!newLocation.district || !newLocation.state) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/location/addlocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocation),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add location');
      }
      
      // Refresh the locations list after successful addition
      const fetchResponse = await fetch('https://dokument-guru-backend.vercel.app/api/admin/location/fetch-all');
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch updated locations');
      }
      const data = await fetchResponse.json();
      setLocations(data.locations);
      
      setNewLocation({ district: '', state: '' });
      setIsAddModalOpen(false);
      setShowAddSuccess(true);
    } catch (err) {
      console.error('Error adding location:', err);
      setError(err.message || 'Failed to add location');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit location
  const handleEditLocation = async () => {
    if (!currentLocation || !currentLocation.district || !currentLocation.state) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://dokument-guru-backend.vercel.app/api/admin/location/updatelocation/${currentLocation._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            district: currentLocation.district,
            state: currentLocation.state
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update location');
      }
      
      // Refresh the locations list after successful update
      const fetchResponse = await fetch('https://dokument-guru-backend.vercel.app/api/admin/location/fetch-all');
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch updated locations');
      }
      const data = await fetchResponse.json();
      setLocations(data.locations);
      
      setIsEditModalOpen(false);
      setShowUpdateSuccess(true);
    } catch (err) {
      console.error('Error updating location:', err);
      setError(err.message || 'Failed to update location');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (location) => {
    setCurrentLocation({ ...location });
    setIsEditModalOpen(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Location Management</h1>
            <p className="text-gray-600 mt-1">Manage all your service locations</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <FiPlus className="mr-2" />
            Add Location
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Locations Table */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search by district or state..."
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12">
                <Loading loadingText="Loading locations..." description="Please wait while we fetch your data" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location, index) => (
                      <tr key={location._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.state}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(location)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <FiEdit2 className="mr-1" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No locations found matching your search.' : 'No locations available.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add Location Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Add New Location</h2>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newLocation.district}
                        onChange={(e) => setNewLocation({ ...newLocation, district: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border ${newLocation.district ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                        placeholder="Enter district"
                      />
                      <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newLocation.state}
                        onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border ${newLocation.state ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                        placeholder="Enter state"
                      />
                      <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setError(null);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center transition-colors duration-200"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLocation}
                    disabled={isSubmitting || !newLocation.district || !newLocation.state}
                    className={`px-5 py-2.5 rounded-lg shadow-sm text-white flex items-center transition-colors duration-200 ${
                      isSubmitting || !newLocation.district || !newLocation.state ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Add Location
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Location Modal */}
        {isEditModalOpen && currentLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Location</h2>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentLocation.district}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, district: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border ${currentLocation.district ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      />
                      <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentLocation.state}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, state: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border ${currentLocation.state ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      />
                      <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setError(null);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center transition-colors duration-200"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleEditLocation}
                    disabled={isSubmitting || !currentLocation.district || !currentLocation.state}
                    className={`px-5 py-2.5 rounded-lg shadow-sm text-white flex items-center transition-colors duration-200 ${
                      isSubmitting || !currentLocation.district || !currentLocation.state ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
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
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Popups */}
        {showAddSuccess && (
          <AddSuccessPopup 
            onClose={() => {
              setShowAddSuccess(false);
              setNewLocation({ district: '', state: '' });
            }} 
          />
        )}
        
        {showUpdateSuccess && (
          <UpdateSuccessPopup 
            onClose={() => {
              setShowUpdateSuccess(false);
              setCurrentLocation(null);
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default LocationManagement;