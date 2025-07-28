import React, { useState } from 'react';
import { Mail, Phone, Building, User } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    revenue: '',
    industry: '',
    message: '',
    priority: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (Netlify will handle this automatically)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            We'll review your indirect spend profile and contact you within 24 hours with specific optimization opportunities.
          </p>
          <div className="text-sm text-blue-600">
            Expected ROI analysis: <strong>$50K - $2M annually</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Get Your Custom ROI Analysis</h3>
        <p className="text-sm text-gray-600">
          See exactly how much your company can save across all indirect spend categories
        </p>
      </div>

      <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="form-name" value="contact" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <User className="w-3 h-3 inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full text-sm border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Mail className="w-3 h-3 inline mr-1" />
              Business Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-sm border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Building className="w-3 h-3 inline mr-1" />
              Company Name *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full text-sm border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ABC Corporation"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Phone className="w-3 h-3 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full text-sm border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Annual Revenue</label>
            <select
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              className="w-full text-sm border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select range</option>
              <option value="50-100M">$50M - $100M</option>
              <option value="100-250M">$100M - $250M</option>
              <option value="250-500M">$250M - $500M</option>
              <option value="500M+">$500M+</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Priority Level</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full text-sm border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General Inquiry</option>
              <option value="urgent">Urgent - Need Results This Quarter</option>
              <option value="board">Board Presentation Required</option>
              <option value="budget">Budget Season Planning</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Current Challenges (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className="w-full text-sm border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your biggest indirect spend challenges..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Analyzing Your Profile...' : 'Get My Custom ROI Analysis'}
        </button>

        <div className="text-center text-xs text-gray-500">
          ✓ Free analysis ✓ No commitment ✓ Results within 24 hours
        </div>
      </form>
    </div>
  );
};

export default ContactForm;