"use client"
import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      position: "Small Business Owner",
      review: "DokumentGuru transformed my document processing. What used to take weeks now takes just hours. Incredibly efficient and reliable!",
      rating: 5,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXnsiObBEA0LnJHpO-nMoeau3_TeWILh7t6A&s"
    },
    {
      name: "Priya Sharma",
      position: "Freelance Consultant",
      review: "The online process is so smooth and user-friendly. I was able to get my documents verified quickly without any hassle.",
      rating: 4,
      image: "https://igimage.indiaglitz.com/telugu/gallery/actress/mrunalthakur/mrunal29122024p.jpg"
    },
    {
      name: "Amit Patel",
      position: "Corporate Professional",
      review: "Government-approved services with top-notch security. DokumentGuru has become my go-to platform for all legal document needs.",
      rating: 5,
      image: "https://source.boomplaymusic.com/buzzgroup1/M00/35/64/rBEeLGLFWs-ATBLoAAJA2iDwLWE854.jpg"
    },
    {
      name: "Sneha Reddy",
      position: "Entrepreneur",
      review: "Quick, secure, and absolutely professional. Their digital archive feature is a game-changer for document management.",
      rating: 4,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwVw7S7gyU4rfv-J8xmdTO3_6haovAjMiQ5Q&s"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`
          w-5 h-5 
          ${i < rating ? 'text-yellow-400' : 'text-gray-300'}
        `}
        fill={i < rating ? '#fbbf24' : 'none'}
      />
    ));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br h-screen from-green-50 via-emerald-50 to-green-100 relative overflow-hidden">
      {/* Blurred Background Shapes */}
      <div className="absolute inset-0 opacity-50 blur-3xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied customers who have experienced seamless document processing.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`
                absolute top-0 left-0 w-full transition-all duration-700 ease-in-out
                ${activeIndex === index 
                  ? 'opacity-100 translate-x-0 z-20' 
                  : 'opacity-0 translate-x-full -z-10'}
              `}
            >
              <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-2xl p-8 shadow-xl relative">
                {/* Quote Icon */}
                <Quote className="absolute top-4 left-4 text-green-200 w-12 h-12" />

                {/* Testimonial Content */}
                <div className="text-center">
                  <p className="text-xl text-gray-800 italic mb-6 relative z-10">
                    "{testimonial.review}"
                  </p>

                  {/* User Profile */}
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-green-500 object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mt-4">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-12 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${activeIndex === index ? 'bg-green-600 w-8' : 'bg-green-200'}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;