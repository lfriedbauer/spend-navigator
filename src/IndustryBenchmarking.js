import React from 'react';
import { Target, Award, TrendingUp } from 'lucide-react';

const IndustryBenchmarking = ({ industry, indirectSpendPercent, revenue }) => {
  const industryBenchmarks = {
    'retail': { average: 15, topQuartile: 12, topDecile: 10 },
    'manufacturing': { average: 14, topQuartile: 11, topDecile: 9 },
    'technology': { average: 21, topQuartile: 18, topDecile: 15 },
    'healthcare': { average: 22.5, topQuartile: 19, topDecile: 16 },
    'financial-services': { average: 30, topQuartile: 25, topDecile: 20 },
    'construction': { average: 12.5, topQuartile: 10, topDecile: 8 },
    'professional-services': { average: 30, topQuartile: 25, topDecile: 20 },
    'energy': { average: 17.8, topQuartile: 15, topDecile: 12 },
    'telecommunications': { average: 17.8, topQuartile: 15, topDecile: 12 },
    'transportation': { average: 17.8, topQuartile: 15, topDecile: 12 }
  };

  const benchmark = industryBenchmarks[industry];
  const userSpend = indirectSpendPercent;

  const getPerformanceLevel = () => {
    if (userSpend <= benchmark.topDecile) return { level: 'Top 10%', color: 'text-green-600', bg: 'bg-green-50' };
    if (userSpend <= benchmark.topQuartile) return { level: 'Top 25%', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (userSpend <= benchmark.average) return { level: 'Above Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Below Average', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const performance = getPerformanceLevel();
  const potentialSavings = Math.max(0, (userSpend - benchmark.topQuartile) / 100 * revenue);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <Target className="w-4 h-4 text-purple-600 mr-2" />
        <h3 className="text-sm font-bold text-gray-800">Industry Benchmarking</h3>
      </div>

      <div className="space-y-4">
        {/* Performance Level */}
        <div className={`${performance.bg} rounded-lg p-3 border`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-600 mb-1">Your Performance</div>
              <div className={`text-sm font-bold ${performance.color}`}>{performance.level}</div>
            </div>
            <Award className={`w-5 h-5 ${performance.color}`} />
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Your Spend:</span>
            <span className="text-sm font-bold text-gray-800">{userSpend}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Industry Average:</span>
            <span className="text-sm text-gray-600">{benchmark.average}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Top 25%:</span>
            <span className="text-sm text-blue-600">{benchmark.topQuartile}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Top 10%:</span>
            <span className="text-sm text-green-600">{benchmark.topDecile}%</span>
          </div>
        </div>

        {/* Potential Improvement */}
        {potentialSavings > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <div className="text-xs font-semibold text-green-800">Optimization Opportunity</div>
            </div>
            <div className="text-sm text-green-700">
              Reaching top 25% performance could save <strong>${potentialSavings.toFixed(1)}M annually</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryBenchmarking;