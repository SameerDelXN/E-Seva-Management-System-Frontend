"use client";
import { useState, useEffect } from 'react';
import { FiEdit2, FiPlus, FiX, FiSave, FiLoader, FiMapPin, FiSearch, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import AddSuccessPopup from '@/components/popups/addSucess';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import Loading from '@/components/Loading';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [newLocation, setNewLocation] = useState({
    subdistrict: '',
    district: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
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
      (location.subdistrict && location.subdistrict.toLowerCase().includes(searchLower)) ||
      (location.district && location.district.toLowerCase().includes(searchLower))
    );
  });

  // Handle add location
  const handleAddLocation = async () => {
    if (!newLocation.subdistrict || !newLocation.district) {
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
      
      setNewLocation({ subdistrict: '', district: '' });
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
    if (!currentLocation || !currentLocation.subdistrict || !currentLocation.district) {
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
            subdistrict: currentLocation.subdistrict,
            district: currentLocation.district
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

  // Handle delete location
  const handleDeleteLocation = async () => {
    if (!currentLocation || !currentLocation._id) {
      setError('No location selected for deletion');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://dokument-guru-backend.vercel.app/api/admin/location/deletelocation/${currentLocation._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete location');
      }
      
      // Refresh the locations list after successful deletion
      const fetchResponse = await fetch('https://dokument-guru-backend.vercel.app/api/admin/location/fetch-all');
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch updated locations');
      }
      const data = await fetchResponse.json();
      setLocations(data.locations);
      
      setIsDeleteModalOpen(false);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error('Error deleting location:', err);
      setError(err.message || 'Failed to delete location');
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

  // Open delete confirmation modal
  const openDeleteModal = (location) => {
    setCurrentLocation({ ...location });
    setIsDeleteModalOpen(true);
    setError(null);
  };

  // Simple success popup for delete
  const DeleteSuccessPopup = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Location Deleted Successfully!</h3>
            <p className="text-sm text-gray-500 mb-6">The location has been removed from your service areas.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
                placeholder="Search by subdistrict or district..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub District</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location, index) => (
                      <tr key={location._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.subdistrict}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                          <button
                            onClick={() => openEditModal(location)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <FiEdit2 className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(location)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <FiTrash2 className="mr-1" />
                            Delete
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub District *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newLocation.subdistrict}
                        onChange={(e) => setNewLocation({ ...newLocation, subdistrict: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border ${newLocation.subdistrict ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                        placeholder="Enter sub district"
                      />
                      <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
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
                    disabled={isSubmitting || !newLocation.subdistrict || !newLocation.district}
                    className={`px-5 py-2.5 rounded-lg shadow-sm text-white flex items-center transition-colors duration-200 ${
                      isSubmitting || !newLocation.subdistrict || !newLocation.district ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub District *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentLocation.subdistrict}
                        onChange={(e) => setCurrentLocation({ ...currentLocation, subdistrict: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border ${currentLocation.subdistrict ? 'border-green-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                      />
                      <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
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
                    disabled={isSubmitting || !currentLocation.subdistrict || !currentLocation.district}
                    className={`px-5 py-2.5 rounded-lg shadow-sm text-white flex items-center transition-colors duration-200 ${
                      isSubmitting || !currentLocation.subdistrict || !currentLocation.district ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
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

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && currentLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
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
                <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        Are you sure you want to delete the location <span className="font-medium">{currentLocation.subdistrict}, {currentLocation.district}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setError(null);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center transition-colors duration-200"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteLocation}
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 rounded-lg shadow-sm text-white flex items-center transition-colors duration-200 ${
                      isSubmitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="mr-2" />
                        Delete Location
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
              setNewLocation({ subdistrict: '', district: '' });
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

        {showDeleteSuccess && (
          <DeleteSuccessPopup 
            onClose={() => {
              setShowDeleteSuccess(false);
              setCurrentLocation(null);
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default LocationManagement;