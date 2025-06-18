
// "use client";
// import React, { useState, useEffect } from 'react';
// import { FiSearch, FiPlus, FiChevronDown ,FiEdit2, FiTrash2, FiX, FiCheck, FiList } from 'react-icons/fi';
// import AddSuccessPopup from '@/components/popups/addSucess';
// import UpdateSuccessPopup from '@/components/popups/updateSuccess';
// import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
// import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
// import LoadingSpinner from '@/components/Loading';
// import axios from 'axios';

// // Header Component
// const Header = ({ onAddNew }) => {
//   return (
//     <header className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6 shadow-lg">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row md:itemls-center md:justify-between">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">Service Groups</h1>
//             <p className="mt-2 text-white !text-white">Browse and manage all available services</p>
//           </div>
//           <button
//             onClick={onAddNew}
//             className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors shadow-sm"
//           >
//             <FiPlus className="mr-2" /> Add New Service Group
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// // ServiceCard Component
// // const ServiceCard = ({
// //   title,
// //   imageUrl,
// //   services,
// //   onEdit,
// //   onDelete
// // }) => {
// //   const [showAll, setShowAll] = useState(false);
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const displayedServices = showAll ? services : services.slice(0, 5);

// //   return (
// //     <div className="bg-white rounded-lg shadow-md  border border-gray-200 flex flex-col h-full relative">
// //       <div className="relative h-48">
// //         <img
// //           src={imageUrl}
// //           alt={title}
// //           className="w-full h-full object-cover"
// //         />
// //         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
// //           <span className="text-white text-xl font-semibold">{title}</span>
// //         </div>
// //       </div>
      
// //       <div className="p-4 flex flex-col flex-grow">
// //         <div className="flex-grow relative">
// //           <button 
// //             className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex justify-between items-center"
// //             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
// //           >
// //             <span>View Services ({services.length})</span>
// //             <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
// //           </button>
          
// //           {isDropdownOpen && (
// //             <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
// //               {services.map((service) => (
// //                 <div 
// //                   key={service._id} 
// //                   className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
// //                 >
// //                   <h4 className="font-medium text-gray-800">{service.name}</h4>
// //                   {service.description && (
// //                     <p className="text-sm text-gray-500 mt-1">{service.description}</p>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         <div className="mt-4 pt-4 border-t border-gray-100">
// //           <div className="flex justify-end space-x-2">
// //             <button
// //               onClick={onEdit}
// //               className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
// //             >
// //               <FiEdit2 className="inline mr-1" /> Edit
// //             </button>
// //             <button
// //               onClick={onDelete}
// //               className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
// //             >
// //               <FiTrash2 className="inline mr-1" /> Delete
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// // ServiceCard Component
// const ServiceCard = ({
//   title,
//   imageUrl,
//   services,
//   onEdit,
//   onDelete,
//   isActive,
//   onToggleActive
// }) => {
//   const [showAll, setShowAll] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//    const [isToggling, setIsToggling] = useState(false);
//   const displayedServices = showAll ? services : services.slice(0, 5);
//   const handleToggle = async () => {
//     setIsToggling(true);
//     try {
//       await onToggleVisibility();
//     } catch (error) {
//       // Handle error (maybe show a toast notification)
//       console.error("Failed to toggle visibility:", error);
//     } finally {
//       setIsToggling(false);
//     }
//   };
//   return (
//     <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col h-full relative">
//       <div className="relative h-48">
//         <img
//           src={imageUrl}
//           alt={title}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
//           <span className="text-white text-xl font-semibold">{title}</span>
//         </div>
//       </div>
      
//       <div className="p-4 flex flex-col flex-grow">
//         {/* Toggle Button at the top */}
//         <div className="flex justify-between items-center mb-3">
//           <span className="text-sm font-medium text-gray-700">Status:</span>
//           <button
//             onClick={handleToggle}
//             className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
//               isActive ? 'bg-green-600' : 'bg-gray-200'
//             }`}
//           >
//             <span
//               className={`inline-block w-4 h-4 transform transition-transform ${
//                 isActive ? 'translate-x-6' : 'translate-x-1'
//               } bg-white rounded-full`}
//             />
//           </button>
//         </div>
        
