"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiPrinter, FiDownload, FiSave } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import LoadingSpinner from '@/components/Loading';

const BillingSystem = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [items, setItems] = useState([
    { id: Date.now(), name: '', basePrice: 0, commission: 0, tax: 0, quantity: 1 }
  ]);
  const [savedBills, setSavedBills] = useState([]);
  const [isPrintView, setIsPrintView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const invoiceRef = useRef();

  // Generate a random invoice number on component mount
  useEffect(() => {
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  const addItem = () => {
    setItems([...items, { 
      id: Date.now(), 
      name: '', 
      basePrice: 0, 
      commission: 0, 
      tax: 0, 
      quantity: 1 
    }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    
    // Validate item fields
    validateItemField(id, field, value);
  };

  // Validation helper functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobileNumber = (number) => {
    // Indian mobile number format: 10 digits starting with 6-9
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const isValidPincode = (pincode) => {
    // Indian pincode format: 6 digits
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };

  const isValidGSTIN = (gstin) => {
    // GSTIN format: 15 characters (2 state code + 10 PAN + 1 entity number + 1 check digit + 1 Z)
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const isValidPrice = (price) => {
    // Price should be a positive number with at most 2 decimal places
    return !isNaN(price) && price > 0 && /^\d+(\.\d{0,2})?$/.test(price.toString());
  };

  const validateItemField = (id, field, value) => {
    const newErrors = { ...errors };
    
    if (!newErrors.items) {
      newErrors.items = {};
    }
    
    if (!newErrors.items[id]) {
      newErrors.items[id] = {};
    }
    
    // Clear the error for this field
    newErrors.items[id][field] = '';
    
    // Validate based on field type
    if (field === 'name' && !value.trim()) {
      newErrors.items[id][field] = 'Item name is required';
    } else if (field === 'basePrice') {
      if (isNaN(value) || value < 0) {
        newErrors.items[id][field] = 'Base price must be a positive number';
      } else if (!isValidPrice(value)) {
        newErrors.items[id][field] = 'Base price must have at most 2 decimal places';
      }
    } else if (field === 'commission') {
      if (isNaN(value) || value < 0) {
        newErrors.items[id][field] = 'Commission must be a positive number';
      } else if (!isValidPrice(value)) {
        newErrors.items[id][field] = 'Commission must have at most 2 decimal places';
      }
    } else if (field === 'tax' && (isNaN(value) || value < 0 || value > 100)) {
      newErrors.items[id][field] = 'Tax must be between 0 and 100';
    } else if (field === 'quantity' && (isNaN(value) || value < 1)) {
      newErrors.items[id][field] = 'Quantity must be at least 1';
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate customer name
    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
      isValid = false;
    } else if (customerName.trim().length < 3) {
      newErrors.customerName = 'Customer name must be at least 3 characters';
      isValid = false;
    }
    
    // Validate customer number (mobile)
    if (!customerNumber.trim()) {
      newErrors.customerNumber = 'Mobile number is required';
      isValid = false;
    } else if (!isValidMobileNumber(customerNumber.trim())) {
      newErrors.customerNumber = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }
    
    // Validate customer email if provided
    if (customerEmail.trim() && !isValidEmail(customerEmail.trim())) {
      newErrors.customerEmail = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate items
    newErrors.items = {};
    items.forEach(item => {
      newErrors.items[item.id] = {};
      
      if (!item.name.trim()) {
        newErrors.items[item.id].name = 'Item name is required';
        isValid = false;
      }
      
      if (isNaN(item.basePrice) || item.basePrice < 0) {
        newErrors.items[item.id].basePrice = 'Base price must be a positive number';
        isValid = false;
      } else if (!isValidPrice(item.basePrice)) {
        newErrors.items[item.id].basePrice = 'Base price must have at most 2 decimal places';
        isValid = false;
      }
      
      if (isNaN(item.commission) || item.commission < 0) {
        newErrors.items[item.id].commission = 'Commission must be a positive number';
        isValid = false;
      } else if (!isValidPrice(item.commission)) {
        newErrors.items[item.id].commission = 'Commission must have at most 2 decimal places';
        isValid = false;
      }
      
      if (isNaN(item.tax) || item.tax < 0 || item.tax > 100) {
        newErrors.items[item.id].tax = 'Tax must be between 0 and 100';
        isValid = false;
      }
      
      if (isNaN(item.quantity) || item.quantity < 1) {
        newErrors.items[item.id].quantity = 'Quantity must be at least 1';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate the field that lost focus
    if (field === 'customerName') {
      if (!customerName.trim()) {
        setErrors({ ...errors, customerName: 'Customer name is required' });
      } else if (customerName.trim().length < 3) {
        setErrors({ ...errors, customerName: 'Customer name must be at least 3 characters' });
      } else {
        setErrors({ ...errors, customerName: '' });
      }
    } else if (field === 'customerNumber') {
      if (!customerNumber.trim()) {
        setErrors({ ...errors, customerNumber: 'Mobile number is required' });
      } else if (!isValidMobileNumber(customerNumber.trim())) {
        setErrors({ ...errors, customerNumber: 'Please enter a valid 10-digit mobile number' });
      } else {
        setErrors({ ...errors, customerNumber: '' });
      }
    } else if (field === 'customerEmail') {
      if (customerEmail.trim() && !isValidEmail(customerEmail.trim())) {
        setErrors({ ...errors, customerEmail: 'Please enter a valid email address' });
      } else {
        setErrors({ ...errors, customerEmail: '' });
      }
    }
  };

  const handleItemBlur = (id, field, value) => {
    if (!touched.items) {
      setTouched({ ...touched, items: {} });
    }
    
    if (!touched.items[id]) {
      setTouched({ ...touched, items: { ...touched.items, [id]: {} } });
    }
    
    setTouched({
      ...touched,
      items: {
        ...touched.items,
        [id]: { ...touched.items[id], [field]: true }
      }
    });
    
    validateItemField(id, field, value);
  };

  const calculateSubtotal = (item) => {
    return item.basePrice * item.quantity;
  };

  const calculateItemTotal = (item) => {
    const subtotal = calculateSubtotal(item);
    const taxAmount = subtotal * (item.tax / 100);
    return subtotal + taxAmount;
  };

  const calculateGrandTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateTotalCommission = () => {
    return items.reduce((total, item) => total + (item.commission * item.quantity), 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((total, item) => {
      const subtotal = calculateSubtotal(item);
      return total + (subtotal * (item.tax / 100));
    }, 0);
  };

  const handleGenerateBill = async () => {
    // Validate form before submission
    if (!validateForm()) {
      // Mark all fields as touched to show all errors
      setTouched({
        customerName: true,
        customerNumber: true,
        customerEmail: true,
        items: items.reduce((acc, item) => {
          acc[item.id] = {
            name: true,
            basePrice: true,
            commission: true,
            tax: true,
            quantity: true
          };
          return acc;
        }, {})
      });
      
      alert('Please fix the validation errors before generating the bill.');
      return;
    }
    
    const billData = {
      invoiceNumber,
      date,
      customerName,
      customerNumber,
      customerEmail,
      customerAddress,
      description,
      items: items.map(item => ({
        ...item,
        subtotal: calculateSubtotal(item),
        total: calculateItemTotal(item)
      })),
      grandTotal: calculateGrandTotal(),
      totalCommission: calculateTotalCommission(),
      totalTax: calculateTotalTax()
    };
  
    setIsLoading(true);
    try {
      // Send data to your backend API
      const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/Bills/create-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(billData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // console.log('✅ Bill saved to database:', result);
        setSavedBills([...savedBills, billData]);
        resetForm();
        // Optionally generate and download PDF
        // await downloadBillAsPDF();
  
        alert('✅ Bill generated, saved, and downloaded successfully!');
      } else {
        console.error('❌ Failed to save bill:', result.message);
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      alert('❌ Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadBillAsPDF = async () => {
    if (!invoiceRef.current) return;
    
    setIsLoading(true);
    // Temporarily show print view for better PDF formatting
    setIsPrintView(true);
    
    // Wait for the state to update and DOM to render
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPrintView(false);
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    setIsPrintView(true);
    setTimeout(() => {
      window.print();
      setIsPrintView(false);
    }, 500);
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerNumber('');
    setCustomerEmail('');
    setCustomerAddress('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    setItems([{ id: Date.now(), name: '', basePrice: 0, commission: 0, tax: 0, quantity: 1 }]);
    setErrors({});
    setTouched({});
  };

  return (
    <div className={`container mx-auto p-4 ${isPrintView ? 'print:p-0' : ''}`} ref={invoiceRef}>
      {isLoading && <LoadingSpinner loadingText="Processing your request..." description="Please wait while we generate your bill" />}
      
      {!isPrintView && (
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Invoice Generator</h1>
      )}
      
      <div className={`bg-white rounded-lg shadow-md p-6 ${isPrintView ? 'shadow-none' : ''}`}>
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Invoice #{invoiceNumber}</h2>
            <p className="text-gray-600">Date: {date}</p>
          </div>
          {!isPrintView && (
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={handlePrint}
                className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                <FiPrinter className="mr-2" /> Print
              </button>
              <button
                onClick={resetForm}
                className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                <FiSave className="mr-2" /> New Invoice
              </button>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="mb-6 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  touched.customerName && errors.customerName 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onBlur={() => handleBlur('customerName')}
                required
              />
              {touched.customerName && errors.customerName && (
                <p className="mt-1 text-sm font-medium text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customerName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  touched.customerNumber && errors.customerNumber 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                onBlur={() => handleBlur('customerNumber')}
                placeholder="10-digit mobile number"
                maxLength="10"
                required
              />
              {touched.customerNumber && errors.customerNumber && (
                <p className="mt-1 text-sm font-medium text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customerNumber}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional notes or description..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Items</h2>
            <button
              onClick={addItem}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <FiPlus className="mr-2" /> Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-8">
                <LoadingSpinner loadingText="Loading items..." />
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border text-left">Item Name <span className="text-red-500 font-bold">*</span></th>
                    <th className="py-3 px-4 border text-left">Base Price (₹) <span className="text-red-500 font-bold">*</span></th>
                    <th className="py-3 px-4 border text-left">Commission (₹) <span className="text-red-500 font-bold">*</span></th>
                    <th className="py-3 px-4 border text-left">Tax (%) <span className="text-red-500 font-bold">*</span></th>
                    <th className="py-3 px-4 border text-left">Qty <span className="text-red-500 font-bold">*</span></th>
                    <th className="py-3 px-4 border text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border">
                        <div>
                          <input
                            type="text"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              touched.items?.[item.id]?.name && errors.items?.[item.id]?.name 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                            }`}
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            onBlur={() => handleItemBlur(item.id, 'name', item.name)}
                            placeholder="Item name"
                          />
                          {touched.items?.[item.id]?.name && errors.items?.[item.id]?.name && (
                            <p className="mt-1 text-xs font-medium text-red-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.items[item.id].name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 border">
                        <div>
                          <input
                            type="number"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              touched.items?.[item.id]?.basePrice && errors.items?.[item.id]?.basePrice 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                            }`}
                            value={item.basePrice}
                            onChange={(e) => updateItem(item.id, 'basePrice', parseFloat(e.target.value) || 0)}
                            onBlur={() => handleItemBlur(item.id, 'basePrice', item.basePrice)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                          {touched.items?.[item.id]?.basePrice && errors.items?.[item.id]?.basePrice && (
                            <p className="mt-1 text-xs font-medium text-red-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.items[item.id].basePrice}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 border">
                        <div>
                          <input
                            type="number"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              touched.items?.[item.id]?.commission && errors.items?.[item.id]?.commission 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                            }`}
                            value={item.commission}
                            onChange={(e) => updateItem(item.id, 'commission', parseFloat(e.target.value) || 0)}
                            onBlur={() => handleItemBlur(item.id, 'commission', item.commission)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                          {touched.items?.[item.id]?.commission && errors.items?.[item.id]?.commission && (
                            <p className="mt-1 text-xs font-medium text-red-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.items[item.id].commission}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 border">
                        <div>
                          <input
                            type="number"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              touched.items?.[item.id]?.tax && errors.items?.[item.id]?.tax 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                            }`}
                            value={item.tax}
                            onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                            onBlur={() => handleItemBlur(item.id, 'tax', item.tax)}
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0.0"
                          />
                          {touched.items?.[item.id]?.tax && errors.items?.[item.id]?.tax && (
                            <p className="mt-1 text-xs font-medium text-red-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.items[item.id].tax}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 border">
                        <div>
                          <input
                            type="number"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              touched.items?.[item.id]?.quantity && errors.items?.[item.id]?.quantity 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                            }`}
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            onBlur={() => handleItemBlur(item.id, 'quantity', item.quantity)}
                            min="1"
                            placeholder="1"
                          />
                          {touched.items?.[item.id]?.quantity && errors.items?.[item.id]?.quantity && (
                            <p className="mt-1 text-xs font-medium text-red-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.items[item.id].quantity}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 border text-center">
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                            title="Remove item"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Subtotal</h3>
              <p className="text-2xl font-semibold">₹{calculateGrandTotal().toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Commission</h3>
              <p className="text-2xl font-semibold">₹{calculateTotalCommission().toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Tax</h3>
              <p className="text-2xl font-semibold">₹{calculateTotalTax().toFixed(2)}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Grand Total</h3>
              <p className="text-3xl font-bold text-green-600">₹{calculateGrandTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isPrintView && (
          <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Reset
            </button>
            <button
              onClick={handleGenerateBill}
              disabled={isLoading}
              className={`flex items-center px-6 py-3 rounded-lg text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner loadingText="Generating..." />
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Generate Bill
                </>
              )}
            </button>
          </div>
        )}

        {/* Invoice Footer */}
        {isPrintView && (
          <div className="mt-12 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-2">For any queries, please contact us at support@company.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingSystem;