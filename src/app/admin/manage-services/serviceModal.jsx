// "use client";
// import React, { useState,useEffect } from 'react';
// import { Plus, Search,Edit, Trash2, Eye, DollarSign, List, Calendar, User, Pencil, Check } from 'lucide-react';
// import { FiUser ,FiFile } from "react-icons/fi";
// const ServiceModal = ({ 
//   isOpen, 
//   onClose, 
//   service, 
//   onSave,
//   isEdit,
//   showUpdateSection,
//   setShowUpdateSection,
//   selectedPlan,
//   setSelectedPlan,
//   selectedPlanPrices,
//   setSelectedPlanPrices
// }) => {
  
//   const [formData, setFormData] = useState(
//    []
//   );
//   useEffect(() => {
//     console.log(service)
//     if (service) {
//       setFormData([service]);
//       console.log(":asasdga",formData) // Wrap the object in an array
//     }
//   }, [service]);
//   console.log("my =- ",formData )
//   const [activeSection, setActiveSection] = useState('services');
//   const [statuses, setStatuses] = useState(service?.status ||[
//     { id: 1, status: 'OFFICE VR CARD ALE AHE', color: '#32a852', askReason: false },
//     { id: 2, status: 'E PAN GENERATED', color: '#b3f542', askReason: false },
//     { id: 3, status: 'Delivered', color: '#EB6C02', askReason: false },
//     { id: 4, status: 'Objection', color: '#F78888', askReason: true },
//     { id: 5, status: 'Approved', color: '#5FF404', askReason: false },
//     { id: 6, status: 'Under Process', color: '#076AF8', askReason: false },
//     { id: 7, status: 'Pending', color: '#FF0404', askReason: false },
//   ]);

//   const [newStatus, setNewStatus] = useState({
//     name: '',
//     hexcode: '#32a852',
//     askreason: false
//   });

//   const [isAdding, setIsAdding] = useState(false);
//   const [editingStatus, setEditingStatus] = useState(null);

//   const handleAddPricesClick = (plan) => {
//     setSelectedPlanPrices(plan);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDocChange = (index, value) => {
//     const newDocs = [...formData.documents];
//     newDocs[index] = value;
//     setFormData(prev => ({ ...prev, documents: newDocs }));
//   };

//   const addDocumentField = () => {
//     setFormData(prev => ({ ...prev, documents: [...prev.documents, ''] }));
//   };

//   const removeDocumentField = (index) => {
//     const newDocs = formData.documents.filter((_, i) => i !== index);
//     setFormData(prev => ({ ...prev, documents: newDocs }));
//   };

//   const handleAddStatus = async() => {
//     console.log("id is ",formData[0]?.id)
//     // if (newStatus.status.trim() === '') return;
    
//     if (editingStatus) {
//       // Update existing status
//       setStatuses(statuses.map(status => 
//         status._id === editingStatus.id 
//           ? { ...newStatus, id: status.id }
//           : status
//       ));
//       setEditingStatus(null);
//     } else {
//         console.log("asdfaef this",newStatus)
//         try {
//             const response = await fetch(`http://localhost:3001/api/admin/newService/update-service/${formData[0]?.id}`, {
//               method: "PATCH",
//               headers: {
//                 "Content-Type": "application/json"
//               },
//               body: JSON.stringify({ newStatus })
//             });
        
//             const result = await response.json();
        
//             if (response.ok) {
//               console.log("✅ Status added:", result);
              
//               // Optional: Update local state or show success message
//             } else {
//               console.error("❌ Error:", result.message);
//               // Optional: Show error message
//             }
//           } catch (error) {
//             console.error("❌ Exception:", error);
//           }
//       // Add new status
//     //   const statusToAdd = {
//     //     id: Date.now(),
//     //     ...newStatus
//     //   };
//     //   setStatuses([...statuses, statusToAdd]);
//     }
    
