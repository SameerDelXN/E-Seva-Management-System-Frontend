"use client"
import React from 'react';
import { Check, X, Star } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: 0,
      period: "/year",
      description: "Essential service for starters",
      features: [
        { text: "No Doorstep Service", available: false },
        { text: "Commission is Low", available: true },
        { text: "Limited Service Access", available: true },
        { text: "Office Timing Support", available: true },
      ],
      highlight: false,
      color: "blue",
      badge: null
    },
    {
      name: "Silver",
      price: 7000,
      period: "/year",
      description: "Enhanced service for growing needs",
      features: [
        { text: "Doorstep Service", available: true },
        { text: "Commission is Moderate", available: true },
        { text: "Limited Service Access", available: true },
        { text: "24/7 Customer Support", available: true },
      ],
      highlight: false,
      color: "green",
      badge: null
    },
    {
      name: "Gold",
      price: 29000,
      period: "/year",
      description: "Premium service package",
      features: [
        { text: "Doorstep Service", available: true },
        { text: "Commission is Average", available: true },
        { text: "Unlimited Service Access", available: true },
        { text: "24/7 Customer Support", available: true },
      ],
      highlight: true,
      color: "yellow",
      badge: "Popular"
    },
    {
      name: "Platinum",
      price: 49000,
      period: "/lifetime",
      description: "Ultimate lifetime solution",
      features: [
        { text: "Doorstep Service", available: true },
        { text: "Commission is Highest", available: true },
        { text: "Unlimited Service Access", available: true },
        { text: "24/7 Customer Support", available: true },
      ],
      highlight: false,
      color: "purple",
      badge: "Best Value"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white" name="Pricing">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">Flexible Options</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-green-600">Plan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
  Select the perfect plan for your needs. Need assistance? Call us at{' '}
  <a href="tel:8605192561" className="text-green-600 font-medium hover:underline">
    8605192561
  </a>
</p>

        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`
                bg-white rounded-2xl overflow-hidden
                transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                hover:ring-2 hover:ring-green-500
                ${plan.highlight ? 'shadow-lg relative z-10' : 'shadow-md border border-gray-100'}
              `}
            >
              {/* Badge if exists */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}
              
              {/* Plan Header */}
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-center justify-center">
                  <span className="text-gray-500 text-xl">₹</span>
                  <span className="text-5xl font-bold text-gray-900 mx-1">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
              </div>
              
              {/* Feature List */}
              <div className="p-8 space-y-4 border-t border-gray-100 bg-gray-50">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center">
                    {feature.available ? (
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                    <span className={feature.available ? "text-gray-700" : "text-gray-400"}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <div className="p-8">
                <button
                  className={`
                    w-full px-6 py-3 rounded-xl font-medium text-sm tracking-wider
                    transition duration-300 shadow-sm
                    ${plan.highlight 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-white hover:bg-green-50 text-green-600 border border-green-200 hover:border-green-300'}
                  `}
                >
                  {plan.price === 0 ? "Get Started" : "Choose Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Contact or Info */}
        <div className="mt-16 text-center">
  <p className="text-gray-600">
    Need a custom plan?{' '}
    <a
      href="tel:+911231231232"
      className="text-green-600 font-medium hover:underline"
    >
      Call at +91 1231231232
    </a>
  </p>
</div>

      </div>
    </section>
  );
};

export default PricingSection;