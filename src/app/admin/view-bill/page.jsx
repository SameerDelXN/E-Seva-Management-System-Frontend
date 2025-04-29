// "use client";
// import React, { useState, useEffect } from "react";
// import { FiPrinter, FiFilter, FiEye, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiX, FiSave, FiDownloadCloud } from "react-icons/fi";

// const BillingUI = () => {
//   // State for filters
//   const [filters, setFilters] = useState({
//     dateFrom: "",
//     dateTo: "",
//     customerName: "",
//     customerNumber: "",
//     billDescription: ""
//   });

//   // State for bills data
//   const [bills, setBills] = useState([]);
//   const [originalBills, setOriginalBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const billsPerPage = 5;

//   // Hardcoded customer data
//   const hardcodedCustomers = [
//     {
//       id: 1,
//       customerName: "John Doe",
//       customerNumber: "9876543210",
//       description: "Website Development Project",
//       date: "2023-10-15",
//       amount: 25000,
//       commission: 2000,
//       tax: 1800,
//       items: [
//         { name: "Frontend Development", price: 15000, quantity: 1 },
//         { name: "Backend Development", price: 10000, quantity: 1 }
//       ]
//     },
//     {
//       id: 2,
//       customerName: "Jane Smith",
//       customerNumber: "8765432109",
//       description: "Mobile App Maintenance",
//       date: "2023-10-20",
//       amount: 15000,
//       commission: 1200,
//       tax: 900,
//       items: [
//         { name: "Monthly Maintenance", price: 10000, quantity: 1 },
//         { name: "Bug Fixes", price: 5000, quantity: 1 }
//       ]
//     },
//     {
//       id: 3,
//       customerName: "Acme Corporation",
//       customerNumber: "7654321098",
//       description: "SEO Services Package",
//       date: "2023-10-25",
//       amount: 30000,
//       commission: 2500,
//       tax: 2700,
//       items: [
//         { name: "Keyword Research", price: 5000, quantity: 1 },
//         { name: "On-Page Optimization", price: 10000, quantity: 1 },
//         { name: "Content Creation", price: 15000, quantity: 1 }
//       ]
//     }
//   ];
//   const newfetchBills = async () => {
//     try {
//       const res = await fetch("https://dokument-guru-backend.vercel.app/api/admin/Bills/fetch-bill", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });
  
//       if (!res.ok) {
//         throw new Error("Failed to fetch bills");
//       }
  
//       const data = await res.json();
//       return data.invoice;
//       console.log("Fetched Bills ✅", data.invoice);
//       // You can now set this to a state variable if needed
//       // setBills(data.bills);
  
//     } catch (err) {
//       console.error("❌ Error fetching bills:", err);
//     }
//   };
//   // Mock data fetch
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await newfetchBills();
        
//         // Transform the API data to match your expected format
//         const transformedBills = data.map((bill) => ({
//           id: bill._id,
//           customerName: bill.customerName,
//           customerNumber: bill.customerNumber,
//           description: bill.description,
//           date: new Date(bill.date).toISOString().split('T')[0],
//           amount: bill.grandTotal,
//           commission: bill.totalCommission,
//           tax: bill.totalTax,
//           items: bill.items.map(item => ({
//             name: item.name,
//             price: item.basePrice,
//             quantity: item.quantity
//           }))
//         }));
//   console.log(data);
//         setBills(transformedBills);
//         setOriginalBills(transformedBills);
//       } catch (error) {
//         console.error("Error fetching bills:", error);
//         // Fallback to hardcoded data if API fails
//         setBills(hardcodedCustomers);
//         setOriginalBills(hardcodedCustomers);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchData();
//   }, []);


  

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   // Apply filters
//   const applyFilters = () => {
//     setLoading(true);
//     const filteredBills = originalBills.filter(bill => {
//       const matchesDateFrom = !filters.dateFrom || new Date(bill.date) >= new Date(filters.dateFrom);
//       const matchesDateTo = !filters.dateTo || new Date(bill.date) <= new Date(filters.dateTo);
//       const matchesCustomerName = !filters.customerName || 
//         bill.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
//       const matchesCustomerNumber = !filters.customerNumber || 
//         bill.customerNumber.includes(filters.customerNumber);
//       const matchesDescription = !filters.billDescription || 
//         bill.description.toLowerCase().includes(filters.billDescription.toLowerCase());
      
//       return matchesDateFrom && matchesDateTo && matchesCustomerName && 
//              matchesCustomerNumber && matchesDescription;
//     });
    
