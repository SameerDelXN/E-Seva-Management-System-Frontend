"use client";
import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAppointment } from '@/context/AppointmentContext';

const PersonalDetailsPage = () => {
  const router = useRouter();

  const { appointmentData, updatePersonalDetails } = useAppointment();

  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   phone: '',
  //   city: '',
  //   address: '',
  // });

  const [formData, setFormData] = useState(appointmentData.personalDetails);

  useEffect(() => {
    setFormData(appointmentData.personalDetails); // Keep in sync if navigating back
  }, [appointmentData.personalDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.city.trim() &&
      formData.address.trim()
    );
  };

  // const handleNext = () => {
  //   if (isFormValid()) {
  //       updatePersonalDetails(formData); // Uncomment when using context
  //     router.push('/appointment/steps/summary');
  //   }
  // };

  const handleNext = () => {
    if (isFormValid()) {
      updatePersonalDetails(formData); // 🧠 Update context state
      router.push('/appointment/steps/summary');
      // console.log(appointmentData);

    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 max-w-md bg-white p-8 border-r border-gray-100 shadow-sm">
        <div className="mb-16">
          <h1 className="text-3xl font-bold">DOKUMENT <span className="text-green-400">GURU</span></h1>
          <div className="border-t border-gray-200 mt-2"></div>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start">
            <div className="relative mr-4">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 h-16 w-0.5 bg-green-500"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Step 1</p>
              <h3 className="font-medium">Select Service</h3>
              <p className="text-green-500 text-sm">completed</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start">
            <div className="relative mr-4">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 h-16 w-0.5 bg-green-500"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Step 2</p>
              <h3 className="font-medium">Date & Time</h3>
              <p className="text-green-500 text-sm">completed</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start">
            <div className="relative mr-4">
              <div className="h-12 w-12 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 h-16 w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Step 3</p>
              <h3 className="font-medium">Personal Details</h3>
              <p className="text-green-500 text-sm">In Progress</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start">
            <div className="relative mr-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Step 4</p>
              <h3 className="font-medium">Summary</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/appointment/steps/date-time" className="inline-flex items-center mb-8 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <h1 className="text-3xl font-bold mb-8">Personal Details</h1>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-500 mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-500 mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-500 mb-2">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-500 mb-2">Your Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className={`px-8 py-3 rounded-lg transition-colors ${
                  isFormValid()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isFormValid()}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsPage;
