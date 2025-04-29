// "use client"
// import React from 'react';
// import { useState } from 'react';
// import Link from 'next/link';
// import { Edit } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useAppointment } from '@/context/AppointmentContext';
// // import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';

// const SummaryPage = () => {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { appointmentData } = useAppointment();

//   if (
//     !appointmentData ||
//     !appointmentData.personalDetails ||
//     !appointmentData.date ||
//     !appointmentData.service ||
//     !appointmentData.category
//   ) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         <p>Loading appointment summary...</p>
//       </div>
//     );
//   }

// console.log(appointmentData);
//   // This would typically come from your app's state management
//   const appointmentDetails = {
//     fullName: `${appointmentData.personalDetails.firstName} ${appointmentData.personalDetails.lastName}`,
//     email: appointmentData.personalDetails.email,
//     phone: appointmentData.personalDetails.phone,
//     city:appointmentData.personalDetails.city,
//     address: appointmentData.personalDetails.address,
//     appointmentDate: appointmentData.date.date || "loading",
//     timeSlot: appointmentData.date.time,
//     duration:appointmentData.service.duration,
//     serviceGroup:appointmentData.category.name,
//     serviceName: appointmentData.service.name,
//     price: appointmentData.service.price
//   };

//   // const handleSubmit=async()=>{
//   //   try{
//   //     const res = await fetch('https://dokument-guru-backend.vercel.app/api/admin/appointments/add-appointment', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(appointmentDetails),
//   //     });

//   //     if (!res.ok) {
//   //       throw new Error('Failed to submit appointment');
//   //     }
    
//   //     alert("done appointment");
//   //     router.push('/appointment/confirmation');

//   //   }
//   //   catch(error){
//   //     console.error('Error submitting appointment:', error);
//   //     alert('There was a problem submitting your appointment. Please try again.');
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (isSubmitting) return;
  
//     setIsSubmitting(true);
  
//     try {
//       const res = await fetch('https://dokument-guru-backend.vercel.app/api/admin/appointments/add-appointment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(appointmentDetails),
//       });
  
//       if (!res.ok) {
//         throw new Error('Failed to submit appointment');
//       }
  
   
//       router.push('/appointment/confirmation');
//     } catch (error) {
//       console.error('Error submitting appointment:', error);
//       alert('There was a problem submitting your appointment. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     } 
//   };
  
//   const SummaryItem = ({ label, value, editable = false, editLink = '' }) => (
//     <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
//       <span className="text-gray-600">{label}</span>
//       <div className="flex items-center">
//         <span className="font-medium">{value}</span>
//         {editable && (
//           <Link href={editLink}>
//             <Edit className="w-4 h-4 ml-2 text-blue-500 cursor-pointer" />
//           </Link>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto py-8 px-4">
//         <div className="flex items-center mb-8">
//           <Link href="/appointment/personal-details" className="text-gray-600 hover:text-gray-800">
//             <span className="flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//               </svg>
//               Back
//             </span>
//           </Link>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <h1 className="text-2xl font-semibold mb-6">Summary</h1>
          
//           <div className="space-y-4">
//             <SummaryItem 
//               label="Full Name" 
//               value={appointmentDetails.fullName} 
//               editable={true}
//               editLink="/appointment/personal-details"
//             />
//             <SummaryItem 
//               label="Email Address" 
//               value={appointmentDetails.email} 
//               editable={true}
//               editLink="/appointment/personal-details"
//             />
//             <SummaryItem 
//               label="Phone Number" 
//               value={appointmentDetails.phone} 
//               editable={true}
//               editLink="/appointment/personal-details"
//             />
//              <SummaryItem 
//               label="City" 
//               value={appointmentDetails.city} 
//               editable={true}
//               editLink="/appointment/personal-details"
//             />
//             <SummaryItem 
//               label="Address" 
//               value={appointmentDetails.address} 
//               editable={true}
//               editLink="/appointment/personal-details"
//             />
//             <SummaryItem 
//               label="Selected Date" 
//               value={appointmentDetails.appointmentDate} 
//               editable={true}
//               editLink="/appointment/date-time"
//             />
//             <SummaryItem 
//               label="Selected Time Slot" 
//               value={appointmentDetails.timeSlot} 
//               editable={true}
//               editLink="/appointment/date-time"
//             />
//             <SummaryItem 
//               label="Selected Duration" 
//               value={appointmentDetails.duration} 
//               editable={true}
//               editLink="/appointment/date-time"
//             />
//             <SummaryItem 
//               label="Selected category" 
//               value={appointmentDetails.serviceGroup} 
//               editable={true}
//               editLink="/appointment/select-service"
//             />
//             <SummaryItem 
//               label="Selected Service" 
//               value={appointmentDetails.serviceName} 
//               editable={true}
//               editLink="/appointment/select-service"
//             />
//             <SummaryItem 
//               label="Total Charges" 
//               value={appointmentDetails.price} 
//             />
//           </div>
//         </div>

