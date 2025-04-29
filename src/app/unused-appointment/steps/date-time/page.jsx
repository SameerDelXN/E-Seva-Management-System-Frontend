"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
 import { useAppointment } from '@/context/AppointmentContext';

const DateTimeSelection = () => {
  const router = useRouter();
   const { updateDateTime, appointmentData } = useAppointment();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  // Generate calendar data
  const generateCalendarData = () => {
    // This is a simplified version - in a real app, you would use a proper date library
    return [
      [null, 30, 31, 1, 2, 3, 4, 5],
      [null, 6, 7, 8, 9, 10, 11, 12],
      [null, 13, 14, 15, 16, 17, 18, 19],
      [null, 20, 21, 22, 23, 24, 25, 26],
      [null, 27, 28, 29, 30, 31, 1, 2],
      [null, 3, 4, 5, 6, 7, 8, 9]
    ];
  };

  const calendar = generateCalendarData();

  const morningSlots = [
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true }
  ];

  const afternoonSlots = [
    { time: '12:00 PM', available: true },
    { time: '01:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true }
  ];

  const eveningSlots = [
    { time: '05:00 PM', available: true },
    { time: '06:00 PM', available: true },
    { time: '07:00 PM', available: true },
    { time: '08:00 PM', available: true },
    { time: '09:00 PM', available: true }
  ];

  const handleDateSelect = (weekIndex, day) => {
    setSelectedDate({ weekIndex, day });
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  const formatSelectedDate = ({ weekIndex, day }) => {
    if (!day) return '';
  
    // Assuming current month/year (can be improved later)
    const currentMonth = 0; // 0 = January
    const currentYear = 2025;
  
    const dateObj = new Date(currentYear, currentMonth, day);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return dateObj.toLocaleDateString('en-GB', options); // e.g., "22 Jan 2025"
  };
  
  const handleNext = () => {
    const formattedDate = formatSelectedDate(selectedDate); // new
    updateDateTime({ date: formattedDate, time: selectedTime });
    router.push('/appointment/steps/personal-details');
  };
  
  // const handleNext = () => {
  //      updateDateTime({ date: selectedDate, time: selectedTime });
  //     router.push('/appointment/steps/personal-details');
  // };

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
          {/* Step 1 - Completed */}
          <div className="flex items-start mb-8 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Step 1</p>
              <h3 className="text-xl font-medium">Select Service</h3>
              <p className="text-sm text-green-500">completed</p>
            </div>
            <div className="absolute top-12 left-6 w-px h-24 bg-gray-200"></div>
          </div>
          
          {/* Step 2 - In Progress */}
          <div className="flex items-start mb-8 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-green-500 bg-white flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Step 2</p>
              <h3 className="text-xl font-medium">Date & Time</h3>
              <p className="text-sm text-blue-400">In Progress</p>
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
          {/* Header with back button and avatar */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/appointment/steps/select-service" className="flex items-center text-gray-700 px-6 py-3 rounded-md bg-gray-100">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </Link>
            <div className="w-10 h-10 overflow-hidden rounded-md">
              <img src="/api/placeholder/40/40" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Date Selection */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-8">Choose a Date</h2>
            
            <div className="mb-6">
              <p className="text-right mb-2 text-gray-500">January</p>
              <div className="grid grid-cols-8 gap-2 text-center">
                {/* Header row */}
                <div className="p-2"></div>
                {daysOfWeek.map((day, index) => (
                  <div key={`day-header-${index}`} className={`p-2 font-medium ${day === 'Sa' || day === 'Su' ? 'text-blue-500' : ''}`}>
                    {day}
                  </div>
                ))}
                
                {/* Calendar rows */}
                {calendar.map((week, weekIndex) => (
                  <React.Fragment key={`week-${weekIndex}`}>
                    {week.map((day, dayIndex) => {
                      if (dayIndex === 0) {
                        return (
                          <div key={`week-number-${weekIndex}`} className="p-2 bg-green-500 text-white rounded-md flex items-center justify-center">
                            {weekIndex + 1}
                          </div>
                        );
                      }
                      
                      const isSelected = selectedDate && selectedDate.weekIndex === weekIndex && selectedDate.day === day;
                      const isWeekend = dayIndex === 6 || dayIndex === 7;
                      
                      return (
                        <div
                          key={`day-${weekIndex}-${dayIndex}`}
                          className={`p-2 cursor-pointer ${
                            isSelected
                              ? 'text-white bg-blue-500'
                              : isWeekend
                              ? 'text-blue-500'
                              : ''
                          }`}
                          onClick={() => handleDateSelect(weekIndex, day)}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          
          {/* Time Slot Selection */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-8">Choose a Time Slot</h2>
            
            {/* Morning Slots */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-yellow-500 mb-4">Morning</h3>
              <div className="grid grid-cols-5 gap-4">
                {morningSlots.map((slot, index) => (
                  <button
                    key={`morning-${index}`}
                    className={`py-3 px-4 border rounded-md text-center ${
                      selectedTime === slot.time ? 'border-green-500 text-green-500' : ''
                    }`}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Afternoon Slots */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-orange-500 mb-4">Afternoon</h3>
              <div className="grid grid-cols-5 gap-4">
                {afternoonSlots.map((slot, index) => (
                  <button
                    key={`afternoon-${index}`}
                    className={`py-3 px-4 border rounded-md text-center ${
                      selectedTime === slot.time ? 'border-green-500 text-green-500' : ''
                    }`}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Evening Slots */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-blue-500 mb-4">Evening</h3>
              <div className="grid grid-cols-5 gap-4">
                {eveningSlots.map((slot, index) => (
                  <button
                    key={`evening-${index}`}
                    className={`py-3 px-4 border rounded-md text-center ${
                      selectedTime === slot.time ? 'border-green-500 text-green-500' : ''
                    }`}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Next button */}
          <div className="flex justify-end">
            <button 
              onClick={handleNext}
              className="bg-blue-500 text-white px-12 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;

