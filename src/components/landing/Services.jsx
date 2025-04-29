import React from 'react';
import { 
  FileText, 
  Landmark, 
  Clock, 
  ShieldCheck, 
  Scroll, 
  Database,
  ChevronRight
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <FileText className="w-12 h-12 text-green-600" />,
      title: "Document Preparation",
      description: "Expertly crafted legal documents tailored to your specific needs.",
      color: "green"
    },
    {
      icon: <Landmark className="w-12 h-12 text-emerald-600" />,
      title: "Government Attestation",
      description: "Seamless government certification and document verification.",
      color: "emerald"
    },
    {
      icon: <Clock className="w-12 h-12 text-teal-600" />,
      title: "Quick Processing",
      description: "Rapid document processing with minimal turnaround time.",
      color: "teal"
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-lime-600" />,
      title: "Secure Verification",
      description: "Advanced security measures to protect your sensitive information.",
      color: "lime"
    },
    {
      icon: <Scroll className="w-12 h-12 text-green-500" />,
      title: "Digital Archives",
      description: "Comprehensive digital storage and easy document retrieval.",
      color: "green"
    },
    {
      icon: <Database className="w-12 h-12 text-emerald-500" />,
      title: "Data Management",
      description: "Intelligent document organization and management solutions.",
      color: "emerald"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" name="Services" >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Services We Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive document solutions designed to simplify your legal and administrative processes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`
                bg-white border border-gray-100 rounded-xl p-6 
                transform transition-all duration-300 
                hover:-translate-y-2 hover:shadow-xl 
                hover:border-${service.color}-100 
                group
              `}
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 
                group-hover:text-green-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-green-600 
                  hover:text-green-800 font-medium 
                  transition-colors group/link"
              >
                
                {/* <ChevronRight 
                  className="ml-2 transform transition-transform group-hover/link:translate-x-1" 
                  size={20} 
                /> */}
              </a>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {/* <div className="text-center mt-12">
          <a 
            href="#services"
            className="
              bg-gradient-to-r from-green-500 to-emerald-600 
              text-white px-8 py-3 rounded-lg 
              hover:from-green-600 hover:to-emerald-700 
              transition-all shadow-md hover:shadow-lg
              inline-flex items-center
            "
          >
            View All Services
            <ChevronRight className="ml-2" size={20} />
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default ServicesSection;