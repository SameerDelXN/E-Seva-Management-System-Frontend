// "use client";
// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useAppointment } from '@/context/AppointmentContext';

// const SelectServicePage = () => {
//   const router = useRouter();
//   const { updateService, updateCategory, appointmentData } = useAppointment();

//   const categories = [
//     { id: 1, name: 'E Seva Kendra' },
//     { id: 2, name: 'RTO Services' },
//     { id: 3, name: 'CA Services' },
//     { id: 4, name: 'Legal Services' },
//     { id: 5, name: 'Banking Services' },
//     { id: 6, name: 'Online Form' },
//     { id: 7, name: 'Quick Services' },
//     { id: 8, name: 'Maha E-Seva' },
//     { id: 9, name: 'Membership' },
//     { id: 10, name: 'ABHIMEX' },
//   ];

//   // Services for each category
//   const allServices = {
//     1: [
//       { id: 101, name: 'Aadhaar Services', price: '100 Rs.', duration: '30 mins', icon: '/images/aadhaar.svg' },
//       { id: 102, name: 'PAN Card Services', price: '150 Rs.', duration: '45 mins', icon: '/images/pan.svg' },
//       { id: 103, name: 'Voter ID Services', price: '100 Rs.', duration: '30 mins', icon: '/images/voter.svg' }
//     ],
//     2: [
//       { id: 201, name: 'Driving License', price: '500 Rs.', duration: '1 Hour', icon: '/images/license.svg' },
//       { id: 202, name: 'Vehicle Registration', price: '300 Rs.', duration: '1.5 Hours', icon: '/images/vehicle.svg' }
//     ],
//     3: [
//       { id: 301, name: 'Tax Filing', price: '1000 Rs.', duration: '2 Hours', icon: '/images/tax.svg' },
//       { id: 302, name: 'GST Registration', price: '800 Rs.', duration: '1.5 Hours', icon: '/images/gst.svg' },
//       { id: 303, name: 'Audit Services', price: '1500 Rs.', duration: '3 Hours', icon: '/images/audit.svg' }
//     ],
//     4: [
//       { id: 401, name: 'Legal Consultation', price: '1500 Rs.', duration: '1 Hour', icon: '/images/legal.svg' },
//       { id: 402, name: 'Document Notarization', price: '500 Rs.', duration: '30 mins', icon: '/images/notary.svg' }
//     ],
//     5: [
//       { id: 501, name: 'Account Opening', price: '0 Rs.', duration: '1 Hour', icon: '/images/account.svg' },
//       { id: 502, name: 'Loan Application', price: '200 Rs.', duration: '1.5 Hours', icon: '/images/loan.svg' }
//     ],
//     6: [
//       { id: 601, name: 'Passport Application', price: '200 Rs.', duration: '1 Hour', icon: '/images/passport.svg' },
//       { id: 602, name: 'Visa Application', price: '300 Rs.', duration: '1.5 Hours', icon: '/images/visa.svg' }
//     ],
//     7: [
//       { id: 701, name: 'Document Printing', price: '50 Rs.', duration: '15 mins', icon: '/images/print.svg' },
//       { id: 702, name: 'Photocopy Services', price: '10 Rs.', duration: '10 mins', icon: '/images/copy.svg' }
//     ],
//     8: [
//       { id: 801, name: 'Property Tax Payment', price: '50 Rs.', duration: '30 mins', icon: '/images/property.svg' },
//       { id: 802, name: 'Utility Bill Payment', price: '30 Rs.', duration: '20 mins', icon: '/images/bill.svg' }
//     ],
//     9: [
//       { id: 901, name: 'New Membership', price: '500 Rs.', duration: '30 mins', icon: '/images/membership.svg' },
//       { id: 902, name: 'Membership Renewal', price: '400 Rs.', duration: '20 mins', icon: '/images/renewal.svg' }
//     ],
//     10: [
//       { id: 1001, name: 'Export Documentation', price: '1200 Rs.', duration: '2 Hours', icon: '/images/export.svg' },
//       { id: 1002, name: 'Import Certification', price: '1500 Rs.', duration: '2.5 Hours', icon: '/images/import.svg' }
//     ]
//   };

