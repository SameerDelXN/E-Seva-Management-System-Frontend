"use client";
import React, { useState, useEffect } from "react";
import { FiFilter, FiX, FiChevronDown, FiPrinter, FiSearch, FiRefreshCw, FiHome, FiUser, FiCalendar } from "react-icons/fi";
import { FaRupeeSign, FaPercentage, FaRegCalendarAlt, FaFileAlt } from "react-icons/fa";
import { MdOutlinePayment, MdAccountBalance, MdDescription } from "react-icons/md";
import { HiDocumentText, HiOfficeBuilding } from "react-icons/hi";
import { BsFileEarmarkText, BsGraphUp } from "react-icons/bs";

const DokumentGuruFilterPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    agentName: "All",
    agentType: "All",
    applicantName: "All",
    status: "All",
    documentType: "All",
    services: "All"
  });

  // State for summary data
  const [summary, setSummary] = useState({
    totalEarnings: 42880.00,
    totalCommission: 25475.00,
    totalTax: 120.00,
    totalGovtFees: 15605.00,
    totalDocuments: 58,
    commissionRate: 18
  });

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    "Legal Documents": false,
    "Property Papers": false,
    "Financial Documents": false,
    "Government Certificates": false,
    "Educational Documents": false,
    "Business Documents": false
  });

  // State for loading
  const [loading, setLoading] = useState(false);
  
  // State for document data
  const [documentData, setDocumentData] = useState({});
  
  // Document categories for DokumentGuru
  const documentCategories = [
    { 
      name: "Legal Documents", 
      services: ["Affidavits", "Notary", "Power of Attorney", "Will Drafting"],
      icon: <MdDescription className="text-green-500" />
    },
    { 
      name: "Property Papers", 
      services: ["Sale Deeds", "Lease Agreements", "Mortgage Documents", "Property Tax Filing"],
      icon: <HiOfficeBuilding className="text-green-500" />
    },
    { 
      name: "Financial Documents", 
      services: ["Loan Agreements", "Investment Papers", "Tax Filing", "Financial Affidavits"],
      icon: <BsGraphUp className="text-purple-500" />
    },
    { 
      name: "Government Certificates", 
      services: ["Birth Certificates", "Marriage Certificates", "Death Certificates", "Caste Certificates"],
      icon: <FaFileAlt className="text-red-500" />
    },
    { 
      name: "Educational Documents", 
      services: ["Transcripts", "Degree Certificates", "Migration Certificates", "Mark Sheets"],
      icon: <HiDocumentText className="text-yellow-500" />
    },
    { 
      name: "Business Documents", 
      services: ["Incorporation Papers", "GST Registration", "Partnership Deeds", "MOA/AOA"],
      icon: <BsFileEarmarkText className="text-cyan-500" />
    }
  ];

  // Initialize document data
  useEffect(() => {
    const initialData = {};
    documentCategories.forEach(category => {
      initialData[category.name] = category.services.map(service => ({
        name: service,
        count: Math.floor(Math.random() * 15) + 5,
        earnings: (Math.random() * 8000 + 1000).toFixed(2),
        commission: (Math.random() * 3000 + 500).toFixed(2),
        status: ["Completed", "Pending", "In Progress"][Math.floor(Math.random() * 3)]
      }));
    });
    setDocumentData(initialData);
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Apply filters function
  const applyFilters = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Applying filters:", filters);
      setLoading(false);
      
      // Update summary with filtered data (simulated)
      setSummary(prev => ({
        ...prev,
        totalEarnings: (Math.random() * 30000 + 20000).toFixed(2),
        totalCommission: (Math.random() * 15000 + 10000).toFixed(2),
        totalTax: (Math.random() * 200 + 50).toFixed(2),
        totalGovtFees: (Math.random() * 20000 + 10000).toFixed(2),
        totalDocuments: Math.floor(Math.random() * 80 + 30)
      }));
    }, 1000);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      agentName: "All",
      agentType: "All",
      applicantName: "All",
      status: "All",
      documentType: "All",
      services: "All"
    });
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 font-sans">

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiFilter className="mr-3 text-green-600 text-2xl" /> 
              <span className="bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                Filter Options
              </span>
            </h2>
            <button 
              onClick={resetFilters}
              className="flex items-center text-sm text-green-600 hover:text-green-800 font-medium"
            >
              <FiRefreshCw className="mr-2" /> Reset All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Date Range */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex items-center">
                <div className="relative flex-1 mr-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <span className="mx-2 text-gray-500">to</span>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <select
                  name="agentName"
                  value={filters.agentName}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                >
                  <option value="All">All Agents</option>
                  <option value="Legal Expert">Legal Expert</option>
                  <option value="Document Specialist">Document Specialist</option>
                  <option value="Certification Agent">Certification Agent</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Agent Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent Type</label>
              <select
                name="agentType"
                value={filters.agentType}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">All Types</option>
                <option value="Notary">Notary</option>
                <option value="Legal Advisor">Legal Advisor</option>
                <option value="Document Processor">Document Processor</option>
                <option value="Certification Expert">Certification Expert</option>
              </select>
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            {/* Applicant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Applicant Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="applicantName"
                  value={filters.applicantName}
                  onChange={handleFilterChange}
                  placeholder="Search applicant..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select
                name="documentType"
                value={filters.documentType}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">All Document Types</option>
                <option value="Legal">Legal</option>
                <option value="Financial">Financial</option>
                <option value="Property">Property</option>
                <option value="Government">Government</option>
              </select>
            </div>
            
            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Services</label>
              <select
                name="services"
                value={filters.services}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">All Services</option>
                {documentCategories.flatMap(category => 
                  category.services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))
                )}
              </select>
            </div>
            
            {/* Apply Button */}
            <div className="flex items-end">
              <button
                onClick={applyFilters}
                disabled={loading}
                className={`flex items-center justify-center w-full bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </>
                ) : (
                  <>
                    <FiSearch className="mr-2" /> Apply Filters
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Active Filters */}
          {filters.dateFrom || filters.dateTo || filters.agentName !== "All" || filters.status !== "All" ? (
            <div className="mt-5 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-medium text-green-800">Active Filters:</span>
                {filters.dateFrom && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center shadow-sm">
                    From: {formatDate(filters.dateFrom)}
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, dateFrom: "" }))}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {filters.dateTo && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center shadow-sm">
                    To: {formatDate(filters.dateTo)}
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, dateTo: "" }))}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {filters.agentName !== "All" && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center shadow-sm">
                    Agent: {filters.agentName}
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, agentName: "All" }))}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {filters.status !== "All" && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center shadow-sm">
                    Status: {filters.status}
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, status: "All" }))}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {/* Total Earnings */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start">
              <div className="p-3 bg-green-50 rounded-lg mr-4 group-hover:bg-green-100 transition-colors">
                <FaRupeeSign className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Earnings</h3>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{summary.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">From document services</p>
              </div>
            </div>
          </div>
          
          {/* Total Commission */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start">
              <div className="p-3 bg-purple-50 rounded-lg mr-4 group-hover:bg-purple-100 transition-colors">
                <MdOutlinePayment className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Commission</h3>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{summary.totalCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Agent commissions</p>
              </div>
            </div>
          </div>
          
          {/* Total Tax */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start">
              <div className="p-3 bg-green-50 rounded-lg mr-4 group-hover:bg-green-100 transition-colors">
                <MdAccountBalance className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Tax</h3>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{summary.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">GST and other taxes</p>
              </div>
            </div>
          </div>
          
          {/* Total Govt Fees */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start">
              <div className="p-3 bg-green-50 rounded-lg mr-4 group-hover:bg-green-100 transition-colors">
                <FaRupeeSign className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Govt Fees</h3>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{summary.totalGovtFees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Government charges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Earnings Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
            <span className="bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              Document Processing Details
            </span>
          </h2>
          
          {documentCategories.map((category) => (
            <div key={category.name} className="mb-4">
              <div 
                className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-200 text-black cursor-pointer hover:from-gray-200 hover:to-gray-200 transition-all rounded-lg shadow-sm"
                onClick={() => toggleSection(category.name)}
              >
                <div className="flex items-center">
                  <div className="mr-3 bg-white bg-opacity-20 p-2 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-2 text-green-700 text-sm">
                      ({documentData[category.name]?.reduce((sum, doc) => sum + doc.count, 0)} documents)
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 font-medium">
                    ₹{documentData[category.name]?.reduce((sum, doc) => sum + parseFloat(doc.earnings), 0).toFixed(2)}
                  </span>
                  <FiChevronDown className={`transition-transform ${expandedSections[category.name] ? 'rotate-180' : ''}`} />
                </div>
              </div>
              
              {expandedSections[category.name] && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-b-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Document</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Count</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Earnings</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Commission</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {documentData[category.name]?.map((doc, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{doc.count}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                              ₹{parseFloat(doc.earnings).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-600 font-medium">
                              ₹{parseFloat(doc.commission).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                doc.status === "Completed" ? "bg-green-100 text-green-800" :
                                doc.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {doc.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-100 font-medium">
                        <tr>
                          <td className="px-4 py-3 text-left">Category Total</td>
                          <td className="px-4 py-3">
                            {documentData[category.name]?.reduce((sum, doc) => sum + doc.count, 0)}
                          </td>
                          <td className="px-4 py-3 text-green-700">
                            ₹{documentData[category.name]?.reduce((sum, doc) => sum + parseFloat(doc.earnings), 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-purple-700">
                            ₹{documentData[category.name]?.reduce((sum, doc) => sum + parseFloat(doc.commission), 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white border-t border-gray-700 p-3 flex justify-between items-center text-sm z-10">
        <div className="flex items-center">
          <span className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs animate-pulse"></span>
          <span>System Status: Operational</span>
          <span className="mx-4 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Last Sync: {new Date().toLocaleTimeString('en-IN')}</span>
        </div>
        <div className="flex items-center">
          <span className="hidden md:inline mr-4">Infognite v2.4.1</span>
          <span>
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'short', 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
          <span className="mx-2">|</span>
          <span>
            {new Date().toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DokumentGuruFilterPage;