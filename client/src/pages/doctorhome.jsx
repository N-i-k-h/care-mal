import React, { useState, useEffect } from 'react';
import puppyImage from '../assets/doctor.png';
import logo from '../assets/logo.png';
import onsiteAppointmentsImage from '../assets/onsite.png';
import aiVoiceDoctorImage from '../assets/aidoctor.png';
import onlineChatImage from '../assets/chat.png';
import { Link } from 'react-router-dom';

// Changed component name to DoctorHome
function DoctorHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '#', icon: '🏠' },
    { name: 'Services', path: '#services', icon: '🛠️' },
    { name: 'Contact', path: '#contact', icon: '📞' },
  ];

  // The first 3 features from your HomePage
  const services = [
    {
      title: "Onsite Appointments",
      description: "Schedule visits easily with our expert veterinarians at your convenience.",
      image: onsiteAppointmentsImage,
      link: "https://live-doctor-patient-ap65.bolt.host/"
    },
    {
      title: "AI Voice Doctor",
      description: "Get instant voice-based consultations with our AI-powered virtual veterinarian.",
      image: aiVoiceDoctorImage,
      link: "https://ai-doctor-2-3maz.onrender.com"
    },
    {
      title: "Video calling",
      description: "Instant video calling with our pet care experts for your queries.",
      image: onlineChatImage,
      link: "https://caremal-chat-22.onrender.com"
    }
  ];

  return (
    <div className="bg-green-50 min-h-screen">
      {/* Enhanced Responsive Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-3 md:py-4"}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={logo} alt="CareMal Logo" className="h-18 w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className={`relative px-3 py-2 font-medium transition-all duration-300 ${isScrolled ? "text-gray-700 hover:text-green-600" : "text-white hover:text-green-200"}`}
                >
                  <span className="group">
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              ))}
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md transition-all ${isScrolled ?
                  "text-gray-700 hover:bg-gray-100" :
                  "text-white hover:bg-white/20"}`}
                aria-label="Menu"
              >
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 py-4" : "max-h-0"}`}>
            <div className="flex flex-col space-y-3 mt-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${isScrolled ?
                    "bg-gray-100 text-gray-800 hover:bg-gray-200" :
                    "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  <span className="mr-2 text-lg">{link.icon}</span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative w-full h-screen flex items-center justify-center pt-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${puppyImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isOpen ? 'initial' : 'fixed'
        }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto">
          {/* You might want to change this text later */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
            Welcome, Doctor
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 opacity-90 px-2 sm:px-0">
            Manage your appointments and services from here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Your Tools</h2>
          <div className="w-16 sm:w-20 h-1 bg-green-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 relative overflow-hidden"
            >
              {/* Service Image */}
              <div className="mb-6 overflow-hidden rounded-lg">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-56 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Service Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <Link
                  to={service.link}
                  className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors duration-300 group/link"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-green-600 after:transition-all after:duration-300 group-hover/link:after:w-full">
                    Learn more
                  </span>
                  <svg
                    className="w-5 h-5 ml-1 transition-transform group-hover/link:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-green-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Need Assistance?</h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Contact our support team if you have any questions or issues with the platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base shadow-lg transform transition-all duration-300 hover:scale-105">
                Call Support
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base shadow-lg transform transition-all duration-300 hover:scale-105">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <img src={logo} alt="CareMal Logo" className="h-12 w-auto" />
              </div>
              <p className="text-sm text-gray-400">Quality care for your furry friends</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-400 transition-colors">FAQ</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} CareMal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Changed export to DoctorHome
export default DoctorHome;