//   const handleCategorySelect = (category) => {
//     updateCategory(category);
//     updateService(null);
//   };

//   const handleServiceSelect = (service) => {
//     updateService(service);
//   };

//   const handleNext = () => {
//     if (!appointmentData.service) {
//       alert("Please select a service");
//       return;
//     }
//     router.push('/demo-appointment/date-time');
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Back button */}
//       <div className="mb-10">
//         <Link href="/" className="flex items-center text-gray-700 px-6 py-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//           </svg>
//           Back
//         </Link>
//       </div>
      
//       {/* Show categories or services based on selection */}
//       {!appointmentData.category ? (
//         <>
//           <h2 className="text-3xl font-bold mb-8">Select Category</h2>
          
//           <div className="grid grid-cols-5 gap-4 mb-4">
//             {categories.slice(0, 5).map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => handleCategorySelect(category)}
//                 className="border rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>
        
//           <div className="grid grid-cols-5 gap-4 mb-8">
//             {categories.slice(5, 10).map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => handleCategorySelect(category)}
//                 className="border rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </>
//       ) : (
//         <>
//           <button 
//             onClick={() => updateCategory(null)}
//             className="flex items-center text-gray-700 mb-6 hover:text-blue-500 transition-colors"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//             </svg>
//             Back to Categories
//           </button>
          
//           <h2 className="text-3xl font-bold mb-8">Services for {appointmentData.category.name}</h2>
          
//           <div className="grid grid-cols-2 gap-6 mb-8">
//             {allServices[appointmentData.category.id]?.map((service) => (
//               <ServiceCard 
//                 key={service.id}
//                 service={service}
//                 isSelected={appointmentData.service?.id === service.id}
//                 onSelect={() => handleServiceSelect(service)}
//               />
//             ))}
//           </div>
          
//           <div className="flex justify-end">
//             <button 
//               onClick={handleNext}
//               disabled={!appointmentData.service}
//               className={`px-12 py-3 rounded-md transition-colors ${
//                 appointmentData.service
//                   ? 'bg-blue-500 text-white hover:bg-blue-600'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const ServiceCard = ({ service, isSelected, onSelect }) => (
//   <div
//     onClick={onSelect}
//     className={`border rounded-lg p-6 relative cursor-pointer transition-all hover:shadow-md ${
//       isSelected ? 'border-green-500 bg-green-50' : 'hover:border-gray-300'
//     }`}
//   >
//     <div className="flex justify-center mb-4">
//       <div className="w-20 h-20 flex items-center justify-center">
//         <Image 
//           src={service.icon} 
//           alt={service.name}
//           width={48}
//           height={48}
//           className="object-contain"
//         />
//       </div>
//     </div>
//     <div className="text-center">
//       <h4 className={`text-xl font-medium mb-3 ${
//         isSelected ? 'text-green-600' : 'text-gray-800'
//       }`}>
//         {service.name}
//       </h4>
//       <p className="text-sm text-gray-500 mb-2">Duration: {service.duration}</p>
//     </div>
//     <div className="absolute top-4 left-4">
//       {isSelected ? (
//         <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
//           <div className="w-4 h-4 rounded-full bg-white"></div>
//         </div>
//       ) : (
//         <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
//       )}
//     </div>
//     <div className="absolute bottom-4 right-4">
//       <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
//         {service.price}
//       </span>
//     </div>
//   </div>
// );

// export default SelectServicePage;




// "use client"
// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useAppointment } from '@/context/AppointmentContext';

// const SelectService = () => {
//   const router = useRouter();
//   const { updateService, updateCategory, appointmentData } = useAppointment();

//   const categories = [
//     { id: 1, name: 'E Seva Kendra' },
//     { id: 2, name: 'RTO Services' },
//     { id: 3, name: 'CA Services' },
//     { id: 4, name: 'Legal Services' },
//     { id: 5, name: 'Banking Services' },
//     { id: 6, name: 'Online Form' },
//     { id: 7, name: 'Quick Services' },
//     { id: 8, name: 'Maha E-Seva' },
//     { id: 9, name: 'Membership' },
//     { id: 10, name: 'ABHIMEX' },
//   ];

