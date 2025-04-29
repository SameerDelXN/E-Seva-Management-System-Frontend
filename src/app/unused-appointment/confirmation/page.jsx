"use client"
import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const ConfirmationPage = () => {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank you for Your Booking
          </h1>
        </div>

        <Link href="/">
          <button className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage; 