//         <div className="flex-grow relative">
//           <button 
//             className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex justify-between items-center"
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           >
//             <span>View Services ({services.length})</span>
//             <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
//           </button>
          
//           {isDropdownOpen && (
//             <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//               {services.map((service) => (
//                 <div 
//                   key={service._id} 
//                   className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
//                 >
//                   <h4 className="font-medium text-gray-800">{service.name}</h4>
//                   {service.description && (
//                     <p className="text-sm text-gray-500 mt-1">{service.description}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="mt-4 pt-4 border-t border-gray-100">
//           <div className="flex justify-end space-x-2">
//             <button
//               onClick={onEdit}
//               className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//             >
//               <FiEdit2 className="inline mr-1" /> Edit
//             </button>
//             <button
//               onClick={onDelete}
//               className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//             >
//               <FiTrash2 className="inline mr-1" /> Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// // ServiceManagementModal
// const ServiceManagementModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   groupData
// }) => {
//   const [formData, setFormData] = useState({
//     name: groupData?.name || '',
//     image: groupData?.image || '',
//     services: groupData?.services || []
//   });
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [isImageUploading, setIsImageUploading] = useState(false);
//   const [newService, setNewService] = useState({ name: '', documentNames: [''] });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [validationErrors, setValidationErrors] = useState({
//     name: '',
//     image: '',
//     services: []
//   });

//   useEffect(() => {
//     if (groupData) {
//       setFormData({
//         name: groupData.name,
//         image: groupData.image,
//         services: groupData.services
//       });
//       setPreviewUrl(groupData.image);
//     }
//   }, [groupData]);


//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Create preview URL
//     const preview = URL.createObjectURL(file);
//     setPreviewUrl(preview);

//     // Start loading
//     setIsImageUploading(true);
//     setError(null);

//     // Upload file to backend
//     const fileData = new FormData();
//     fileData.append('file', file);
//     fileData.append('type', 'serviceImage');

//     try {
//       const response = await axios.post('/api/upload', fileData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       // Update formData with the returned URL
//       setFormData(prev => ({
//         ...prev,
//         image: response.data.url
//       }));
      
