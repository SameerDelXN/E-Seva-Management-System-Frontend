import React from 'react';
import { 
  ChevronRight, 
  Shield, 
  Globe 
} from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-600 relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute inset-0 opacity-20 blur-3xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* CTA Content */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-12 border border-white/30 shadow-2xl">
          <div className="flex flex-col items-center">
            {/* Section Heading */}
            <div className="inline-flex items-center bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Shield className="mr-2 text-white" size={20} />
              Secure & Trusted Platform
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 max-w-3xl leading-tight">
              Simplify Your Document Journey, Start Today!
            </h2>

            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Experience hassle-free document processing with Infognite. Your one-stop solution for all legal documentation needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="#get-started"
                className="
                  w-full sm:w-auto 
                  bg-white text-green-600 
                  px-8 py-4 rounded-lg 
                  hover:bg-green-50 
                  transition-all 
                  flex items-center justify-center
                  font-semibold
                  shadow-lg hover:shadow-xl
                "
              >
                Get Started Now
                <ChevronRight className="ml-2" size={20} />
              </a>
              <a 
                href="#services"
                className="
                  w-full sm:w-auto 
                  bg-transparent 
                  border border-white/50 text-white 
                  px-8 py-4 rounded-lg 
                  hover:bg-white/10 
                  transition-all 
                  flex items-center justify-center
                  font-semibold
                "
              >
                <Globe className="mr-2" size={20} />
                Explore Services
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center space-x-6 opacity-70">
              <div className="flex items-center space-x-2">
                <Shield className="text-white" size={24} />
                <span className="text-white text-sm">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="text-white" size={24} />
                <span className="text-white text-sm">Government Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;