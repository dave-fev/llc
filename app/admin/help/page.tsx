'use client';

import React from 'react';
import { HelpCircle, Book, MessageCircle, FileText, Video } from 'lucide-react';

const helpSections = [
  {
    title: 'Documentation',
    icon: Book,
    description: 'Comprehensive guides and tutorials',
    items: ['Getting Started', 'User Management', 'Order Processing', 'Settings Guide'],
  },
  {
    title: 'FAQ',
    icon: HelpCircle,
    description: 'Frequently asked questions',
    items: ['How to add users?', 'How to process orders?', 'How to enable maintenance mode?'],
  },
  {
    title: 'Support',
    icon: MessageCircle,
    description: 'Get help from our support team',
    items: ['Live Chat', 'Email Support', 'Ticket System'],
  },
  {
    title: 'Resources',
    icon: FileText,
    description: 'Additional resources and downloads',
    items: ['API Documentation', 'Video Tutorials', 'Best Practices'],
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-neutral-900 mb-2">Help & Support</h1>
        <p className="text-neutral-600">Find answers and get the help you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">{section.title}</h2>
                  <p className="text-sm text-neutral-600">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
        <h2 className="text-2xl font-black text-neutral-900 mb-4">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-neutral-50 rounded-xl">
            <h3 className="font-black text-neutral-900 mb-2">Email</h3>
            <p className="text-sm text-neutral-600 mb-2">support@swiftsfilling.com</p>
            <button className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
              Send Email
            </button>
          </div>
          <div className="p-6 bg-neutral-50 rounded-xl">
            <h3 className="font-black text-neutral-900 mb-2">Phone</h3>
            <p className="text-sm text-neutral-600 mb-2">1-800-SWIFT-FILL</p>
            <button className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
              Call Now
            </button>
          </div>
          <div className="p-6 bg-neutral-50 rounded-xl">
            <h3 className="font-black text-neutral-900 mb-2">Live Chat</h3>
            <p className="text-sm text-neutral-600 mb-2">Available 24/7</p>
            <button className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




