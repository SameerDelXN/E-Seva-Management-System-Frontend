"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What documents can be processed through your service?",
      answer: "We offer processing services for a wide range of documents including legal papers, government certificates, business registration documents, personal identification documents, educational certificates, property documents, and many more. Contact our customer support for specific document inquiries."
    },
    {
      question: "How long does the document processing typically take?",
      answer: "Processing times vary based on the document type and the plan you choose. Basic processing can take 3-5 business days, while our premium services offer expedited processing in as little as 24 hours. The exact timeline will be provided when you submit your request."
    },
    {
      question: "Is my data secure with your services?",
      answer: "Absolutely. We implement industry-leading security measures including end-to-end encryption, secure data centers, and strict access controls. We are compliant with all relevant data protection regulations and never share your information with third parties without consent."
    },
    {
      question: "Can I track the status of my document processing?",
      answer: "Yes, all customers receive access to our tracking portal where you can monitor your document's progress in real-time. You'll also receive email and SMS updates at key stages of the processing journey."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards, net banking, UPI, and various digital wallets. For enterprise customers, we also offer invoice-based payment options with credit terms."
    },
    {
      question: "Do you offer refunds if I'm not satisfied?",
      answer: "We have a satisfaction guarantee policy. If our service doesn't meet the promised standards, we offer a full refund within 7 days of service completion. Certain conditions apply based on the nature of the document processing."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" name="FAQ">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about our document services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`
                border rounded-lg overflow-hidden transition-all duration-300
                ${openIndex === index 
                  ? 'border-green-300 shadow-md bg-green-50' 
                  : 'border-gray-200 bg-white'}
              `}
            >
              <button
                className="w-full flex justify-between items-center p-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className={`
                  font-semibold text-lg 
                  ${openIndex === index ? 'text-green-700' : 'text-gray-800'}
                `}>
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <div 
                className={`
                  px-4 overflow-hidden transition-all duration-300 ease-in-out
                  ${openIndex === index ? 'pb-4 max-h-96' : 'max-h-0'}
                `}
              >
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for?
          </p>
          <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=infognite2@gmail.com&su=Support%20Request&body=Hello%2C%20I%20need%20assistance%20with%20your%20services."
  target="_blank"
  rel="noopener noreferrer"
  className="
    bg-gradient-to-r from-green-500 to-emerald-600 
    text-white px-8 py-3 rounded-lg 
    hover:from-green-600 hover:to-emerald-700 
    transition-all shadow-md hover:shadow-lg
    inline-flex items-center
  "
>
  Email Us
</a>


        </div>
      </div>
    </section>
  );
};

export default FAQSection;