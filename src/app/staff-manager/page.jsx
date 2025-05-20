"use client";

import { useSession } from '@/context/SessionContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiRefreshCw, FiFile, FiDownload, FiUpload, FiTrash2, FiCheckCircle, FiClock, FiUser, FiEdit2, FiEdit, FiSave, FiX, FiList, FiMessageSquare, FiEye, FiPlus } from 'react-icons/fi';
import { uploadFile } from '@/utils/uploadFile';
import axios from 'axios';
export default function StaffManagerDashboard() {
  const { session } = useSession()
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add state for editing application status
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [showReasonField, setShowReasonField] = useState(false);

  // State to store combined status options for the current application being edited
  const [combinedStatusOptions, setCombinedStatusOptions] = useState([]);

  // Modal state for staff assignment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusHistoryModalOpen, setIsStatusHistoryModalOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);



  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsApplication, setDetailsApplication] = useState(null);
  const [isDocRemarkModalOpen, setIsDocRemarkModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docRemarks, setDocRemarks] = useState([]);
  const [newDocRemark, setNewDocRemark] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showDocumentRemarkModal, setShowDocumentRemarkModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentRemarks, setDocumentRemarks] = useState([]);
  const [newDocumentRemark, setNewDocumentRemark] = useState("");
  const [formData, setFormData] = useState({

    // Changed from a single document to an array of documents
    documents: [],

  });
  const [filters, setFilters] = useState({
    name: '',
    provider: '',
    service: '',
    dateFrom: '',
    dateTo: ''
  });
  // Add state for remarks
  const [currentStaffName, setCurrentStaffName] = useState(session?.user?.name);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [isViewRemarksModalOpen, setIsViewRemarksModalOpen] = useState(false);
  const [newRemarkText, setNewRemarkText] = useState("");
  const [currentRemark, setCurrentRemark] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const [editingDeliveryDate, setEditingDeliveryDate] = useState(false);
  const [tempDeliveryDate, setTempDeliveryDate] = useState("");

  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api/application";
  const STAFF_API_URL = "https://dokument-guru-backend.vercel.app/api/admin/staff/fetch-all-staff";

  // Stats counters for dashboard
  const [stats, setStats] = useState({
    total: 0,
    unassigned: 0,
    inProgress: 0,
    completed: 0
  });
  console.log("sess = ", session)
  // Fetch all applications
  const formatDatee = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  const startEditDeliveryDate = (application) => {
    setTempDeliveryDate(application.delivery || "");
    setEditingDeliveryDate(true);
  };

  const saveDeliveryDate = async (applicationId) => {
    console.log(tempDeliveryDate)
    try {
      const response = await fetch(`${API_BASE_URL}/update/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delivery: formatDatee(tempDeliveryDate) }),
      });
      console.log(response)
      if (!response.ok) throw new Error('Failed to update delivery date');

      const updatedApplication = await response.json();

      setApplications(applications.map(app =>
        app._id === applicationId ? updatedApplication : app
      ));

      setEditingDeliveryDate(false);
      setShowViewModal(false)
      fetchApplications(); // Refresh the data

    } catch (err) {
      console.error("Error updating delivery date:", err);
      alert("Failed to update delivery date. Please try again.");
    }
  };

  const cancelEditDeliveryDate = () => {
    setEditingDeliveryDate(false);
  };
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/filter?location=${session?.user?.city}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const data = await response.json();
      setApplications(data);

      // Calculate stats - updated to properly check for unassigned
      const unassignedApps = data.filter(app => {
        console.log("appu = ", app)
        const staff = app.staff[0];
        return !staff ||
          staff.name === "Not Assigned" ||
          (typeof staff === 'object' && (!staff.name || staff.name === "Not Assigned"));
      }).length;

      const inProgressApps = data.filter(app => {
        const status = app.initialStatus?.[0]?.name || app.status || "Initiated";
        return status === "In Progress";
      }).length;

      const completedApps = data.filter(app => {
        const status = app.initialStatus?.[0]?.name || app.status || "Initiated";
        return status === "Completed";
      }).length;

      // Count overdue applications
      const overdueApps = data.filter(app => {
        if (!app.delivery) return false;

        console.log("deli = ", app.delivery); // e.g. "13/05/2025"

        const [day, month, year] = app.delivery.split('/');
        const deliveryDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();

        // Remove the time portion of today for accurate comparison
        today.setHours(0, 0, 0, 0);

        return deliveryDate < today;
      }).length;

      // Extract unique provider names


      // Count applications due within 3 days
      const dueSoonApps = data.filter(app => {
        if (!app.delivery) return false;
        const deliveryDate = new Date(app.delivery);
        const today = new Date();
        const diffTime = deliveryDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 3 && diffDays >= 0;
      }).length;

      setStats({
        total: data.length,
        unassigned: unassignedApps,
        inProgress: inProgressApps,
        completed: completedApps,
        overdue: overdueApps,
        dueSoon: dueSoonApps
      });

    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  console.log("appi", applications)
  // Fetch all staff members
  const uniqueProviders = [
    ...new Set(
      applications
        .map(app => app.provider?.[0]?.name)
        .filter(Boolean)
    )
  ];

  // Extract unique service names
  const uniqueServices = [
    ...new Set(
      applications
        .map(app => typeof app.service === 'object' ? app.service?.name : app.service)
        .filter(Boolean)
    )
  ];
  const fetchStaffMembers = async () => {
    try {
      setStaffLoading(true);
      const response = await fetch(STAFF_API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch staff members: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setStaffMembers(data.data.map(staff => ({
          id: staff._id,
          name: staff.name,
          username: staff.username,
          contactNo: staff.contactNo,
          location: staff.location,
          serviceGroups: staff.serviceGroups || [],
          status: "Available"
        })));
      } else {
        throw new Error("Invalid staff data format");
      }
    } catch (err) {
      console.error("Error fetching staff members:", err);
      setStaffMembers([
        { id: 1, name: "John Doe", status: "Available", serviceGroups: [] },
        { id: 2, name: "Sarah Smith", status: "Busy", serviceGroups: [] },
        { id: 3, name: "Meera Shah", status: "Available", serviceGroups: [] },
        { id: 4, name: "Alex Johnson", status: "Available", serviceGroups: [] }
      ]);
    } finally {
      setStaffLoading(false);
    }
  };

  // Filter staff based on application service
  const filterStaffForApplication = (application) => {
    console.log(application)
    if (!application || !application.service) return staffMembers;

    const serviceName = typeof application.service === 'object'
      ? application.service.name
      : application.service;

    if (!serviceName) return staffMembers;

    const filtered = staffMembers.filter(staff => {
      if (!staff.serviceGroups || !Array.isArray(staff.serviceGroups)) return false;
      return staff.serviceGroups.some(group =>
        group.serviceName === serviceName ||
        group.serviceName === serviceName.trim()
      );
    });

    return filtered.length > 0 ? filtered : staffMembers;
  };
  const filterApplications = () => {
    return applications.filter(app => {
      // Name filter (case insensitive partial match)
      if (filters.name && !app.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Provider filter
      if (filters.provider && app.provider[0]?.name !== filters.provider) {
        return false;
      }

      // Service filter
      if (filters.service) {
        const serviceName = typeof app.service === 'object' ? app.service.name : app.service;
        if (serviceName !== filters.service) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const appDate = new Date(app.date);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

        if (fromDate && appDate < fromDate) return false;
        if (toDate && appDate > toDate) return false;
      }

      return true;
    });
  };

  // Update application status
  const updateStatus = async (id, newStatus, reason = "") => {
    try {
      const statusDetails = combinedStatusOptions.find(option => option.name === newStatus);
      if (!statusDetails) throw new Error("Invalid status selected");

      const currentApp = applications.find(app => app._id === id);
      if (!currentApp) throw new Error("Application not found");

      const updatePayload = {
        ...currentApp,
        initialStatus: [{
          name: newStatus,
          hexcode: statusDetails.hexcode,
          askreason: statusDetails.askreason,
          reason: statusDetails.askreason ? reason : "",
          updatedAt: new Date()
        }]
      };

      const response = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) throw new Error(`Failed to update status: ${response.status}`);

      const updatedApplication = await response.json();

      setApplications(applications.map(app =>
        app._id === id ? {
          ...app,
          ...updatedApplication,
          initialStatus: updatedApplication.initialStatus || app.initialStatus
        } : app
      ));
      fetchApplications();

      setEditingStatusId(null);
      setEditingStatus("");
      setStatusReason("");
      setShowReasonField(false);
      setCombinedStatusOptions([]);

    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };
  const addDocumentRemark = async () => {
    if (!newDocumentRemark.trim()) return;

    try {
      // Find the current document in the application and update it with the new remark
      const updatedDocuments = selectedApplication.document.map(doc => {
        if (doc._id === selectedDocument._id) {
          return {
            ...doc,
            remark: newDocumentRemark
          };
        }
        return doc;
      });

      // Create new remark history entry
      const newRemarkHistory = {
        text: newDocumentRemark,
        documentId: selectedDocument._id,
        addedBy: session?.user?._id,
        addedAt: new Date()
      };

      // Prepare the update payload
      const updatePayload = {
        ...selectedApplication,
        initialStatus: [
          {
            name: "Objection",
            hexcode: "#9C27B0",
            askreason: true,
            reason: "remark added",
          }
        ],
        document: updatedDocuments,
        remarkHistory: [...(selectedApplication.remarkHistory || []), newRemarkHistory]
      };

      const response = await fetch(`${API_BASE_URL}/update/${selectedApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to update remarks');
      }

      const updatedApplication = await response.json();

      // Update local state
      setApplications(applications.map(app =>
        app._id === selectedApplication._id ? updatedApplication : app
      ));

      // Update the selected application state
      setSelectedApplication(updatedApplication);

      // Update document remarks in the modal
      setDocumentRemarks([newDocumentRemark]);

      // Clear input field
      setNewDocumentRemark("");

      // Show success message
      alert('Remark added successfully');
      setShowDocumentRemarkModal(false)
      setShowViewModal(false)

      fetchApplications()
    } catch (err) {
      console.error("Error adding document remark:", err);
      alert("Failed to add remark. Please try again.");
    }
  };
  const openRemarkModal = (application) => {
    setSelectedApplicationId(application?._id);
    setCurrentRemark(application?.remark || "");
    setShowRemarkModal(true);
  };
  // Update staff assignment
  const updateAssignment = async (applicationId, staffId, staffName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff: {
            name: staffName,
            id: staffId
          }
        }),
      });

      if (!response.ok) throw new Error(`Failed to update staff assignment: ${response.status}`);

      const updatedApplication = await response.json();
      console.log(updatedApplication)
      setApplications(applications.map(app =>
        app._id === updatedApplication._id ? updatedApplication : app
      ));
      fetchApplications()
      setIsModalOpen(false);
      setSelectedApplication(null);

    } catch (err) {
      console.error("Error updating staff assignment:", err);
      alert("Failed to update staff assignment. Please try again.");
    }
  };

  const handleAssignStaff = (application) => {
    setSelectedApplication(application);
    setFilteredStaffMembers(filterStaffForApplication(application));
    console.log(filteredStaffMembers)
    setIsModalOpen(true);
  };

  const handleViewStatusHistory = (application) => {
    setSelectedApplication(application);
    setIsStatusHistoryModalOpen(true);
  };

  const getServiceStatusOptions = (application) => {
    if (!application.service || !application.service.status || !Array.isArray(application.service.status)) {
      return [];
    }
    return application.service.status;
  };

  const startEditStatus = (application) => {
    const currentStatusName = application.initialStatus?.[0]?.name || "Initiated";
    const serviceStatusOptions = getServiceStatusOptions(application);

    const allStatusOptions = [...serviceStatusOptions];

    setCombinedStatusOptions(allStatusOptions);
    setEditingStatusId(application._id);
    setEditingStatus(currentStatusName);

    const statusOption = allStatusOptions.find(option => option.name === currentStatusName);
    setShowReasonField(statusOption?.askreason || false);
  };
  const openViewModal = (application) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };
  const cancelEditStatus = () => {
    setEditingStatusId(null);
    setEditingStatus("");
    setStatusReason("");
    setShowReasonField(false);
    setCombinedStatusOptions([]);
  };
  const openDocumentRemarkModal = (document, application) => {
    // Find the document object from the application.document array
    // This is where the issue was - we need to properly find the document
    const docObj = application.document.find(doc => doc._id === document._id);

    setSelectedDocument({
      _id: document._id,
      name: document.name,
      remark: docObj?.remark || ""
    });

    // Set selected application for context
    setSelectedApplication(application);

    // If there is a remark, add it to documentRemarks array
    // This ensures we properly display existing remarks
    if (docObj?.remark) {
      setDocumentRemarks([docObj.remark]);
    } else {
      setDocumentRemarks([]);
    }

    setShowDocumentRemarkModal(true);
  };
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEditingStatus(newStatus);
    const statusOption = combinedStatusOptions.find(option => option.name === newStatus);
    setShowReasonField(statusOption?.askreason || false);
  };

  const saveStatus = (id) => {
    const statusDetails = combinedStatusOptions.find(option => option.name === editingStatus);

    if (statusDetails?.askreason && !statusReason.trim()) {
      alert("Please provide a reason for this status change");
      return;
    }
    updateStatus(id, editingStatus, statusReason);
  };

  useEffect(() => {
    fetchApplications();
    fetchStaffMembers();
  }, []);

  const getCurrentStatus = (application) => {
    return application.initialStatus?.[0]?.name || "Initiated";
  };

  // Function to get staff name display (handles both string and object)
  const getStaffName = (staff) => {
    if (!staff) return "Not Assigned";
    if (typeof staff === 'string') return staff;
    if (typeof staff === 'object') return staff[0].name || "Not Assigned";
    return "Not Assigned";
  };

  // Add a new remark to application
  const addRemark = async () => {
    if (!selectedApplication || !newRemarkText.trim()) {
      alert("Please enter a remark");
      return;
    }

    try {
      const currentApp = applications.find(app => app._id === selectedApplication._id);
      if (!currentApp) throw new Error("Application not found");

      // Create a new remark object
      const newRemark = {
        id: Date.now().toString(), // Generate a temporary ID
        text: newRemarkText,
        createdAt: new Date().toISOString(),
        createdBy: "Staff Manager" // You can replace with actual user info
      };

      // Get existing remarks or initialize empty array
      const existingRemarks = currentApp.remarks || [];

      // Update with new remarks array including the new remark
      const updatePayload = {
        remarks: [...existingRemarks, newRemark]
      };

      const response = await fetch(`${API_BASE_URL}/update/${selectedApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) throw new Error(`Failed to add remark: ${response.status}`);

      const updatedApplication = await response.json();

      setApplications(applications.map(app =>
        app._id === updatedApplication._id ? {
          ...app,
          ...updatedApplication,
          remarks: updatedApplication.remarks || []
        } : app
      ));

      fetchApplications();

      setIsRemarkModalOpen(false);
      setNewRemarkText("");

    } catch (err) {
      console.error("Error adding remark:", err);
      alert("Failed to add remark. Please try again.");
    }
  };
  const handleFileChange = async (id, type, fileData) => {
    try {
      let updateData;

      if (type === 'document') {
        // For documents - add to array while preserving existing documents
        const currentApp = applications.find(app => app._id === id);
        const currentDocuments = currentApp?.document || [];

        updateData = {
          document: [...currentDocuments, fileData]
        };
      } else {
        // For receipts - set or clear the value
        updateData = {
          receipt: fileData ? [fileData.view] : []
        };
      }

      const response = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update file reference');

      const updatedApplication = await response.json();

      setApplications(applications.map(app =>
        app._id === id ? updatedApplication : app
      ));

      fetchApplications();

      if (fileData) {
        alert(`${type === 'document' ? 'Document' : 'Receipt'} ${fileData.view ? 'uploaded' : 'removed'} successfully!`);
      }

    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      alert(`Failed to update ${type}. Please try again.`);
    }
  };
  const handleAddRemark = (application) => {
    setSelectedApplication(application);
    setNewRemarkText("");
    setIsRemarkModalOpen(true);
  };

  const handleViewRemarks = (application) => {
    console.log(application)
    setSelectedApplication(application);
    setIsViewRemarksModalOpen(true);
  };

  // Get the latest remark for display in the table
  const getLatestRemark = (application) => {
    if (!application.remarks || !Array.isArray(application.remarks) || application.remarks.length === 0) {
      return application.remark || null; // Fallback to old remark field if exists
    }

    // Sort remarks by date and return the latest one
    const sortedRemarks = [...application.remarks].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return sortedRemarks[0];
  };

  // Open details modal
  const handleViewDetails = (application) => {
    console.log(application)
    setDetailsApplication(application);
    setIsDetailsModalOpen(true);
  };

  // Open document remark modal
  const handleDocRemark = (docKey) => {
    setSelectedDoc(docKey);
    setDocRemarks(detailsApplication?.docRemarks?.[docKey] || []);
    setIsDocRemarkModalOpen(true);
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
      console.log(response)
      if (response.data.success) {
        const newDoc = {
          type: documentType,
          name: documentType,
          view: response.data.documentUrl,
          remark: ''
        };

        // Check if this document type already exists
        const existingDocIndex = formData?.documents?.findIndex(doc => doc.type === documentType);

        if (existingDocIndex >= 0) {
          // Replace existing document
          const updatedDocuments = [...formData.documents];
          updatedDocuments[existingDocIndex] = newDoc;
          setFormData(prev => ({
            ...prev,
            documents: updatedDocuments
          }));
        } else {
          // Add new document
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
  function FileUploadButton({ application, id, type, onChange, file, status }) {
    const [uploading, setUploading] = useState(false);
    const MAX_FILE_SIZE = 256 * 1024; // 5MB in bytes (increased from 256KB)
    const handleFileChange = async (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert(`File size exceeds 256kb limit. Your file is ${Math.round(selectedFile.size / 1024)}KB.`);
        return;
      }
      setUploading(true);
      try {
        const uploadResponse = await uploadFile(selectedFile);

        const fileData = {
          name: selectedFile.name,
          type: selectedFile.type || selectedFile.name.split('.').pop(),
          view: uploadResponse.documentUrl,
          remark: "",
          uploadedAt: new Date().toISOString()
        };

        onChange(id, type, fileData);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      } finally {
        setUploading(false);
      }
    };

    const isReceipt = type === 'receipt';

    return (
      <div className="flex items-center">
        {file && file.view ? (
          <div className="flex items-center space-x-2">
            {uploading ? (
              <FiRefreshCw className="animate-spin h-4 w-4 text-gray-500" />
            ) : (
              <>
                <span className="text-sm text-gray-500">
                  {isReceipt ? 'Receipt' : 'Uploaded'}
                </span>
                <a
                  href={file.view}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  View
                </a>
                {isReceipt && (
                  <button
                    onClick={() => onChange(id, type, null)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove receipt"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <label className="cursor-pointer flex items-center gap-1">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading || status === "Completed"}
              accept={isReceipt ? "image/*,.pdf" : "*"}
            />
            <FiUpload className="h-4 w-4 text-gray-500 mr-1" />
            {uploading ? <span className="text-sm text-gray-700">Uploading</span> : <span className="text-sm text-gray-700">Upload</span>}
            <button
              onClick={() => openViewModal(application)}


              className="text-indigo-600 hover:text-indigo-900 text-sm"
            >
              View
            </button>
          </label>
        )}
      </div>
    );
  }
  // Add a remark to a document
  const addDocRemark = async () => {
    if (!newDocRemark.trim() || !selectedDoc || !detailsApplication) return;

    try {
      // Create the updated document array with the new remark
      const updatedDocuments = detailsApplication.document.map(doc => {
        if (doc._id === selectedDoc) {
          // Add the new remark to the document's remarks array
          return {
            ...doc,
            remark: newDocRemark
          };
        }
        return doc;
      });

      // Prepare the form data to send to the backend
      const updatePayload = {
        ...detailsApplication,
        document: updatedDocuments
      };

      const response = await fetch(`${API_BASE_URL}/update/${detailsApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      console.log(response)
      if (!response.ok) throw new Error(`Failed to add document remark: ${response.status}`);

      const updatedApplication = await response.json();

      // Update the local state
      setDetailsApplication(updatedApplication);
      setApplications(applications.map(app =>
        app._id === updatedApplication._id ? updatedApplication : app
      ));

      // Reset the remark input and close the modal
      setNewDocRemark("");
      setIsDocRemarkModalOpen(false);

    } catch (err) {
      console.error("Error adding document remark:", err);
      alert("Failed to add document remark. Please try again.");
    }
  };
  function DeliveryDateAlert({ deliveryDate }) {
    if (!deliveryDate) return null;

    // Parse date properly - handle both DD/MM/YYYY format and Date objects
    const parseDateString = (dateStr) => {
      if (dateStr instanceof Date) return dateStr;

      // Check if date is in DD/MM/YYYY format
      if (typeof dateStr === 'string' && dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day); // month is 0-indexed in JS Date
      }

      // Otherwise try standard Date constructor
      return new Date(dateStr);
    };

    const today = new Date();
    const delivery = parseDateString(deliveryDate);

    // Validate that we have a valid date
    if (isNaN(delivery.getTime())) {
      console.error('Invalid date format:', deliveryDate);
      return <span className="text-xs text-red-500">Invalid date format</span>;
    }

    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log("Delivery date:", delivery);
    console.log("Difference in days:", diffDays);

    if (diffDays < 0) {
      return (
        <span className="text-xs text-red-500 font-medium">
          Overdue by {Math.abs(diffDays)} days
        </span>
      );
    }

    if (diffDays <= 3) {
      return (
        <span className="text-xs text-yellow-600 font-medium animate-pulse">
          Due in {diffDays} day{diffDays !== 1 ? 's' : ''}
        </span>
      );
    }

    return null;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Manager Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={<FiFile className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Unassigned"
            value={stats.unassigned}
            icon={<FiUser className="h-6 w-6 text-red-500" />}
            color="bg-red-100"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<FiClock className="h-6 w-6 text-yellow-500" />}
            color="bg-yellow-100"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<FiCheckCircle className="h-6 w-6 text-green-500" />}
            color="bg-green-100"
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<FiClock className="h-6 w-6 text-red-500" />}
            color="bg-red-100"
          />
        </div>
        <div className="mt-6 bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                placeholder="Search by name"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Provider Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agents</label>
              <select
                value={filters.provider}
                onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Agents</option>
                {uniqueProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select
                value={filters.service}
                onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Services</option>
                {uniqueServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                name: '',
                provider: '',
                service: '',
                dateFrom: '',
                dateTo: ''
              })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        </div>


        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">All Applications</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Total: {applications.length}</span>
              <button
                onClick={fetchApplications}
                className="flex items-center bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded"
              >
                <FiRefreshCw className="mr-1" /> Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-10">
              <FiRefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-500" />
              <p className="mt-2 text-gray-500">Loading applications...</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                      {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th> */}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      filterApplications().slice().reverse().map((application, index) => {
                        const latestRemark = getLatestRemark(application);
                        const remarkCount = (application.remarks && Array.isArray(application.remarks))
                          ? application.remarks.length
                          : (application.remark ? 1 : 0);

                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(application.date).toLocaleDateString('en-GB')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {application.delivery}
                              </div>
                              <DeliveryDateAlert deliveryDate={application.delivery} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingStatusId === application._id ? (
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <select
                                      value={editingStatus}
                                      onChange={handleStatusChange}
                                      className="text-xs border border-gray-300 rounded p-1"
                                    >
                                      {combinedStatusOptions.sort((a, b) => a.priority - b.priority).map(option => (
                                        <option key={option.name} value={option.name}>
                                          {option.name}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => saveStatus(application._id)}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <FiSave className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={cancelEditStatus}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <FiX className="h-4 w-4" />
                                    </button>
                                  </div>

                                  {showReasonField && (
                                    <input
                                      type="text"
                                      placeholder="Enter reason"
                                      value={statusReason}
                                      onChange={(e) => setStatusReason(e.target.value)}
                                      className="text-xs border border-gray-300 rounded p-1 w-full"
                                    />
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <StatusBadge
                                    status={getCurrentStatus(application)}
                                    hexcode={application.initialStatus?.[0]?.hexcode}
                                    reason={application.initialStatus?.[0]?.reason}

                                  />
                                  <button
                                    onClick={() => startEditStatus(application)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    title="Edit Status"
                                  >
                                    <FiEdit className="h-4 w-4" />
                                  </button>
                                  {(application.statusHistory?.length > 0) && (
                                    <button
                                      onClick={() => handleViewStatusHistory(application)}
                                      className="text-gray-600 hover:text-gray-900"
                                      title="View Status History"
                                    >
                                      <FiList className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {typeof application.service === 'object'
                                ? application.service.name || JSON.stringify(application.service)
                                : application.service}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{typeof application.amount === 'number' ? application.amount : 0}
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">

                                <FileUploadButton
                                  application={application}
                                  id={application._id}
                                  type="document"
                                  onChange={handleFileChange}
                                  status={getCurrentStatus(application)}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <FileUploadButton
                                id={application._id}
                                type="receipt"
                                onChange={handleFileChange}
                                file={{ view: application.receipt?.[0] }}
                                status={getCurrentStatus(application)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${!application.staff || application.staff === "Not Assigned" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                                  {getStaffName(application.staff)}
                                </span>
                                <button
                                  onClick={() => handleAssignStaff(application)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button onClick={() => openViewModal(application)} className="text-blue-600 hover:text-blue-900">
                                <FiEye />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Staff Assignment Modal */}
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Assign Staff to Application
              </h3>

              <div className="mb-4 bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Service Required:</span> {
                    typeof selectedApplication.service === 'object'
                      ? selectedApplication.service.name
                      : selectedApplication.service
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Showing staff members who can provide this service
                </p>
              </div>

              <div className="space-y-3">
                {staffLoading ? (
                  <div className="text-center py-4">
                    <FiRefreshCw className="animate-spin h-5 w-5 mx-auto text-gray-500" />
                    <p className="mt-2 text-sm text-gray-500">Loading staff members...</p>
                  </div>
                ) : filteredStaffMembers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No staff members available for this service
                  </div>
                ) : (
                  filteredStaffMembers.map(staff => (
                    <button
                      key={staff.id}
                      onClick={() => updateAssignment(selectedApplication._id, staff.id, staff.name)}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 
                        ${
                        // Compare staff name with the application's assigned staff
                        (typeof selectedApplication.staff === 'object' && selectedApplication.staff?.name === staff.name) ||
                          selectedApplication.staff === staff.name
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200'
                        }`}
                    >
                      <div className="flex items-center">
                        <FiUser className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <span className="font-medium text-gray-900">{staff.name}</span>
                          <p className="text-xs text-gray-500">Location: {staff.location}</p>
                        </div>
                      </div>
                      <span className={`text-sm ${staff.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                        {staff.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}



        {isStatusHistoryModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Status History
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 ? (
                  [...selectedApplication.statusHistory].reverse().map((status, idx) => (
                    <div key={idx} className="border-l-4 pl-3 py-2" style={{ borderColor: status.hexcode || '#CBD5E0' }}>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">{status.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(status.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      {status.reason && (
                        <div className="mt-2">
                          <button
                            onClick={() => alert(`Reason: ${status.reason}`)}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FiMessageSquare className="mr-1 h-3 w-3" />
                            View Reason
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No status history available
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsStatusHistoryModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Remark Modal */}
        {isRemarkModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Remark to Application
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark
                </label>
                <textarea
                  value={newRemarkText}
                  onChange={(e) => setNewRemarkText(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your remark here..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsRemarkModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={addRemark}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Remark
                </button>
              </div>
            </div>
          </div>
        )}

        {showRemarkModal && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Add Remark
                      </h3>
                      <div className="mt-4 w-full">
                        <textarea
                          className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                          rows="4"
                          placeholder="Enter your remark here..."
                          value={currentRemark}
                          onChange={(e) => setCurrentRemark(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => updateRemark(selectedApplicationId, currentRemark)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowRemarkModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add View Modal */}
        {showViewModal && selectedApplication && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Application Details
                        </h3>
                        <button
                          onClick={() => setShowViewModal(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>

                      {/* Applicant Information */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                          <h4 className="text-sm font-medium text-gray-500">Applicant Name</h4>
                          <p className="mt-1 text-sm font-medium text-gray-900">{selectedApplication.name}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                          <h4 className="text-sm font-medium text-gray-500">Application Date</h4>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {new Date(selectedApplication.date).toLocaleDateString('en-GB')}
                          </p>

                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                          <h4 className="text-sm font-medium text-gray-500">Service Type</h4>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {typeof selectedApplication.service === 'object'
                              ? selectedApplication.service.name
                              : selectedApplication.service}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                          <h4 className="text-sm font-medium text-gray-500">Delivery Date</h4>
                          {editingDeliveryDate ? (
                            <div className="mt-1 flex items-center space-x-2">
                              <input
                                type="date"
                                value={tempDeliveryDate}
                                onChange={(e) => setTempDeliveryDate(e.target.value)}
                                className="text-sm border border-gray-300 rounded p-1"
                              />
                              <button
                                onClick={() => saveDeliveryDate(selectedApplication._id)}
                                className="text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <FiSave className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEditDeliveryDate}
                                className="text-red-600 hover:text-red-800"
                                title="Cancel"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {selectedApplication.delivery || "Not set"}
                              </p>
                              <button
                                onClick={() => startEditDeliveryDate(selectedApplication)}
                                className="text-indigo-600 hover:text-indigo-800 ml-2"
                                title="Edit Delivery Date"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                               <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                               <p className="mt-1 text-sm font-medium text-gray-900">₹{selectedApplication.amount}</p>
                             </div> */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                          <h4 className="text-sm font-medium text-gray-500">Status</h4>
                          <div className="mt-1">
                            <StatusBadge
                              status={getCurrentStatus(selectedApplication)}
                              hexcode={selectedApplication.initialStatus?.[0]?.hexcode}
                              reason={selectedApplication.initialStatus?.[0]?.reason}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-8">
  <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
    <FiList className="text-indigo-500 mr-2" />
    Form Data
  </h4>
  
  {selectedApplication.formData && selectedApplication.formData.length > 0 ? (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 border-b border-gray-100">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr.</div>
          <div className="col-span-7 text-xs font-semibold text-gray-600 uppercase tracking-wider">Label</div>
          <div className="col-span-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Price</div>
        </div>
      </div>
      
      {/* Form Data Items */}
      <div className="divide-y divide-gray-100">
        {selectedApplication.formData.map((item, index) => (
          <div key={item._id || index} className="px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                  {index + 1}
                </span>
              </div>
              <div className="col-span-7">
                <span className="text-sm font-medium text-gray-800">{item.label || `Item ${index + 1}`}</span>
              </div>
              <div className="col-span-4 text-right">
                <span className="text-sm font-bold text-gray-800 bg-green-50 px-3 py-1 rounded-full">
                  ₹{item.price || '0'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Footer */}
      
    </div>
  ) : (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-indigo-50 p-3 rounded-full mb-3">
        <FiList className="h-6 w-6 text-indigo-500" />
      </div>
      <p className="text-sm text-gray-500 mb-1">No Form Data Available</p>
      <p className="text-xs text-gray-400">Form details will appear here when available</p>
    </div>
  )}
</div>
                      {/* <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-700 mb-3">FormData Section</h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          {selectedApplication.formData && selectedApplication.formData.length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-around w-full">
                                <span className="text-sm font-medium">Sr. No.</span>
                                <span className="text-sm font-medium">Label</span>
                                <span className="text-sm font-medium">Price</span>
                              </div>
                              {selectedApplication.formData.map((doc, index) => (
                                <div key={doc._id || index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                                  <div className="flex items-center justify-around w-full">
                                    <span className="text-sm font-medium">{` ${index + 1} )`}</span>
                                    <span className="text-sm font-medium">{doc.label || ` ${index + 1} )`}</span>
                                    <span className="text-sm font-medium">{doc.price || `Document ${index + 1}`}</span>
                                  </div>

                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No FormData Available</p>
                          )}
                        </div>
                      </div> */}
                      {/* Documents Section */}
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-700 mb-3">Documents</h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          {selectedApplication.document && selectedApplication.document.length > 0 ? (
                            <div className="space-y-3">
                              {selectedApplication.document.map((doc, index) => (
                                <div key={doc._id || index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                                  <div className="flex items-center">
                                    <FiFile className="text-indigo-500 mr-2" />
                                    <span className="text-sm font-medium">{doc.name || `Document ${index + 1}`}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => openDocumentRemarkModal(doc, selectedApplication)}
                                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center"
                                    >
                                      <FiMessageSquare className="mr-1 h-3 w-3" />
                                      {doc.remark ? "View Remark" : "Add Remark"}
                                    </button>
                                    <Link
                                      href={doc.view}
                                      className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center"
                                    >
                                      <FiDownload className="mr-1 h-3 w-3" /> View
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No documents uploaded</p>
                          )}
                        </div>
                      </div>

                      {/* Remarks Section */}
                      {/* <div className="mb-6">
                             <h4 className="text-lg font-medium text-gray-700 mb-3">Application Remarks</h4>
                             <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                               {selectedApplication.remark ? (
                                 <div className="bg-white p-3 rounded border border-gray-200">
                                   <p className="text-sm">{selectedApplication.remark}</p>
                                   <div className="mt-2 flex items-center text-xs text-gray-500">
                                     <FiUserCheck className="mr-1" />
                                     <span>
                                       Added by: {currentStaffName || "Staff"} 
                                     </span>
                                   </div>
                                 </div>
                               ) : (
                                 <div className="text-center py-4">
                                   <p className="text-sm text-gray-500">No remarks added</p>
                                   <button
                                     onClick={() => openRemarkModal(selectedApplication)}
                                     className="mt-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded flex items-center mx-auto"
                                   >
                                     <FiMessageSquare className="mr-1 h-4 w-4" /> Add Remark
                                   </button>
                                 </div>
                               )}
                             </div>
                           </div> */}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Remark Modal */}
        {showDocumentRemarkModal && selectedDocument && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {selectedDocument.name} - Document Remarks
                      </h3>

                      {/* Existing remarks section - Fixed to properly display remarks */}
                      <div className="mt-4 max-h-40 overflow-y-auto">
                        {documentRemarks.length > 0 ? (
                          documentRemarks.map((remark, index) => (
                            <div key={index} className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
                              <p className="text-sm">{remark}</p>

                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">No remarks added for this document</p>
                        )}
                      </div>

                      {/* Add new remark section */}
                      <div className="mt-4 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Add New Remark
                        </label>
                        <textarea
                          className="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                          rows="3"
                          placeholder="Enter document remark here..."
                          value={newDocumentRemark}
                          onChange={(e) => setNewDocumentRemark(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={addDocumentRemark}
                  >
                    Save Remark
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowDocumentRemarkModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatusBadge Component
// function StatusBadge({ status, hexcode }) {
//   // Default color based on status names, fallback to hexcode if provided
//   const getDefaultColor = (status) => {
//     switch(status.toLowerCase()) {
//       case 'completed': return '#10B981'; // green
//       case 'in progress': return '#F59E0B'; // yellow
//       case 'initiated': return '#6366F1'; // indigo
//       case 'on hold': return '#EF4444'; // red
//       case 'rejected': return '#EF4444'; // red
//       case 'cancelled': return '#6B7280'; // gray
//       default: return '#6366F1'; // indigo as default
//     }
//   };

//   const bgColor = hexcode || getDefaultColor(status);

//   return (
//     <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
//       style={{ 
//         backgroundColor: `${bgColor}20`, // 20% opacity of the color
//         color: bgColor 
//       }}>
//       {status}
//     </span>
//   );
// }

function StatusBadge({ status, hexcode, reason }) {
  const [showReasonModal, setShowReasonModal] = useState(false);

  const getDefaultColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10B981'; // green
      case 'in progress': return '#F59E0B'; // yellow
      case 'initiated': return '#6366F1'; // indigo
      case 'on hold': return '#EF4444'; // red
      case 'rejected': return '#EF4444'; // red
      case 'cancelled': return '#6B7280'; // gray
      default: return '#6366F1'; // indigo as default
    }
  };

  const bgColor = hexcode || getDefaultColor(status);

  return (
    <>
      <div className="flex items-center">
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
          style={{
            backgroundColor: `${bgColor}20`, // 20% opacity of the color
            color: bgColor
          }}>
          {status}
        </span>
        {reason && (
          <button
            className="ml-1 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setShowReasonModal(true);
            }}
            title="View reason"
          >
            <FiMessageSquare className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowReasonModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiMessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg capitalize leading-6 font-medium text-gray-900">
                      Status : {status}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm capitalize text-gray-500">
                        Reason : {reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowReasonModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}