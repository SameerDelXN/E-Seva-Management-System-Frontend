"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppointment } from '@/context/AppointmentContext';

const SelectService = () => {
  const router = useRouter();
  const { updateService, updateCategory, appointmentData } = useAppointment();

  const categories = [
    { id: 1, name: 'E Seva Kendra' },
    { id: 2, name: 'RTO Services' },
    { id: 3, name: 'CA Services' },
    { id: 4, name: 'Legal Services' },
    { id: 5, name: 'Banking Services' },
    { id: 6, name: 'Online Form' },
    { id: 7, name: 'Quick Services' },
    { id: 8, name: 'Maha E-Seva' },
    { id: 9, name: 'Membership' },
    { id: 10, name: 'ABHIMEX' },
  ];

  // Services for each category
  const allServices = {
    1: [
      { id: 101, name: 'Aadhaar Services', price: '100 Rs.', duration: '30 mins', icon: '/images/aadhaar.svg' },
      { id: 102, name: 'PAN Card Services', price: '150 Rs.', duration: '45 mins', icon: '/images/pan.svg' },
      { id: 103, name: 'Voter ID Services', price: '100 Rs.', duration: '30 mins', icon: '/images/voter.svg' }
    ],
    2: [
      { id: 201, name: 'Driving License', price: '500 Rs.', duration: '1 Hour', icon: '/images/license.svg' },
      { id: 202, name: 'Vehicle Registration', price: '300 Rs.', duration: '1.5 Hours', icon: '/images/vehicle.svg' }
    ],
    3: [
      { id: 301, name: 'Tax Filing', price: '1000 Rs.', duration: '2 Hours', icon: '/images/tax.svg' },
      { id: 302, name: 'GST Registration', price: '800 Rs.', duration: '1.5 Hours', icon: '/images/gst.svg' },
      { id: 303, name: 'Audit Services', price: '1500 Rs.', duration: '3 Hours', icon: '/images/audit.svg' }
    ],
    4: [
      { id: 401, name: 'Legal Consultation', price: '1500 Rs.', duration: '1 Hour', icon: '/images/legal.svg' },
      { id: 402, name: 'Document Notarization', price: '500 Rs.', duration: '30 mins', icon: '/images/notary.svg' }
    ],
    5: [
      { id: 501, name: 'Account Opening', price: '0 Rs.', duration: '1 Hour', icon: '/images/account.svg' },
      { id: 502, name: 'Loan Application', price: '200 Rs.', duration: '1.5 Hours', icon: '/images/loan.svg' }
    ],
    6: [
      { id: 601, name: 'Passport Application', price: '200 Rs.', duration: '1 Hour', icon: '/images/passport.svg' },
      { id: 602, name: 'Visa Application', price: '300 Rs.', duration: '1.5 Hours', icon: '/images/visa.svg' }
    ],
    7: [
      { id: 701, name: 'Document Printing', price: '50 Rs.', duration: '15 mins', icon: '/images/print.svg' },
      { id: 702, name: 'Photocopy Services', price: '10 Rs.', duration: '10 mins', icon: '/images/copy.svg' }
    ],
    8: [
      { id: 801, name: 'Property Tax Payment', price: '50 Rs.', duration: '30 mins', icon: '/images/property.svg' },
      { id: 802, name: 'Utility Bill Payment', price: '30 Rs.', duration: '20 mins', icon: '/images/bill.svg' }
    ],
    9: [
      { id: 901, name: 'New Membership', price: '500 Rs.', duration: '30 mins', icon: '/images/membership.svg' },
      { id: 902, name: 'Membership Renewal', price: '400 Rs.', duration: '20 mins', icon: '/images/renewal.svg' }
    ],
    10: [
      { id: 1001, name: 'Export Documentation', price: '1200 Rs.', duration: '2 Hours', icon: '/images/export.svg' },
      { id: 1002, name: 'Import Certification', price: '1500 Rs.', duration: '2.5 Hours', icon: '/images/import.svg' }
    ]
  };

  const handleCategorySelect = (category) => {
    updateCategory(category);
    updateService(null); // Reset service when category changes
  };

  const handleServiceSelect = (service) => {
    updateService(service);
  };

  const handleNext = () => {
    if (!appointmentData.service) {
      alert("Please select a service");
      return;
    }
    router.push('/appointment/steps/date-time');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="w-1/3 bg-white p-12 relative">
        <div className="mb-16">
          <h1 className="text-4xl font-bold">
            <span className="text-black">DOKUMENT</span>{' '}
            <span className="text-green-400">GURU</span>
          </h1>
          <div className="mt-2 w-64 h-px bg-gray-200"></div>
        </div>
        
        {/* Progress steps */}
        <div className="relative">
          {/* Step 1 */}
          <div className="flex items-start mb-8 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Step 1</p>
              <h3 className="text-xl font-medium">Select Service</h3>
              <p className="text-sm text-blue-400">In Progress</p>
            </div>
            <div className="absolute top-12 left-6 w-px h-24 bg-gray-200"></div>
          </div>
          
          {/* Step 2 */}
          <div className="flex items-start mb-8 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Step 2</p>
              <h3 className="text-xl font-medium text-gray-400">Date & Time</h3>
            </div>
            <div className="absolute top-12 left-6 w-px h-24 bg-gray-200"></div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-start mb-8 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Step 3</p>
              <h3 className="text-xl font-medium text-gray-400">Personal Details</h3>
            </div>
            <div className="absolute top-12 left-6 w-px h-24 bg-gray-200"></div>
          </div>
          
          {/* Step 4 */}
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Step 4</p>
              <h3 className="text-xl font-medium text-gray-400">Summary</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="w-2/3 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-10">
            <Link href="/" className="flex items-center text-gray-700 px-6 py-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </Link>
          </div>
          
          {/* Show categories or services based on selection */}
          {!appointmentData.category ? (
            <>
              <h2 className="text-3xl font-bold mb-8">Select Category</h2>
              
              {/* Category options - first row */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="border rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            
              {/* Category options - second row */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                {categories.slice(5, 10).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="border rounded-md px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Back to categories button */}
              <button 
                onClick={() => updateCategory(null)}
                className="flex items-center text-gray-700 mb-6 hover:text-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Categories
              </button>
              
              <h2 className="text-3xl font-bold mb-8">Services for {appointmentData.category.name}</h2>
              
              {/* Services for selected category */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {allServices[appointmentData.category.id]?.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`border rounded-lg p-6 relative cursor-pointer transition-all hover:shadow-md ${
                      appointmentData.service?.id === service.id
                        ? 'border-green-500 bg-green-50'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 flex items-center justify-center">
                        <Image 
                          src={service.icon} 
                          alt={service.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className={`text-xl font-medium mb-3 ${
                        appointmentData.service?.id === service.id ? 'text-green-600' : 'text-gray-800'
                      }`}>
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">Duration: {service.duration}</p>
                    </div>
                    <div className="absolute top-4 left-4">
                      {appointmentData.service?.id === service.id ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                        {service.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Next button */}
              <div className="flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!appointmentData.service}
                  className={`px-12 py-3 rounded-md transition-colors ${
                    appointmentData.service
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectService;