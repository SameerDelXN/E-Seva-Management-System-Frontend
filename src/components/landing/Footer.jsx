'use client';

import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram 
} from 'lucide-react';
import { Link } from 'react-scroll';

const Footer = () => {
  return (
    <footer className="bg-green-100 text-green-700 py-12 px-4 sm:px-6 lg:px-8" name="Footer">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            <Link 
              to='home'
              smooth={true}
              className="text-green-600 hover:text-green-800 transition-colors flex items-center cursor-pointer"
            >
              Home
            </Link>
            <Link 
              to='Services'
              smooth={true}
              className="text-green-600 hover:text-green-800 transition-colors flex items-center cursor-pointer"
            >
              Services
            </Link>
            <Link
              to='Pricing'
              smooth={true}
              className="text-green-600 hover:text-green-800 transition-colors flex items-center cursor-pointer"
            >
              Pricing
            </Link>
            <Link
              to='FAQ'
              smooth={true}
              className="text-green-600 hover:text-green-800 transition-colors flex items-center cursor-pointer"
            >
              FAQ
            </Link>
            <Link
              to='Footer'
              smooth={true}
              
              className="text-green-600 hover:text-green-800 transition-colors flex items-center cursor-pointer"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Social Media Icons */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
          <div className="flex space-x-4">
            {[
              { Icon: Facebook, href: "#facebook" },
              { Icon: Twitter, href: "#twitter" },
              { Icon: Linkedin, href: "#linkedin" },
              { Icon: Instagram, href: "#instagram" }
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                className="
                  text-green-600 
                  hover:text-green-800 
                  hover:scale-110 
                  transition-all 
                  duration-300 
                  ease-in-out
                "
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <div className="space-y-2">
            <p className="text-green-600">Email: support@dokumentguru.com</p>
            <p className="text-green-600">Phone: +1 (555) 123-4567</p>
            <p className="mt-4 text-sm text-green-700">
              © {new Date().getFullYear()} DokumentGuru. 
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="border-t border-green-200 mt-8 pt-4 text-center text-sm text-green-600">
        Secure Document Processing Platform
      </div>
    </footer>
  );
};

export default Footer;
