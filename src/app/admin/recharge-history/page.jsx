"use client";
import React, { useState, useEffect } from 'react';
import { HomeIcon, Search, ChevronDown, ChevronUp, Download } from 'lucide-react';
import LoadingSpinner from '@/components/Loading';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rechargeData, setRechargeData] = useState([]);
  
  // Fetch data from API
  useEffect(() => {
    const fetchRechargeHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/agent/recharge/history');
        const result = await response.json();
        
        if (result.data) {
          // Map the response data to match our expected format
          const formattedData = result.data.map((item, index) => ({
            id: index + 1,
            _id: item._id,
            agentId: item.agentId,
            agentName: item.agentName,
            dateTime: item.dateTime,
            balanceBefore: item.balanceBefore,
            rechargeAmount: item.rechargeAmount,
            balanceAfter: item.balanceAfter,
          }));
          
          setRechargeData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching recharge history:", error);
        // In case of error, you might want to show some fallback data
        setRechargeData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRechargeHistory();
  }, []);

  const filteredData = rechargeData.filter(item =>
    item.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dateTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const totalEarnings = rechargeData.reduce((sum, item) => sum + item.rechargeAmount, 0);

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-700 to-green-600">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <HomeIcon size={25}  color='white'/>
              <h1 className="text-2xl font-bold text-white">
                Agent's Recharge History
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-green-700 rounded-lg transition-colors"
              >
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Recharges</p>
                <p className="text-2xl font-bold text-gray-800">{rechargeData.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{totalEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Highest Recharge</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{rechargeData.length > 0 ? Math.max(...rechargeData.map(item => item.rechargeAmount)).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12">
                <LoadingSpinner loadingText="Loading recharge history..." description="Please wait while we fetch the data" />
              </div>
            ) : (
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
                      onClick={() => requestSort('agentName')}
                    >
                      <div className="flex items-center gap-1">
                        Agent Name
                        {getSortIcon('agentName')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('dateTime')}
                    >
                      <div className="flex items-center gap-1">
                        Date and Time
                        {getSortIcon('dateTime')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('balanceBefore')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Balance Before
                        {getSortIcon('balanceBefore')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('rechargeAmount')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Recharge Amount
                        {getSortIcon('rechargeAmount')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('balanceAfter')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Balance After
                        {getSortIcon('balanceAfter')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.length > 0 ? (
                    sortedData.map((item) => (
                      <tr 
                        key={item._id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="font-medium">{item.agentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.dateTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ₹{item.balanceBefore.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <span className="text-green-600">
                            +₹{item.rechargeAmount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <span className="text-green-600">
                            ₹{item.balanceAfter.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recharge data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedData.length}</span> of{' '}
              <span className="font-medium">{rechargeData.length}</span> results
            </div>
            {/* Pagination would go here */}
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