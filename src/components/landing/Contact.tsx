import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

// Mock data for demonstration
const companySettings = {
  phone: '+91 98765 43210',
  email: 'info@construction.com',
  address: 'Chajing Mamang Leikai, Imphal West, Manipur, India'
};

export function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: companySettings.phone,
      href: `tel:${companySettings.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: companySettings.email,
      href: `mailto:${companySettings.email}`,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: companySettings.address,
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Mon - Sat: 6:00 AM - 6:00 PM',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Contact Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-600 text-lg">
            Ready to start your construction project? Contact us today for a free
            consultation and quote.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <item.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <p className="text-sm text-gray-500 mb-2 font-medium">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-gray-900 font-semibold hover:text-blue-600 transition-colors text-sm leading-relaxed block"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-gray-900 font-semibold text-sm leading-relaxed">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d538.7163014680963!2d93.93534367424604!3d24.72561500026707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!2schajing%20mamang%20leikai%2C%20imphal%20west!5e0!3m2!1sen!2sin!4v1766116099691!5m2!1sen!2sin"
              className="absolute top-0 left-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </div>

        {/* Optional: Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have questions? We're here to help you with your construction needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${companySettings.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href={`mailto:${companySettings.email}`}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-sm hover:shadow-md border border-gray-200"
            >
              <Mail className="w-5 h-5" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}