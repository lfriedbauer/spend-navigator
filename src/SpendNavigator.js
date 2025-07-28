import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Clock, TrendingUp, CreditCard, Building, Wifi, Truck, Package, Heart, Users, Coffee, FileText, Settings } from 'lucide-react';
import ContactForm from './ContactForm';
import VendorLookup from './VendorLookup';
import industryCategories from './data/industryCategories.json';

// Add this CSS animation code here
const additionalStyles = `
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SpendNavigator = () => {
  const [revenue, setRevenue] = useState(80);
  const [industry, setIndustry] = useState('manufacturing');
  const [indirectSpendPercent, setIndirectSpendPercent] = useState(14);
  const [lostAmount, setLostAmount] = useState(0);
  const [frozenLostAmount, setFrozenLostAmount] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [roiAmount, setRoiAmount] = useState(0);
  const [isRoiUpdating, setIsRoiUpdating] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [counterStarted, setCounterStarted] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Category spending state - updated for industry-specific categories
const [categorySpend, setCategorySpend] = useState({
  // Keep existing categories
  'banking-services': 0,
  'merchant-card-services': 0,
  'insurance': 0,
  'waste-management': 0,
  'cleaning-janitorial': 0,
  'utilities-energy': 0,
  'facility-management': 0,
  'telecom': 0,
  'information-technology': 0,
  'managed-print-services': 0,
  'logistics-freight': 0,
  'small-package-freight': 0,
  'fleet-management': 0,
  'chemicals-industrial-gases': 0,
  'packaging': 0,
  'uniforms-linens': 0,
  'office-supplies': 0,
  'factory-consumables': 0,
  'healthcare-products': 0,
  'healthcare-services': 0,
  'employment-staffing': 0,
  'payroll-processing': 0,
  'food-catering': 0,
  'food-supply-purchases': 0,
  'food-ingredients': 0,
  'printing-services': 0,
  'records-management': 0,
  // Add new categories
  'maintenance-repair': 0,
  'cloud-hosting': 0,
  'marketing-advertising': 0,
  'travel-expenses': 0,
  'medical-waste': 0,
  'material-supplies': 0,
  'fuel': 0,
  'rent-lease': 0,
  'network-capex': 0,
  'equipment-rental': 0
});

// Get categories for selected industry
const getIndustryCategories = (industry) => {
  return industryCategories[industry] || [];
};

const currentIndustryCategories = getIndustryCategories(industry);

  // Industry benchmarks
  const industryBenchmarks = {
    'retail': 15,
    'manufacturing': 14,
    'technology': 21,
    'healthcare': 22.5,
    'financial-services': 30,
    'construction': 12.5,
    'professional-services': 30,
    'energy': 17.8,
    'telecommunications': 17.8,
    'transportation': 17.8
  };

  const industryLabels = {
    'retail': 'Retail',
    'manufacturing': 'Manufacturing',
    'technology': 'Technology',
    'healthcare': 'Healthcare',
    'financial-services': 'Financial Services',
    'construction': 'Construction',
    'professional-services': 'Professional Services',
    'energy': 'Energy',
    'telecommunications': 'Telecommunications',
    'transportation': 'Transportation & Logistics'
  };

  const industrySources = {
    'retail': 'BCG Research (10-20% range)',
    'manufacturing': 'McKinsey Analysis (10-18% range)',
    'technology': 'FairMarkit Study (15-27% range)',
    'healthcare': 'LogicSource Report (20-25% range)',
    'financial-services': 'Supply Chain Brain (20-40% range)',
    'construction': 'Droppe Industry Analysis (10-15% range)',
    'professional-services': 'FocalPoint Research (up to 40%)',
    'energy': 'Sourcing Innovation Study (13.5-22% range)',
    'telecommunications': 'Sourcing Innovation Study (13.5-22% range)',
    'transportation': 'Sourcing Innovation Study (13.5-22% range)'
  };

  // Calculate values
  const indirectSpend = revenue * (indirectSpendPercent / 100);
  const annualSavings = indirectSpend * 0.13;
const totalIndirectSpend = indirectSpend; // This is our slider maximum
  const perSecondLoss = (annualSavings * 1000000) / (365 * 24 * 60 * 60);

  // Calculate ROI from categories
const calculateROI = () => {
  let totalROI = 0;
  currentIndustryCategories.forEach((category) => {
    const spend = categorySpend[category.key] || 0;
    const savings = spend * (category.savings / 100);
    totalROI += savings;
  });
  return totalROI;
};

  const totalROI = calculateROI();
  const perSecondROI = (totalROI * 1000000) / (365 * 24 * 60 * 60);
  const hasUserTakenAction = Object.values(categorySpend).some(spend => spend > 0);

  // Start counter after 3-second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCounterStarted(true);
      setStartTime(Date.now());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Update counters
  useEffect(() => {
    if (!counterStarted) return;

    const interval = setInterval(() => {
      if (!hasUserTakenAction) {
        setIsUpdating(true);
      }
      setIsRoiUpdating(true);
      
      setTimeout(() => {
        const secondsElapsed = (Date.now() - startTime) / 1000;
        
        if (hasUserTakenAction && frozenLostAmount === null) {
          setFrozenLostAmount(secondsElapsed * perSecondLoss);
        }
        
        if (!hasUserTakenAction) {
          setLostAmount(secondsElapsed * perSecondLoss);
        }
        
        setRoiAmount(secondsElapsed * perSecondROI);
        setIsUpdating(false);
        setIsRoiUpdating(false);
      }, 800);
    }, 3000);

    return () => clearInterval(interval);
  }, [counterStarted, perSecondLoss, perSecondROI, startTime, hasUserTakenAction, frozenLostAmount]);
useEffect(() => {
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  document.head.appendChild(styleElement);
  return () => {
    if (document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  };
}, []);
  // Handle changes
  const handleRevenueChange = (e) => {
    setRevenue(parseInt(e.target.value));
    setStartTime(Date.now());
    setLostAmount(0);
    setFrozenLostAmount(null);
  };

  const handleIndustryChange = (e) => {
    const newIndustry = e.target.value;
    setIndustry(newIndustry);
    setIndirectSpendPercent(industryBenchmarks[newIndustry]);
    setStartTime(Date.now());
    setLostAmount(0);
    setFrozenLostAmount(null);
  };

  const handleIndirectSpendChange = (e) => {
    setIndirectSpendPercent(parseInt(e.target.value));
    setStartTime(Date.now());
    setLostAmount(0);
    setFrozenLostAmount(null);
  };

  const handleCategorySpendChange = (categoryKey, value) => {
    setCategorySpend(prev => ({
      ...prev,
      [categoryKey]: parseFloat(value)
    }));
    
    const newSpend = { ...categorySpend, [categoryKey]: parseFloat(value) };
    const hasAnySpend = Object.values(newSpend).some(spend => spend > 0);
    if (!hasAnySpend) {
      setFrozenLostAmount(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatMillions = (amount) => {
    return `$${(amount).toFixed(1)}M`;
  };

  return (
<div className="bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 min-h-screen p-4">
      <div className="w-full max-w-7xl mx-auto">
     {/* Hero Section */}
<div className="text-center mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
<h1 className="text-4xl font-bold text-white mb-4">
  Measure the Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Inaction</span>
</h1>
<p className="text-xl text-emerald-200 mb-2 font-semibold">
  Indirect spend optimization can improve EBITDA by 2-5% without touching core operations.
</p>
<p className="text-lg text-blue-100 mb-6 max-w-4xl mx-auto">
  Delaying a conversation doesn't just cost time—it costs real dollars across your indirect spend.
</p>
  
  {/* Introductory explanation */}
  <div className="bg-gradient-to-r from-blue-800/50 to-emerald-800/50 rounded-xl p-6 max-w-5xl mx-auto border border-white/10">
    <h3 className="text-xl font-semibold text-white mb-3">How to Use This Intelligence Platform</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-100">
  <div className="flex items-start space-x-3">
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
    <div>
      <div className="font-semibold text-white">Select Your Industry</div>
      <div>See relevant cost categories and optimization opportunities.</div>
    </div>
  </div>
  <div className="flex items-start space-x-3">
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
    <div>
      <div className="font-semibold text-white">Configure Your Profile</div>
      <div>Model your company's specific indirect spend profile.</div>
    </div>
  </div>
  <div className="flex items-start space-x-3">
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
    <div>
      <div className="font-semibold text-white">Watch Real-Time Impact</div>
      <div>See live ROI calculations as you adjust sliders.</div>
    </div>
  </div>
</div>
  </div>
</div>

        {/* Industry Selection */}
<div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-800 mb-3 text-center">Industry Selection</h3>
          <div className="max-w-md mx-auto">
            <select
              value={industry}
              onChange={handleIndustryChange}
              className="w-full text-sm border border-gray-300 rounded p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(industryLabels)
                .sort(([,a], [,b]) => a.localeCompare(b))
                .map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-2 text-center">
              <div className="font-semibold text-blue-600">{industryBenchmarks[industry]}% indirect spend benchmark</div>
              <div className="text-xs text-gray-400 mt-1">{industrySources[industry]}</div>
            </div>
          </div>
        </div>
{/* Section Divider */}
<div className="relative mb-8">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-blue-200/50"></div>
  </div>
  <div className="relative flex justify-center">
    <span className="bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 px-4 text-sm text-blue-200">Dashboard Overview</span>
  </div>
</div>
        {/* Main Dashboard - 2x2 Grid Layout */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          
          {/* Cost of Inaction Counter */}
<div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-amber-600 mr-1" />
                <h3 className="text-sm font-semibold text-gray-800">Cost of Inaction</h3>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-3 border border-amber-200">
                <div className={`text-xl font-bold mb-2 transition-all duration-200 ${
                  !counterStarted
                    ? 'text-gray-600'
                    : hasUserTakenAction 
                      ? 'text-gray-600' 
                      : isUpdating 
                        ? 'scale-105 text-red-600' 
                        : 'text-amber-700'
                }`}>
                  {formatCurrency(hasUserTakenAction && frozenLostAmount !== null ? frozenLostAmount : lostAmount)}
                </div>
                <div className="text-xs text-amber-600 mb-2">
                  {!counterStarted 
                    ? 'preparing cost calculator...' 
                    : hasUserTakenAction 
                      ? 'action initiated - cost stopped' 
                      : 'lost since page load'
                  }
                </div>
                
                <div className="flex justify-center items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full border transition-all duration-500 ${
                    !counterStarted || hasUserTakenAction
                      ? 'bg-gray-300 border-gray-400'
                      : isUpdating 
                        ? 'bg-red-500 border-red-600 scale-125' 
                        : 'bg-amber-400 border-amber-500'
                  }`}></div>
                  <div className={`w-3 h-3 rounded-full border transition-all duration-500 delay-150 ${
                    !counterStarted || hasUserTakenAction
                      ? 'bg-gray-300 border-gray-400'
                      : isUpdating 
                        ? 'bg-red-500 border-red-600 scale-125' 
                        : 'bg-amber-400 border-amber-500'
                  }`}></div>
                  <div className={`w-3 h-3 rounded-full border transition-all duration-500 delay-300 ${
                    !counterStarted || hasUserTakenAction
                      ? 'bg-gray-300 border-gray-400'
                      : isUpdating 
                        ? 'bg-red-500 border-red-600 scale-125' 
                        : 'bg-amber-400 border-amber-500'
                  }`}></div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Second</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondLoss)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Hour</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondLoss * 3600)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Day</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondLoss * 86400)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Week</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondLoss * 604800)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Month</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondLoss * 2592000)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Year</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondLoss * 31536000)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Counter */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <h3 className="text-sm font-semibold text-gray-800">ROI from Action</h3>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-3 border border-green-200">
                <div className={`text-xl font-bold text-green-700 mb-2 transition-all duration-200 ${isRoiUpdating ? 'scale-105 text-emerald-600' : ''}`}>
                  {formatCurrency(roiAmount)}
                </div>
                <div className="text-xs text-green-600 mb-2">earned since page load</div>
                
                <div className="flex justify-center items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full border transition-all duration-500 ${isRoiUpdating ? 'bg-emerald-500 border-emerald-600 scale-125' : 'bg-green-400 border-green-500'}`}></div>
                  <div className={`w-3 h-3 rounded-full border transition-all duration-500 delay-150 ${isRoiUpdating ? 'bg-emerald-500 border-emerald-600 scale-125' : 'bg-green-400 border-green-500'}`}></div>
                  <div className={`w-3 h-3 rounded-full border transition-all duration-500 delay-300 ${isRoiUpdating ? 'bg-emerald-500 border-emerald-600 scale-125' : 'bg-green-400 border-green-500'}`}></div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Second</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondROI)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Hour</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondROI * 3600)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Day</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondROI * 86400)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Week</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondROI * 604800)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Month</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondROI * 2592000)}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">Per Year</div>
                    <div className="font-bold text-gray-800">{formatCurrency(perSecondROI * 31536000)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Profile */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              Company Profile
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Annual Revenue: <span className="text-sm font-bold text-blue-600">${revenue}M</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={revenue}
                  onChange={handleRevenueChange}
                  className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$50M</span>
                  <span>$1B</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded p-3">
                <p className="text-xs text-blue-800">
                  Based on industry benchmarks, companies generating <strong>${revenue.toFixed(1)}M</strong> in revenue tend to spend roughly <strong>${indirectSpend.toFixed(1)}M</strong> on indirect costs—unlocking up to <strong>${annualSavings.toFixed(1)}M</strong> in potential savings.
                </p>
              </div>
                
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Indirect Spend: <span className="text-sm font-bold text-blue-600">{indirectSpendPercent}%</span> of revenue
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={indirectSpendPercent}
                  onChange={handleIndirectSpendChange}
                  className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>10%</span>
                  <span>40%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Impact */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
              <TrendingDown className="w-4 h-4 mr-1 text-green-600" />
              Financial Impact
            </h3>
            
            <div className="space-y-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-sm font-bold text-blue-600">${revenue.toFixed(1)}M</div>
                <div className="text-xs text-blue-800">Revenue</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-bold text-gray-600">${indirectSpend.toFixed(1)}M</div>
                <div className="text-xs text-gray-800">Indirect Spend ({indirectSpendPercent}%)</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-sm font-bold text-green-600">{formatMillions(totalROI)}</div>
                <div className="text-xs text-green-800">Total ROI Potential</div>
              </div>
            </div>
          </div>
        </div>
{/* Vendor Lookup Tool */}
<div className="mb-6">
  <VendorLookup />
</div>
{/* Section Divider */}
<div className="relative mb-8">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-emerald-200/50"></div>
  </div>
  <div className="relative flex justify-center">
    <span className="bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 px-4 text-sm text-emerald-200">Cost Configuration</span>
  </div>
</div>
{/* Spending Summary */}
<div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 mb-6 border border-blue-200">
  <div className="flex justify-between items-center">
    <div>
      <div className="text-sm font-semibold text-gray-800">Category Spend Allocated</div>
      <div className="text-xs text-gray-600">Sum of all category spending</div>
    </div>
    <div className="text-right">
      <div className="text-lg font-bold text-blue-800">
        ${Object.values(categorySpend).reduce((sum, spend) => sum + (spend || 0), 0).toFixed(1)}M
      </div>
      <div className="text-xs text-gray-600">
        of ${totalIndirectSpend.toFixed(1)}M total
      </div>
    </div>
  </div>
  <div className="mt-2">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300" 
        style={{
          width: `${Math.min(100, (Object.values(categorySpend).reduce((sum, spend) => sum + (spend || 0), 0) / totalIndirectSpend) * 100)}%`
        }}
      ></div>
    </div>
  </div>
</div>
{/* Category Configuration Section */}
<div className="bg-blue-50/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
  {/* Category Cards */}
  <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-8 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 rounded-xl"></div>
    <div className="relative">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        {industryLabels[industry]} - Key Spend Categories
      </h3>
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Top 6 categories for your industry - adjust spending to see ROI impact
        </p>
        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-4 py-2 inline-block mb-2">
          💡 Sliders capped at ${totalIndirectSpend.toFixed(1)}M (your total indirect spend)
        </p>
        <p className="text-xs text-gray-500">
          <strong>Savings percentages</strong> based on industry benchmarks from McKinsey, BCG, and procurement case studies.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentIndustryCategories
          .filter(category => category.priority <= 6)
          .sort((a, b) => a.priority - b.priority)
          .map((category) => {
            const IconComponent = {
              'Building': Building,
              'Truck': Truck, 
              'Package': Package,
              'Settings': Settings,
              'CreditCard': CreditCard,
              'Heart': Heart,
              'Users': Users,
              'Coffee': Coffee,
              'FileText': FileText,
              'Wifi': Wifi
            }[category.icon] || Package;
            
            const currentSpend = categorySpend[category.key] || 0;
            const potentialSavings = currentSpend * (category.savings / 100);
            
            return (
              <div key={category.key} className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl p-4 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center mb-3">
                  <IconComponent className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">{category.name}</h5>
                    <div className="text-xs text-gray-600">Priority #{category.priority} • Typical: {category.typicalSpend}% of revenue</div>
                  </div>
                </div>
                
                {category.description && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 italic">{category.description}</p>
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-2">
                    Annual Spend: <span className="font-semibold text-blue-600">${currentSpend.toFixed(1)}M</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={totalIndirectSpend}
                    step="0.1"
                    value={currentSpend}
                    onChange={(e) => handleCategorySpendChange(category.key, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0M</span>
                    <span>${totalIndirectSpend.toFixed(1)}M</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-green-600">
                    <div className="flex items-center">
                      <span>{category.savings}% savings potential</span>
                      <div className="ml-1 group relative">
                        <span className="cursor-help text-gray-400">ⓘ</span>
                        <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap z-10">
                          Based on industry benchmarks
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-700">
                    ROI: ${potentialSavings.toFixed(2)}M
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  </div>
</div>
{/* Section Divider */}
<div className="relative mb-8">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-blue-200/50"></div>
  </div>
  <div className="relative flex justify-center">
    <span className="bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 px-4 text-sm text-blue-200">Get In Touch</span>
  </div>
</div>
{/* Optional Contact Section */}
<div className="bg-emerald-50/30 backdrop-blur-sm rounded-2xl p-8">
  <div className="text-center mb-6">
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      Want to explore this further?
    </h3>
    <p className="text-sm text-gray-600 mb-4">
      You can continue using this calculator anonymously, or connect with us to discuss your specific situation.
    </p>
    
    {/* Toggle Button */}
    <button
      onClick={() => setShowContactForm(!showContactForm)}
      className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold py-2 px-6 rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {showContactForm ? 'Hide Contact Form' : 'Request a Conversation'}
    </button>
  </div>

  {/* Collapsible Contact Form */}
  {showContactForm && (
    <div className="mt-6 animate-fadeIn">
      <ContactForm />
    </div>
  )}
  
  {/* Trust Signals - Always Visible */}
  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
    <div className="bg-white/50 rounded-lg p-4">
      <div className="text-blue-600 font-semibold mb-1">100% Free</div>
      <div className="text-xs text-gray-600">No charges, ever</div>
    </div>
    <div className="bg-white/50 rounded-lg p-4">
      <div className="text-blue-600 font-semibold mb-1">No Spam</div>
      <div className="text-xs text-gray-600">We hate spam too</div>
    </div>
    <div className="bg-white/50 rounded-lg p-4">
      <div className="text-blue-600 font-semibold mb-1">No Pressure</div>
      <div className="text-xs text-gray-600">Genuine conversations only</div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default SpendNavigator;