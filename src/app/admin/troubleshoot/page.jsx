"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const TroubleshootPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    category: 'general'
  });
  const router = useRouter();

  const categories = [
    { id: 'general', name: 'General Issues', icon: 'ℹ️' },
    { id: 'upload', name: 'Upload Problems', icon: '📤' },
    { id: 'conversion', name: 'Document Conversion', icon: '🔄' },
    { id: 'account', name: 'Account Issues', icon: '👤' },
    { id: 'billing', name: 'Billing & Payments', icon: '💳' },
  ];

  const faqs = {
    general: [
      {
        id: 1,
        question: 'Why is DocumentGuru not loading properly?',
        answer: 'This could be due to browser cache issues or slow internet connection. Try clearing your browser cache or switching to a different browser. Also check your internet connection speed.',
        related: [3, 7] // Related question IDs
      },
      {
        id: 2,
        question: 'How do I contact DocumentGuru support?',
        answer: 'You can reach our support team by clicking the "Contact Support" button at the bottom of this page or by emailing support@documentguru.com. We typically respond within 24 hours.',
        related: []
      },
    ],
    upload: [
      {
        id: 3,
        question: 'Why won\'t my document upload?',
        answer: 'Ensure your document is under 50MB and in a supported format (PDF, DOCX, PPTX, XLSX). If the issue persists, try refreshing the page or uploading from a different device.',
        related: [1, 4]
      },
      {
        id: 4,
        question: 'What file formats does DocumentGuru support?',
        answer: 'We support PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, and RTF files. For images, we support JPG, PNG, and GIF for conversion to PDF.',
        related: [5, 6]
      },
    ],
    conversion: [
      {
        id: 5,
        question: 'Why is my document conversion taking so long?',
        answer: 'Conversion time depends on file size and server load. Large files (over 20MB) may take several minutes. If conversion fails, try splitting your document into smaller parts.',
        related: [4, 6]
      },
      {
        id: 6,
        question: 'The converted document looks different from the original. What can I do?',
        answer: 'Complex formatting may not convert perfectly. Try simplifying the document layout or converting to a different format. For best results with PDFs, use the "Preserve Layout" option.',
        related: [4, 5]
      },
    ],
    account: [
      {
        id: 7,
        question: 'I can\'t log in to my account. What should I do?',
        answer: 'First, try resetting your password. If you don\'t receive a password reset email, check your spam folder. If issues persist, contact support with your account email address.',
        related: [1, 8]
      },
      {
        id: 8,
        question: 'How do I change my account email address?',
        answer: 'Go to Account Settings > Profile and click "Change Email". You\'ll need to verify the new email address before it becomes active.',
        related: [7, 9]
      },
    ],
    billing: [
      {
        id: 9,
        question: 'How do I cancel my subscription?',
        answer: 'Go to Account Settings > Billing and click "Cancel Subscription". Your access will continue until the end of your current billing period.',
        related: [8, 10]
      },
      {
        id: 10,
        question: 'Why was I charged unexpectedly?',
        answer: 'This usually happens when your subscription auto-renews. Check your billing history for details. If you believe this is an error, contact our billing team immediately.',
        related: [9]
      },
    ],
  };

  // Get all FAQs for search functionality
  const allFaqs = Object.values(faqs).flat();

  // Filter FAQs based on search query or active category
  const filteredFaqs = searchQuery
  ? allFaqs.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : faqs[activeCategory];
  // Find related questions
  const getRelatedQuestions = (id) => {
    const currentQuestion = allFaqs.find(q => q.id === id);
    if (!currentQuestion || !currentQuestion.related.length) return [];
    
    return currentQuestion.related.map(relatedId => 
      allFaqs.find(q => q.id === relatedId)
    ).filter(Boolean);
  };

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const handleContactSupport = () => {
    setShowContactForm(true);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Your message has been sent! Our team will get back to you soon.');
      setShowContactForm(false);
      setContactForm({
        name: '',
        email: '',
        message: '',
        category: 'general'
      });
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset expanded question when category changes
  useEffect(() => {
    setExpandedQuestion(null);
  }, [activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section with Animation */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          DocumentGuru Help Center
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Find solutions to common issues or get help from our support team
        </p>
      </motion.header>

      {/* Search Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center mb-12"
      >
        <div className="w-full max-w-2xl relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search troubleshooting articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveCategory('');
              }}
              className="w-full px-6 py-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('general');
              }}
              className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all questions
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Category Sidebar */}
        {!searchQuery && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full md:w-72 flex-shrink-0"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <motion.li
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-colors flex items-center ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSearchQuery('');
                  }}
                >
                  <span className="mr-3 text-xl">{category.icon}</span>
                  {category.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={`flex-1 ${searchQuery ? 'md:mx-auto md:max-w-3xl' : ''}`}
        >
          {!searchQuery && (
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              {categories.find(c => c.id === activeCategory)?.icon}
              <span className="ml-2">{categories.find(c => c.id === activeCategory)?.name}</span>
            </h2>
          )}
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredFaqs.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`px-6 py-5 flex justify-between items-center cursor-pointer ${
                        expandedQuestion === item.id ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleQuestion(item.id)}
                    >
                      <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                      <motion.span 
                        animate={{ rotate: expandedQuestion === item.id ? 0 : 180 }}
                        className="text-gray-500 text-2xl"
                      >
                        {expandedQuestion === item.id ? '−' : '+'}
                      </motion.span>
                    </div>
                    <AnimatePresence>
                      {expandedQuestion === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-white border-t border-gray-200">
                            <p className="text-gray-600 mb-4">{item.answer}</p>
                            
                            {getRelatedQuestions(item.id).length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Related questions:</h4>
                                <ul className="space-y-2">
                                  {getRelatedQuestions(item.id).map(related => (
                                    <li key={related.id}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const category = Object.keys(faqs).find(key => 
                                            faqs[key].some(q => q.id === related.id)
                                          );
                                          if (category) {
                                            setActiveCategory(category);
                                            setExpandedQuestion(related.id);
                                            document.getElementById(`question-${related.id}`)?.scrollIntoView({
                                              behavior: 'smooth'
                                            });
                                          }
                                        }}
                                        className="text-sm text-green-600 hover:text-green-800 hover:underline"
                                      >
                                        {related.question}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-gray-50 rounded-lg shadow-inner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-gray-600 mb-6">No results found for "{searchQuery}"</p>
              <button
                className="px-8 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                onClick={handleContactSupport}
              >
                Contact Support
              </button>
              <button
                onClick={() => setSearchQuery('')}
                className="ml-4 px-6 py-3 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Support Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm"
      >
        <h2 className="text-3xl font-semibold text-gray-800">Still need help?</h2>
        <p className="mt-3 text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Our support team is available 24/7 to assist you with any issues you're facing.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center"
            onClick={handleContactSupport}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </button>

        </div>
      </motion.div>

      {/* Contact Form */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Contact Support</h3>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Issue Category</label>
                    <select
                      id="category"
                      name="category"
                      value={contactForm.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center min-w-24"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TroubleshootPage;