"use client"
import React from 'react';
import { AppointmentProvider } from '@/context/AppointmentContext';

const AppointmentLayout = ({ children }) => {
  return (
    <AppointmentProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
     </AppointmentProvider>
  );
};

export default AppointmentLayout; 