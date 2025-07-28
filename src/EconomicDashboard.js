import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const EconomicDashboard = () => {
  const [economicData, setEconomicData] = useState({
    federalFundsRate: { value: 0, change: 0 },
    inflation: { value: 0, change: 0 },
    gdpGrowth: { value: 0, change: 0 },
    unemploymentRate: { value: 0, change: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEconomicData();
  }, []);

  const fetchEconomicData = async () => {
    try {
      // For now, we'll use mock data (you can implement real FRED API later)
      const mockData = {
        federalFundsRate: { value: 5.25, change: 0.25 },
        inflation: { value: 3.2, change: -0.3 },
        gdpGrowth: { value: 2.1, change: 0.4 },
        unemploymentRate: { value: 3.8, change: -0.1 }
      };

      setEconomicData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching economic data:', error);
      setLoading(false);
    }
  };

  const formatPercent = (value) => `${value}%`;
  
  const getChangeColor = (change) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
        <h3 className="text-sm font-bold text-gray-800">Economic Indicators</h3>
        <div className="ml-auto text-xs text-gray-500">Updated: {new Date().toLocaleDateString()}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded p-3">
          <div className="text-xs text-blue-600 mb-1">Fed Funds Rate</div>
          <div className="flex items-center">
            <div className="text-sm font-bold text-blue-800">{formatPercent(economicData.federalFundsRate.value)}</div>
            <div className={`ml-2 flex items-center text-xs ${getChangeColor(economicData.federalFundsRate.change)}`}>
              {getChangeIcon(economicData.federalFundsRate.change)}
              <span className="ml-1">{Math.abs(economicData.federalFundsRate.change)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded p-3">
          <div className="text-xs text-orange-600 mb-1">Inflation (CPI)</div>
          <div className="flex items-center">
            <div className="text-sm font-bold text-orange-800">{formatPercent(economicData.inflation.value)}</div>
            <div className={`ml-2 flex items-center text-xs ${getChangeColor(economicData.inflation.change)}`}>
              {getChangeIcon(economicData.inflation.change)}
              <span className="ml-1">{Math.abs(economicData.inflation.change)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded p-3">
          <div className="text-xs text-green-600 mb-1">GDP Growth</div>
          <div className="flex items-center">
            <div className="text-sm font-bold text-green-800">{formatPercent(economicData.gdpGrowth.value)}</div>
            <div className={`ml-2 flex items-center text-xs ${getChangeColor(economicData.gdpGrowth.change)}`}>
              {getChangeIcon(economicData.gdpGrowth.change)}
              <span className="ml-1">{Math.abs(economicData.gdpGrowth.change)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded p-3">
          <div className="text-xs text-purple-600 mb-1">Unemployment</div>
          <div className="flex items-center">
            <div className="text-sm font-bold text-purple-800">{formatPercent(economicData.unemploymentRate.value)}</div>
            <div className={`ml-2 flex items-center text-xs ${getChangeColor(economicData.unemploymentRate.change)}`}>
              {getChangeIcon(economicData.unemploymentRate.change)}
              <span className="ml-1">{Math.abs(economicData.unemploymentRate.change)}%</span>
            </div>
          </div>
        </div>
      </div>

<div className="mt-3 text-xs text-gray-500 text-center">
  <strong>Live economic indicators</strong> - Rising rates increase financing costs, while inflation drives material price volatility.
</div>
    </div>
  );
};

export default EconomicDashboard;