"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppointment } from '@/context/AppointmentContext';
import { format, addMonths, isAfter, isSameDay, startOfToday } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const DateTimeSelection = () => {
  const router = useRouter();
  const { updateDateTime, appointmentData } = useAppointment();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [month, setMonth] = useState(new Date());
  
  const today = startOfToday();

  // Disable past dates
  const disabledDays = { before: today };

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

  const handleDateSelect = (day) => {
    setSelectedDate(day);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  
  const formatSelectedDate = (date) => {
    if (!date) return '';
    return format(date, 'd MMM yyyy'); // e.g., "22 Jan 2025"
  };
  
  const handleNext = () => {
    const formattedDate = formatSelectedDate(selectedDate);
    updateDateTime({ date: formattedDate, time: selectedTime });
    router.push('/appointment/personal-details');
  };

  // Custom CSS styles for the calendar
  const calendarStyles = {
    '--rdp-accent-color': '#3b82f6', // blue-500
    '--rdp-background-color': '#eff6ff', // blue-50
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
              <div className="flex justify-center">
                <div style={calendarStyles}>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    month={month}
                    onMonthChange={setMonth}
                    showOutsideDays
                    className="border rounded-lg p-4 bg-white shadow-sm"
                    modifiersClassNames={{
                      selected: 'bg-blue-500 text-white rounded-full',
                      today: 'border border-blue-500 rounded-full',
                      disabled: 'text-gray-300 cursor-not-allowed'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Slot Selection */}
          <div className="mb-8 lg:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Choose a Time Slot</h2>
            
            {selectedDate ? (
              <>
                {/* Morning Slots */}
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-medium text-yellow-500 mb-3 md:mb-4">Morning</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                    {morningSlots.map((slot, index) => (
                      <button
                        key={`morning-${index}`}
                        className={`py-2 md:py-3 px-2 md:px-4 border rounded-md text-center text-sm md:text-base transition-colors ${
                          selectedTime === slot.time 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'hover:bg-gray-50'
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
                        className={`py-2 md:py-3 px-2 md:px-4 border rounded-md text-center text-sm md:text-base transition-colors ${
                          selectedTime === slot.time 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'hover:bg-gray-50'
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
                        className={`py-2 md:py-3 px-2 md:px-4 border rounded-md text-center text-sm md:text-base transition-colors ${
                          selectedTime === slot.time 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleTimeSelect(slot.time)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-600">Please select a date first</p>
              </div>
            )}
          </div>
          
          {/* Selected date and time display */}
          {selectedDate && selectedTime && (
            <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-green-700 font-medium">
                You selected: {formatSelectedDate(selectedDate)} at {selectedTime}
              </p>
            </div>
          )}
          
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