//   // Services for each category
//   const allServices = {
//     1: [
//       { id: 101, name: 'Aadhaar Services', price: '100 Rs.', duration: '30 mins', icon: '/images/aadhaar.svg' },
//       { id: 102, name: 'PAN Card Services', price: '150 Rs.', duration: '45 mins', icon: '/images/pan.svg' },
//       { id: 103, name: 'Voter ID Services', price: '100 Rs.', duration: '30 mins', icon: '/images/voter.svg' }
//     ],
//     2: [
//       { id: 201, name: 'Driving License', price: '500 Rs.', duration: '1 Hour', icon: '/images/license.svg' },
//       { id: 202, name: 'Vehicle Registration', price: '300 Rs.', duration: '1.5 Hours', icon: '/images/vehicle.svg' }
//     ],
//     3: [
//       { id: 301, name: 'Tax Filing', price: '1000 Rs.', duration: '2 Hours', icon: '/images/tax.svg' },
//       { id: 302, name: 'GST Registration', price: '800 Rs.', duration: '1.5 Hours', icon: '/images/gst.svg' },
//       { id: 303, name: 'Audit Services', price: '1500 Rs.', duration: '3 Hours', icon: '/images/audit.svg' }
//     ],
//     4: [
//       { id: 401, name: 'Legal Consultation', price: '1500 Rs.', duration: '1 Hour', icon: '/images/legal.svg' },
//       { id: 402, name: 'Document Notarization', price: '500 Rs.', duration: '30 mins', icon: '/images/notary.svg' }
//     ],
//     5: [
//       { id: 501, name: 'Account Opening', price: '0 Rs.', duration: '1 Hour', icon: '/images/account.svg' },
//       { id: 502, name: 'Loan Application', price: '200 Rs.', duration: '1.5 Hours', icon: '/images/loan.svg' }
//     ],
//     6: [
//       { id: 601, name: 'Passport Application', price: '200 Rs.', duration: '1 Hour', icon: '/images/passport.svg' },
//       { id: 602, name: 'Visa Application', price: '300 Rs.', duration: '1.5 Hours', icon: '/images/visa.svg' }
//     ],
//     7: [
//       { id: 701, name: 'Document Printing', price: '50 Rs.', duration: '15 mins', icon: '/images/print.svg' },
//       { id: 702, name: 'Photocopy Services', price: '10 Rs.', duration: '10 mins', icon: '/images/copy.svg' }
//     ],
//     8: [
//       { id: 801, name: 'Property Tax Payment', price: '50 Rs.', duration: '30 mins', icon: '/images/property.svg' },
//       { id: 802, name: 'Utility Bill Payment', price: '30 Rs.', duration: '20 mins', icon: '/images/bill.svg' }
//     ],
//     9: [
//       { id: 901, name: 'New Membership', price: '500 Rs.', duration: '30 mins', icon: '/images/membership.svg' },
//       { id: 902, name: 'Membership Renewal', price: '400 Rs.', duration: '20 mins', icon: '/images/renewal.svg' }
//     ],
//     10: [
//       { id: 1001, name: 'Export Documentation', price: '1200 Rs.', duration: '2 Hours', icon: '/images/export.svg' },
//       { id: 1002, name: 'Import Certification', price: '1500 Rs.', duration: '2.5 Hours', icon: '/images/import.svg' }
//     ]
//   };

//   const handleCategorySelect = (category) => {
//     updateCategory(category);
//     updateService(null); // Reset service when category changes
//   };

//   const handleServiceSelect = (service) => {
//     updateService(service);
//   };

//   const handleNext = () => {
//     if (!appointmentData.service) {
//       alert("Please select a service");
//       return;
//     }
//     router.push('/demo-appointment/date-time');
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Left sidebar */}
    
      
//       {/* Main content */}
//       <div className="w-full p-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Back button */}
          
          
//           {/* Show categories or services based on selection */}
//           {!appointmentData.category ? (
//             <>
//               <h2 className="text-3xl font-bold mb-8">Select Category</h2>
              
//               {/* Category options - first row */}
//               <div className="grid grid-cols-5 gap-4 mb-4">
//                 {categories.slice(0, 5).map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => handleCategorySelect(category)}
//                     className="border rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
//                   >
//                     {category.name}
//                   </button>
//                 ))}
//               </div>
            