//         <div className="flex justify-end">
//           {/* <Link href="/appointment/confirmation"> */}
//           <button
//   onClick={handleSubmit}
//   className={`px-6 py-2 rounded-lg text-white transition-colors ${
//     isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
//   }`}
//   disabled={isSubmitting}
// >
//   {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
// </button>

//           {/* </Link> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SummaryPage; 



"use client"
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppointment } from '@/context/AppointmentContext';

const SummaryPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { appointmentData } = useAppointment();

  if (
    !appointmentData ||
    !appointmentData.personalDetails ||
    !appointmentData.date ||
    !appointmentData.service ||
    !appointmentData.category
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Loading appointment summary...</p>
      </div>
    );
  }

  const appointmentDetails = {
    fullName: `${appointmentData.personalDetails.firstName} ${appointmentData.personalDetails.lastName}`,
    email: appointmentData.personalDetails.email,
    phone: appointmentData.personalDetails.phone,
    city: appointmentData.personalDetails.city,
    address: appointmentData.personalDetails.address,
    appointmentDate: appointmentData.date.date || "loading",
    timeSlot: appointmentData.date.time,
    duration: appointmentData.service.duration,
    serviceGroup: appointmentData.category.name,
    serviceName: appointmentData.service.name,
    price: appointmentData.service.price
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
  
    setIsSubmitting(true);
  
    try {
      const res = await fetch('https://dokument-guru-backend.vercel.app/api/admin/appointments/add-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentDetails),
      });
  
      if (!res.ok) {
        throw new Error('Failed to submit appointment');
      }
  
      router.push('/appointment/confirmation');
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('There was a problem submitting your appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    } 
  };
  
  const SummaryItem = ({ label, value, editable = false, editLink = '' }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 mb-1 sm:mb-0">{label}</span>
      <div className="flex items-center">
        <span className="font-medium text-right sm:text-left">{value}</span>
        {editable && (
          <Link href={editLink} className="ml-2">
            <Edit className="w-4 h-4 text-blue-500 cursor-pointer" />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6 sm:mb-8">
          <Link href="/appointment/personal-details" className="text-gray-600 hover:text-gray-800">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Summary</h1>
          
          <div className="space-y-3 sm:space-y-4">
            <SummaryItem 
              label="Full Name" 
              value={appointmentDetails.fullName} 
              editable={true}
              editLink="/appointment/personal-details"
            />
            <SummaryItem 
              label="Email Address" 
              value={appointmentDetails.email} 
              editable={true}
              editLink="/appointment/personal-details"
            />
            <SummaryItem 
              label="Phone Number" 
              value={appointmentDetails.phone} 
              editable={true}
              editLink="/appointment/personal-details"
            />
            <SummaryItem 
              label="City" 
              value={appointmentDetails.city} 
              editable={true}
              editLink="/appointment/personal-details"
            />
            <SummaryItem 
              label="Address" 
              value={appointmentDetails.address} 
              editable={true}
              editLink="/appointment/personal-details"
            />
            <SummaryItem 
              label="Selected Date" 
              value={appointmentDetails.appointmentDate} 
              editable={true}
              editLink="/appointment/date-time"
            />
            <SummaryItem 
              label="Selected Time Slot" 
              value={appointmentDetails.timeSlot} 
              editable={true}
              editLink="/appointment/date-time"
            />
            <SummaryItem 
              label="Selected Duration" 
              value={appointmentDetails.duration} 
              editable={true}
              editLink="/appointment/date-time"
            />
            <SummaryItem 
              label="Selected category" 
              value={appointmentDetails.serviceGroup} 
              editable={true}
              editLink="/appointment/select-service"
            />
            <SummaryItem 
              label="Selected Service" 
              value={appointmentDetails.serviceName} 
              editable={true}
              editLink="/appointment/select-service"
            />
            <SummaryItem 
              label="Total Charges" 
              value={appointmentDetails.price} 
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className={`px-4 sm:px-6 py-2 rounded-lg text-white transition-colors ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;