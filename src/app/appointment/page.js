"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BookAppointmentIntro() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header with decorative element */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-white"></div>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Book Your Session
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-green-100 text-lg"
            >
              Get expert guidance for your document needs
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How it works</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-4">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <p className="text-gray-600">Select the type of service you need</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <p className="text-gray-600">Choose your preferred date and time</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-4">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <p className="text-gray-600">Provide your contact information</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-4">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <p className="text-gray-600">Review and confirm your appointment</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <h3 className="text-lg font-medium text-gray-700 mb-4">Ready to get started?</h3>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/appointment/select-service" 
                  className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg text-center shadow-md transition-all duration-300"
                >
                  Book Now
                </Link>
              </motion.div>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Takes less than 2 minutes
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-emerald-200 opacity-40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-10 right-10 w-16 h-16 rounded-full bg-green-200 opacity-40"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
    </div>
  );
}