//     setNewStatus({
//       status: '',
//       color: '#32a852',
//       askReason: false
//     });
//     setIsAdding(false);
//   };

//   const handleEditStatus = (status) => {
//     setEditingStatus(status);
//     setNewStatus({
//       status: status.status,
//       color: status.color,
//       askReason: status.askReason
//     });
//     setIsAdding(true);
//   };

//   const handleNoteChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       note: e.target.value
//     }));
//   };

//   const handleInputChange = (index, field, value) => {
//     const newFormInputs = [...(formData.formInputs || [])];
//     newFormInputs[index] = {
//       ...newFormInputs[index],
//       [field]: value
//     };
//     setFormData(prev => ({
//       ...prev,
//       formInputs: newFormInputs
//     }));
//   };

//   const addFormInput = () => {
//     setFormData(prev => ({
//       ...prev,
//       formInputs: [...(prev.formInputs || []), { type: 'text', label: '' }]
//     }));
//   };

//   const removeFormInput = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       formInputs: (prev.formInputs || []).filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   const handleAvailablePlansClick = (plan) => {
//     console.log('Navigating to prices without subscription for plan:', plan);
//     setSelectedPlan(plan);
//     setActiveSection('without-subscription');
//   };

//   const renderManageServices = () => (
//     <div className="space-y-6">
//       <div className="mb-4">
//         <button 
//           onClick={() => {
//             setEditingStatus(null);
//             setNewStatus({
//               name: '',
//               hexcode: '#32a852',
//               askreason: false
//             });
//             setIsAdding(true);
//           }}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm transition duration-200 hover:bg-blue-700 shadow-md hover:shadow-lg"
//         >
//           <Plus className="w-4 h-4" /> Add New Status
//         </button>
//       </div>

//       {isAdding && (
//         <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-inner border border-gray-200">
//           <h3 className="font-medium mb-4 text-lg text-gray-700">
//             {editingStatus ? 'Edit Status' : 'Add New Status'}
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status Name</label>
//               <input
//                 type="text"
//                 value={newStatus.name}
//                 onChange={(e) => setNewStatus({...newStatus, name: e.target.value})}
//                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter status name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Color Code</label>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="color"
//                   value={newStatus.hexcode}
//                   onChange={(e) => setNewStatus({...newStatus, color: e.target.value})}
//                   className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
//                 />
//                 <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{newStatus.color}</span>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Ask Reason</label>
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={newStatus.askReason}
//                     onChange={() => setNewStatus({...newStatus, askReason: !newStatus.askReason})}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label className="ml-2 text-sm text-gray-700">
//                     Require reason for this status
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 mt-6">
//             <button
//               type="button"
//               onClick={() => {
//                 setIsAdding(false);
//                 setEditingStatus(false);
//                 setNewStatus({
//                   name: '',
//                   color: '#32a852',
//                   askReason: false
//                 });
//               }}
//               className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm transition duration-200 hover:bg-gray-300 shadow-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleAddStatus}
//               className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm transition duration-200 hover:bg-green-700 shadow-md hover:shadow-lg flex items-center gap-2"
//             >
//               <Check className="w-4 h-4" />
//               {editingStatus ? 'Save Changes' : 'Add Status'}
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//         <table className="min-w-full bg-white divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ask Reason</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {statuses.map((status, index) => (
//               <tr key={index} className="hover:bg-gray-50 transition duration-150">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{status.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                   <div className="flex items-center gap-2">
//                     <span 
//                       className="inline-block w-5 h-5 rounded-full border border-gray-300" 
//                       style={{ backgroundColor: status.hexcode }}
//                     ></span>
//                     <span className="text-xs font-mono">{status.color}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                   {status.askreason ? (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       Yes
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       No
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                   <button 
//                     onClick={() => handleEditStatus(status)}
//                     className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center gap-1"
//                   >
//                     <Pencil className="w-4 h-4" />
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
//         {/* Sidebar */}
//         <div className="w-64 bg-gray-50 p-6 border-r border-gray-200">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <FiUser className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800">{formData[0]?.name || ""}</h2>
//               <span className="text-sm text-green-600 flex items-center gap-1">
//                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
//                 Active
//               </span>
//             </div>
//           </div>

