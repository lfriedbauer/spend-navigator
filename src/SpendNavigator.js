import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Clock, TrendingUp, CreditCard, Building, Wifi, Truck, Package, Heart, Users, Coffee, FileText, Settings } from 'lucide-react';

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

  // Category spending state - 27 categories
  const [categorySpend, setCategorySpend] = useState({
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
    'records-management': 0
  });

  // Category definitions with savings percentages
  const categories = {
    'Financial Services': {
      'banking-services': { 
        name: 'Banking Services', 
        savings: 30, 
        icon: Building,
        description: 'Savings achieved on reducing spend for E-Payments; Fiduciary/ Investment Management; Treasury; ATM Service & Maintenance.'
      },
      'merchant-card-services': { 
        name: 'Merchant Card Services', 
        savings: 21, 
        icon: CreditCard,
        description: 'Savings achieved on reducing spend connected to payments to a client by their customers via credit and debit card or ACH/eCheck payments.'
      },
      'insurance': { 
        name: 'Insurance', 
        savings: 20, 
        icon: Building,
        description: 'Savings achieved on reducing spend for Health, Property and Casualty, Officer and E&O Insurances.'
      }
    },
    'Facilities & Operations': {
      'waste-management': { name: 'Waste Management', savings: 35, icon: Building },
      'cleaning-janitorial': { name: 'Cleaning/Janitorial', savings: 20.1, icon: Building },
      'utilities-energy': { name: 'Utilities/Energy', savings: 18, icon: Building },
      'facility-management': { name: 'Facility Management', savings: 20.1, icon: Building }
    },
    'Technology & Communications': {
      'telecom': { name: 'Telecom', savings: 26, icon: Wifi },
      'information-technology': { name: 'Information Technology', savings: 10, icon: Settings },
      'managed-print-services': { name: 'Managed Print Services', savings: 40, icon: FileText }
    },
    'Supply Chain & Logistics': {
      'logistics-freight': { name: 'Logistics & Freight', savings: 20.1, icon: Truck },
      'small-package-freight': { name: 'Small Package Freight', savings: 20.1, icon: Package },
      'fleet-management': { name: 'Fleet Management', savings: 21, icon: Truck }
    },
    'Materials & Supplies': {
      'chemicals-industrial-gases': { name: 'Chemicals/Industrial Gases', savings: 20.1, icon: Package },
      'packaging': { name: 'Packaging', savings: 20.1, icon: Package },
      'uniforms-linens': { name: 'Uniforms and Linens', savings: 22.4, icon: Package },
      'office-supplies': { name: 'Office Supplies', savings: 15, icon: Package },
      'factory-consumables': { name: 'Factory Consumables', savings: 15, icon: Package }
    },
    'Healthcare': {
      'healthcare-products': { name: 'Healthcare Products', savings: 20.1, icon: Heart },
      'healthcare-services': { name: 'Healthcare Services', savings: 20.1, icon: Heart }
    },
    'HR & Staffing': {
      'employment-staffing': { name: 'Employment Staffing', savings: 20.1, icon: Users },
      'payroll-processing': { name: 'Payroll Processing', savings: 18, icon: Users }
    },
    'Food Services': {
      'food-catering': { name: 'Food Catering', savings: 20.1, icon: Coffee },
      'food-supply-purchases': { name: 'Food Supply Purchases', savings: 20.1, icon: Coffee },
      'food-ingredients': { name: 'Food Ingredients', savings: 20.1, icon: Coffee }
    },
    'Professional Services': {
      'printing-services': { name: 'Printing Services', savings: 12, icon: FileText },
      'records-management': { name: 'Records Management', savings: 14, icon: FileText }
    }
  };

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
  const perSecondLoss = (annualSavings * 1000000) / (365 * 24 * 60 * 60);

  // Calculate ROI from categories
  const calculateROI = () => {
    let totalROI = 0;
    Object.entries(categories).forEach(([groupName, groupCategories]) => {
      Object.entries(groupCategories).forEach(([categoryKey, categoryData]) => {
        const spend = categorySpend[categoryKey] || 0;
        const savings = spend * (categoryData.savings / 100);
        totalROI += savings;
      });
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
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Measure the Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Inaction</span>
          </h2>
          <p className="text-sm text-gray-600">
            Delaying a conversation doesn't just cost time—it costs real dollars across your indirect spend.
          </p>
        </div>

        {/* Industry Selection */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
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

        {/* Main Dashboard - 2x2 Grid Layout */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          {/* Cost of Inaction Counter */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
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
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
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
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
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
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
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

        {/* Category Cards */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">ROI Category Configuration</h3>
          <p className="text-sm text-gray-600 text-center mb-6">Adjust spending by category to see potential ROI impact</p>
          
          {Object.entries(categories).map(([groupName, groupCategories]) => (
            <div key={groupName} className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-1">{groupName}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {Object.entries(groupCategories).map(([categoryKey, categoryData]) => {
                  const IconComponent = categoryData.icon;
                  const currentSpend = categorySpend[categoryKey] || 0;
                  const potentialSavings = currentSpend * (categoryData.savings / 100);
                  
                  return (
                    <div key={categoryKey} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex items-center mb-2">
                        <IconComponent className="w-4 h-4 text-blue-600 mr-2" />
                        <h5 className="text-xs font-medium text-gray-800">{categoryData.name}</h5>
                      </div>
                      
                      {groupName === 'Financial Services' && categoryData.description && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 italic">{categoryData.description}</p>
                        </div>
                      )}
                      
                      <div className="mb-2">
                        <label className="block text-xs text-gray-600 mb-1">
                          Spend: <span className="font-semibold">${currentSpend.toFixed(1)}M</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={currentSpend}
                          onChange={(e) => handleCategorySpendChange(categoryKey, e.target.value)}
                          className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>$0M</span>
                          <span>$10M</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-green-600">
                        <div>{categoryData.savings}% {groupName === 'Financial Services' ? 'average savings achieved on historical projects' : 'savings potential'}</div>
                        <div className="font-semibold">ROI: ${potentialSavings.toFixed(2)}M</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendNavigator;