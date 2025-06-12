// "use client";
// import { useState, useEffect,useRef } from 'react';
// import { FiFile,FiSave, FiPlus,FiPackage,FiChevronLeft ,FiChevronDown,FiChevronUp ,FiChevronRight ,FiClock, FiSearch, FiRefreshCw, FiUpload, FiX, FiCheck, FiEye, FiCalendar, FiUser, FiPhone, FiMail, FiMapPin, FiFileText, FiCreditCard, FiDownload, FiTrash2 } from 'react-icons/fi';
// import { useSession } from '@/context/SessionContext';
// import axios from 'axios';
// export default function ServiceGroupsUI() {
//   const { session } = useSession();
//   const [serviceGroups, setServiceGroups] = useState([]);
//    const [walletAmount, setWalletAmount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [applications, setApplications] = useState([]);
//   const [appLoading, setAppLoading] = useState(true);
//    const [currentPage, setCurrentPage] = useState(1);
//    const [checkboxSelections, setCheckboxSelections] = useState({});
// const [modifiedPrice, setModifiedPrice] = useState(0);
//   const applicationsPerPage = 5;
// const [openGroups, setOpenGroups] = useState({});

//   // Toggle dropdown for a specific group
//   const toggleGroupDropdown = (groupId) => {
//     setOpenGroups(prev => ({
//       ...prev,
//       [groupId]: !prev[groupId]
//     }));
//   };

//    const indexOfLastApplication = currentPage * applicationsPerPage;
//   const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
//   const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);
  
//   // Calculate total pages
//   const totalPages = Math.ceil(applications.length / applicationsPerPage);

//   // Change page
//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Agent's data from session
//   const agentData = {
//     location: session?.user?.location,
//     district:session?.user?.location?.district,
//     // This should be dynamic in your actual app
//     purchasePlan: session?.user?.purchasePlan // Extracted from session data
//   };
  
//   // Form data state - Modified to handle multiple documents
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     checkboxSelections: {},
//     location:session?.user?.location,
//     provider: {
//       id:'',
//       name:""
//     }, 
//      ExpectedDays:0,
//     date: new Date().toISOString().split('T')[0],
//     delivery: calculateDeliveryDate(new Date(), 7),
//     status: {
//       "name":"initiated",
//       "hexcode":"#12fe11",
//       "askreason":"no"
//     },
//     initialStatus: {
//       "name":"initiated",
//       "hexcode":"#12fe11",
//       "askreason":false
//     },
//     service: '',
//     serviceId: '', // Add serviceId field to store the _id
//     staff: {
//       id:"",
//       name:"Not Assigned"
//     },
//     amount: '',
//     // Changed from a single document to an array of documents
//     documents: [],
//     receipt: null,
//     additional: {
//       inputType: '',
//       label: '',
//       value: ''
//     }
//   });

//   useEffect(() => {
//     if (session?.user?._id) {
//       const fetchApplications = async () => {
//         try {
//           const response = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session.user._id}`);
//           const data = await response.json();
//           setApplications(data.data || []);
//         } catch (error) {
//           console.error("Error fetching applications:", error);
//         } finally {
//           setAppLoading(false);
//         }
//       };
      
//       fetchApplications();
//     }
//   }, [session]);

//   // Calculate delivery date
//   function calculateDeliveryDate(date, days) {
//     const d = new Date(date);
//     d.setDate(d.getDate() + days);
//     return formatDisplayDate(d);
//   }

//   // Format display date function
//   function formatDisplayDate(date) {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   }
//   // Fetch service groups
//   useEffect(() => {
//     const fetchServiceGroups = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/fetch-by-visibility');
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch service groups: ${response.status}`);
//         }
        
//         const data = await response.json();
//         setServiceGroups(data.serviceGroups || []);
//       } catch (err) {
//         console.error("Error fetching service groups:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchServiceGroups();
//   }, []);
//   useEffect(() => {
//     const fetchWalletAmount = async () => {
//       if (!session?.user?._id) {
//         setLoading(false);
//         return;
//       }
      
//       try {
//         const response = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/wallet/${session?.user?._id}`);
//         const data = await response.json();
        
//         if (data.success) {
//           setWalletAmount(data.wallet);
//         } else {
//           setError("Failed to fetch wallet amount");
//         }
//       } catch (err) {
//         setError("Error connecting to wallet service");
//         console.error("Error fetching wallet:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWalletAmount();
//   }, [session]);
//     const handleButtonClick = (group,service) => {
//     const servicePrice = getPriceForAgentPlan(service);
    
//     if (walletAmount >= servicePrice) {
//       handleOpenModal(group, service);
//     } else {
//       console.log("Insufficient amount in wallet");
//       // You could also show this as a toast notification
//       setError("Insufficient balance in wallet");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e,label) => {
//     const { name, value, type, checked } = e.target
//      if (type === 'checkbox') {
//     // Find the corresponding form data to get the price
//     const checkboxData = selectedService?.formData?.find(item => item.label === label);
//     const priceChange = checkboxData?.price || 0;
    
//     setCheckboxSelections(prev => ({
//       ...prev,
//       [label]: checked
//     }));
    
//     // Update the modified price
//     if (checked) {
//       setModifiedPrice(prev => prev + priceChange);
//       // Show alert about price increase
//       alert(`Service price increased by ₹${priceChange} for ${label}`);
//     } else {
//       setModifiedPrice(prev => prev - priceChange);
//     }
    
//     return;
//   }
//     // For nested fields like "additional.value"
//     if (name.includes('.')) {
//       const [parentKey, childKey] = name.split('.');
//       setFormData((prevData) => ({
//         ...prevData,
//         [parentKey]: {
//           ...prevData[parentKey],
//           [childKey]: value
//         }
//       }));
//       setFormData((prevData) => ({
//         ...prevData,
//         additional: {
//           ...prevData[parentKey],
//           label: label
//         }
//       }));
      
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value
//       }));
//     }
//   };
  
//   console.log(serviceGroups)

//   const handleCheckboxChange = (e, label, price) => {
//   const { checked } = e.target;

//   setFormData(prev => {
//     const newCheckboxSelections = {
//       ...prev.checkboxSelections,
//       [label]: {
//         selected: checked,
//         price: price
//       }
//     };

//     // Calculate new modified price
//     const priceChange = checked ? price : -price;
//     const newModifiedPrice = prev.modifiedPrice + priceChange;

//     return {
//       ...prev,
//       checkboxSelections: newCheckboxSelections,
//       modifiedPrice: newModifiedPrice
//     };
//   });

//   if (checked) {
//     alert(`Service price increased by ₹${price} for ${label}`);
//   }
// };
//   // Updated handle file change function to accept document type
//   const handleFileChange = (e, documentType,name) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (documentType === 'receipt') {
//       // Handle receipt upload
//       setFormData({
//         ...formData,
//         receipt: {
//           name: name,
//           file: file,
//           view: URL.createObjectURL(file)
//         }
//       });
//     } else {
//       // Handle document uploads
//       const newDocuments = [...formData.documents];
      
//       // Check if this document type already exists
//       const existingDocIndex = newDocuments.findIndex(doc => doc.type === documentType);
      
//       const newDoc = {
//         type: documentType,
//         name: name,
//         file: file,
//         view: URL.createObjectURL(file)
//       };
      
//       if (existingDocIndex >= 0) {
//         // Replace existing document
//         newDocuments[existingDocIndex] = newDoc;
//       } else {
//         // Add new document
//         newDocuments.push(newDoc);
//       }
      
//       setFormData({
//         ...formData,
//         documents: newDocuments
//       });
//     }
//   };

//   // Function to remove a document
//   const handleRemoveDocument = (documentType) => {
//     if (documentType === 'receipt') {
//       setFormData({
//         ...formData,
//         receipt: null
//       });
//     } else {
//       setFormData({
//         ...formData,
//         documents: formData.documents.filter(doc => doc.type !== documentType)
//       });
//     }
//   };

//   // Check if a document has been uploaded
//   const isDocumentUploaded = (documentType) => {
//     if (documentType === 'receipt') {
//       return formData.receipt !== null;
//     }
//     return formData.documents.some(doc => doc.type === documentType);
//   };

//   // Get uploaded document by type
//   const getDocumentByType = (documentType) => {
//     if (documentType === 'receipt') {
//       return formData.receipt;
//     }
//     return formData.documents.find(doc => doc.type === documentType);
//   };
  
//   // Get price based on agent's plan
//  const getPriceForAgentPlan = (service) => {
//   if (!service?.planPrices) return 0;
  
//   // Add proper null checks
//   const agentLocation = agentData.location || {};
//   const agentPlan = agentData.purchasePlan || '';
  
//   const locationPricing = service.planPrices.find(
//     pricing => pricing.subdistrict === agentLocation.subdistrict
//   ) || service.planPrices[0]; // Fallback to first pricing if none found
  
//   if (!locationPricing) return 0;
  
//   const agentPlanPrice = locationPricing.plans.find(
//     plan => plan.planName.toLowerCase() === agentPlan.toLowerCase()
//   ) || locationPricing.plans[0]; // Fallback to first plan
  
//   return agentPlanPrice?.price?.TotalFee || 0;
// };

//   // Open modal with selected service
//   const handleOpenModal = (serviceGroup, service) => {
//     console.log("mianser",service);
//     const price = getPriceForAgentPlan(service);
    
//     setSelectedService({
//       groupName: serviceGroup.name,
//       ...service,
//       price: price
//     });
    
//     // Pre-populate form with service data including the service ID
//     setFormData({
//       ...formData,
//       service: service.name,
//       serviceId: service.serviceId,
//       amount: service.price,
//       status: service.status,
//        ExpectedDays:service.ExpectedDays,
//       delivery: calculateDeliveryDate(new Date(), service.ExpectedDays),
//       date: new Date().toISOString().split('T')[0],
//       // Reset documents when opening a new form
//       documents: [],
//       receipt: null,
//       additional: {
//         inputType: '',
//         label: '',
//         value: ''
//       }
//     });
 
//     setIsModalOpen(true);
//   };
// console.log("select",selectedService)
//   // Handle viewing application details
//   const handleViewDetails = (application) => {
//     setSelectedApplication(application);
//     setIsViewModalOpen(true);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//      const selectedOptions = Object.entries(formData.checkboxSelections)
//     .filter(([_, value]) => value.selected)
//     .map(([label, data]) => ({
//       label,
//       price: data.price
//     }));
//     setFormLoading(true);
//     setSubmissionStatus(null);
//      const formattedDocuments = formData.documents.map(doc => ({
//     name: doc.name,
//     view: doc.view,
//     remark: doc.remark || ''
//   }));
//     // Format the service field properly for the API
//     const serviceData = {
//       _id: formData.serviceId,
//       name: formData.service,
//       status: formData.status,
//     };
//     const totalSelectedOptionsPrice = selectedOptions.reduce((acc, curr) => acc + (curr.price || 0), 0);
//     // Prepare data for submission
//     const submissionData = {
//       ...formData,

//       service: serviceData,
//       amount: parseFloat(selectedService.price + totalSelectedOptionsPrice),
//        selectedOptions, 
//       date: new Date(formData.date).toISOString(),
//    delivery: calculateDeliveryDate(formData.date, formData.ExpectedDays),
//       provider: {
//         id:session?.user?._id,
//         name:session?.user?.fullName
//       },
//       // Format documents for API
//        document: formattedDocuments,
//     };
//     console.log("Complete submission data:", submissionData);
//     try {
//       const response = await fetch("https://dokument-guru-backend.vercel.app/api/application/create", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(submissionData),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Failed to create application: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       // Show success message
//       setSubmissionStatus({ success: true, message: "Application submitted successfully!" });
      
//       // Refresh applications list
//       if (session?.user?._id) {
//         try {
//           const appResponse = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session?.user?._id}`);
//           const appData = await appResponse.json();
//           setApplications(appData.data || []);
//         } catch (error) {
//           console.error("Error refreshing applications:", error);
//         }
//       }
      
//       // Reset form after short delay
//       setTimeout(() => {
//         setIsModalOpen(false);
//         setFormData({
//           name: '',
//           phone: '',
//           email: '',
//           address: '',
//           provider: 'Agent',
//           ExpectedDays:0,
//           date: new Date().toISOString().split('T')[0],
//           delivery: calculateDeliveryDate(new Date(), 7),
//           status: {
//             "name":"initiated",
//             "hexcode":"#12fe11",
//             "askreason":"no"
//           },
//           initialStatus: {
//             "name":"initiated",
//             "hexcode":"#12fe11",
//             "askreason":false
//           },
//           service: '',
//           serviceId: '',
//           staff: 'Not Assigned',
//           amount: '',
//           documents: [],
//           receipt: null,
//           additional: {
//             inputType: '',
//             label: '',
//             value: ''
//           }
//         });
//         setSubmissionStatus(null);
//       }, 2000);
      
//     } catch (error) {
//       console.error('Error submitting application:', error);
//       setSubmissionStatus({ success: false, message: `Failed to submit application: ${error.message}` });
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // Filter service groups based on search term
//   const filteredServiceGroups = serviceGroups.filter(group => 
//     group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     group.services.some(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
//   );
//   console.log(applications)
//   // Get contrast color for status badges
//   function getContrastColor(hexColor) {
//     // Convert hex to RGB
//     const r = parseInt(hexColor.substr(1, 2), 16);
//     const g = parseInt(hexColor.substr(3, 2), 16);
//     const b = parseInt(hexColor.substr(5, 2), 16);
    
//     // Calculate luminance
//     const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
//     // Return dark or light color based on luminance
//     return luminance > 0.5 ? '#000000' : '#ffffff';
//   }
//   const [modifiedApplication, setModifiedApplication] = useState(null);
// const [documentsModified, setDocumentsModified] = useState(false);
// const [isUploading, setIsUploading] = useState(false);

// // Reset state when the modal opens
// useEffect(() => {
//   if (selectedApplication) {
//     setModifiedApplication({...selectedApplication});
//     setDocumentsModified(false);
//   }
// }, [selectedApplication, isViewModalOpen]);

// // Handle file upload change
// const handleViewFileChange = async (e, index) => {
//   const file = e.target.files[0];
//   if (!file) return;
  
//   setIsUploading(true);
  
//   try {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     const response = await axios.post(
//       'https://dokument-guru-backend.vercel.app/api/upload/doc',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     );

//     if (response.data.success) {
//       const updatedDocuments = [...modifiedApplication.document];
//       updatedDocuments[index] = {
//         ...updatedDocuments[index],
//         name: file.name,
//         view: response.data.documentUrl,
//         remark: '' // Clear any existing remark when reuploading
//       };
      
//       setModifiedApplication({
//         ...modifiedApplication,
//         document: updatedDocuments
//       });
      
//       setDocumentsModified(true);
//     }
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     alert(`Failed to upload file: ${error.message}`);
//   } finally {
//     setIsUploading(false);
//   }
// };

// // Handle saving changes
// const handleSaveChanges = async () => {
//   if (!modifiedApplication) return;
  
//   try {
//     // Send the updated application to your API
//     const response = await axios.put(
//       `https://dokument-guru-backend.vercel.app/api/application/update/${modifiedApplication._id}`,
//       modifiedApplication
//     );
    
//     if (response.data) {
//       // Update the selected application with the response data
//       setSelectedApplication(response.data);
//       // Reset modification flags
//       setDocumentsModified(false);
      
//       // Show success message
//       alert("Application updated successfully!");
//     }
//   } catch (error) {
//     console.error("Error updating application:", error);
//     alert("Failed to update application. Please try again.");
//   }
// };
// // Update the handleFileUpload function in your main component
// const handleFileUpload = async (documentType, file) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     const response = await axios.post(
//       'https://dokument-guru-backend.vercel.app/api/upload/doc',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     );
//     console.log(response)
//     if (response.data.success) {
//       const newDoc = {
//         type: documentType,
//         name: documentType,
//         view: response.data.documentUrl,
//         remark: ''
//       };

//       // Check if this document type already exists
//       const existingDocIndex = formData?.documents?.findIndex(doc => doc.type === documentType);
      
//       if (existingDocIndex >= 0) {
//         // Replace existing document
//         const updatedDocuments = [...formData.documents];
//         updatedDocuments[existingDocIndex] = newDoc;
//         setFormData(prev => ({
//           ...prev,
//           documents: updatedDocuments
//         }));
//       } else {
//         // Add new document
//         setFormData(prev => ({
//           ...prev,
//           documents: [...prev.documents, newDoc]
//         }));
//       }
//     }
//   } catch (error) {
//     console.error("Error uploading document:", error);
//     alert("Failed to upload document. Please try again.");
//   }
// };
// console.log("formu - ",formData.documents)
// // Add a confirmation before closing if there are unsaved changes
// const handleCloseModal = () => {
//   if (documentsModified) {
//     if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
//       setIsViewModalOpen(false);
//     }
//   } else {
//     setIsViewModalOpen(false);
//   }
// };
//   // Application Table Component
//   function ApplicationsTable({ applications }) {
//     return (
//       <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-8">
//         <div className="px-6 py-5 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">Your Applications</h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Track status and details of all customer applications
//           </p>
//         </div>
        
//         {applications.length === 0 ? (
//           <div className="px-6 py-8 text-center">
//             <p className="text-gray-500">No applications submitted yet</p>
//             <p className="text-sm text-gray-400 mt-1">Submit your first application using the services below</p>
//           </div>
//         ) : (
//           <div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Customer
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Service
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Amount
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Submitted
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Delivery
//               </th>
//               <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentApplications.map((application) => (
//               <tr key={application._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
//                       <span className="text-gray-600 font-medium">
//                         {application.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{application.name}</div>
//                       <div className="text-sm text-gray-500">{application.phone}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{application.service.name}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span 
//                     className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full py-1"
//                     style={{ 
//                       backgroundColor: application.initialStatus[0]?.hexcode || '#e5e7eb',
//                       color: getContrastColor(application.initialStatus[0]?.hexcode || '#e5e7eb')
//                     }}
//                   >
//                     {application.initialStatus[0]?.name || 'Pending'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   ₹{application.amount}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(application.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {application.delivery}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button
//                     onClick={() => handleViewDetails(application)}
//                     className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
//                   >
//                     <FiEye className="mr-1" /> View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination controls */}
//       <div className="mt-4 flex items-center justify-between p-4">
//         <div className="text-sm text-gray-700">
//           Showing <span className="font-medium">{indexOfFirstApplication + 1}</span> to{" "}
//           <span className="font-medium">
//             {Math.min(indexOfLastApplication, applications.length)}
//           </span>{" "}
//           of <span className="font-medium">{applications.length}</span> applications
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={goToPreviousPage}
//             disabled={currentPage === 1}
//             className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
//               currentPage === 1
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             <FiChevronLeft className="h-4 w-4 mr-1" />
//             Previous
//           </button>
//           <button
//             onClick={goToNextPage}
//             disabled={currentPage === totalPages}
//             className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
//               currentPage === totalPages
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Next
//             <FiChevronRight className="h-4 w-4 ml-1" />
//           </button>
//         </div>
//       </div>
//     </div>
//         )}
//       </div>
//     );
//   }
//   console.log("selellele = ",selectedService)
//   // Component for document upload UI
// const DocumentUploadField = ({ documentType, label, onFileChange }) => {
//   const [fileName, setFileName] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState('');
//   const fileInputRef = useRef(null);
  
//   const MAX_FILE_SIZE = 256 * 1024; // 256KB in bytes
  
//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     setError('');
    
//     // Check file size
//     if (file.size > MAX_FILE_SIZE) {
//       alert(`File size exceeds 256KB limit. Current size: ${(file.size / 1024).toFixed(2)}KB`)
//       setError(`File size exceeds 256KB limit. Current size: ${(file.size / 1024).toFixed(2)}KB`);
//       fileInputRef.current.value = ''; // Reset file input
//       return;
//     }
    
//     setFileName(documentType);
//     setIsUploading(true);
    
//     try {
//       await onFileChange(documentType, file);
//     } catch (error) {
//       setFileName('');
//       setError(`Upload failed: ${error.message || 'Unknown error'}`);
//       console.error("Upload failed:", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <div className="flex items-center space-x-2">
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="hidden"
//         accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//       />
//       <div className="flex-grow min-w-0">
//         <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
//           <span className="truncate text-sm text-gray-600">
//             {fileName || `No file selected for ${label}`}
//           </span>
//           <button
//             type="button"
//             onClick={handleUploadClick}
//             disabled={isUploading}
//             className={`ml-2 px-3 py-1 text-sm rounded focus:outline-none focus:ring-2 ${
//               isUploading
//                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 : 'bg-green-600 text-white hover:bg-green-700'
//             }`}
//           >
//             {isUploading ? 'Uploading...' : fileName ? 'Change' : 'Upload'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//   // Loading state for the entire page
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <FiRefreshCw className="animate-spin h-10 w-10 mx-auto text-green-600 mb-4" />
//           <p className="text-gray-600">Loading services...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
//         <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-lg w-full">
//           <p className="font-medium text-lg mb-2">Error loading service groups</p>
//           <p className="text-sm mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
//           >
//             <FiRefreshCw className="mr-2" /> Retry Loading
//           </button>
//         </div>
//       </div>
//     );
//   }
//   console.log(agentData)
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Dokument Guru Services</h1>
//           <p className="text-gray-600 mt-2">Browse available services and track your applications</p>
//           <div className="flex items-center mt-2">
//             <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
//               {agentData.location.subdistrict}-{agentData.location.district}
//             </span>
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//               {agentData.purchasePlan} Plan
//             </span>
//           </div>
//         </div>

       

//         {/* Service Groups Section */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">Available Services</h2>
            
//             {/* Search Bar */}
//             <div className="relative w-full md:w-96">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search service groups or services..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               />
//             </div>
//           </div>

//           {/* Service Groups Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {filteredServiceGroups.map((group) => (
//         <div
//           key={group._id}
//           className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
//         >
//           <div className="h-40 bg-gray-200 relative overflow-hidden">
//             {group.image ? (
//               <img
//                 src={group.image}
//                 alt={group.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
//                 <FiFileText className="h-12 w-12 text-green-400" />
//               </div>
//             )}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
//               <h3 className="text-white text-xl font-semibold p-4">{group.name}</h3>
//             </div>
//           </div>

//           <div className="p-4">
//             {group.services && group.services.length > 0 ? (
//               <div>
//                 <button
//                   onClick={() => toggleGroupDropdown(group._id)}
//                   className="w-full flex justify-between items-center py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
//                 >
//                   <span className="font-medium text-gray-700">
//                     View {group.services.length} available services
//                   </span>
//                   {openGroups[group._id] ? (
//                     <FiChevronUp className="h-5 w-5 text-gray-500" />
//                   ) : (
//                     <FiChevronDown className="h-5 w-5 text-gray-500" />
//                   )}
//                 </button>

//                 {openGroups[group._id] && (
//                   <div className="mt-3 space-y-3">
//                     {group.services.map((service) => (
//                       <div key={service._id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
//                         <div>
//                           <p className="font-medium text-gray-800">{service.name}</p>
//                           {service.documentNames && service.documentNames.length > 0 && (
//                             <p className="text-xs text-gray-500 mt-1">
//                               Requires: {service.documentNames.slice(0, 2).join(', ')}
//                               {service.documentNames.length > 2 && ' + ' + (service.documentNames.length - 2) + ' more'}
//                             </p>
//                           )}
//                         </div>
                        
//                         <div className="relative">
//                           <button
//                             onClick={() => handleButtonClick(group, service)}
//                             disabled={loading}
//                             className={`flex items-center text-sm px-3 py-1 rounded-md font-medium ${
//                               loading 
//                                 ? "bg-gray-100 text-gray-400"
//                                 : "bg-green-50 hover:bg-green-100 text-green-700"
//                             }`}
//                           >
//                             {loading ? (
//                               "Loading..."
//                             ) : (
//                               <>
//                                 ₹{getPriceForAgentPlan(service)}
//                                 <FiPlus className="ml-2 h-4 w-4" />  
//                               </>
//                             )}
//                           </button>
                          
//                           {error && (
//                             <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
//                               {error}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-4">No services available yet</p>
//             )}
//           </div>
//         </div>
//       ))}
      
//       {filteredServiceGroups.length === 0 && (
//         <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
//           <FiSearch className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//           <p className="text-gray-600 mb-1">No service groups match your search</p>
//           <p className="text-gray-500 text-sm">Try a different search term or browse all services</p>
//         </div>
//       )}
//     </div>
//         </div>
        
//         {/* Application Form Modal */}
//      {isModalOpen && selectedService && (
//   <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
//     <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full mx-4 max-h-screen overflow-y-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium text-gray-900">
//           Apply for {selectedService.name}
//         </h3>
//         <button 
//           onClick={() => setIsModalOpen(false)}
//           className="text-gray-400 hover:text-gray-500"
//         >
//           <FiX className="h-5 w-5" />
//         </button>
//       </div>
      
//       <div className="flex items-center space-x-2 mb-4">
//        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
//   ₹{selectedService.price + modifiedPrice}
// </span>
//         <span className="text-sm text-gray-600">
//           Service Group: {selectedService.groupName}
//         </span>
//       </div>
      
//       {/* Required Documents */}
//       {selectedService.documentNames && selectedService.documentNames.length > 0 && (
//         <div className="mb-4 p-3 bg-yellow-50 rounded-md">
//           <p className="text-sm font-medium text-yellow-800">Required Documents:</p>
//           <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
//             {selectedService.documentNames.map((doc, index) => (
//               <li key={index}>{doc}</li>
//             ))}
//           </ul>
//         </div>
//       )}
    
      
//       {/* Form submission status */}
//       {submissionStatus && (
//         <div className={`mb-4 p-3 rounded ${submissionStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//           <div className="flex items-center">
//             {submissionStatus.success ? (
//               <FiCheck className="h-5 w-5 mr-2" />
//             ) : (
//               <FiX className="h-5 w-5 mr-2" />
//             )}
//             {submissionStatus.message}
//           </div>
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Applicant Name*</label>
//             <div className="mt-1 relative rounded-md shadow-sm">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiUser className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
//             <div className="mt-1 relative rounded-md shadow-sm">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiPhone className="text-gray-400" />
//               </div>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 required
//                 pattern="[0-9]{10}"
//                 title="Please enter a valid 10-digit phone number"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email Address*</label>
//             <div className="mt-1 relative rounded-md shadow-sm">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiMail className="text-gray-400" />
//               </div>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
//               />
//             </div>
//           </div>
//           {/* {
//             selectedService.formData.map((data)=>{
//               if (data.inputType === 'checkbox') {
//       return (
//         <div key={data.label} className="flex items-center">
//           <input
//             type="checkbox"
//             name={`additional.${data.label}`}
//             checked={checkboxSelections[data.label] || false}
//             onChange={(e) => handleInputChange(e, data.label)}
//             className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//           />
//           <label className="ml-2 block text-sm text-gray-700">
//             {data.label} {data.price && `(+₹${data.price})`}
//           </label>
//         </div>
//       );
//     }
//               return<div key={data.label}>
//                 <label className="block text-sm font-medium text-gray-700">{data.label}*</label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                 <input
//                   type={data.inputType}
//                   name="additional.value"
//                   required
//                   value={formData.additional.value || ''}
//                   onChange={(e)=>handleInputChange(e,data.label)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>
//               </div> 
//             })
//           } */}
//            {selectedService.formData
//         .filter(item => item.inputType === 'checkbox')
//         .map(item => (
//           <div key={item.label} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               id={`option-${item.label}`}
//               // checked={formData.checkboxSelections[item.label]?.selected || false}
//               checked={formData.checkboxSelections ? (formData.checkboxSelections[item.label]?.selected || false) : false}
//               onChange={(e) => handleCheckboxChange(e, item.label, item.price)}
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//             />
//             <label htmlFor={`option-${item.label}`} className="ml-2 text-sm text-gray-700">
//               {item.label} (+₹{item.price})
//             </label>
//           </div>
//         ))
//       }
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Application Date</label>
//             <div className="mt-1 relative rounded-md shadow-sm">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiCalendar className="text-gray-400" />
//               </div>
//               <input
//                 type="date"
//                 name="date"
//                 disabled
//                 value={formData.date}
//                 onChange={handleInputChange}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
//               />
//             </div>
//           </div>
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Address</label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiMapPin className="text-gray-400" />
//             </div>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//               rows={3}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
//             />
//           </div>
//         </div>
        
//         {/* Payment Details */}
//         {/* <div>
//           <div className="flex justify-between items-center mb-2">
//             <label className="block text-sm font-medium text-gray-700">Payment Receipt</label>
//             <span className="text-xs text-gray-500">Upload payment confirmation</span>
//           </div>
//           <div className="mt-1">
//             <DocumentUploadField 
//               documentType="receipt" 
//               label="Payment Receipt" 
//               onFileChange={handleFileUpload}
//             />
//           </div>
//         </div>
//         {formData.receipt && (
//   <div className="mt-2">
//     <h4 className="text-sm font-medium text-gray-700 mb-1">Uploaded Receipt:</h4>
//     <div className="flex items-center justify-start gap-2 bg-gray-50 p-2 rounded">
//     <span>Payment Receipt</span>-<span className="text-sm text-gray-600">{formData.receipt.name}</span>
//       <button
//         type="button"
//         onClick={() => handleRemoveDocument('receipt')}
//         className="text-red-500 hover:text-red-700"
//       >
//         <FiX />
//       </button>
//     </div>
//   </div>
// )} */}
        
//         {/* Dynamic Document Upload Fields */}
//         {selectedService.documentNames && selectedService.documentNames.length > 0 && (
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <label className="block text-sm font-medium text-gray-700">Required Documents</label>
//               <span className="text-xs text-gray-500">Upload all required documents</span>
//             </div>
//             <div className="space-y-3">
//               {selectedService.documentNames.map((docName, index) => (
//                 <DocumentUploadField 
//                   key={index} 
//                   documentType={docName} 
//                   label={docName}
//                   onFileChange={handleFileUpload}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//           {formData.documents.length > 0 && (
//   <div className="mt-4">
//     <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
//     <ul className="space-y-2">
//       {formData.documents.map((doc, index) => (
//         <li key={index} className="flex items-center justify-start gap-2 bg-gray-50 p-2 rounded">
//           <span>{doc.type}</span>-<span className="text-sm text-gray-600">{doc.name}</span>
//           <button
//             type="button"
//             onClick={() => handleRemoveDocument(doc.type)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <FiX />
//           </button>
//         </li>
//       ))}
//     </ul>
//   </div>
// )}
        
//         <div className="pt-4 border-t border-gray-200 flex justify-end">
//           <button
//             type="button"
//             onClick={() => setIsModalOpen(false)}
//             className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={formLoading}
//             className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {formLoading ? (
//               <>
//                 <FiRefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Submitting...
//               </>
//             ) : (
//               'Submit Application'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}
        
//         {/* View Application Modal */}
//         {isViewModalOpen && selectedApplication && (
//   <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h3 className="text-2xl font-semibold text-gray-900">
//             {selectedApplication.name}'s Application
//           </h3>
//         </div>
//         <button 
//           onClick={() => setIsViewModalOpen(false)}
//           className="text-gray-400 hover:text-gray-500 transition-colors p-1 -m-1"
//         >
//           <FiX className="h-6 w-6" />
//         </button>
//       </div>
      
//       {/* Status Bar */}
//       <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
//         <div className="flex items-center">
//           <div 
//             className="px-3 py-1 text-sm font-medium rounded-full shadow-sm"
//             style={{ 
//               backgroundColor: selectedApplication.initialStatus[0]?.hexcode || '#e5e7eb',
//               color: getContrastColor(selectedApplication.initialStatus[0]?.hexcode || '#e5e7eb')
//             }}
//           >
//             {selectedApplication.initialStatus[0]?.name || 'Processing'}
//           </div>
//           <div className="ml-3">
//             <p className="text-sm font-medium text-gray-700">Submitted</p>
//             <p className="text-xs text-gray-500">
//               {new Date(selectedApplication.createdAt).toLocaleString()}
//             </p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-sm font-medium text-gray-700">Expected Delivery</p>
//           <p className="text-sm text-indigo-600 font-semibold">
//             {selectedApplication.delivery}
//           </p>
//         </div>
//       </div>
      
//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Service Details Card */}
//         <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
//           <div className="flex items-center mb-4">
//             <div className="p-2 bg-indigo-100 rounded-lg mr-3">
//               <FiPackage className="h-5 w-5 text-indigo-600" />
//             </div>
//             <h4 className="font-semibold text-gray-900">Service Details</h4>
//           </div>
//           <div className="space-y-3">
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service</p>
//               <p className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.service.name}</p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</p>
//               <p className="text-sm font-medium text-gray-900 mt-1">₹{selectedApplication.amount}</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Applicant Details Card */}
//         <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
//           <div className="flex items-center mb-4">
//             <div className="p-2 bg-blue-100 rounded-lg mr-3">
//               <FiUser className="h-5 w-5 text-blue-600" />
//             </div>
//             <h4 className="font-semibold text-gray-900">Applicant Details</h4>
//           </div>
//           <div className="space-y-3">
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
//               <p className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.name}</p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
//               <p className="text-sm font-medium text-gray-900 mt-1">{selectedApplication.phone}</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Timeline Card */}
//         <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
//           <div className="flex items-center mb-4">
//             <div className="p-2 bg-purple-100 rounded-lg mr-3">
//               <FiClock className="h-5 w-5 text-purple-600" />
//             </div>
//             <h4 className="font-semibold text-gray-900">Application Timeline</h4>
//           </div>
//           <div className="space-y-4">
//             {/* Submitted Status - Always completed */}
//             <div className="flex">
//               <div className="flex flex-col items-center mr-4">
//                 <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
//                 <div className="w-px h-full bg-gray-200"></div>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">Application Submitted</p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(selectedApplication.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             </div>

//             {/* Dynamic Status Timeline from Service Status */}
//             {selectedApplication.service.status.map((statusItem, index) => {
//               // Find the current status index
//               const currentStatusIndex = selectedApplication.service.status.findIndex(
//                 s => s._id === selectedApplication.initialStatus[0]?._id
//               );
              
//               // Check if this status is completed (before current status)
//               const isCompleted = index < currentStatusIndex;
//               // Check if this is the current status
//               const isCurrent = index === currentStatusIndex;
//               // Check if this is a future status
//               const isFuture = index > currentStatusIndex;

//               return (
//                 <div key={statusItem._id} className="flex">
//                   <div className="flex flex-col items-center mr-4">
//                     <div 
//                       className={`w-3 h-3 rounded-full mt-1 ${
//                         isCompleted || isCurrent ? 'bg-green-500' : 'bg-gray-300'
//                       }`}
//                     ></div>
//                     {index !== selectedApplication.service.status.length - 1 && (
//                       <div className={`w-px h-full ${
//                         isCompleted ? 'bg-green-500' : 'bg-gray-200'
//                       }`}></div>
//                     )}
//                   </div>
//                   <div>
//                     <p className={`text-sm font-medium ${
//                       isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
//                     }`}>
//                       {statusItem.name}
//                       {isCurrent && (
//                         <span className="ml-2 px-2 py-0.5 text-xs font-normal rounded-full bg-green-100 text-green-800">
//                           Current
//                         </span>
//                       )}
//                     </p>
//                     {isCompleted || isCurrent ? (
//                       <p className="text-xs text-gray-500">
//                         {isCurrent 
//                           ? `Updated: ${new Date(selectedApplication.updatedAt).toLocaleString()}`
//                           : `Completed: ${new Date(selectedApplication.updatedAt).toLocaleString()}`
//                         }
//                       </p>
//                     ) : (
//                       <p className="text-xs text-gray-400">Pending</p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Delivery Status - Only show if all statuses are completed */}
//             {selectedApplication.initialStatus[0]?._id === 
//               selectedApplication.service.status[selectedApplication.service.status.length - 1]?._id && (
//               <div className="flex">
//                 <div className="flex flex-col items-center mr-4">
//                   <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Service Completion</p>
//                   <p className="text-xs text-gray-400">Estimated by {selectedApplication.delivery}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Documents Section */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <div className="p-2 bg-green-100 rounded-lg mr-3">
//               <FiFileText className="h-5 w-5 text-green-600" />
//             </div>
//             <h4 className="font-semibold text-gray-900">Uploaded Documents</h4>
//           </div>
          
//           {/* Save Changes Button - Only show when documents have been modified */}
//           {documentsModified && (
//             <button
//               onClick={handleSaveChanges}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
//             >
//               <FiSave className="mr-2 -ml-1 h-4 w-4" />
//               Save Changes
//             </button>
//           )}
//         </div>
        
//         {modifiedApplication?.document && modifiedApplication?.document.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {modifiedApplication.document.map((doc, index) => (
//               <div key={index} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//                 <div className="p-4">
//                   <div className="flex items-start">
//                     <div className="bg-gray-50 p-3 rounded-lg mr-4">
//                       <FiFile className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h5 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h5>
//                       {doc.remark && (
//                         <div className="mt-2">
//                           <p className="text-xs font-medium text-red-500 uppercase tracking-wider mb-1">
//                             Remark:
//                           </p>
//                           <p className="text-xs text-gray-700 italic bg-red-50 p-2 rounded-md">
//                             {doc.remark}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 flex justify-between border-t border-gray-100">
//                   {doc.view && (
//                     <a
//                       href={doc.view}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
//                     >
//                       <FiEye className="mr-1.5 h-4 w-4" />
//                       View Document
//                     </a>
//                   )}
                  
//                   {/* Reupload Button - Only show for documents with remarks */}
//                   {doc.remark && (
//                     <div className="relative">
//                       <input
//                         type="file"
//                         id={`file-upload-${index}`}
//                         onChange={(e) => handleViewFileChange(e, index)}
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       />
//                       <label
//                         htmlFor={`file-upload-${index}`}
//                         className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 cursor-pointer"
//                       >
//                         <FiUpload className="mr-1.5 h-4 w-4" />
//                         Reupload Document
//                       </label>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 bg-gray-50 rounded-lg">
//             <FiFile className="mx-auto h-8 w-8 text-gray-400" />
//             <p className="mt-2 text-sm text-gray-500">No documents uploaded</p>
//           </div>
//         )}
//       </div>
      
//       {/* Footer Actions */}
//       {/* <div className="border-t border-gray-100 pt-5 flex flex-wrap justify-between items-center">
//         <div className="mb-3 sm:mb-0">
//           <p className="text-xs text-gray-500">
//             Last updated: {new Date(selectedApplication.updatedAt).toLocaleString()}
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => setIsViewModalOpen(false)}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//           >
//             Close
//           </button>
//           <button
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//           >
//             <FiDownload className="mr-2 -ml-1 h-4 w-4" />
//             Export Details
//           </button>
//         </div>
//       </div> */}
//     </div>
//   </div>
// )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect,useRef } from 'react';
import { FiFile,FiSave, FiPlus,FiPackage,FiChevronLeft ,FiChevronDown,FiChevronUp ,FiChevronRight ,FiClock, FiSearch, FiRefreshCw, FiUpload, FiX, FiCheck, FiEye, FiCalendar, FiUser, FiPhone, FiMail, FiMapPin, FiFileText, FiCreditCard, FiDownload, FiTrash2 } from 'react-icons/fi';
import { useSession } from '@/context/SessionContext';
import axios from 'axios';

export default function ServiceGroupsUI() {
  const { session } = useSession();
  const [serviceGroups, setServiceGroups] = useState([]);
  const [walletAmount, setWalletAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkboxSelections, setCheckboxSelections] = useState({});
  const [modifiedPrice, setModifiedPrice] = useState(0);
  const applicationsPerPage = 5;
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroupDropdown = (groupId) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);
  
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const agentData = {
    location: session?.user?.location,
    district: session?.user?.location?.district,
    purchasePlan: session?.user?.purchasePlan
  };
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    checkboxSelections: {},
    location: session?.user?.location,
    provider: {
      id: '',
      name: ""
    }, 
    ExpectedDays: 0,
    date: new Date().toISOString().split('T')[0],
    delivery: calculateDeliveryDate(new Date(), 7),
    status: {
      "name": "initiated",
      "hexcode": "#12fe11",
      "askreason": "no"
    },
    initialStatus: {
      "name": "initiated",
      "hexcode": "#12fe11",
      "askreason": false
    },
    service: '',
    serviceId: '',
    staff: {
      id: "",
      name: "Not Assigned"
    },
    amount: '',
    documents: [],
    receipt: null,
    additional: {
      inputType: '',
      label: '',
      value: ''
    },
    checkboxSelections: {}
  });

  useEffect(() => {
    if (session?.user?._id) {
      const fetchApplications = async () => {
        try {
          const response = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session.user._id}`);
          const data = await response.json();
          setApplications(data.data || []);
        } catch (error) {
          console.error("Error fetching applications:", error);
        } finally {
          setAppLoading(false);
        }
      };
      
      fetchApplications();
    }
  }, [session]);

  function calculateDeliveryDate(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return formatDisplayDate(d);
  }

  function formatDisplayDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const fetchServiceGroups = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/fetch-by-visibility');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch service groups: ${response.status}`);
        }
        
        const data = await response.json();
        setServiceGroups(data.serviceGroups || []);
      } catch (err) {
        console.error("Error fetching service groups:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceGroups();
  }, []);

  useEffect(() => {
    const fetchWalletAmount = async () => {
      if (!session?.user?._id) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/wallet/${session?.user?._id}`);
        const data = await response.json();
        
        if (data.success) {
          setWalletAmount(data.wallet);
        } else {
          setError("Failed to fetch wallet amount");
        }
      } catch (err) {
        setError("Error connecting to wallet service");
        console.error("Error fetching wallet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletAmount();
  }, [session]);

  const handleButtonClick = (group, service) => {
    const servicePrice = getPriceForAgentPlan(service);
    
    if (walletAmount >= servicePrice) {
      handleOpenModal(group, service);
    } else {
      console.log("Insufficient amount in wallet");
      setError("Insufficient balance in wallet");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleInputChange = (e, label) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const checkboxData = selectedService?.formData?.find(item => item.label === label);
      const priceChange = checkboxData?.price || 0;
      
      setCheckboxSelections(prev => ({
        ...prev,
        [label]: checked
      }));
      
      if (checked) {
        setModifiedPrice(prev => prev + priceChange);
        // alert(`Service price increased by ₹${priceChange} for ${label}`);
      } else {
        setModifiedPrice(prev => prev - priceChange);
      }
      
      return;
    }
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [childKey]: value
        }
      }));
      setFormData((prevData) => ({
        ...prevData,
        additional: {
          ...prevData[parentKey],
          label: label
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

const handleCheckboxChange = (e, label, price) => {
  const { checked } = e.target;

  setFormData(prev => {
    const newCheckboxSelections = {
      ...prev.checkboxSelections,
      [label]: checked
    };

    // Calculate new modified price
    const priceChange = checked ? price : -price;
    const newModifiedPrice = (prev.modifiedPrice || 0) + priceChange;

    if (checked) {
      alert(`Service price increased by ₹${price} for ${label}`);
    }

    return {
      ...prev,
      checkboxSelections: newCheckboxSelections,
      modifiedPrice: newModifiedPrice
    };
  });
};
 const handleFileChange = async (documentType, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      'https://dokument-guru-backend.vercel.app/api/upload/doc',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success) {
      const newDoc = {
        type: documentType,
        name: file.name,
        view: response.data.documentUrl,
        remark: ''
      };

      setFormData(prev => {
        const existingDocIndex = prev.documents.findIndex(doc => doc.type === documentType);
        
        if (existingDocIndex >= 0) {
          const updatedDocuments = [...prev.documents];
          updatedDocuments[existingDocIndex] = newDoc;
          return {
            ...prev,
            documents: updatedDocuments
          };
        } else {
          return {
            ...prev,
            documents: [...prev.documents, newDoc]
          };
        }
      });
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    alert("Failed to upload document. Please try again.");
  }
};

  const handleRemoveDocument = (documentType) => {
    if (documentType === 'receipt') {
      setFormData({
        ...formData,
        receipt: null
      });
    } else {
      setFormData({
        ...formData,
        documents: formData.documents.filter(doc => doc.type !== documentType)
      });
    }
  };

  const isDocumentUploaded = (documentType) => {
    if (documentType === 'receipt') {
      return formData.receipt !== null;
    }
    return formData.documents.some(doc => doc.type === documentType);
  };

  const getDocumentByType = (documentType) => {
    if (documentType === 'receipt') {
      return formData.receipt;
    }
    return formData.documents.find(doc => doc.type === documentType);
  };
  
  const getPriceForAgentPlan = (service) => {
    if (!service?.planPrices) return 0;
    
    const agentLocation = agentData.location || {};
    const agentPlan = agentData.purchasePlan || '';
    
    const locationPricing = service.planPrices.find(
      pricing => pricing.subdistrict === agentLocation.subdistrict
    ) || service.planPrices[0];
    
    if (!locationPricing) return 0;
    
    const agentPlanPrice = locationPricing.plans.find(
      plan => plan.planName.toLowerCase() === agentPlan.toLowerCase()
    ) || locationPricing.plans[0];
    
    return agentPlanPrice?.price?.TotalFee || 0;
  };

  const handleOpenModal = (serviceGroup, service) => {
    const price = getPriceForAgentPlan(service);
    
    setSelectedService({
      groupName: serviceGroup.name,
      ...service,
      price: price
    });
    
    setFormData({
      ...formData,
      service: service.name,
      serviceId: service.serviceId,
      amount: service.price,
      status: service.status,
      ExpectedDays: service.ExpectedDays,
      delivery: calculateDeliveryDate(new Date(), service.ExpectedDays),
      date: new Date().toISOString().split('T')[0],
      documents: [],
      receipt: null,
      additional: {
        inputType: '',
        label: '',
        value: ''
      },
      modifiedPrice: 0,
      checkboxSelections: {}
    });
 
    setIsModalOpen(true);
    setModifiedPrice(0);
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Calculate total price including checkbox selections
  const selectedOptions = Object.entries(formData.checkboxSelections)
    .filter(([_, isChecked]) => isChecked)
    .map(([label]) => {
      const option = selectedService.formData.find(item => item.label === label);
      return {
        label,
        price: option?.price || 0
      };
    });

  const totalOptionsPrice = selectedOptions.reduce((sum, option) => sum + option.price, 0);
  const totalAmount = selectedService.price + totalOptionsPrice;

  setFormLoading(true);
  setSubmissionStatus(null);
  
  const formattedDocuments = formData.documents.map(doc => ({
    name: doc.name,
    view: doc.view,
    remark: doc.remark || ''
  }));

  const submissionData = {
    ...formData,
    name: formData.name,
    phone: formData.phone,
    address: formData.address,
    service: {
      _id: selectedService.serviceId,
      name: selectedService.name,
      status: selectedService.status,
    },
    amount: totalAmount,
    selectedOptions,
    date: new Date().toISOString(),
    delivery: calculateDeliveryDate(new Date(), formData.ExpectedDays),
    provider: {
      id: session?.user?._id,
      name: session?.user?.fullName
    },
    document: formattedDocuments,
    receipt: formData.receipt ? {
      name: formData.receipt.name,
      view: formData.receipt.view,
      remark: ''
    } : null,
    additional: formData.additional,
    checkboxSelections: selectedOptions.reduce((acc, option) => {
      acc[option.label] = option;
      return acc;
    }, {})
  };

  try {
    const response = await fetch("https://dokument-guru-backend.vercel.app/api/application/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create application: ${response.status}`);
    }
    
    const result = await response.json();
    
    setSubmissionStatus({ success: true, message: "Application submitted successfully!" });
    
    setTimeout(async () => {
      if (session?.user?._id) {
        try {
          const appResponse = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session?.user?._id}`);
          const appData = await appResponse.json();
          setApplications(appData.data || []);
          setIsModalOpen(false);
        } catch (error) {
          console.error("Error refreshing applications:", error);
        }
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error submitting application:', error);
    setSubmissionStatus({ success: false, message: `Failed to submit application: ${error.message}` });
  } finally {
    setFormLoading(false);
  }
};

  const filteredServiceGroups = serviceGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.services.some(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function getContrastColor(hexColor) {
    if (!hexColor) return '#000000';
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  const [modifiedApplication, setModifiedApplication] = useState(null);
  const [documentsModified, setDocumentsModified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedApplication) {
      setModifiedApplication({...selectedApplication});
      setDocumentsModified(false);
    }
  }, [selectedApplication, isViewModalOpen]);

  const handleViewFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        'https://dokument-guru-backend.vercel.app/api/upload/doc',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const updatedDocuments = [...modifiedApplication.document];
        updatedDocuments[index] = {
          ...updatedDocuments[index],
          name: file.name,
          view: response.data.documentUrl,
          remark: ''
        };
        
        setModifiedApplication({
          ...modifiedApplication,
          document: updatedDocuments
        });
        
        setDocumentsModified(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Failed to upload file: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!modifiedApplication) return;
    
    try {
      const response = await axios.put(
        `https://dokument-guru-backend.vercel.app/api/application/update/${modifiedApplication._id}`,
        modifiedApplication
      );
      
      if (response.data) {
        setSelectedApplication(response.data);
        setDocumentsModified(false);
        alert("Application updated successfully!");
        
        // Refresh applications list
        if (session?.user?._id) {
          const appResponse = await fetch(`https://dokument-guru-backend.vercel.app/api/agent/application/${session?.user?._id}`);
          const appData = await appResponse.json();
          setApplications(appData.data || []);
        }
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application. Please try again.");
    }
  };

  const handleFileUpload = async (documentType, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        'https://dokument-guru-backend.vercel.app/api/upload/doc',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        const newDoc = {
          type: documentType,
          name: documentType,
          view: response.data.documentUrl,
          remark: ''
        };

        const existingDocIndex = formData.documents.findIndex(doc => doc.type === documentType);
        
        if (existingDocIndex >= 0) {
          const updatedDocuments = [...formData.documents];
          updatedDocuments[existingDocIndex] = newDoc;
          setFormData(prev => ({
            ...prev,
            documents: updatedDocuments
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, newDoc]
          }));
        }
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to upload document. Please try again.");
    }
  };

  const handleCloseModal = () => {
    if (documentsModified) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        setIsViewModalOpen(false);
      }
    } else {
      setIsViewModalOpen(false);
    }
  };

  // function ApplicationsTable({ applications }) {
  //   return (
  //     <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-8">
  //       <div className="px-6 py-5 border-b border-gray-200">
  //         <h2 className="text-lg font-medium text-gray-900">Your Applications</h2>
  //         <p className="mt-1 text-sm text-gray-500">
  //           Track status and details of all customer applications
  //         </p>
  //       </div>
        
  //       {applications.length === 0 ? (
  //         <div className="px-6 py-8 text-center">
  //           <p className="text-gray-500">No applications submitted yet</p>
  //           <p className="text-sm text-gray-400 mt-1">Submit your first application using the services below</p>
  //         </div>
  //       ) : (
  //         <div>
  //           <div className="overflow-x-auto">
  //             <table className="min-w-full divide-y divide-gray-200">
  //               <thead className="bg-gray-50">
  //                 <tr>
  //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Customer
  //                   </th>
  //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Service
  //                   </th>
  //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Status
  //                   </th>
  //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Amount
  //                   </th>
  //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Submitted
  //                   </th>
  //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Delivery
  //                   </th>
  //                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Actions
  //                   </th>
  //                 </tr>
  //               </thead>
  //               <tbody className="bg-white divide-y divide-gray-200">
  //                 {currentApplications.map((application) => (
  //                   <tr key={application._id} className="hover:bg-gray-50">
  //                     <td className="px-6 py-4 whitespace-nowrap">
  //                       <div className="flex items-center">
  //                         <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
  //                           <span className="text-gray-600 font-medium">
  //                             {application.name.charAt(0).toUpperCase()}
  //                           </span>
  //                         </div>
  //                         <div className="ml-4">
  //                           <div className="text-sm font-medium text-gray-900">{application.name}</div>
  //                           <div className="text-sm text-gray-500">{application.phone}</div>
  //                         </div>
  //                       </div>
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap">
  //                       <div className="text-sm text-gray-900">{application.service.name}</div>
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap">
  //                       <span 
  //                         className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full py-1"
  //                         style={{ 
  //                           backgroundColor: application.initialStatus[0]?.hexcode || '#e5e7eb',
  //                           color: getContrastColor(application.initialStatus[0]?.hexcode || '#e5e7eb')
  //                         }}
  //                       >
  //                         {application.initialStatus[0]?.name || 'Pending'}
  //                       </span>
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       ₹{application.amount}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {new Date(application.createdAt).toLocaleDateString()}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  //                       {application.delivery}
  //                     </td>
  //                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  //                       <button
  //                         onClick={() => handleViewDetails(application)}
  //                         className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
  //                       >
  //                         <FiEye className="mr-1" /> View
  //                       </button>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
            
  //           <div className="mt-4 flex items-center justify-between p-4">
  //             <div className="text-sm text-gray-700">
  //               Showing <span className="font-medium">{indexOfFirstApplication + 1}</span> to{" "}
  //               <span className="font-medium">
  //                 {Math.min(indexOfLastApplication, applications.length)}
  //               </span>{" "}
  //               of <span className="font-medium">{applications.length}</span> applications
  //             </div>
  //             <div className="flex space-x-2">
  //               <button
  //                 onClick={goToPreviousPage}
  //                 disabled={currentPage === 1}
  //                 className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
  //                   currentPage === 1
  //                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
  //                     : "bg-white text-gray-700 hover:bg-gray-50"
  //                 }`}
  //               >
  //                 <FiChevronLeft className="h-4 w-4 mr-1" />
  //                 Previous
  //               </button>
  //               <button
  //                 onClick={goToNextPage}
  //                 disabled={currentPage === totalPages}
  //                 className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
  //                   currentPage === totalPages
  //                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
  //                     : "bg-white text-gray-700 hover:bg-gray-50"
  //                 }`}
  //               >
  //                 Next
  //                 <FiChevronRight className="h-4 w-4 ml-1" />
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

