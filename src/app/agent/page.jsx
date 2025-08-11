

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
    // Check file size (500KB = 500 * 1024 bytes)
    const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE/1024}KB limit`);
    }

    // Check file type if needed (example for PDF only)
    // const allowedTypes = ['application/pdf'];
    // if (!allowedTypes.includes(file.type)) {
    //   throw new Error('Only PDF files are allowed');
    // }

    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      'https://dokument-guru-backend.vercel.app/api/upload/doc',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Optional: Add upload progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`${percentCompleted}% uploaded`);
          // You could set this to state to show a progress bar
        }
      }
    );

    if (response.data.success) {
      const newDoc = {
        type: documentType,
        name: file.name,
        view: response.data.documentUrl,
        remark: '',
        size: file.size // Optionally store file size
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
        }
        return {
          ...prev,
          documents: [...prev.documents, newDoc]
        };
      });

      // Optional: Show success message
      alert(`Document "${file.name}" uploaded successfully!`);
    }
  } catch (error) {
    console.error("Document upload error:", error);
    
    // User-friendly error messages
    let errorMessage = "Failed to upload document. Please try again.";
    if (error.message.includes('exceeds')) {
      errorMessage = error.message;
    } else if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    alert(errorMessage);
    
    // Optionally update state to show error near the upload field
    // setUploadError(documentType, errorMessage);
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
    setFormData({
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
})
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
    window.location.reload()
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
       
        setIsViewModalOpen(false);
            
        
   
  };
  useEffect(() => {
  if (!isModalOpen) {
     setFormData({
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
})
    setSubmissionStatus(null);
  }
}, [isModalOpen]);


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
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes

 const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Reset previous state
  setError(null);
  setIsUploading(true);
  setUploadProgress(0);

  // Immediate file size validation
  if (file.size > MAX_FILE_SIZE) {
    handleUploadError(`File size exceeds ${MAX_FILE_SIZE/1024}KB limit`);
    setIsUploading(false); // Immediately set uploading to false
    return;
  }

  // Only start progress simulation if file size is valid
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
    
    // Only mark as uploaded if successful
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type
    });
    setUploadProgress(100);
  } catch (error) {
    handleUploadError(error.message);
  } finally {
    clearInterval(progressInterval);
    setIsUploading(false);
    // Reset file input whether successful or not
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};

const handleUploadError = (errorMessage) => {
  console.error("Upload failed:", errorMessage);
  setError(errorMessage);
  setUploadedFile(null);
  setUploadProgress(0);
  setIsUploading(false); // Ensure uploading state is false
};

  const handleFileDelete = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
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
    if (fileType?.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="w-full">
      <div className={`flex items-center justify-between p-4 border-2 border-dashed rounded-lg transition-colors ${
        error 
          ? 'border-red-300 bg-red-50/50' 
          : uploadedFile 
            ? 'border-green-300 bg-green-50/50' 
            : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
      }`}>
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
                <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC (Max {MAX_FILE_SIZE/1024}KB)</p>
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
              disabled={isUploading}
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

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                error ? 'bg-red-500' : 'bg-blue-600'
              }`}
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
          <h1 className="text-3xl font-bold text-gray-900">Infognite Services</h1>
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