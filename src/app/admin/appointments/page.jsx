"use client";
import React, { useState, useEffect } from 'react';
import { HomeIcon, Search, ChevronDown, ChevronUp, Calendar, Filter, AlertCircle } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '@/components/Loading';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [rechargeData, setRechargeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  
  // Stats counters calculated from rechargeData
  const visitedCount = rechargeData.filter(item => item.status === 'Visited').length;
  const rejectedCount = rechargeData.filter(item => item.status === 'Rejected').length;
  const pendingCount = rechargeData.filter(item => item.status === 'Pending').length;
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Adjust the URL based on filter
      const url = filterStatus === 'All' 
        ? 'https://dokument-guru-backend.vercel.app/api/admin/appointments/fetch-pending-appointments' 
        : `https://dokument-guru-backend.vercel.app/api/admin/appointments/fetch-pending-appointments?status=${filterStatus}`;
      
      const res = await axios.get(url);
      
      if (res.data.success) {
        setRechargeData(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus]); // Re-fetch when filter changes

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      setUpdating(true);
      console.log(`Updating appointment ${appointmentId} to ${newStatus}`);
      
      // Use consistent API - stick with axios
      const res = await axios.patch(
        `https://dokument-guru-backend.vercel.app/api/admin/appointments/update-appointments/${appointmentId}`, 
        { status: newStatus }
      );
      
      if (res.data.success) {
        // Update local state to reflect the change
        setRechargeData(prevData => 
          prevData.map(item => 
            item._id === appointmentId ? {...item, status: newStatus} : item
          )
        );
        return true;
      } else {
        setError(res.data.message || `Failed to update appointment status to ${newStatus}`);
        return false;
      }
    } catch (err) {
      console.error(`Error updating appointment status to ${newStatus}:`, err);
      setError(err.response?.data?.message || err.message || `Failed to update appointment status to ${newStatus}`);
      return false;
    } finally {
      setUpdating(false);
    }
  };
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const filteredData = rechargeData.filter(item => {
    // First apply search filter
    const matchesSearch = 
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.appointmentDate.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply status filter if not "All"
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const handleVisited = async (appointmentId) => {
    const success = await updateAppointmentStatus(appointmentId, 'Visited');
    if (success) {
      alert(`Appointment ${appointmentId} marked as visited`);
    }
  };

  const handleRejected = async (appointmentId) => {
    const success = await updateAppointmentStatus(appointmentId, 'Rejected');
    if (success) {
      alert(`Appointment ${appointmentId} marked as rejected`);
    }
  };
  console.log(sortedData)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-700 to-green-600">
  <div className="flex items-center gap-4 mb-4 md:mb-0">
    <div className="flex items-center gap-2">
      <Calendar className="text-white" size={24} />
      <h1 className="text-2xl font-bold text-white">
        Appointments
      </h1>
    </div>
  </div>
  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
    {/* Search Input */}
    <div className="relative flex-grow max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-200" />
      </div>
      <input
        type="text"
        placeholder="Search agents or dates..."
        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100 bg-transparent placeholder-gray-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    
    {/* Enhanced Filter Dropdown */}
    <div className="relative">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 hover:border-white/30 transition-colors">
        <select 
          className="bg-transparent appearance-none focus:outline-none text-white cursor-pointer pr-6"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All" className="text-gray-900">All Appointments</option>
          <option value="Pending" className="text-gray-900">Pending</option>
          <option value="Visited" className="text-gray-900">Visited</option>
          <option value="Rejected" className="text-gray-900">Rejected</option>
        </select>
        <div className="pointer-events-none absolute right-2 flex items-center">
          <ChevronDown size={16} className="text-gray-200" />
        </div>
      </div>
    </div>
  </div>
</div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 p-4 border-l-4 border-red-500">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                className="text-sm text-red-500 mt-2 hover:text-red-700"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Stats Card */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">All Appointments</p>
                <p className="text-2xl font-bold text-green-600">{rechargeData.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Pending Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{pendingCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Visited Appointments</p>
                <p className="text-2xl font-bold text-green-600">{visitedCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Rejected Appointments</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner loadingText="Loading appointments..." description="Please wait while we fetch your data" />
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('id')}
                    >
                      <div className="flex items-center gap-1">
                        Sr.No
                        {getSortIcon('id')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('fullName')}
                    >
                      <div className="flex items-center gap-1">
                        Customer Name
                        {getSortIcon('fullName')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('appointmentDate')}
                    >
                      <div className="flex items-center gap-1">
                        Date and Time
                        {getSortIcon('appointmentDate')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price(₹)
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((item,index) => (
                    <tr 
                      key={item._id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index+1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="font-medium">{item.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.appointmentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${item.status === 'Visited' ? 'bg-green-100 text-green-800' : ''}
                          ${item.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex justify-end gap-2">
                          {item.status === 'Pending' && (
                            <>
                              <button 
                                className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 disabled:opacity-50"
                                onClick={() => handleVisited(item._id)}
                                disabled={updating}
                              >
                                Visited
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                                onClick={() => handleRejected(item._id)}
                                disabled={updating}
                              >
                                Rejected
                              </button>
                            </>
                          )}
                          {item.status !== 'Pending' && (
                            <span className="text-gray-400 italic">Processed</span>
                          )}
                        </div>
                      </td>
                    </tr> 
                  ))}
                  {!loading && sortedData.length === 0 && (
                    <tr>
                      <td colSpan="11" className="px-6 py-10 text-center text-gray-500">
                        No appointments found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedData.length}</span> of{' '}
              <span className="font-medium">{rechargeData.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}