const DocumentUploadField = ({ documentType, label, onFileChange, onFileDelete }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await onFileChange(documentType, file);
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
      setUploadProgress(100);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
      setUploadedFile(null);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleFileDelete = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileDelete) {
      onFileDelete(documentType);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-gray-50/50">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            disabled={isUploading || uploadedFile}
          />
          
          {!uploadedFile ? (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC (Max 10MB)</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-lg">{getFileIcon(uploadedFile.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</h4>
                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!uploadedFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || uploadedFile}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isUploading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading...</span>
                </div>
              ) : (
                'Choose File'
              )}
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Uploaded</span>
              </div>
              <button
                type="button"
                onClick={handleFileDelete}
                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Delete file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FiRefreshCw className="animate-spin h-10 w-10 mx-auto text-green-600 mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-lg w-full">
          <p className="font-medium text-lg mb-2">Error loading service groups</p>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
          >
            <FiRefreshCw className="mr-2" /> Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dokument Guru Services</h1>
          <p className="text-gray-600 mt-2">Browse available services and track your applications</p>
          <div className="flex items-center mt-2">
            <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              {agentData.location.subdistrict}-{agentData.location.district}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {agentData.purchasePlan} Plan
            </span>
          </div>
        </div>

        {/* <ApplicationsTable applications={applications} /> */}

        {/* Service Groups Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">Available Services</h2>
            
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search service groups or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServiceGroups.map((group) => (
              <div
                key={group._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  {group.image ? (
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <FiFileText className="h-12 w-12 text-green-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-white text-xl font-semibold p-4">{group.name}</h3>
                  </div>
                </div>

                <div className="p-4">
                  {group.services && group.services.length > 0 ? (
                    <div>
                      <button
                        onClick={() => toggleGroupDropdown(group._id)}
                        className="w-full flex justify-between items-center py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <span className="font-medium text-gray-700">
                          View {group.services.length} available services
                        </span>
                        {openGroups[group._id] ? (
                          <FiChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <FiChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>

                      {openGroups[group._id] && (
                        <div className="mt-3 space-y-3">
                          {group.services.map((service) => (
                            <div key={service._id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                              <div>
                                <p className="font-medium text-gray-800">{service.name}</p>
                                {service.documentNames && service.documentNames.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Requires: {service.documentNames.slice(0, 2).join(', ')}
                                    {service.documentNames.length > 2 && ' + ' + (service.documentNames.length - 2) + ' more'}
                                  </p>
                                )}
                              </div>
                              
                              <div className="relative">
                                <button
                                  onClick={() => handleButtonClick(group, service)}
                                  disabled={loading}
                                  className={`flex items-center text-sm px-3 py-1 rounded-md font-medium ${
                                    loading 
                                      ? "bg-gray-100 text-gray-400"
                                      : "bg-green-50 hover:bg-green-100 text-green-700"
                                  }`}
                                >
                                  {loading ? (
                                    "Loading..."
                                  ) : (
                                    <>
                                      ₹{getPriceForAgentPlan(service)}
                                      <FiPlus className="ml-2 h-4 w-4" />  
                                    </>
                                  )}
                                </button>
                                
                                {error && (
                                  <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                                    {error}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No services available yet</p>
                  )}
                </div>
              </div>
            ))}
            
            {filteredServiceGroups.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <FiSearch className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 mb-1">No service groups match your search</p>
                <p className="text-gray-500 text-sm">Try a different search term or browse all services</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Application Form Modal */}
        {isModalOpen && selectedService && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Apply for {selectedService.name}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                  ₹{selectedService.price + (formData.modifiedPrice || 0)}
                </span>
                <span className="text-sm text-gray-600">
                                    {selectedService.groupName}
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  {/* Additional form fields from service */}
                {selectedService.formData?.map((field, index) => {
  if (field.inputType === 'checkbox') {
    return (
      <div key={index} className="flex items-center">
        <input
          type="checkbox"
          id={`checkbox-${index}`}
          name={field.label}
          checked={formData.checkboxSelections[field.label] || false}
          onChange={(e) => handleCheckboxChange(e, field.label, field.price)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor={`checkbox-${index}`} className="ml-2 block text-sm text-gray-700">
          {field.label} (+₹{field.price})
        </label>
      </div>
    );
  }
  return (
    <div key={index}>
      <label htmlFor={`field-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <input
        type={field.inputType || 'text'}
        id={`field-${index}`}
        name={field.name || `additional.${field.label}`}
        onChange={(e) => handleInputChange(e, field.label)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        required={field.required}
      />
    </div>
  );
})}

                  {/* Document uploads */}
                  {selectedService.documentNames?.map((docName, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Upload {docName}
                      </label>
                      <DocumentUploadField
                        documentType={docName}
                        label={docName}
                        onFileChange={handleFileChange}
                      />
                      {isDocumentUploaded(docName) && (
                        <div className="flex items-center text-sm text-green-600">
                          <FiCheck className="mr-1" />
                          {getDocumentByType(docName)?.name || docName} uploaded
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(docName)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Receipt upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Receipt (Optional)
                    </label>
                    <DocumentUploadField
                      documentType="receipt"
                      label="Receipt"
                      onFileChange={handleFileChange}
                    />
                    {isDocumentUploaded('receipt') && (
                      <div className="flex items-center text-sm text-green-600">
                        <FiCheck className="mr-1" />
                        {getDocumentByType('receipt')?.name || 'Receipt'} uploaded
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument('receipt')}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        Estimated delivery: {formData.delivery}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formLoading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {submissionStatus && (
                <div className={`mt-4 p-4 rounded-md ${submissionStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <div className="flex items-center">
                    {submissionStatus.success ? (
                      <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <FiX className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <p>{submissionStatus.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Application Modal */}
        {isViewModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Application Details
                </h3>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{selectedApplication.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{selectedApplication.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{selectedApplication.address}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Service Information</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <FiPackage className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{selectedApplication.service.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ₹{selectedApplication.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Dates</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">
                          Submitted: {new Date(selectedApplication.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">
                          Estimated Delivery: {selectedApplication.delivery}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <div className="mt-2">
                      <span 
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full py-1"
                        style={{ 
                          backgroundColor: selectedApplication.initialStatus[0]?.hexcode || '#e5e7eb',
                          color: getContrastColor(selectedApplication.initialStatus[0]?.hexcode || '#e5e7eb')
                        }}
                      >
                        {selectedApplication.initialStatus[0]?.name || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Documents</h4>
                <div className="space-y-3">
                  {modifiedApplication?.document?.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                        {doc.view && (
                          <a 
                            href={doc.view} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            <FiEye className="inline mr-1" /> View
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          onChange={(e) => handleViewFileChange(e, index)}
                          className="hidden"
                          id={`doc-upload-${index}`}
                        />
                        <label
                          htmlFor={`doc-upload-${index}`}
                          className={`text-sm px-3 py-1 rounded border ${
                            isUploading
                              ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                          }`}
                        >
                          {isUploading ? 'Uploading...' : 'Replace'}
                        </label>
                        
                        <input
                          type="text"
                          value={doc.remark || ''}
                          onChange={(e) => {
                            const updatedDocs = [...modifiedApplication.document];
                            updatedDocs[index].remark = e.target.value;
                            setModifiedApplication({
                              ...modifiedApplication,
                              document: updatedDocs
                            });
                            setDocumentsModified(true);
                          }}
                          placeholder="Add remark..."
                          className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!documentsModified || isUploading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !documentsModified || isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}