//               {/* Category options - second row */}
//               <div className="grid grid-cols-5 gap-4 mb-8">
//                 {categories.slice(5, 10).map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => handleCategorySelect(category)}
//                     className="border rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
//                   >
//                     {category.name}
//                   </button>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Back to categories button */}
//               <button 
//                 onClick={() => updateCategory(null)}
//                 className="flex items-center text-gray-700 mb-6 hover:text-blue-500 transition-colors"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//                 </svg>
//                 Back to Categories
//               </button>
              
//               <h2 className="text-3xl font-bold mb-8">Services for {appointmentData.category.name}</h2>
              
//               {/* Services for selected category */}
//               <div className="grid grid-cols-2 gap-6 mb-8">
//                 {allServices[appointmentData.category.id]?.map((service) => (
//                   <div
//                     key={service.id}
//                     onClick={() => handleServiceSelect(service)}
//                     className={`border rounded-lg p-6 relative cursor-pointer transition-all hover:shadow-md ${
//                       appointmentData.service?.id === service.id
//                         ? 'border-green-500 bg-green-50'
//                         : 'hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex justify-center mb-4">
//                       <div className="w-20 h-20 flex items-center justify-center">
//                         <Image 
//                           src={service.icon} 
//                           alt={service.name}
//                           width={48}
//                           height={48}
//                           className="object-contain"
//                         />
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <h4 className={`text-xl font-medium mb-3 ${
//                         appointmentData.service?.id === service.id ? 'text-green-600' : 'text-gray-800'
//                       }`}>
//                         {service.name}
//                       </h4>
//                       <p className="text-sm text-gray-500 mb-2">Duration: {service.duration}</p>
//                     </div>
//                     <div className="absolute top-4 left-4">
//                       {appointmentData.service?.id === service.id ? (
//                         <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
//                           <div className="w-4 h-4 rounded-full bg-white"></div>
//                         </div>
//                       ) : (
//                         <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
//                       )}
//                     </div>
//                     <div className="absolute bottom-4 right-4">
//                       <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
//                         {service.price}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               {/* Next button */}
//               <div className="flex justify-end">
//                 <button 
//                   onClick={handleNext}
//                   disabled={!appointmentData.service}
//                   className={`px-12 py-3 rounded-md transition-colors ${
//                     appointmentData.service
//                       ? 'bg-blue-500 text-white hover:bg-blue-600'
//                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectService;



"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointment } from '@/context/AppointmentContext';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Clock, Check
} from 'lucide-react';