//     } catch (error) {
//       console.error('Upload failed:', error.response?.data || error.message);
//       setError('Failed to upload image');
//       setPreviewUrl(formData.image); // Revert to previous image
//     } finally {
//       setIsImageUploading(false);
//     }
//   };

  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleServiceChange = (index, field, value) => {
//     const newServices = [...formData.services];
//     if (field === 'name') {
//       newServices[index].name = value;
//     } else if (field === 'documentNames') {
//       newServices[index].documentNames = value.split(',').map(doc => doc.trim());
//     }
//     setFormData(prev => ({ ...prev, services: newServices }));
    
//     const newValidationErrors = [...validationErrors.services];
//     if (newValidationErrors[index]) {
//       newValidationErrors[index] = '';
//       setValidationErrors(prev => ({ ...prev, services: newValidationErrors }));
//     }
//   };

//   const handleNewServiceChange = (field, value) => {
//     if (field === 'name') {
//       setNewService(prev => ({ ...prev, name: value }));
//     } else if (field === 'documentNames') {
//       setNewService(prev => ({ ...prev, documentNames: value.split(',').map(doc => doc.trim()) }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {
//       name: '',
//       image: '',
//       services: []
//     };
//     let isValid = true;

//     if (!formData.name.trim()) {
//       errors.name = 'Group name is required';
//       isValid = false;
//     }

//     if (!formData.image.trim()) {
//       errors.image = 'Image URL is required';
//       isValid = false;
//     } else if (!isValidUrl(formData.image)) {
//       errors.image = 'Please enter a valid URL';
//       isValid = false;
//     }

//     formData.services.forEach((service, index) => {
//       const serviceErrors = {
//         name: '',
//         documentNames: ''
//       };
      
//       if (!service.name.trim()) {
//         serviceErrors.name = 'Service name is required';
//         isValid = false;
//       }
      
//       if (!service.documentNames.length || service.documentNames.every(doc => !doc.trim())) {
//         serviceErrors.documentNames = 'At least one document is required';
//         isValid = false;
//       }
      
//       errors.services[index] = serviceErrors;
//     });

//     setValidationErrors(errors);
//     return isValid;
//   };

//   const isValidUrl = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch (e) {
//       return false;
//     }
//   };

//   const addNewService = async () => {
//     if (!newService.name.trim()) {
//       setError('Service name is required');
//       return;
//     }
    
//     if (!newService.documentNames.length || newService.documentNames.every(doc => !doc.trim())) {
//       setError('At least one document is required');
//       return;
//     }
    
//     try {
//       const localService = {
//         _id: `local-${Date.now()}`,
//         name: newService.name,
//         documentNames: newService.documentNames.filter(doc => doc.trim() !== '')
//       };
      
//       setFormData(prev => ({
//         ...prev,
//         services: [...prev.services, localService]
//       }));
      
//       setNewService({ name: '', documentNames: [''] });
//       setError(null);
//     } catch (error) {
//       console.error('Error adding service:', error);
//       setError('Failed to add new service');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       const updatedGroup = {
//         ...groupData,
//         name: formData.name,
//         image: formData.image,
//         services: formData.services
//       };
      
//       await onSubmit(updatedGroup);
//       onClose();
//     } catch (error) {
//       console.error('Error updating group:', error);
//       setError('Failed to update group');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
//           <h3 className="text-lg font-bold">
//             Edit Service Group
//           </h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <FiX size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           {error && (
//             <div className="bg-red-50 p-3 rounded-md text-red-700">
//               {error}
//             </div>
//           )}
          
//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//             <h4 className="font-medium text-blue-800 mb-2">Group Information</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//                   required
//                 />
//                 {validationErrors.name && (
//                   <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
//                 )}
//               </div>
//               <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Image* {isImageUploading && "(Uploading...)"}
//                 </label>
//                 {isImageUploading ? (
//                   <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                     <span className="ml-2 text-gray-600">Uploading...</span>
//                   </div>
//                 ) : previewUrl ? (
//                   <div className="mb-2">
//                     <img 
//                       src={previewUrl} 
//                       alt="Preview" 
//                       className="h-32 w-full object-cover rounded-md border border-gray-200"
//                     />
//                   </div>
//                 ) : null}
//                <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className={`w-full px-3 py-2 border ${validationErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//                   disabled={isImageUploading}
//                 />
//                 {validationErrors.image && (
//                   <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <FiCheck className="mr-1" /> Update Group
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ServiceGroupForm Modal with image upload loading state
// const ServiceGroupForm = ({
//   isOpen,
//   onClose,
//   onSubmit
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     image: '',
//     services: [{ name: '', documentNames: [''] }]
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isImageUploading, setIsImageUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [validationErrors, setValidationErrors] = useState({
//     name: '',
//     image: '',
//     services: []
//   });
//   const [previewUrl, setPreviewUrl] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Create preview URL
//     const preview = URL.createObjectURL(file);
//     setPreviewUrl(preview);

//     // Start loading
//     setIsImageUploading(true);
//     setError(null);

//     // Upload file to backend
//     const fileData = new FormData();
//     fileData.append('file', file);
//     fileData.append('type', 'serviceImage');

//     try {
//       const response = await axios.post('/api/upload', fileData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       // Update formData with the returned URL
//       setFormData(prev => ({
//         ...prev,
//         image: response.data.url
//       }));
      
//     } catch (error) {
//       console.error('Upload failed:', error.response?.data || error.message);
//       setError('Failed to upload image');
//       // Clear preview on error
//       setPreviewUrl('');
//     } finally {
//       setIsImageUploading(false);
//     }
//   };

//   const handleServiceChange = (index, field, value) => {
//     const newServices = [...formData.services];
//     if (field === 'name') {
//       newServices[index].name = value;
//     } else if (field === 'documentNames') {
//       newServices[index].documentNames = value.split(',').map(doc => doc.trim());
//     }
//     setFormData(prev => ({ ...prev, services: newServices }));
    
//     const newValidationErrors = [...validationErrors.services];
//     if (newValidationErrors[index]) {
//       newValidationErrors[index] = '';
//       setValidationErrors(prev => ({ ...prev, services: newValidationErrors }));
//     }
//   };

//   const addServiceField = () => {
//     setFormData(prev => ({
//       ...prev,
//       services: [...prev.services, { name: '', documentNames: [''] }]
//     }));
//   };

//   const removeServiceField = (index) => {
//     if (formData.services.length > 1) {
//       const newServices = formData.services.filter((_, i) => i !== index);
//       setFormData(prev => ({ ...prev, services: newServices }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {
//       name: '',
//       image: '',
//       services: []
//     };
//     let isValid = true;

//     if (!formData.name.trim()) {
//       errors.name = 'Group name is required';
//       isValid = false;
//     }

//     if (!formData.image.trim()) {
//       errors.image = 'Image is required';
//       isValid = false;
//     }

//     setValidationErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       await onSubmit(formData);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setError('Failed to create service group');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
//           <h3 className="text-lg font-bold">Create New Service Group</h3>
//           <button 
//             onClick={onClose} 
//             className="text-gray-500 hover:text-gray-700"
//             disabled={isSubmitting || isImageUploading}
//           >
//             <FiX size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           {error && (
//             <div className="bg-red-50 p-3 rounded-md text-red-700">
//               {error}
//             </div>
//           )}
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
//                 required
//                 placeholder="E.g., Home Services"
//               />
//               {validationErrors.name && (
//                 <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Image*</label>
              
//               {/* Image preview or loading */}
//               {isImageUploading ? (
//                 <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
//                   <span className="ml-2 text-gray-600">Uploading...</span>
//                 </div>
//               ) : previewUrl ? (
//                 <div className="mb-2">
//                   <img 
//                     src={previewUrl} 
//                     alt="Preview" 
//                     className="h-32 w-full object-cover rounded-md border border-gray-200"
//                   />
//                 </div>
//               ) : null}
              
//               <input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className={`w-full px-3 py-2 border ${validationErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
//                 required
//                 disabled={isImageUploading}
//               />
//               {validationErrors.image && (
//                 <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               disabled={isSubmitting || isImageUploading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
//               disabled={isSubmitting || isImageUploading}
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <FiPlus className="mr-1" /> Create Group
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Confirmation Modal
// const ConfirmationModal = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   message
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold">Confirm Action</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <FiX size={24} />
//           </button>
//         </div>

//         <p className="mb-6">{message}</p>

//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
//           >
//             <FiTrash2 className="mr-1" /> Confirm Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main ServiceGroupsPage Component
// const ServiceGroupsPage = () => {
//   const [serviceGroups, setServiceGroups] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
//   const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
//   const [currentGroup, setCurrentGroup] = useState(null);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [groupToDelete, setGroupToDelete] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddSuccess, setShowAddSuccess] = useState(false);
//   const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
//   const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

//   useEffect(() => {
//     fetchServiceGroups();
//   }, []);
//   console.log(serviceGroups)
//   const fetchServiceGroups = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch("http://localhost:3001/api/admin/serviceGroup/getAll-Groups", {
//         method: 'GET'
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch service groups. Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("asdf",data);
//       if (data.serviceGroups && Array.isArray(data.serviceGroups)) {
//         setServiceGroups(data.serviceGroups);
//       } else {
//         setServiceGroups([]);
//         console.warn('Unexpected data format:', data);
//       }
//     } catch (error) {
//       console.error("Error fetching service groups:", error);
//       setError(error.message);
//       setServiceGroups([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (groupId) => {
//     try {
//       const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/deleteServiceGroup/${groupId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete group');
//       }

//       setServiceGroups(serviceGroups.filter(group => group._id !== groupId));
//       setIsDeleteConfirmOpen(false);
//       setTimeout(() => {
//         setShowDeleteSuccess(true);
//       }, 100);
//     } catch (error) {
//       console.error('Error deleting group:', error);
//     }
//   };

//   const handleUpdateServices = async (updatedGroup) => {
//     try {
//       if (!updatedGroup._id) {
//         throw new Error('Group ID is required for update');
//       }
      
//       const requestBody = {
//         name: updatedGroup.name,
//         image: updatedGroup.image,
//         services: updatedGroup.services.map(service => ({
//           ...(service._id && !service._id.startsWith('local-') ? { _id: service._id } : {}),
//           name: service.name,
//           documentNames: service.documentNames.filter(doc => doc.trim() !== '')
//         }))
//       };
      
//       const response = await fetch(`http://localhost:3001/api/admin/serviceGroup/update-Group/${updatedGroup._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update group');
//       }

//       setIsServiceModalOpen(false);
//       setTimeout(() => {
//         setShowUpdateSuccess(true);
//       }, 100);
//       fetchServiceGroups();
//       return true;
//     } catch (error) {
//       console.error('Error updating group:', error);
//       alert(`Error updating group: ${error.message}`);
//       return false;
//     }
//   };

//   const handleCreateGroup = async (newGroup) => {
//     try {
//       const response = await fetch('http://localhost:3001/api/admin/serviceGroup/add-serviceGroups', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newGroup),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create group');
//       }

//       const data = await response.json();
//       if (data.message === 'Service group registered successfully' || data.serviceGroup) {
//         setServiceGroups(prevGroups => [...prevGroups, data.serviceGroup]);
//         setIsGroupFormOpen(false);
//         setTimeout(() => {
//           setShowAddSuccess(true);
//         }, 100);
//         fetchServiceGroups();
//       }
//     } catch (error) {
//       console.error('Error creating group:', error);
//     }
//   };

//   const filteredGroups = serviceGroups.filter(group => {
//     if (!group || !group.name) return false;
//     return group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (group.services && group.services.some(service => 
//         service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         service.documentNames.some(doc => doc.toLowerCase().includes(searchTerm.toLowerCase()))
//       ));
//   });

//   const handleAddNew = () => {
//     setIsGroupFormOpen(true);
//   };

//   const handleEditServices = (index) => {
//     setCurrentGroup(filteredGroups[index]);
//     setIsServiceModalOpen(true);
//   };
// const handleToggleVisibility = async (groupId, currentVisibility) => {
//   try {
//     const response = await fetch(`http://localhost:3001/api/admin/serviceGroup/updateVisibility/${groupId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ visibility: !currentVisibility }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update visibility status');
//     }

//     const data = await response.json();
    
//     // Update local state
//     setServiceGroups(prevGroups =>
//       prevGroups.map(group =>
//         group._id === groupId ? { ...group, visibility: !currentVisibility } : group
//       )
//     );
    
//     return data;
//   } catch (error) {
//     console.error('Error toggling visibility status:', error);
//     throw error;
//   }
// };
//   const confirmDelete = () => {
//     if (groupToDelete) {
//       handleDelete(groupToDelete);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-10">
//       <Header onAddNew={handleAddNew} />

//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search services, groups, or documents..."
//               className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {isLoading && (
//           <LoadingSpinner loadingText="Loading Service Groups" description="Please wait while we fetch your data" />
//         )}

//         {error && (
//           <div className="text-center py-12 bg-red-50 rounded-lg">
//             <p className="text-red-600">Error: {error}</p>
//             <button
//               onClick={fetchServiceGroups}
//               className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {!isLoading && !error && (
//           filteredGroups.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredGroups.map((group, index) => (
//                 <ServiceCard
//                   key={group._id}
//                   title={group.name}
//                   imageUrl={group.image}
//                   services={group.services}
//                   isActive={group.visibility || false} // Default to false if undefined
//    onToggleVisibility={() => handleToggleVisibility(group._id, group.visibility || false)}
//                   onEdit={() => handleEditServices(index)}
//                   onDelete={() => {
//                     setGroupToDelete(group._id);
//                     setIsDeleteConfirmOpen(true);
//                   }}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
//               <h3 className="text-lg font-medium text-gray-700">No service groups found</h3>
//               <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
//               <button
//                 onClick={handleAddNew}
//                 className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center mx-auto"
//               >
//                 <FiPlus className="mr-1" /> Create New Group
//               </button>
//             </div>
//           )
//         )}
//       </div>

//       <ServiceManagementModal
//         isOpen={isServiceModalOpen}
//         onClose={() => setIsServiceModalOpen(false)}
//         onSubmit={handleUpdateServices}
//         groupData={currentGroup}
//       />

//       <ServiceGroupForm
//         isOpen={isGroupFormOpen}
//         onClose={() => setIsGroupFormOpen(false)}
//         onSubmit={handleCreateGroup}
//       />

//       {isDeleteConfirmOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <DeleteConfirmationPopup
//             onConfirm={() => handleDelete(groupToDelete)}
//             onCancel={() => setIsDeleteConfirmOpen(false)}
//           />
//         </div>
//       )}

//       {showAddSuccess && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <AddSuccessPopup onClose={() => setShowAddSuccess(false)} />
//         </div>
//       )}

//       {showUpdateSuccess && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <UpdateSuccessPopup onClose={() => setShowUpdateSuccess(false)} />
//         </div>
//       )}

//       {showDeleteSuccess && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <DeleteSuccessPopup onClose={() => setShowDeleteSuccess(false)} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceGroupsPage;


"use client";
import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiChevronDown, FiEdit2, FiTrash2, FiX, FiCheck, FiList } from 'react-icons/fi';
import AddSuccessPopup from '@/components/popups/addSucess';
import UpdateSuccessPopup from '@/components/popups/updateSuccess';
import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
import LoadingSpinner from '@/components/Loading';
import axios from 'axios';

// Header Component
const Header = ({ onAddNew }) => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Service Groups</h1>
            <p className="mt-2 text-white">Browse and manage all available services</p>
          </div>
          <button
            onClick={onAddNew}
            className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors shadow-sm"
          >
            <FiPlus className="mr-2" /> Add New Service Group
          </button>
        </div>
      </div>
    </header>
  );
};

// ServiceCard Component
const ServiceCard = ({
  title,
  imageUrl,
  services,
  onEdit,
  onDelete,
  isActive,
  onToggleActive
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleActive();
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col h-full relative">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <span className="text-white text-xl font-semibold">{title}</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isActive ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform transition-transform ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              } bg-white rounded-full`}
            />
          </button>
        </div>
        
        <div className="flex-grow relative">
          <button 
            className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex justify-between items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>View Services ({services.length})</span>
            <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {services.map((service) => (
                <div 
                  key={service._id} 
                  className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <h4 className="font-medium text-gray-800">{service.name}</h4>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-end space-x-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiEdit2 className="inline mr-1" /> Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="inline mr-1" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ServiceManagementModal
const ServiceManagementModal = ({
  isOpen,
  onClose,
  onSubmit,
  groupData
}) => {
  const [formData, setFormData] = useState({
    name: groupData?.name || '',
    image: groupData?.image || '',
    services: groupData?.services || []
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [newService, setNewService] = useState({ name: '', documentNames: [''] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    image: '',
    services: []
  });

  useEffect(() => {
    if (groupData) {
      setFormData({
        name: groupData.name,
        image: groupData.image,
        services: groupData.services
      });
      setPreviewUrl(groupData.image);
    }
  }, [groupData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    setIsImageUploading(true);
    setError(null);

    const fileData = new FormData();
    fileData.append('file', file);
    fileData.append('type', 'serviceImage');

    try {
      const response = await axios.post('/api/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData(prev => ({
        ...prev,
        image: response.data.url
      }));
      
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      setError('Failed to upload image');
      setPreviewUrl(formData.image);
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    if (field === 'name') {
      newServices[index].name = value;
    } else if (field === 'documentNames') {
      newServices[index].documentNames = value.split(',').map(doc => doc.trim());
    }
    setFormData(prev => ({ ...prev, services: newServices }));
    
    const newValidationErrors = [...validationErrors.services];
    if (newValidationErrors[index]) {
      newValidationErrors[index] = '';
      setValidationErrors(prev => ({ ...prev, services: newValidationErrors }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      image: '',
      services: []
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Group name is required';
      isValid = false;
    }

    if (!formData.image.trim()) {
      errors.image = 'Image URL is required';
      isValid = false;
    } else if (!isValidUrl(formData.image)) {
      errors.image = 'Please enter a valid URL';
      isValid = false;
    }

    formData.services.forEach((service, index) => {
      const serviceErrors = {
        name: '',
        documentNames: ''
      };
      
      if (!service.name.trim()) {
        serviceErrors.name = 'Service name is required';
        isValid = false;
      }
      
      if (!service.documentNames.length || service.documentNames.every(doc => !doc.trim())) {
        serviceErrors.documentNames = 'At least one document is required';
        isValid = false;
      }
      
      errors.services[index] = serviceErrors;
    });

    setValidationErrors(errors);
    return isValid;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedGroup = {
        ...groupData,
        name: formData.name,
        image: formData.image,
        services: formData.services
      };
      
      await onSubmit(updatedGroup);
      onClose();
    } catch (error) {
      console.error('Error updating group:', error);
      setError('Failed to update group');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">
            Edit Service Group
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 p-3 rounded-md text-red-700">
              {error}
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Group Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image* {isImageUploading && "(Uploading...)"}
                </label>
                {isImageUploading ? (
                  <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Uploading...</span>
                  </div>
                ) : previewUrl ? (
                  <div className="mb-2">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-32 w-full object-cover rounded-md border border-gray-200"
                    />
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full px-3 py-2 border ${validationErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  disabled={isImageUploading}
                />
                {validationErrors.image && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FiCheck className="mr-1" /> Update Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ServiceGroupForm Modal
const ServiceGroupForm = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    services: [{ name: '', documentNames: [''] }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    image: '',
    services: []
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    setIsImageUploading(true);
    setError(null);

    const fileData = new FormData();
    fileData.append('file', file);
    fileData.append('type', 'serviceImage');

    try {
      const response = await axios.post('/api/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData(prev => ({
        ...prev,
        image: response.data.url
      }));
      
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      setError('Failed to upload image');
      setPreviewUrl('');
    } finally {
      setIsImageUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      image: '',
      services: []
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Group name is required';
      isValid = false;
    }

    if (!formData.image.trim()) {
      errors.image = 'Image is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to create service group');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Create New Service Group</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting || isImageUploading}
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 p-3 rounded-md text-red-700">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                required
                placeholder="E.g., Home Services"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image*</label>
              
              {isImageUploading ? (
                <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">Uploading...</span>
                </div>
              ) : previewUrl ? (
                <div className="mb-2">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-32 w-full object-cover rounded-md border border-gray-200"
                  />
                </div>
              ) : null}
              
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full px-3 py-2 border ${validationErrors.image ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                required
                disabled={isImageUploading}
              />
              {validationErrors.image && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting || isImageUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              disabled={isSubmitting || isImageUploading}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus className="mr-1" /> Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main ServiceGroupsPage Component
const ServiceGroupsPage = () => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchServiceGroups();
  }, []);

  const fetchServiceGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/getAll-Groups", {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch service groups. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.serviceGroups && Array.isArray(data.serviceGroups)) {
        setServiceGroups(data.serviceGroups);
      } else {
        setServiceGroups([]);
        console.warn('Unexpected data format:', data);
      }
    } catch (error) {
      console.error("Error fetching service groups:", error);
      setError(error.message);
      setServiceGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    try {
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/deleteServiceGroup/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      setServiceGroups(serviceGroups.filter(group => group._id !== groupId));
      setIsDeleteConfirmOpen(false);
      setTimeout(() => {
        setShowDeleteSuccess(true);
      }, 100);
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleUpdateServices = async (updatedGroup) => {
    try {
      if (!updatedGroup._id) {
        throw new Error('Group ID is required for update');
      }
      
      const requestBody = {
        name: updatedGroup.name,
        image: updatedGroup.image,
        services: updatedGroup.services.map(service => ({
          ...(service._id && !service._id.startsWith('local-') ? { _id: service._id } : {}),
          name: service.name,
          documentNames: service.documentNames.filter(doc => doc.trim() !== '')
        }))
      };
      
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/update-Group/${updatedGroup._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update group');
      }

      setIsServiceModalOpen(false);
      setTimeout(() => {
        setShowUpdateSuccess(true);
      }, 100);
      fetchServiceGroups();
      return true;
    } catch (error) {
      console.error('Error updating group:', error);
      alert(`Error updating group: ${error.message}`);
      return false;
    }
  };

  const handleCreateGroup = async (newGroup) => {
    try {
      const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/add-serviceGroups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const data = await response.json();
      if (data.message === 'Service group registered successfully' || data.serviceGroup) {
        setServiceGroups(prevGroups => [...prevGroups, data.serviceGroup]);
        setIsGroupFormOpen(false);
        setTimeout(() => {
          setShowAddSuccess(true);
        }, 100);
        fetchServiceGroups();
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleToggleVisibility = async (groupId, currentVisibility) => {
    try {
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/updateVisibility/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visibility: !currentVisibility }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visibility status');
      }

      const data = await response.json();
      
      setServiceGroups(prevGroups =>
        prevGroups.map(group =>
          group._id === groupId ? { ...group, visibility: !currentVisibility } : group
        )
      );
      
      return data;
    } catch (error) {
      console.error('Error toggling visibility status:', error);
      throw error;
    }
  };

  const filteredGroups = serviceGroups.filter(group => {
    if (!group || !group.name) return false;
    return group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.services && group.services.some(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.documentNames.some(doc => doc.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
  });

  const handleAddNew = () => {
    setIsGroupFormOpen(true);
  };

  const handleEditServices = (index) => {
    setCurrentGroup(filteredGroups[index]);
    setIsServiceModalOpen(true);
  };

  const confirmDelete = () => {
    if (groupToDelete) {
      handleDelete(groupToDelete);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Header onAddNew={handleAddNew} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search services, groups, or documents..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading && (
          <LoadingSpinner loadingText="Loading Service Groups" description="Please wait while we fetch your data" />
        )}

        {error && (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={fetchServiceGroups}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGroups.map((group, index) => (
                <ServiceCard
                  key={group._id}
                  title={group.name}
                  imageUrl={group.image}
                  services={group.services}
                  isActive={group.visibility || false}
                  onToggleActive={() => handleToggleVisibility(group._id, group.visibility || false)}
                  onEdit={() => handleEditServices(index)}
                  onDelete={() => {
                    setGroupToDelete(group._id);
                    setIsDeleteConfirmOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">No service groups found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
              <button
                onClick={handleAddNew}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center mx-auto"
              >
                <FiPlus className="mr-1" /> Create New Group
              </button>
            </div>
          )
        )}
      </div>

      <ServiceManagementModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSubmit={handleUpdateServices}
        groupData={currentGroup}
      />

      <ServiceGroupForm
        isOpen={isGroupFormOpen}
        onClose={() => setIsGroupFormOpen(false)}
        onSubmit={handleCreateGroup}
      />

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <DeleteConfirmationPopup
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteConfirmOpen(false)}
          />
        </div>
      )}

      {showAddSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <AddSuccessPopup onClose={() => setShowAddSuccess(false)} />
        </div>
      )}

      {showUpdateSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <UpdateSuccessPopup onClose={() => setShowUpdateSuccess(false)} />
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <DeleteSuccessPopup onClose={() => setShowDeleteSuccess(false)} />
        </div>
      )}
    </div>
  );
};

export default ServiceGroupsPage;