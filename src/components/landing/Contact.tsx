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
      </div>
    </section>
  );
}