const SelectService = () => {
  const router = useRouter();
  const { updateService, updateCategory, appointmentData } = useAppointment();
  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServiceGroup, setSelectedServiceGroup] = useState(null);

  useEffect(() => {
    const fetchServiceGroups = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dokument-guru-backend.vercel.app/api/admin/serviceGroup/getAll-Groups');
        
        if (!response.ok) {
          throw new Error('Failed to fetch service groups');
        }
        
        const data = await response.json();
        setServiceGroups(data.serviceGroups || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service groups:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceGroups();
  }, []);

  const handleServiceGroupSelect = (serviceGroup) => {
    setSelectedServiceGroup(serviceGroup);
    updateCategory({
      id: serviceGroup._id,
      name: serviceGroup.name,
      icon: getServiceGroupIcon(serviceGroup.name)
    });
  };

  const handleServiceSelect = (service) => {
    updateService({
      id: service.serviceId,
      name: service.name,
      price: `${service.price} Rs.`,
      duration: '30 mins', // You might want to add duration to your API data
      documents: service.documentNames
    });
  };

  const handleBack = () => {
    setSelectedServiceGroup(null);
    updateCategory(null);
    updateService(null);
  };

  const handleNext = () => {
    if (!appointmentData.service) {
      alert("Please select a service");
      return;
    }
    router.push('/appointment/date-time');
  };

  // Function to get icon based on service group name
  const getServiceGroupIcon = (name) => {
    // This is a placeholder. You should import and use your actual icons
    // based on the service group names
    return <div className="w-5 h-5 md:w-6 md:h-6 text-emerald-600"></div>;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 items-center justify-center">
        <div className="text-emerald-600 text-lg font-medium">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 items-center justify-center">
        <div className="text-red-600 text-lg font-medium">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Main content */}
      <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500"
            >
              Select Your Service
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-gray-600"
            >
              Choose from our wide range of document services
            </motion.p>
          </div>

          {/* Category/Service Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-emerald-100"
          >
            {!selectedServiceGroup ? (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Service Categories</h2>
                
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                  {serviceGroups.map((serviceGroup, index) => (
                    <motion.div
                      key={serviceGroup._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => handleServiceGroupSelect(serviceGroup)}
                        className="w-full h-full bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex flex-col items-center group shadow-sm hover:shadow-md"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-2 sm:mb-3 flex items-center justify-center bg-white rounded-full p-2 sm:p-3 shadow-sm group-hover:shadow-md transition-all">
                          {serviceGroup.image ? (
                            <img 
                              src={serviceGroup.image} 
                              alt={serviceGroup.name} 
                              className="w-full h-full object-contain rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 md:w-6 md:h-6 text-emerald-600"></div>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-emerald-700 transition-colors">
                          {serviceGroup.name}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center mb-4 sm:mb-6">
                  <motion.button 
                    onClick={handleBack}
                    className="flex items-center text-sm sm:text-base text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                    whileHover={{ x: -3 }}
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    Back to Categories
                  </motion.button>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  {selectedServiceGroup.image && (
                    <img 
                      src={selectedServiceGroup.image} 
                      alt={selectedServiceGroup.name} 
                      className="w-8 h-8 mr-2 rounded-full object-cover hidden sm:inline-block"
                    />
                  )}
                  <span className="ml-0 sm:ml-2">{selectedServiceGroup.name} Services</span>
                </h2>
                
                {selectedServiceGroup.services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {selectedServiceGroup.services.map((service, index) => (
                      <ServiceCard 
                        key={service.serviceId}
                        service={service}
                        isSelected={appointmentData.service?.id === service.serviceId}
                        onSelect={() => handleServiceSelect(service)}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No services available in this category.</p>
                  </div>
                )}
                
                {selectedServiceGroup.services.length > 0 && (
                  <div className="mt-6 sm:mt-8 flex justify-end">
                    <motion.button 
                      onClick={handleNext}
                      disabled={!appointmentData.service}
                      whileHover={appointmentData.service ? { scale: 1.03 } : {}}
                      whileTap={appointmentData.service ? { scale: 0.97 } : {}}
                      className={`px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-base sm:text-lg font-medium flex items-center transition-all ${
                        appointmentData.service
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continue to Date & Time
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, isSelected, onSelect, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 * index }}
    onClick={onSelect}
    whileHover={{ y: -5 }}
    className={`relative cursor-pointer rounded-lg sm:rounded-xl border-2 p-4 sm:p-6 transition-all ${
      isSelected 
        ? 'border-emerald-500 bg-emerald-50 shadow-md' 
        : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
    }`}
  >
    <div className="flex flex-col h-full">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-white rounded-full p-2 sm:p-3 shadow-sm ${
          isSelected ? 'ring-2 sm:ring-4 ring-emerald-200' : ''
        }`}>
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold">
            {service.name.charAt(0)}
          </div>
        </div>
      </div>
      
      <div className="text-center flex-grow">
        <h4 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${
          isSelected ? 'text-emerald-700' : 'text-gray-800'
        }`}>
          {service.name}
        </h4>
        {service.documentNames && service.documentNames.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Required Documents:</p>
            <div className="flex flex-wrap justify-center gap-1">
              {service.documentNames.map((doc, idx) => (
                <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex items-center justify-center">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
          30 mins
        </p>
      </div>
      
      <div className="mt-auto flex justify-center">
        <span className={`inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
          isSelected 
            ? 'bg-emerald-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {service.price} Rs.
        </span>
      </div>
    </div>
    
    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors ${
        isSelected 
          ? 'bg-emerald-500 ring-1 sm:ring-2 ring-emerald-200' 
          : 'border-2 border-gray-300'
      }`}>
        {isSelected && (
          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        )}
      </div>
    </div>
  </motion.div>
);

export default SelectService;