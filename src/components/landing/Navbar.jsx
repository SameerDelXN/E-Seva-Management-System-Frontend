"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Calendar } from 'lucide-react';
import NextLink from 'next/link';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { label: 'Home', to: 'home' },
    { label: 'Services', to: 'Services' },
    { label: 'Our Edge', to: 'WhyChooseUs' },
    { label: 'About', to: 'HowItWorks' },
    { label: 'Contact', to: 'Footer' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let found = false;

      navItems.forEach((item) => {
        const element = document.getElementById(item.to);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(item.to);
            found = true;
          }
        }
      });

      // Force Footer active when at bottom of page
      if (
        !found &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      ) {
        setActiveSection('Footer');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 fixed">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/logo.svg"
              alt="Dokument Guru Logo"
              className="h-10 w-10 object-contain"
            />
            <a
              href="/"
              className="text-2xl font-bold text-green-600 flex items-center"
            >
              Dokument Guru
              <Shield className="ml-2 text-green-500" size={20} />
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 justify-center flex-1">
            {navItems.map((item) => (
              <ScrollLink
                key={item.label}
                to={item.to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                onSetActive={() => setActiveSection(item.to)}
                className={`cursor-pointer text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-green-50 hover:scale-105 ${
                  activeSection === item.to ? 'text-green-600 font-semibold' : ''
                }`}
              >
                {item.label}
              </ScrollLink>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NextLink
              href="/auth/signin"
              className="text-green-600 hover:text-green-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </NextLink>
            <NextLink
              href="/appointment"
              className="inline-flex items-center text-green-600 hover:text-green-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-green-500 hover:bg-green-50"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </NextLink>
            <NextLink
              href="/register-agent"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Register
            </NextLink>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-green-600 hover:text-green-800 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <ScrollLink
                  key={item.label}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveSection(item.to);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors ${
                    activeSection === item.to
                      ? 'text-green-600 font-semibold bg-green-50'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  {item.label}
                </ScrollLink>
              ))}
              <div className="pt-4 space-y-2">
                <NextLink
                  href="/auth/signin"
                  className="text-green-600 hover:text-green-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/appointment/steps/select-service"
                  className="inline-flex items-center justify-center w-full text-green-600 hover:text-green-800 px-3 py-2 rounded-md text-base font-medium border border-green-500 hover:bg-green-50"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </NextLink>
                <ScrollLink
                  to="get-started"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white block w-full text-center px-4 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md cursor-pointer"
                >
                  Get Started
                </ScrollLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
