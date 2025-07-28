import React, { useState } from 'react';
import { Search, Building, MapPin, Users, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Globe} from 'lucide-react';

const VendorLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Mock vendor database (replace with real API later)
  const mockVendorData = {
    'microsoft': {
      name: 'Microsoft Corporation',
      domain: 'microsoft.com',
      industry: 'Technology Software',
      employees: '221,000',
      revenue: '$211.9B',
      location: 'Redmond, WA',
      founded: '1975',
      riskScore: 'Low',
      financialHealth: 'Excellent',
      marketCap: '$2.8T',
      insights: {
        negotiationOpportunity: 'High',
        competitivePosition: 'Market Leader',
        supplierDiversification: 'Consider multi-vendor strategy for leverage',
        costOptimization: 'Volume discounts available for enterprise licensing'
      },
      keyMetrics: [
        { label: 'Annual Revenue Growth', value: '+12%', trend: 'up' },
        { label: 'Market Position', value: '#1 in Cloud', trend: 'stable' },
        { label: 'Financial Stability', value: 'AAA Rating', trend: 'up' },
        { label: 'Supplier Risk', value: 'Very Low', trend: 'stable' }
      ]
    },
    'salesforce': {
      name: 'Salesforce, Inc.',
      domain: 'salesforce.com', 
      industry: 'Cloud Software',
      employees: '79,000',
      revenue: '$31.4B',
      location: 'San Francisco, CA',
      founded: '1999',
      riskScore: 'Low',
      financialHealth: 'Strong',
      marketCap: '$248B',
      insights: {
        negotiationOpportunity: 'Medium',
        competitivePosition: 'CRM Leader',
        supplierDiversification: 'HubSpot, Microsoft alternatives available',
        costOptimization: 'Multi-year contracts offer 15-20% savings'
      },
      keyMetrics: [
        { label: 'Annual Revenue Growth', value: '+18%', trend: 'up' },
        { label: 'Market Position', value: '#1 in CRM', trend: 'up' },
        { label: 'Financial Stability', value: 'Strong', trend: 'stable' },
        { label: 'Supplier Risk', value: 'Low', trend: 'stable' }
      ]
    },
    'zoom': {
      name: 'Zoom Video Communications',
      domain: 'zoom.us',
      industry: 'Video Communications',
      employees: '8,400',
      revenue: '$4.4B',
      location: 'San Jose, CA',
      founded: '2011',
      riskScore: 'Medium',
      financialHealth: 'Good',
      marketCap: '$21B',
      insights: {
        negotiationOpportunity: 'High',
        competitivePosition: 'Strong but competitive market',
        supplierDiversification: 'Teams, Google Meet, WebEx alternatives',
        costOptimization: 'Annual plans save 16%, consider seat optimization'
      },
      keyMetrics: [
        { label: 'Annual Revenue Growth', value: '-8%', trend: 'down' },
        { label: 'Market Position', value: 'Top 3', trend: 'down' },
        { label: 'Financial Stability', value: 'Stable', trend: 'stable' },
        { label: 'Supplier Risk', value: 'Medium', trend: 'up' }
      ]
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      const searchKey = searchTerm.toLowerCase();
      const found = mockVendorData[searchKey] || 
                   Object.values(mockVendorData).find(vendor => 
                     vendor.name.toLowerCase().includes(searchKey) ||
                     vendor.domain.includes(searchKey)
                   );
      
      setVendorData(found || null);
      setLoading(false);
    }, 1500);
  };

  const getRiskColor = (risk) => {
    switch(risk?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Search className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">Vendor Intelligence Lookup</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Research any vendor or supplier to get financial intelligence, risk assessment, and negotiation insights
      </p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter company name or domain (try: Microsoft, Salesforce, Zoom)"
              className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Analyze'}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600 mt-2">Analyzing vendor data...</p>
        </div>
      )}

      {/* No Results */}
      {searched && !loading && !vendorData && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-800 mb-2">Vendor Not Found</h4>
          <p className="text-sm text-gray-600 mb-4">
            We couldn't find data for "{searchTerm}". Try a different company name or domain.
          </p>
          <p className="text-xs text-gray-500">
            Try examples: Microsoft, Salesforce, Zoom, or their domains
          </p>
        </div>
      )}

      {/* Vendor Results */}
      {vendorData && !loading && (
        <div className="space-y-6">
          {/* Company Header */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-xl font-bold text-gray-800">{vendorData.name}</h4>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Globe className="w-4 h-4 mr-1" />
                  {vendorData.domain}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(vendorData.riskScore)}`}>
                {vendorData.riskScore} Risk
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <Building className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Industry</div>
                  <div className="font-medium">{vendorData.industry}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Employees</div>
                  <div className="font-medium">{vendorData.employees}</div>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Revenue</div>
                  <div className="font-medium">{vendorData.revenue}</div>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="font-medium">{vendorData.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Key Performance Indicators</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vendorData.keyMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600">{metric.label}</div>
                      <div className="font-semibold text-gray-800">{metric.value}</div>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Insights */}
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Strategic Insights & Recommendations</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <div className="font-medium text-blue-800">Negotiation Opportunity</div>
                </div>
                <div className="text-sm text-blue-700">{vendorData.insights.negotiationOpportunity}</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                  <div className="font-medium text-green-800">Market Position</div>
                </div>
                <div className="text-sm text-green-700">{vendorData.insights.competitivePosition}</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                  <div className="font-medium text-yellow-800">Diversification Strategy</div>
                </div>
                <div className="text-sm text-yellow-700">{vendorData.insights.supplierDiversification}</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-4 h-4 text-purple-600 mr-2" />
                  <div className="font-medium text-purple-800">Cost Optimization</div>
                </div>
                <div className="text-sm text-purple-700">{vendorData.insights.costOptimization}</div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
            <h5 className="font-semibold text-gray-800 mb-2">Recommended Actions</h5>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Schedule contract renegotiation before renewal</div>
              <div>• Benchmark pricing against identified alternatives</div>
              <div>• Assess financial stability for long-term partnerships</div>
              <div>• Review service level agreements and performance metrics</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorLookup;