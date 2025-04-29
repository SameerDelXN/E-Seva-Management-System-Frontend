"use client"
import React, { useEffect, useRef } from 'react';
import { 
  FileSearch, 
  FormInput, 
  Upload, 
  FileCheck2 
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
//sample
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const stepsRef = useRef([]);
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "1️⃣",
      title: "Select a Service",
      description: "Browse our comprehensive range of document services and choose the one that fits your needs.",
      icon: <FileSearch className="w-12 h-12 text-green-600" />
    },
    {
      number: "2️⃣",
      title: "Fill Out the Form",
      description: "Provide necessary details accurately in our user-friendly digital form.",
      icon: <FormInput className="w-12 h-12 text-emerald-600" />
    },
    {
      number: "3️⃣",
      title: "Submit Documents",
      description: "Upload or scan your required documents securely through our platform.",
      icon: <Upload className="w-12 h-12 text-teal-600" />
    },
    {
      number: "4️⃣",
      title: "Receive Your Documents",
      description: "Get your processed, verified documents delivered digitally or physically.",
      icon: <FileCheck2 className="w-12 h-12 text-lime-600" />
    }
  ];

  useEffect(() => {
    const elements = stepsRef.current;
    
    elements.forEach((el, index) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <section  
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      id="HowItWorks"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple, transparent process to get your documents processed efficiently.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-green-200 h-full hidden md:block"></div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={el => stepsRef.current[index] = el}
                className={`
                  bg-white border border-gray-100 rounded-xl p-6 
                  flex items-center space-x-6
                  ${index % 2 === 0 ? 'md:text-right md:flex-row-reverse' : ''}
                `}
              >
                {/* Step Icon */}
                <div className="flex-shrink-0 bg-green-50 rounded-full p-4">
                  {step.icon}
                </div>

                {/* Step Content */}
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-green-600">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-3">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;