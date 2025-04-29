import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">E-Seva Management System</h3>
          <p className="text-gray-400 text-sm mb-4">
            Streamlining government services through innovative digital solutions, 
            making administration more efficient and accessible.
          </p>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Services</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Agents</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Reports</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Settings</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Support</a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-gray-400" />
              <span className="text-sm">support@eseva.gov.in</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-gray-400" />
              <span className="text-sm">+91 1800-000-0000</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-sm">E-Seva Headquarters, Digital Park, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Legal */}
      <div className="border-t border-gray-800 mt-6 pt-4 text-center">
        <p className="text-sm text-gray-500">
          © {currentYear} E-Seva Management System. All Rights Reserved.
        </p>
        <div className="mt-2 space-x-4">
          <a href="#" className="text-xs text-gray-400 hover:text-white">Privacy Policy</a>
          <a href="#" className="text-xs text-gray-400 hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;