//           <nav className="space-y-1">
//             <button
//               onClick={() => setActiveSection('services')}
//               className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
//                 activeSection === 'services' 
//                   ? 'bg-green-100 text-green-900' 
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//             >
//               <FiUser className="w-5 h-5" />
//               Manage Services
//             </button>
//             <button
//               onClick={() => setActiveSection('statuses')}
//               className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
//                 activeSection === 'statuses' 
//                   ? 'bg-green-100 text-green-900' 
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//             >
//               <FiFile className="w-5 h-5" />
//               Manage Statuses
//             </button>
//             <button
//               onClick={() => setActiveSection('preview')}
//               className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
//                 activeSection === 'preview' 
//                   ? 'bg-green-100 text-green-900' 
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//             >
//               <Eye className="w-5 h-5" />
//               Preview
//             </button>
//             <button
//               onClick={() => setActiveSection('with-subscription')}
//               className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
//                 activeSection === 'with-subscription' 
//                   ? 'bg-green-100 text-green-900' 
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//             >
//               <DollarSign className="w-5 h-5" />
//               Manage Prices
//             </button>
//           </nav>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//               {activeSection === 'services' && (
//                 <>
//                   <FiUser className="text-blue-500" />
//                   Manage Services
//                 </>
//               )}
//               {activeSection === 'statuses' && (
//                 <>
//                   <FiFile className="text-blue-500" />
//                   Manage Statuses
//                 </>
//               )}
//               {activeSection === 'preview' && (
//                 <>
//                   <Eye className="text-purple-500" />
//                   Preview
//                 </>
//               )}
//               {activeSection === 'with-subscription' && (
//                 <>
//                   <DollarSign className="text-purple-500" />
//                   Manage Prices
//                 </>
//               )}
//               {activeSection === 'without-subscription' && (
//                 <>
//                   <DollarSign className="text-purple-500" />
//                   Prices without Subscription
//                 </>
//               )}
//             </h3>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 transition duration-200"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {activeSection === 'services' ? (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Service</h2>

//               {/* Service Name */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Service Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData[0]?.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter service name"
//                 />
//               </div>

//               {/* Document Requirements */}
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <label className="block text-sm font-medium text-gray-700">Document Requirements</label>
//                   <button
//                     onClick={() => setFormData(prev => ({
//                       ...prev,
//                       documents: [...prev.documents, '']
//                     }))}
//                     className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow-md"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Document
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {formData[0]?.documents?.map((doc, index) => (
//                     <div key={index} className="flex items-center gap-2 group">
//                       <div className="flex-1">
//                         <input
//                           type="text"
//                           value={doc}
//                           onChange={(e) => {
//                             const newDocs = [...formData.documents];
//                             newDocs[index] = e.target.value;
//                             setFormData(prev => ({
//                               ...prev,
//                               documents: newDocs
//                             }));
//                           }}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors group-hover:border-gray-400"
//                           placeholder={`Document #${index + 1}`}
//                         />
//                       </div>
//                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         {index > 0 && (
//                           <button
//                             onClick={() => {
//                               const newDocs = formData.documents.filter((_, i) => i !== index);
//                               setFormData(prev => ({
//                                 ...prev,
//                                 documents: newDocs
//                               }));
//                             }}
//                             className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Remove document"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {formData?.documents?.length === 0 && (
//                   <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
//                     <div className="flex flex-col items-center gap-2">
//                       <FiFile className="w-8 h-8 text-gray-400" />
//                       <p>No documents added yet</p>
//                       <p className="text-sm text-gray-400">Click "Add Document" to start adding requirements</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Form Data Section */}
//               <div className="space-y-4 mt-8">
//                 <h3 className="text-xl font-bold text-gray-800">Form Data</h3>
                
//                 {formData.map((input, index) => (
//                   <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Input Type</label>
//                       <select
//                         value={input.type}
//                         onChange={(e) => handleInputChange(index, 'type', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="text">Text</option>
//                         <option value="number">Number</option>
//                         <option value="date">Date</option>
//                         <option value="file">File</option>
//                         <option value="select">Select</option>
//                       </select>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-sm font-medium text-gray-700">Input Label</label>
//                       <input
//                         type="text"
//                         value={input.label}
//                         onChange={(e) => handleInputChange(index, 'label', e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter input label"
//                       />
//                     </div>

//                     <button
//                       onClick={() => removeFormInput(index)}
//                       className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   onClick={addFormInput}
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
//                 >
//                   Add Input
//                 </button>
//               </div>

//               <div className="mt-6">
//                 <button
//                   onClick={handleSubmit}
//                   className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                 >
//                   Update Service
//                 </button>
//               </div>
//             </div>
//           ) : activeSection === 'statuses' ? (
//             <div className="space-y-6">
//               {renderManageServices(formData.id)}
//             </div>
//           ) : activeSection === 'preview' ? (
//             <div className="space-y-6">
//               <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">{formData.name || 'Service Name'}</h2>
//                     <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
//                       {formData.group || 'Service Group'}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-green-600 flex items-center gap-1">
//                       <span className="w-2 h-2 rounded-full bg-green-500"></span>
//                       Active
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
//                     <List className="w-5 h-5 text-blue-500" />
//                     Note
//                   </h3>
//                   <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
//                     <textarea
//                       className="w-full min-h-[150px] p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       placeholder="Enter note about the service..."
//                       value={formData.note || ''}
//                       onChange={handleNoteChange}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : activeSection === 'with-subscription' ? (
//             <div className="space-y-6">
//               <div className="mt-6">
//                 <div className="flex items-center gap-4 mb-6">
//                   <h3 className="text-lg font-semibold">Appointment Price:</h3>
//                   <div className="flex items-center">
//                     <span className="text-gray-600 text-lg mr-2">₹</span>
//                     <input
//   type="number"
//   className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//   placeholder="300.00"
//   value={formData[0]?.price || ""} // or whatever value you're binding
//   onChange={(e) => setFormData(prev => [{ ...prev[0], price: e.target.value }])}
// />

//                     <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
//                       Update
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-8">
//                   <h3 className="text-xl font-semibold mb-4">Prices with Subscription</h3>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         <tr>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pune</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maharashtra</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             <button 
//                               onClick={() => handleAvailablePlansClick({
//                                 id: 1,
//                                 name: 'Pune',
//                                 state: 'Maharashtra'
//                               })}
//                               className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
//                             >
//                               Available Plans
//                             </button>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Beed</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maharashtra</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             <button 
//                               onClick={() => handleAvailablePlansClick({
//                                 id: 2,
//                                 name: 'Beed',
//                                 state: 'Maharashtra'
//                               })}
//                               className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
//                             >
//                               Available Plans
//                             </button>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : activeSection === 'without-subscription' ? (
//             <div className="space-y-6">
//               <div className="mt-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold">
//                     Prices without Subscription {selectedPlan && `- ${selectedPlan.name}, ${selectedPlan.state}`}
//                   </h2>
//                   <button
//                     onClick={() => {
//                       setActiveSection('with-subscription');
//                       setSelectedPlan(null);
//                     }}
//                     className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
//                   >
//                     Back
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  

                
//                 </div>

        

//                 <div className="mt-8">
//                   <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       <tr>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Amol Awari</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <button 
//                             onClick={() => handleAddPricesClick({
//                               id: 1,
//                               name: 'Amol Awari',
//                               govtPrice: '107.00',
//                               commissionPrice: '43.00',
//                               taxPercentage: '0.00',
//                               tatkalGovtPrice: '107.00',
//                               tatkalCommissionPrice: '43.00',
//                               tatkalTaxPercentage: '0.00'
//                             })}
//                             className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
//                           >
//                             Add Prices
//                           </button>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Driving School</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <button 
//                             onClick={() => handleAddPricesClick({
//                               id: 2,
//                               name: 'Driving School',
//                               govtPrice: '107.00',
//                               commissionPrice: '43.00',
//                               taxPercentage: '0.00',
//                               tatkalGovtPrice: '107.00',
//                               tatkalCommissionPrice: '43.00',
//                               tatkalTaxPercentage: '0.00'
//                             })}
//                             className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
//                           >
//                             Add Prices
//                           </button>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">maha e seva monthly Suscription</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <button 
//                             onClick={() => handleAddPricesClick({
//                               id: 3,
//                               name: 'maha e seva monthly Suscription',
//                               govtPrice: '107.00',
//                               commissionPrice: '43.00',
//                               taxPercentage: '0.00',
//                               tatkalGovtPrice: '107.00',
//                               tatkalCommissionPrice: '43.00',
//                               tatkalTaxPercentage: '0.00'
//                             })}
//                             className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
//                           >
//                             Add Prices
//                           </button>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dokument Guru Gold</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <button 
//                             onClick={() => handleAddPricesClick({
//                               id: 4,
//                               name: 'Dokument Guru Gold',
//                               govtPrice: '107.00',
//                               commissionPrice: '43.00',
//                               taxPercentage: '0.00',
//                               tatkalGovtPrice: '107.00',
//                               tatkalCommissionPrice: '43.00',
//                               tatkalTaxPercentage: '0.00'
//                             })}
//                             className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
//                           >
//                             Add Prices
//                           </button>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Driving School Pro</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <button 
//                             onClick={() => handleAddPricesClick({
//                               id: 5,
//                               name: 'Driving School Pro',
//                               govtPrice: '107.00',
//                               commissionPrice: '43.00',
//                               taxPercentage: '0.00',
//                               tatkalGovtPrice: '107.00',
//                               tatkalCommissionPrice: '43.00',
//                               tatkalTaxPercentage: '0.00'
//                             })}
//                             className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
//                           >
//                             Add Prices
//                           </button>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           ) : null}

//           <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
//             >
//               <Check className="w-4 h-4" /> Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// export default ServiceModal;




"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, List, Calendar, User, Pencil, Check } from 'lucide-react';
import { FiUser, FiFile } from "react-icons/fi";

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
  const [formData, setFormData] = useState({
    name: '',
    documents: [],
    formInputs: [],
    note: '',
    price: '',
    planPrices:[],
    group: ''
  });
const [newplan,selectnewplan]=useState([]);
  const [activeSection, setActiveSection] = useState('services');
  const [statuses, setStatuses] = useState(service?.status || [
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
    askReason: false
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        documents: service.documents || [],
        formInputs: service.formInputs || [],
        note: service.note || '',
        price: service.price || '',
        group: service.group || '',
        planPrices:service.planPrice,
        id: service.id || ''
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
  console.log("new - ",newplan)
  const removeDocumentField = (index) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  // const handleAddStatus = async () => {
  //   if (newStatus.name.trim() === '') return;
    
  //   if (editingStatus) {
  //     setStatuses(statuses.map(status => 
  //       status.id === editingStatus.id 
  //         ? { ...status, ...newStatus }
  //         : status
  //     ));
  //     setEditingStatus(null);
  //   } else {
  //     try {
  //       const response = await fetch(`http://localhost:3001/api/admin/newService/update-service/${formData.id}`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({ newStatus })
  //       });
    
  //       const result = await response.json();
    
  //       if (response.ok) {
  //         console.log("✅ Status added:", result);
  //         setStatuses([...statuses, result.newStatus]);
  //       } else {
  //         console.error("❌ Error:", result.message);
  //       }
  //     } catch (error) {
  //       console.error("❌ Exception:", error);
  //     }
  //   }
    
  //   setNewStatus({
  //     name: '',
  //     hexcode: '#32a852',
  //     askReason: false
  //   });
  //   setIsAdding(false);
  // };


  const handleAddStatus = async() => {
        console.log("id is ",formData.id)
        // if (newStatus.status.trim() === '') return;
        
        if (editingStatus) {
          // Update existing status
          setStatuses(statuses.map(status => 
            status._id === editingStatus.id 
              ? { ...newStatus, id: status.id }
              : status
          ));
          setEditingStatus(null);
        } else {
            console.log("asdfaef this",newStatus)
            try {
                const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/newService/update-service/${formData.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ newStatus })
                });
            
                const result = await response.json();
            
                if (response.ok) {
                  console.log("✅ Status added:", result);
                  
                  // Optional: Update local state or show success message
                } else {
                  console.error("❌ Error:", result.message);
                  // Optional: Show error message
                }
              } catch (error) {
                console.error("❌ Exception:", error);
              }
          // Add new status
        //   const statusToAdd = {
        //     id: Date.now(),
        //     ...newStatus
        //   };
        //   setStatuses([...statuses, statusToAdd]);
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
      name: status.status,
      hexcode: status.color,
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
    const newFormInputs = [...formData.formInputs];
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
      formInputs: [...prev.formInputs, { type: 'text', label: '' }]
    }));
  };

  const removeFormInput = (index) => {
    setFormData(prev => ({
      ...prev,
      formInputs: prev.formInputs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // onSave(formData);
    // console.log("sdfe",formData);

    try {
        const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/newService/update-namedoc/${formData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            documents: formData.documents, // should be an array of strings
          }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log('✅ Updated successfully:', data);
          // Optionally: show toast, close modal, reload data, etc.
        } else {
          console.error('❌ Failed to update:', data.message);
          // Optionally: show error message to user
        }
      } catch (error) {
        console.error('🔥 Error in handleSubmit:', error);
      }

  };

  const handleAvailablePlansClick = (plan) => {

   
    setSelectedPlan(plan);
    selectnewplan(plan.plans)
    console.log("updated",plan.plans);
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
                    checked={newStatus.askreason}
                    onChange={() => setNewStatus({...newStatus, askreason: !newStatus.askreason})}
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
                setEditingStatus(null);
                setNewStatus({
                  name: '',
                  hexcode: '#32a852',
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
// console.log("plapriece",formData.planPrices);
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
                    onClick={addDocumentField}
                    className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={doc}
                          onChange={(e) => handleDocChange(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors group-hover:border-gray-400"
                          placeholder={`Document #${index + 1}`}
                        />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeDocumentField(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {formData.documents?.length === 0 && (
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
                
                {formData.formInputs?.map((input, index) => (
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

                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-500" />
                    Note
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <textarea
                      className="w-full min-h-[150px] p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter note about the service..."
                      value={formData.note}
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

<tbody className="divide-y divide-gray-200">
  {formData.planPrices.map((item, index) => (
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
                
                <div className="mt-8">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    {/* <tbody className="divide-y divide-gray-200">
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
                    </tbody> */}

<tbody className="divide-y divide-gray-200">
  {newplan?.map((planItem, index) => (
    <tr key={planItem._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{planItem?.plan?.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <button 
          onClick={() => handleAddPricesClick({
            id: planItem._id,
            name: planItem.plan.name,
            govtPrice: planItem.plan.price,
            commissionPrice: '43.00',
            taxPercentage: '0.00',
            tatkalGovtPrice: planItem.plan.price,
            tatkalCommissionPrice: '43.00',
            tatkalTaxPercentage: '0.00'
          })}
          className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
        >
          Add Prices
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

export default ServiceModal;