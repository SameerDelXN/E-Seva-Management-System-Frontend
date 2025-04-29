'use client';
import React, { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointmentData, setAppointmentData] = useState({
    category: null,
    service: null,
    date: null,
    time: null,
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      address: ''
    }
  });

  const updateCategory = (category) => {
    setAppointmentData(prev => ({
      ...prev,
      category
    }));
  };

  const updateService = (service) => {
    setAppointmentData(prev => ({
      ...prev,
      service
    }));
  };

  const updateDateTime = (date, time) => {
    setAppointmentData(prev => ({
      ...prev,
      date,
      time
    }));
  };

  const updatePersonalDetails = (details) => {
    setAppointmentData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        ...details
      }
    }));
  };

  const resetAppointment = () => {
    setAppointmentData({
      category: null,
      service: null,
      date: null,
      time: null,
      personalDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        address: ''
      }
    });
  };

  return (
    <AppointmentContext.Provider 
      value={{
        appointmentData,
        updateCategory,
        updateService,
        updateDateTime,
        updatePersonalDetails,
        resetAppointment
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