//     setTimeout(() => {
//       setBills(filteredBills);
//       setCurrentPage(1);
//       setLoading(false);
//     }, 500);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       dateFrom: "",
//       dateTo: "",
//       customerName: "",
//       customerNumber: "",
//       billDescription: ""
//     });
//     setBills(originalBills);
//     setCurrentPage(1);
//   };

//   // Calculate totals
//   const totalEarnings = bills.reduce((sum, bill) => sum + bill.amount, 0);
//   const totalCommission = bills.reduce((sum, bill) => sum + bill.commission, 0);
//   const totalTax = bills.reduce((sum, bill) => sum + (bill.tax || 0), 0);

//   // Pagination logic
//   const indexOfLastBill = currentPage * billsPerPage;
//   const indexOfFirstBill = indexOfLastBill - billsPerPage;
//   const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
//   const totalPages = Math.ceil(bills.length / billsPerPage);

//   // Preview modal state
//   const [previewModal, setPreviewModal] = useState(false);
//   const [selectedBill, setSelectedBill] = useState(null);

//   // Edit modal state
//   const [editModal, setEditModal] = useState(false);
//   const [editingBill, setEditingBill] = useState(null);
//   const [editForm, setEditForm] = useState({
//     customerName: '',
//     customerNumber: '',
//     description: '',
//     date: '',
//     amount: 0,
//     commission: 0,
//     tax: 0
//   });

//   // Open preview modal
//   const openPreview = (bill) => {
//     setSelectedBill(bill);
//     setPreviewModal(true);
//   };

//   // Open edit modal
//   const openEdit = (bill) => {
//     setEditingBill(bill);
//     setEditForm({
//       customerName: bill.customerName,
//       customerNumber: bill.customerNumber,
//       description: bill.description,
//       date: bill.date,
//       amount: bill.amount,
//       commission: bill.commission,
//       tax: bill.tax || 0
//     });
//     setEditModal(true);
//   };

//   // Handle edit form changes
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: value }));
//   };

//   // Save edited bill
//   // const saveEditedBill = () => {
//   //   setLoading(true);
    
//   //   const updatedBill = {
//   //     ...editingBill,
//   //     customerName: editForm.customerName,
//   //     customerNumber: editForm.customerNumber,
//   //     description: editForm.description,
//   //     date: editForm.date,
//   //     amount: parseFloat(editForm.amount),
//   //     commission: parseFloat(editForm.commission),
//   //     tax: parseFloat(editForm.tax)
//   //   };
    
//   //   const updatedBills = bills.map(bill => 
//   //     bill.id === updatedBill.id ? updatedBill : bill
//   //   );
    
//   //   setTimeout(() => {
//   //     setBills(updatedBills);
//   //     setOriginalBills(updatedBills);
//   //     setEditModal(false);
//   //     setLoading(false);
//   //   }, 500);
//   // };
//   const saveEditedBill = async () => {
//     try {
//       setLoading(true);
      
//       // Prepare the updated bill data
//       const updatedBill = {
//         customerName: editForm.customerName,
//         customerNumber: editForm.customerNumber,
//         description: editForm.description,
//         date: editForm.date,
//         grandTotal: parseFloat(editForm.amount),
//         totalCommission: parseFloat(editForm.commission),
//         totalTax: parseFloat(editForm.tax),
//         items: editingBill.items.map(item => ({
//           name: item.name,
//           basePrice: item.price,
//           quantity: item.quantity
//         }))
//       };
  
//       // Make API call to update the bill
//       const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/Bills/update-bill/${editingBill.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedBill)
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to update bill');
//       }
  
//       // Update local state with the edited bill
//       const updatedBills = bills.map(bill => 
//         bill.id === editingBill.id ? {
//           ...editingBill,
//           customerName: editForm.customerName,
//           customerNumber: editForm.customerNumber,
//           description: editForm.description,
//           date: editForm.date,
//           amount: parseFloat(editForm.amount),
//           commission: parseFloat(editForm.commission),
//           tax: parseFloat(editForm.tax)
//         } : bill
//       );
  
//       setBills(updatedBills);
//       setOriginalBills(updatedBills);
//       setEditModal(false);
      
//       alert('Bill updated successfully!');
//     } catch (error) {
//       console.error('Error updating bill:', error);
//       alert('Failed to update bill. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete bill
//   const deleteBill = async (id) => {
//     console.log(id);
//     if (window.confirm("Are you sure you want to delete this bill?")) {
//       setLoading(true);
  
//       try {
//         const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/Bills/delete-bill/${id}`, {
//           method: 'DELETE',
//         });
  
//         if (!response.ok) {
//           throw new Error('Failed to delete bill');
//         }
  
