"use client";

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiHome, FiCalendar, FiCreditCard, FiLock, FiUpload, FiChevronDown, FiShoppingBag, FiKey, FiEdit2, FiTrash2, FiPlus, FiSearch, FiEye } from 'react-icons/fi';
import AddSuccessPopup from '@/components/popups/addSucess';
import DeleteSuccessPopup from '@/components/popups/deleteSuccess';
import DeleteConfirmationPopup from '@/components/popups/deleteConfirmation';
import LoadingSpinner from '@/components/Loading';

const AgentManagement = () => {
  // State for agent data
  const [agents, setAgents] = useState([]);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingAgentId, setUpdatingAgentId] = useState(null); // New state for tracking which agent is being updated
  const [showUpdateSuccessPopup, setShowUpdateSuccessPopup] = useState(false); // New state for update success popup

  // Options for dropdowns
  const paymentMethods = ['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Wallet', 'Cash', 'NA'];
  const plans = ['Basic', 'Premium', 'Enterprise', 'Custom'];
  const statusOptions = ['Active', 'pending', 'Hold', 'Inactive'];

  // Add popup states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  // Fetch agents from API
  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://dokument-guru-backend.vercel.app/api/admin/agent/fetch-agents", {
        method: 'GET'
      });

      if (!response.ok) {
        console.error("Failed to fetch agents. Status:", response.status);
        // Load dummy data if API fails
        setAgents(mapDummyAgents());
        return;
      }

      const data = await response.json();
      
      // Filter agents with status 'pending'
      const pendingAgents = data.data.filter(agent => agent.status === "pending");
      
      // Map API data to our component format
      const mappedAgents = pendingAgents.map((agent, index) => mapAgentData(agent, index));
      
      setAgents(mappedAgents);
      console.log("Pending agents:", mappedAgents);
    } catch (error) {
      console.error("Error fetching agents:", error.message);
      // Load dummy data if API fails
      setAgents(mapDummyAgents());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);
  
  // Map API data to the format expected by our component
  const mapAgentData = (agent, index) => {
    return {
      id: agent._id || `dummy-${index}`,
      name: agent.fullName || 'Unknown',
      registrationDate: new Date(agent.createdAt).toISOString().split('T')[0] || '2023-01-01',
      paymentStatus: agent.paidAmount > 0 ? (agent.unpaidAmount > 0 ? 'Partial' : 'Paid') : 'pending',
      amountPaid: agent.paidAmount || '0',
      unpaidAmount: agent.unpaidAmount || '0',
      plan: agent.purchasePlan || 'Basic',
      paymentMethod: agent.paymentMethod || 'NA',
      status: agent.status || 'pending',
      contactNo: agent.phone || 'N/A',
      email: agent.email || 'N/A',
      shopName: agent.shopName || 'N/A',
      shopAddress: agent.shopAddress || 'N/A',
      documents: agent.documents || {},
      balance: agent.balance || '0.00',
      dateOfPurchasePlan: agent.dateOfPurchasePlan || 'N/A',
      username: agent.username || 'N/A'
    };
  };

  // Create dummy data if API fails
  const mapDummyAgents = () => {
    return [
      {
        id: 'dummy-1',
        name: 'Sample Agent',
        registrationDate: '2025-04-11',
        paymentStatus: 'pending',
        amountPaid: '0.00',
        unpaidAmount: '0.00',
        plan: 'Basic',
        paymentMethod: 'NA',
        status: 'pending',
        contactNo: '9898989899',
        email: 'sample@gmail.com',
        shopName: 'Sample Shop',
        shopAddress: 'Sample Address',
        documents: {},
        balance: '0.00',
        dateOfPurchasePlan: '15/03/2025',
        username: 'SampleUser'
      },
      {
        id: 'dummy-2',
        name: 'Another Agent',
        registrationDate: '2025-04-10',
        paymentStatus: 'Pending',
        amountPaid: '0.00',
        unpaidAmount: '0.00',
        plan: 'Basic',
        paymentMethod: 'NA',
        status: 'Pending',
        contactNo: '9876543210',
        email: 'another@gmail.com',
        shopName: 'Another Shop',
        shopAddress: 'Another Address',
        documents: {},
        balance: '0.00',
        dateOfPurchasePlan: '14/03/2025',
        username: 'AnotherUser'
      }
    ];
  };

  // Filter and sort agents
  const filteredAgents = agents.filter(agent =>
    (selectedStatus === 'All' || agent.status === selectedStatus) &&
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.contactNo.includes(searchTerm) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'Newest First':
        return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
      case 'Oldest First':
        return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Update agent details
  const handleUpdateAgent = async (id, field, value) => {
    setUpdatingAgentId(id); // Set loading state for this specific agent
    
    try {
      // First update locally to provide immediate feedback
      setAgents(agents.map(agent =>
        agent.id === id ? { ...agent, [field]: value } : agent
      ));
      
      // Then update in the backend
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/agent/update-agent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
      
      if (!response.ok) {
        console.error("Failed to update agent status");
        // Revert the local change if update fails
       
        setAgents(agents);
        return;
      }
      
      const data = await response.json();
      console.log("Agent updated successfully:", data);
      fetchAgents();
      // Show success popup briefly
      setShowUpdateSuccessPopup(true);
      setTimeout(() => {
        setShowUpdateSuccessPopup(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error updating agent:", error);
      // Revert the local change if update fails
      setAgents(agents);
    } finally {
      setUpdatingAgentId(null); // Clear loading state
    }
  };

  // Modify delete handler
  const handleDeleteAgent = async(id) => {
    console.log(id);
    try {
      setIsLoading(true);
      const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/agent/delete-agent/${id}`, {
        method: "DELETE",
      });
      
      if(response.ok) {
        // Refresh the agents list after successful deletion
        await fetchAgents();
        setShowDeleteSuccessPopup(true);
        setTimeout(() => {
          setShowDeleteSuccessPopup(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    setAgents(agents.filter(agent => agent.id !== agentToDelete));
    setShowDeleteConfirmation(false);
    setShowDeleteSuccess(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setAgentToDelete(null);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      Active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800', // Handle lowercase status from API
      Hold: 'bg-red-100 text-red-800',
      Inactive: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }) => {
    const statusColors = {
      Paid: 'bg-green-100 text-green-800',
      Partial: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      Overdue: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // View agent details handler
  const handleViewAgent = (agent) => {
    // Implement a view modal or navigation to details page
    console.log("Viewing agent details:", agent);
    // You could implement a modal here or navigate to a details page
  };

  // Update Success Popup component
  const UpdateSuccessPopup = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Agent Updated Successfully!</h3>
          <p className="text-gray-600 text-center mb-4">The agent information has been updated in the system.</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agent Requests</h1>
          <p className="text-gray-600 mt-2">Manage all agent requests and their payment details</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search agents..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
         
        </div>
      </div>

      {/* Agents Table with Loading */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner loadingText="Loading Agent Data" description="Please wait while we fetch the agent information" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr. No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Registration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid (₹)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unpaid Amount (₹)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent, index) => (
                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <FiUser className="text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500">{agent.email}</div>
                            <div className="text-sm text-gray-500">{agent.contactNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.shopName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(agent.registrationDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                          onClick={() => handleViewAgent(agent)}
                        >
                          <FiEye className="mr-1" /> View
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentStatusBadge status={agent.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{agent.amountPaid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{agent.unpaidAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          {updatingAgentId === agent.id && ['plan'].includes('plan') ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : null}
                          <select
                            value={agent.plan}
                            onChange={(e) => handleUpdateAgent(agent.id, 'plan', e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            disabled={updatingAgentId === agent.id}
                          >
                            {plans.map(plan => (
                              <option key={plan} value={plan}>{plan}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          {updatingAgentId === agent.id && ['paymentMethod'].includes('paymentMethod') ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : null}
                          <select
                            value={agent.paymentMethod}
                            onChange={(e) => handleUpdateAgent(agent.id, 'paymentMethod', e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            disabled={updatingAgentId === agent.id}
                          >
                            {paymentMethods.map(method => (
                              <option key={method} value={method}>{method}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          {updatingAgentId === agent.id && ['status'].includes('status') ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : null}
                          <select
                            value={agent.status}
                            onChange={(e) => handleUpdateAgent(agent.id, 'status', e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            disabled={updatingAgentId === agent.id}
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            disabled={updatingAgentId === agent.id || isLoading}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="px-6 py-4 text-center text-gray-500">
                      No agents found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAgents.length}</span> of{' '}
              <span className="font-medium">{filteredAgents.length}</span> agents
            </div>
            <div className="flex space-x-2">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add popup components */}
      {showDeleteConfirmation && (
        <DeleteConfirmationPopup
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {showDeleteSuccessPopup && <DeleteSuccessPopup onClose={() => setShowDeleteSuccessPopup(false)} />}

      {showDeleteSuccess && (
        <DeleteSuccessPopup
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}

      {/* New update success popup */}
      {showUpdateSuccessPopup && (
        <UpdateSuccessPopup onClose={() => setShowUpdateSuccessPopup(false)} />
      )}
    </div>
  );
};

export default AgentManagement;