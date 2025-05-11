'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

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

  // Function to check if a specific step is complete
  const isStepComplete = useCallback((step) => {
    switch (step) {
      case 'select-service':
        return !!appointmentData.service;
      case 'date-time':
        return !!appointmentData.date && !!appointmentData.time;
      case 'details':
        return (
          appointmentData.personalDetails.firstName &&
          appointmentData.personalDetails.lastName &&
          appointmentData.personalDetails.email &&
          appointmentData.personalDetails.phone
        );
      default:
        return false;
    }
  }, [appointmentData]);

  // Function to validate if a step can be accessed
  const canAccessStep = useCallback((step) => {
    const stepOrder = ['select-service', 'date-time', 'details', 'summary'];
    const currentStepIndex = stepOrder.indexOf(step);
    
    // All steps before the current one must be completed
    for (let i = 0; i < currentStepIndex; i++) {
      if (!isStepComplete(stepOrder[i])) {
        return false;
      }
    }
    return true;
  }, [isStepComplete]);

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
        isStepComplete,
        canAccessStep,
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