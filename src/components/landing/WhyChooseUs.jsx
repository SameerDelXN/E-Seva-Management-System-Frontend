import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  CheckCircle 
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Globe className="w-16 h-16 text-green-600" />,
      title: "100% Online Process",
      description: "Complete your document requirements from anywhere, anytime with our fully digital platform.",
      color: "green"
    },
    {
      icon: <ShieldCheck className="w-16 h-16 text-emerald-600" />,
      title: "Government-Approved Services",
      description: "Certified and validated services that meet all official government standards and regulations.",
      color: "emerald"
    },
    {
      icon: <Zap className="w-16 h-16 text-teal-600" />,
      title: "Quick & Secure Processing",
      description: "Rapid document processing with state-of-the-art security measures to protect your information.",
      color: "teal"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="WhyChooseUs">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Trust DokumentGuru?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing seamless, secure, and efficient document solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`
                bg-gray-50 border border-gray-100 rounded-xl p-6 
                text-center transition-all duration-300
                hover:bg-white hover:shadow-xl hover:border-${feature.color}-100
                group
              `}
            >
              <div className="mb-6 flex justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 
                  group-hover:text-green-600 transition-colors">
                  <CheckCircle className="inline-block mr-2 text-green-500" size={24} />
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;