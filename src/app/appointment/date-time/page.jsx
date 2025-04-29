// 


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
    const formattedDate = formatSelectedDate(selectedDate);
    updateDateTime({ date: formattedDate, time: selectedTime });
    router.push('/appointment/personal-details');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button and avatar */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <Link href="/appointment/select-service" className="flex items-center text-gray-700 px-3 py-2 md:px-6 md:py-3 rounded-md bg-gray-100 text-sm md:text-base">
              <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </Link>
          </div>
          
          {/* Date Selection */}
          <div className="mb-8 lg:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Choose a Date</h2>
            
            <div className="mb-6">
              <p className="text-right mb-2 text-gray-500">January</p>
              <div className="overflow-x-auto">
                <div className="min-w-full grid grid-cols-8 gap-1 md:gap-2 text-center text-sm md:text-base">
                  {/* Header row */}
                  <div className="p-1 md:p-2"></div>
                  {daysOfWeek.map((day, index) => (
                    <div key={`day-header-${index}`} className={`p-1 md:p-2 font-medium ${day === 'Sa' || day === 'Su' ? 'text-blue-500' : ''}`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar rows */}
                  {calendar.map((week, weekIndex) => (
                    <React.Fragment key={`week-${weekIndex}`}>
                      {week.map((day, dayIndex) => {
                        if (dayIndex === 0) {
                          return (
                            <div key={`week-number-${weekIndex}`} className="p-1 md:p-2 bg-green-500 text-white rounded-md flex items-center justify-center">
                              {weekIndex + 1}
                            </div>
                          );
                        }
                        
                        const isSelected = selectedDate && selectedDate.weekIndex === weekIndex && selectedDate.day === day;
                        const isWeekend = dayIndex === 6 || dayIndex === 7;
                        
                        return (
                          <div
                            key={`day-${weekIndex}-${dayIndex}`}
                            className={`p-1 md:p-2 cursor-pointer ${
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
          </div>
          
          {/* Time Slot Selection */}
          <div className="mb-8 lg:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Choose a Time Slot</h2>
            
            {/* Morning Slots */}
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-medium text-yellow-500 mb-3 md:mb-4">Morning</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                {morningSlots.map((slot, index) => (
                  <button
                    key={`morning-${index}`}
                    className={`py-2 md:py-3 px-2 md:px-4 border rounded-md text-center text-sm md:text-base ${
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
              <h3 className="text-lg md:text-xl font-medium text-orange-500 mb-3 md:mb-4">Afternoon</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                {afternoonSlots.map((slot, index) => (
                  <button
                    key={`afternoon-${index}`}
                    className={`py-2 md:py-3 px-2 md:px-4 border rounded-md text-center text-sm md:text-base ${
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
              <h3 className="text-lg md:text-xl font-medium text-blue-500 mb-3 md:mb-4">Evening</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                {eveningSlots.map((slot, index) => (
                  <button
                    key={`evening-${index}`}
                    className={`py-2 md:py-3 px-2 md:px-4 border rounded-md text-center text-sm md:text-base ${
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
          <div className="flex justify-center md:justify-end">
            <button 
              onClick={handleNext}
              disabled={!selectedDate || !selectedTime}
              className={`px-8 py-2 md:px-12 md:py-3 rounded-md transition-colors ${
                selectedDate && selectedTime 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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