//         // Update UI only after successful deletion
//         const updatedBills = bills.filter(bill => bill.id !== id);
//         setBills(updatedBills);
//         setOriginalBills(updatedBills);
//       } catch (error) {
//         console.error('Error deleting bill:', error);
//         alert('Failed to delete the bill. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
  

//   return (
//     <div className="min-h-screen bg-green-50 p-4 md:p-8">
//       {/* Navigation Buttons */}
//       <div className="flex justify-between items-center mb-6">
//         <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
//           <FiPrinter className="mr-2" />
//           Print
//         </button>
//       </div>

//       {/* Filter Section */}
//       <div className="bg-white p-6 shadow-md rounded-lg mb-6">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter Options</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
//             <input
//               type="date"
//               name="dateFrom"
//               value={filters.dateFrom}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
//             <input
//               type="date"
//               name="dateTo"
//               value={filters.dateTo}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
//             <input
//               type="text"
//               name="customerName"
//               value={filters.customerName}
//               onChange={handleFilterChange}
//               placeholder="Enter customer name"
//               className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Customer Number</label>
//             <input
//               type="text"
//               name="customerNumber"
//               value={filters.customerNumber}
//               onChange={handleFilterChange}
//               placeholder="Enter customer number"
//               className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div className="md:col-span-2 lg:col-span-3">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Bill Description</label>
//             <input
//               type="text"
//               name="billDescription"
//               value={filters.billDescription}
//               onChange={handleFilterChange}
//               placeholder="Enter bill description"
//               className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             />
//           </div>
//         </div>
//         <div className="flex space-x-2 mt-4">
//           <button
//             onClick={applyFilters}
//             className="flex items-center justify-center bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors"
//           >
//             <FiFilter className="mr-2" />
//             Apply Filters
//           </button>
//           <button
//             onClick={resetFilters}
//             className="flex items-center justify-center bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
//           >
//             <FiX className="mr-2" />
//             Reset Filters
//           </button>
//         </div>
//       </div>

//       {/* Summary Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-green-100 p-4 rounded-lg border border-green-200">
//           <h3 className="text-sm font-medium text-green-800">Total Earnings</h3>
//           <p className="text-2xl font-bold text-green-900">₹{totalEarnings.toLocaleString()}</p>
//         </div>
//         <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
//           <h3 className="text-sm font-medium text-blue-800">Total Commission</h3>
//           <p className="text-2xl font-bold text-blue-900">₹{totalCommission.toLocaleString()}</p>
//         </div>
//         <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
//           <h3 className="text-sm font-medium text-purple-800">Total Tax</h3>
//           <p className="text-2xl font-bold text-purple-900">₹{totalTax.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Bills Table */}
//       <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
//         {loading ? (
//           <div className="p-8 flex justify-center items-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-400 text-white">
//                   <tr>
//                     <th className="p-3 text-left">Sr.No</th>
//                     <th className="p-3 text-left">Customer Name</th>
//                     <th className="p-3 text-left">Customer Number</th>
//                     <th className="p-3 text-left">Description</th>
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Actions</th>
//                     <th className="p-3 text-right">Amount (₹)</th>
//                     <th className="p-3 text-right">Commission (₹)</th>
//                     <th className="p-3 text-right">Tax (₹)</th>
//                     <th className="p-3 text-right">Download</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {currentBills.length > 0 ? (
//                     currentBills.map((bill, index) => (
//                       <tr key={bill.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                         <td className="p-3">{indexOfFirstBill + index + 1}</td>
//                         <td className="p-3 font-medium text-gray-900">{bill.customerName}</td>
//                         <td className="p-3 text-gray-700">{bill.customerNumber}</td>
//                         <td className="p-3 text-gray-700">{bill.description}</td>
//                         <td className="p-3 text-gray-700">{bill.date}</td>
//                         <td className="p-3">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openPreview(bill)}
//                               className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
//                               title="Preview"
//                             >
//                               <FiEye />
//                             </button>
//                             <button 
//                               onClick={() => openEdit(bill)}
//                               className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50" 
//                               title="Edit"
//                             >
//                               <FiEdit2 />
//                             </button>
//                             <button 
//                               onClick={() => deleteBill(bill.id)}
//                               className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50" 
//                               title="Delete"
//                             >
//                               <FiTrash2 />
//                             </button>
//                           </div>
//                         </td>
//                         <td className="p-3 text-right font-medium">{bill.amount.toLocaleString()}</td>
//                         <td className="p-3 text-right">{bill.commission.toLocaleString()}</td>
//                         <td className="p-3 text-right">{bill.tax.toLocaleString()}</td>
//                         <td className="p-3 text-right ">Download</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="9" className="p-4 text-center text-gray-500">
//                         No bills found matching your filters
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {bills.length > 0 && (
//               <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{indexOfFirstBill + 1}</span> to{' '}
//                     <span className="font-medium">{Math.min(indexOfLastBill, bills.length)}</span> of{' '}
//                     <span className="font-medium">{bills.length}</span> bills
//                   </p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
//                   >
//                     <FiChevronLeft />
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-gray-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-400 text-white hover:bg-gray-400'}`}
//                   >
//                     <FiChevronRight />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Preview Items Modal */}
//       {previewModal && selectedBill && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-gray-900">Bill Details - {selectedBill.description}</h3>
//                 <button
//                   onClick={() => setPreviewModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <FiX size={24} />
//                 </button>
//               </div>
              
//               <div className="mb-6">
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Customer Name</p>
//                     <p className="font-medium">{selectedBill.customerName}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Customer Number</p>
//                     <p className="font-medium">{selectedBill.customerNumber}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Date</p>
//                     <p className="font-medium">{selectedBill.date}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Total Amount</p>
//                     <p className="font-medium">₹{selectedBill.amount.toLocaleString()}</p>
//                   </div>
//                 </div>
                
//                 <h4 className="text-lg font-medium mb-2">Items</h4>
//                 <div className="border rounded-lg overflow-hidden">
//                   <table className="w-full">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="p-2 text-left">Item</th>
//                         <th className="p-2 text-right">Price</th>
//                         <th className="p-2 text-right">Quantity</th>
//                         <th className="p-2 text-right">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {selectedBill.items.map((item, index) => (
//                         <tr key={index}>
//                           <td className="p-2">{item.name}</td>
//                           <td className="p-2 text-right">₹{item.price.toLocaleString()}</td>
//                           <td className="p-2 text-right">{item.quantity}</td>
//                           <td className="p-2 text-right font-medium">₹{(item.price * item.quantity).toLocaleString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
              
//               <div className="flex justify-end">
//                 <button
//                   onClick={() => setPreviewModal(false)}
//                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Bill Modal */}
//       {editModal && editingBill && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-gray-900">Edit Bill - {editingBill.description}</h3>
//                 <button
//                   onClick={() => setEditModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <FiX size={24} />
//                 </button>
//               </div>
              
//               <div className="mb-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
//                     <input
//                       type="text"
//                       name="customerName"
//                       value={editForm.customerName}
//                       onChange={handleEditChange}
//                       className="border border-gray-300 rounded-md p-2 w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Customer Number</label>
//                     <input
//                       type="text"
//                       name="customerNumber"
//                       value={editForm.customerNumber}
//                       onChange={handleEditChange}
//                       className="border border-gray-300 rounded-md p-2 w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                     <input
//                       type="text"
//                       name="description"
//                       value={editForm.description}
//                       onChange={handleEditChange}
//                       className="border border-gray-300 rounded-md p-2 w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={editForm.date}
//                       onChange={handleEditChange}
//                       className="border border-gray-300 rounded-md p-2 w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
//                     <input
//                       type="number"
//                       name="amount"
//                       value={editForm.amount}
//                       onChange={handleEditChange}
//                       className="border border-gray-300 rounded-md p-2 w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Commission (₹)</label>
//                     <input
//                       type="number"
//                       name="commission"
//                       value={editForm.commission}
//                       onChange={handleEditChange}
//                       className="border border-gray-300 rounded-md p-2 w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Tax (₹)</label>
//                     <input
//                       type="number"
//                       name="tax"
//                       value={editForm.tax}
//                       onChange={handleEditChange}
//                       className="border border-gray-300 rounded-md p-2 w-full"
//                     />
//                   </div>
//                 </div>
                
//                 <h4 className="text-lg font-medium mb-2">Items</h4>
//                 <div className="border rounded-lg overflow-hidden mb-4">
//                   <table className="w-full">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="p-2 text-left">Item</th>
//                         <th className="p-2 text-right">Price</th>
//                         <th className="p-2 text-right">Quantity</th>
//                         <th className="p-2 text-right">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {editingBill.items.map((item, index) => (
//                         <tr key={index}>
//                           <td className="p-2">{item.name}</td>
//                           <td className="p-2 text-right">₹{item.price.toLocaleString()}</td>
//                           <td className="p-2 text-right">{item.quantity}</td>
//                           <td className="p-2 text-right font-medium">₹{(item.price * item.quantity).toLocaleString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
              
//               <div className="flex justify-end space-x-2">
//                 <button
//                   onClick={() => setEditModal(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={saveEditedBill}
//                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
//                 >
//                   <FiSave className="mr-2" />
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BillingUI;



  "use client";
  import React, { useState, useEffect } from "react";
  import { FiPrinter, FiFilter, FiEye, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiX, FiSave, FiDownloadCloud } from "react-icons/fi";
  import jsPDF from "jspdf";
  import "jspdf-autotable";
  import html2pdf from 'html2pdf.js';

  const BillingUI = () => {
    // State for filters
    const [filters, setFilters] = useState({
      dateFrom: "",
      dateTo: "",
      customerName: "",
      customerNumber: "",
      billDescription: ""
    });

    // State for bills data
    const [bills, setBills] = useState([]);
    const [originalBills, setOriginalBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 50;

    // Hardcoded customer data
    const hardcodedCustomers = [
      {
        id: 1,
        customerName: "John Doe",
        customerNumber: "9876543210",
        description: "Website Development Project",
        date: "2023-10-15",
        amount: 25000,
        commission: 2000,
        tax: 1800,
        items: [
          { name: "Frontend Development", price: 15000, quantity: 1 },
          { name: "Backend Development", price: 10000, quantity: 1 }
        ]
      },
      {
        id: 2,
        customerName: "Jane Smith",
        customerNumber: "8765432109",
        description: "Mobile App Maintenance",
        date: "2023-10-20",
        amount: 15000,
        commission: 1200,
        tax: 900,
        items: [
          { name: "Monthly Maintenance", price: 10000, quantity: 1 },
          { name: "Bug Fixes", price: 5000, quantity: 1 }
        ]
      },
      {
        id: 3,
        customerName: "Acme Corporation",
        customerNumber: "7654321098",
        description: "SEO Services Package",
        date: "2023-10-25",
        amount: 30000,
        commission: 2500,
        tax: 2700,
        items: [
          { name: "Keyword Research", price: 5000, quantity: 1 },
          { name: "On-Page Optimization", price: 10000, quantity: 1 },
          { name: "Content Creation", price: 15000, quantity: 1 }
        ]
      }
    ];
    const newfetchBills = async () => {
      try {
        const res = await fetch("https://dokument-guru-backend.vercel.app/api/admin/Bills/fetch-bill", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
    
        if (!res.ok) {
          throw new Error("Failed to fetch bills");
        }
    
        const data = await res.json();
        return data.invoice;
        console.log("Fetched Bills ✅", data.invoice);
        // You can now set this to a state variable if needed
        // setBills(data.bills);
    
      } catch (err) {
        console.error("❌ Error fetching bills:", err);
      }
    };
    // Mock data fetch
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await newfetchBills();
          
          // Transform the API data to match your expected format
          const transformedBills = data.map((bill) => ({
            id: bill._id,
            customerName: bill.customerName,
            customerNumber: bill.customerNumber,
            description: bill.description,
            date: new Date(bill.date).toISOString().split('T')[0],
            amount: bill.grandTotal,
            commission: bill.totalCommission,
            tax: bill.totalTax,
            items: bill.items.map(item => ({
              name: item.name,
              price: item.basePrice,
              quantity: item.quantity
            }))
          }));
    console.log(data);
          setBills(transformedBills);
          setOriginalBills(transformedBills);
        } catch (error) {
          console.error("Error fetching bills:", error);
          // Fallback to hardcoded data if API fails
          setBills(hardcodedCustomers);
          setOriginalBills(hardcodedCustomers);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, []);


    

    // Handle filter changes
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Apply filters
    const applyFilters = () => {
      setLoading(true);
      const filteredBills = originalBills.filter(bill => {
        const matchesDateFrom = !filters.dateFrom || new Date(bill.date) >= new Date(filters.dateFrom);
        const matchesDateTo = !filters.dateTo || new Date(bill.date) <= new Date(filters.dateTo);
        const matchesCustomerName = !filters.customerName || 
          bill.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
        const matchesCustomerNumber = !filters.customerNumber || 
          bill.customerNumber.includes(filters.customerNumber);
        const matchesDescription = !filters.billDescription || 
          bill.description.toLowerCase().includes(filters.billDescription.toLowerCase());
        
        return matchesDateFrom && matchesDateTo && matchesCustomerName && 
              matchesCustomerNumber && matchesDescription;
      });
      
      setTimeout(() => {
        setBills(filteredBills);
        setCurrentPage(1);
        setLoading(false);
      }, 500);
    };

    // Reset filters
    const resetFilters = () => {
      setFilters({
        dateFrom: "",
        dateTo: "",
        customerName: "",
        customerNumber: "",
        billDescription: ""
      });
      setBills(originalBills);
      setCurrentPage(1);
    };

    // Calculate totals
    const totalEarnings = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalCommission = bills.reduce((sum, bill) => sum + bill.commission, 0);
    const totalTax = bills.reduce((sum, bill) => sum + (bill.tax || 0), 0);

    // Pagination logic
    const indexOfLastBill = currentPage * billsPerPage;
    const indexOfFirstBill = indexOfLastBill - billsPerPage;
    const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
    const totalPages = Math.ceil(bills.length / billsPerPage);

    // Preview modal state
    const [previewModal, setPreviewModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    // Edit modal state
    const [editModal, setEditModal] = useState(false);
    const [editingBill, setEditingBill] = useState(null);
    const [editForm, setEditForm] = useState({
      customerName: '',
      customerNumber: '',
      description: '',
      date: '',
      amount: 0,
      commission: 0,
      tax: 0
    });

    // Open preview modal
    const openPreview = (bill) => {
      setSelectedBill(bill);
      setPreviewModal(true);
    };

    // Open edit modal
    const openEdit = (bill) => {
      setEditingBill(bill);
      setEditForm({
        customerName: bill.customerName,
        customerNumber: bill.customerNumber,
        description: bill.description,
        date: bill.date,
        amount: bill.amount,
        commission: bill.commission,
        tax: bill.tax || 0
      });
      setEditModal(true);
    };

    // Handle edit form changes
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const saveEditedBill = async () => {
      try {
        setLoading(true);
        
        // Prepare the updated bill data
        const updatedBill = {
          customerName: editForm.customerName,
          customerNumber: editForm.customerNumber,
          description: editForm.description,
          date: editForm.date,
          grandTotal: parseFloat(editForm.amount),
          totalCommission: parseFloat(editForm.commission),
          totalTax: parseFloat(editForm.tax),
          items: editingBill.items.map(item => ({
            name: item.name,
            basePrice: item.price,
            quantity: item.quantity
          }))
        };
    
        // Make API call to update the bill
        const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/Bills/update-bill/${editingBill.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedBill)
        });
    
        if (!response.ok) {
          throw new Error('Failed to update bill');
        }
    
        // Update local state with the edited bill
        const updatedBills = bills.map(bill => 
          bill.id === editingBill.id ? {
            ...editingBill,
            customerName: editForm.customerName,
            customerNumber: editForm.customerNumber,
            description: editForm.description,
            date: editForm.date,
            amount: parseFloat(editForm.amount),
            commission: parseFloat(editForm.commission),
            tax: parseFloat(editForm.tax)
          } : bill
        );
    
        setBills(updatedBills);
        setOriginalBills(updatedBills);
        setEditModal(false);
        
        alert('Bill updated successfully!');
      } catch (error) {
        console.error('Error updating bill:', error);
        alert('Failed to update bill. Please try again.');
      } finally {
        setLoading(false);
        setBillToDelete(null);
      }
    };

    // Delete bill
    const deleteBill = async (id) => {
      console.log(id);
      if (window.confirm("Are you sure you want to delete this bill?")) {
        setLoading(true);
    
        try {
          const response = await fetch(`https://dokument-guru-backend.vercel.app/api/admin/Bills/delete-bill/${id}`, {
            method: 'DELETE',
          });
    
          if (!response.ok) {
            throw new Error('Failed to delete bill');
          }
    
          // Update UI only after successful deletion
          const updatedBills = bills.filter(bill => bill.id !== id);
          setBills(updatedBills);
          setOriginalBills(updatedBills);
        } catch (error) {
          console.error('Error deleting bill:', error);
          alert('Failed to delete the bill. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    


const downloadBillPdf = (bill) => {
  const subtotal = bill.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = subtotal + bill.commission + (bill.tax || 0);

  // Create a temporary element to hold the bill content
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 30px;
      color: #333;
    ">
      <!-- Header Section -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      ">
        <div>
          <h1 style="
            color: #4CAF50;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: 1px;
          ">
            Dokument Guru
          </h1>
          <p style="color: #777; margin: 5px 0 0; font-size: 14px;">
            Professional Documentation Services
          </p>
        </div>
        <div style="text-align: right;">
          <h2 style="
            color: #333;
            font-size: 24px;
            margin: 0;
            font-weight: 600;
          ">
            INVOICE
          </h2>
          <p style="margin: 5px 0 0; font-size: 14px; color: #777;">
            #${bill.id.substring(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        flex-wrap: wrap;
      ">
        <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
          <h3 style="
            font-size: 16px;
            color: #4CAF50;
            margin-bottom: 10px;
            font-weight: 600;
          ">
            Bill To:
          </h3>
          <p style="font-weight: 600; margin: 5px 0;">${bill.customerName}</p>
          <p style="margin: 5px 0; color: #555;">Phone: ${bill.customerNumber}</p>
          <p style="margin: 5px 0; color: #555;">${bill.description}</p>
        </div>
        
        <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
          <div style="margin-bottom: 15px;">
            <p style="margin: 5px 0; font-weight: 600;">Invoice Date</p>
            <p style="margin: 5px 0; color: #555;">${new Date(bill.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
         
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px; overflow-x: auto;">
        <table style="
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        ">
          <thead>
            <tr style="
              background-color: #4CAF50;
              color: white;
              text-align: left;
            ">
              <th style="padding: 12px 15px; font-weight: 500;">ITEM</th>
              <th style="padding: 12px 15px; text-align: right; font-weight: 500;">PRICE</th>
              <th style="padding: 12px 15px; text-align: right; font-weight: 500;">QTY</th>
              <th style="padding: 12px 15px; text-align: right; font-weight: 500;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map((item, index) => `
              <tr style="
                border-bottom: 1px solid #e0e0e0;
                ${index % 2 === 0 ? 'background-color: #f9f9f9;' : ''}
              ">
                <td style="padding: 12px 15px;">${item.name}</td>
                <td style="padding: 12px 15px; text-align: right;">₹${item.price.toLocaleString()}</td>
                <td style="padding: 12px 15px; text-align: right;">${item.quantity}</td>
                <td style="padding: 12px 15px; text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div style="
        display: flex;
        justify-content: flex-end;
        margin-bottom: 30px;
      ">
        <div style="width: 300px;">
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e0e0e0;
          ">
            <span style="font-weight: 500;">Subtotal:</span>
            <span>₹${subtotal.toLocaleString()}</span>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e0e0e0;
          ">
            <span style="font-weight: 500;">Commission:</span>
            <span>₹${bill.commission.toLocaleString()}</span>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e0e0e0;
          ">
            <span style="font-weight: 500;">Tax:</span>
            <span>₹${(bill.tax || 0).toLocaleString()}</span>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #4CAF50;
            font-size: 16px;
            font-weight: 700;
          ">
            <span>Total Amount:</span>
            <span>₹${totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
        text-align: center;
        color: #777;
        font-size: 12px;
      ">
        <p style="margin: 5px 0;">Thank you for your business!</p>
        <p style="margin: 5px 0;">Please make payment within 15 days of receiving this invoice</p>
        <p style="margin: 5px 0;">
          For any queries, contact us at 
          <a href="mailto:support@dokumentguru.com" style="color: #4CAF50; text-decoration: none;">
            support@dokumentguru.com
          </a>
        </p>
        <p style="margin: 10px 0 0; font-style: italic;">
          This is computer generated invoice and does not require signature
        </p>
      </div>
    </div>
  `;

  // Options for pdf generation
  const opt = {
    margin: 10,
    filename: `Invoice-${bill.customerName}-${bill.date}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      letterRendering: true,
      useCORS: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  // Generate PDF
  html2pdf().set(opt).from(element).save();
};
    
    const printAllBills = () => {
      if (bills.length === 0) {
        alert("No bills to print!");
        return;
      }
      
      // Create a temporary element to hold the summary content
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #008000; text-align: center; font-size: 24px; margin-bottom: 5px;">Dokument Guru</h1>
          <h2 style="text-align: center; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Bills Summary</h2>
          
          ${(filters.dateFrom || filters.dateTo) ? `
            <div style="text-align: center; margin-bottom: 20px; font-size: 14px;">
              ${filters.dateFrom && filters.dateTo ? `Bills from ${filters.dateFrom} to ${filters.dateTo}` : ''}
              ${filters.dateFrom && !filters.dateTo ? `Bills from ${filters.dateFrom}` : ''}
              ${!filters.dateFrom && filters.dateTo ? `Bills until ${filters.dateTo}` : ''}
            </div>
          ` : ''}
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <thead>
              <tr style="background-color: #008000; color: white;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Customer</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Date</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Amount (₹)</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Commission (₹)</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Tax (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${bills.map(bill => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${bill.customerName}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${bill.description}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${bill.date}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${bill.amount.toLocaleString()}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${bill.commission.toLocaleString()}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${bill.tax.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-left: auto; width: 250px; font-size: 12px;">
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span>Total Earnings:</span>
                <span>₹ ${totalEarnings.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Total Commission:</span>
                <span>₹ ${totalCommission.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Total Tax:</span>
                <span>₹ ${totalTax.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    
      // Options for pdf generation
      const opt = {
        margin: 10,
        filename: 'Bills-Summary.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
    
      // Generate PDF
      html2pdf().from(element).set(opt).save();
    };
   

    return (
      <div className="min-h-screen bg-green-50 p-4 md:p-8">
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={printAllBills}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FiPrinter className="mr-2" />
            Print All
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={filters.customerName}
                onChange={handleFilterChange}
                placeholder="Enter customer name"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Number</label>
              <input
                type="text"
                name="customerNumber"
                value={filters.customerNumber}
                onChange={handleFilterChange}
                placeholder="Enter customer number"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Description</label>
              <input
                type="text"
                name="billDescription"
                value={filters.billDescription}
                onChange={handleFilterChange}
                placeholder="Enter bill description"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={applyFilters}
              className="flex items-center justify-center bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors"
            >
              <FiFilter className="mr-2" />
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center justify-center bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              <FiX className="mr-2" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800">Total Earnings</h3>
            <p className="text-2xl font-bold text-green-900">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">Total Commission</h3>
            <p className="text-2xl font-bold text-blue-900">₹{totalCommission.toLocaleString()}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
            <h3 className="text-sm font-medium text-purple-800">Total Tax</h3>
            <p className="text-2xl font-bold text-purple-900">₹{totalTax.toLocaleString()}</p>
          </div>
        </div>

        {/* Bills Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          {loading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-400 text-white">
                    <tr>
                      <th className="p-3 text-left">Sr.No</th>
                      <th className="p-3 text-left">Customer Name</th>
                      <th className="p-3 text-left">Customer Number</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Actions</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                      <th className="p-3 text-right">Commission (₹)</th>
                      <th className="p-3 text-right">Tax (₹)</th>
                      <th className="p-3 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentBills.length > 0 ? (
                      currentBills.map((bill, index) => (
                        <tr key={bill.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-3">{indexOfFirstBill + index + 1}</td>
                          <td className="p-3 font-medium text-gray-900">{bill.customerName}</td>
                          <td className="p-3 text-gray-700">{bill.customerNumber}</td>
                          <td className="p-3 text-gray-700">{bill.description}</td>
                          <td className="p-3 text-gray-700">{bill.date}</td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openPreview(bill)}
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                title="Preview"
                              >
                                <FiEye />
                              </button>
                              <button 
                                onClick={() => openEdit(bill)}
                                className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50" 
                                title="Edit"
                              >
                                <FiEdit2 />
                              </button>
                              <button 
                                onClick={() => deleteBill(bill.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50" 
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-right font-medium">{bill.amount.toLocaleString()}</td>
                          <td className="p-3 text-right">{bill.commission.toLocaleString()}</td>
                          <td className="p-3 text-right">{bill.tax.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => downloadBillPdf(bill)}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 flex items-center justify-center" 
                              title="Download PDF"
                            >
                              <FiDownloadCloud />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="p-4 text-center text-gray-500">
                          No bills found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {bills.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstBill + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastBill, bills.length)}</span> of{' '}
                      <span className="font-medium">{bills.length}</span> bills
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                      <FiChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-gray-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-400 text-white hover:bg-gray-400'}`}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Preview Items Modal */}
        {previewModal && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Bill Details - {selectedBill.description}</h3>
                  <button
                    onClick={() => setPreviewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-medium">{selectedBill.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Number</p>
                      <p className="font-medium">{selectedBill.customerNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{selectedBill.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">₹{selectedBill.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-medium mb-2">Items</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Item</th>
                          <th className="p-2 text-right">Price</th>
                          <th className="p-2 text-right">Quantity</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedBill.items.map((item, index) => (
                          <tr key={index}>
                            <td className="p-2">{item.name}</td>
                            <td className="p-2 text-right">₹{item.price.toLocaleString()}</td>
                            <td className="p-2 text-right">{item.quantity}</td>
                            <td className="p-2 text-right font-medium">₹{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setPreviewModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      downloadBillPdf(selectedBill);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FiDownloadCloud className="mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Bill Modal */}
        {editModal && editingBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Edit Bill - {editingBill.description}</h3>
                  <button
                    onClick={() => setEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={editForm.customerName}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Number</label>
                      <input
                        type="text"
                        name="customerNumber"
                        value={editForm.customerNumber}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commission (₹)</label>
                      <input
                        type="number"
                        name="commission"
                        value={editForm.commission}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax (₹)</label>
                      <input
                        type="number"
                        name="tax"
                        value={editForm.tax}
                        onChange={handleEditChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-medium mb-2">Items</h4>
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Item</th>
                          <th className="p-2 text-right">Price</th>
                          <th className="p-2 text-right">Quantity</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {editingBill.items.map((item, index) => (
                          <tr key={index}>
                            <td className="p-2">{item.name}</td>
                            <td className="p-2 text-right">₹{item.price.toLocaleString()}</td>
                            <td className="p-2 text-right">{item.quantity}</td>
                            <td className="p-2 text-right font-medium">₹{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditedBill}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default BillingUI;
