'use client';

import React, { useState, useMemo } from 'react';
import { CostEstimate, CostComparison, CloudProvider } from '@/lib/cost/cost-calculator';

export interface CostDashboardProps {
  estimate: CostEstimate;
  comparison?: CostComparison;
  onProviderChange?: (provider: CloudProvider) => void;
  showComparison?: boolean;
  showOptimizations?: boolean;
}

export default function CostDashboard({
  estimate,
  comparison,
  onProviderChange,
  showComparison = false,
  showOptimizations = true,
}: CostDashboardProps) {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>(estimate.provider);
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const handleProviderChange = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    onProviderChange?.(provider);
  };

  const totalCost = timeframe === 'monthly' ? estimate.monthly : estimate.yearly;
  const serviceBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    for (const item of estimate.breakdown) {
      if (!breakdown[item.service]) {
        breakdown[item.service] = 0;
      }
      breakdown[item.service] += timeframe === 'monthly' ? item.monthlyCost : item.yearlyCost;
    }
    return breakdown;
  }, [estimate.breakdown, timeframe]);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cost Estimate</h2>
        
        <div className="flex items-center gap-4">
          {/* Timeframe Toggle */}
          <div className="flex border rounded">
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-4 py-2 text-sm ${
                timeframe === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('yearly')}
              className={`px-4 py-2 text-sm border-l ${
                timeframe === 'yearly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yearly
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 text-sm ${
                viewMode === 'chart'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm border-l ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Total Cost Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 mb-1">
              Estimated {timeframe === 'monthly' ? 'Monthly' : 'Yearly'} Cost
            </div>
            <div className="text-4xl font-bold">
              ${totalCost.toLocaleString()}
            </div>
            <div className="text-sm opacity-90 mt-1">
              {estimate.currency} · {estimate.provider.toUpperCase()} · {estimate.region}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-90">Confidence</div>
            <div className="text-2xl font-semibold capitalize">{estimate.confidence}</div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      {showComparison && comparison && (
        <CostComparisonCard comparison={comparison} timeframe={timeframe} />
      )}

      {/* Service Breakdown */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Cost by Service</h3>
        
        {viewMode === 'chart' ? (
          <ServiceBreakdownChart breakdown={serviceBreakdown} total={totalCost} />
        ) : (
          <ServiceBreakdownTable breakdown={estimate.breakdown} timeframe={timeframe} />
        )}
      </div>

      {/* Resource Details */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Resource Breakdown</h3>
        <ResourceTable resources={estimate.breakdown} timeframe={timeframe} />
      </div>

      {/* Cost Trends (Projection) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CostMetricCard
          title="Next 30 Days"
          value={`$${estimate.monthly.toLocaleString()}`}
          subtitle="Estimated cost"
          color="blue"
        />
        <CostMetricCard
          title="Next 90 Days"
          value={`$${(estimate.monthly * 3).toLocaleString()}`}
          subtitle="Projected cost"
          color="purple"
        />
        <CostMetricCard
          title="Annual Projection"
          value={`$${estimate.yearly.toLocaleString()}`}
          subtitle="Based on current usage"
          color="indigo"
        />
      </div>

      {/* Optimizations */}
      {showOptimizations && (
        <OptimizationsPanel estimate={estimate} />
      )}
    </div>
  );
}

// Cost Comparison Card
function CostComparisonCard({ 
  comparison, 
  timeframe 
}: { 
  comparison: CostComparison; 
  timeframe: 'monthly' | 'yearly' 
}) {
  const isSavings = comparison.savings > 0;
  const amount = timeframe === 'monthly' ? comparison.savings : comparison.savings * 12;

  return (
    <div className={`rounded-lg p-6 border-2 ${
      isSavings ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">
            Cost Impact
          </div>
          <div className={`text-3xl font-bold ${isSavings ? 'text-green-700' : 'text-red-700'}`}>
            {isSavings ? '-' : '+'}${Math.abs(amount).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {Math.abs(comparison.savingsPercentage).toFixed(1)}% {isSavings ? 'savings' : 'increase'}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600 mb-2">Before → After</div>
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-500">${comparison.before.monthly}</span>
              <span className="mx-2">→</span>
              <span className="font-semibold">${comparison.after.monthly}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700">{comparison.recommendation}</p>
      </div>
    </div>
  );
}

// Service Breakdown Chart (Bar chart)
function ServiceBreakdownChart({ 
  breakdown, 
  total 
}: { 
  breakdown: Record<string, number>; 
  total: number 
}) {
  const services = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const maxCost = Math.max(...services.map(([_, cost]) => cost));

  return (
    <div className="space-y-3">
      {services.map(([service, cost]) => {
        const percentage = (cost / total) * 100;
        const barWidth = (cost / maxCost) * 100;

        return (
          <div key={service} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{service}</span>
              <span className="text-gray-600">
                ${cost.toFixed(2)} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Service Breakdown Table
function ServiceBreakdownTable({ 
  breakdown, 
  timeframe 
}: { 
  breakdown: any[]; 
  timeframe: 'monthly' | 'yearly' 
}) {
  const grouped = breakdown.reduce((acc, item) => {
    if (!acc[item.service]) {
      acc[item.service] = [];
    }
    acc[item.service].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Service</th>
            <th className="px-4 py-3 text-left font-semibold">Resources</th>
            <th className="px-4 py-3 text-right font-semibold">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {Object.entries(grouped).map(([service, items]) => {
            const totalCost = items.reduce((sum, item) => 
              sum + (timeframe === 'monthly' ? item.monthlyCost : item.yearlyCost), 0
            );

            return (
              <tr key={service} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{service}</td>
                <td className="px-4 py-3 text-gray-600">{items.length}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  ${totalCost.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Resource Details Table
function ResourceTable({ 
  resources, 
  timeframe 
}: { 
  resources: any[]; 
  timeframe: 'monthly' | 'yearly' 
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Resource</th>
            <th className="px-4 py-3 text-left font-semibold">Type</th>
            <th className="px-4 py-3 text-left font-semibold">Service</th>
            <th className="px-4 py-3 text-right font-semibold">Quantity</th>
            <th className="px-4 py-3 text-right font-semibold">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {resources.map((resource, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{resource.resourceName}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {resource.resourceType}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{resource.service}</td>
              <td className="px-4 py-3 text-right text-gray-600">
                {resource.details.quantity} {resource.details.unit}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                ${(timeframe === 'monthly' ? resource.monthlyCost : resource.yearlyCost).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Cost Metric Card
function CostMetricCard({ 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  color: string 
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6 text-white`}>
      <div className="text-sm opacity-90 mb-2">{title}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-80">{subtitle}</div>
    </div>
  );
}

// Optimizations Panel
function OptimizationsPanel({ estimate }: { estimate: CostEstimate }) {
  const optimizations = [
    {
      title: 'Use Reserved Instances',
      potential: '30-40%',
      description: 'Commit to 1-3 year terms for consistent workloads',
    },
    {
      title: 'Enable Auto-Scaling',
      potential: '20-30%',
      description: 'Scale resources based on actual demand',
    },
    {
      title: 'Implement Storage Lifecycle',
      potential: '15-25%',
      description: 'Move old data to cheaper storage tiers',
    },
    {
      title: 'Right-Size Resources',
      potential: '10-20%',
      description: 'Match instance sizes to actual usage',
    },
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Cost Optimization Opportunities</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optimizations.map((opt, idx) => (
          <div key={idx} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold">{opt.title}</div>
              <div className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                Save {opt.potential}
              </div>
            </div>
            <p className="text-sm text-gray-600">{opt.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <div className="font-semibold text-blue-900 mb-1">Potential Savings</div>
            <div className="text-sm text-blue-700">
              Implementing these optimizations could reduce your monthly costs by{' '}
              <span className="font-bold">${(estimate.monthly * 0.3).toFixed(2)} - ${(estimate.monthly * 0.5).toFixed(2)}</span>
              {' '}(30-50%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Multi-Cloud Comparison Component
export function MultiCloudComparison({ 
  estimates 
}: { 
  estimates: { aws: CostEstimate; azure: CostEstimate; gcp: CostEstimate } 
}) {
  const providers = [
    { name: 'AWS', estimate: estimates.aws, color: 'from-orange-500 to-orange-600' },
    { name: 'Azure', estimate: estimates.azure, color: 'from-blue-500 to-blue-600' },
    { name: 'GCP', estimate: estimates.gcp, color: 'from-green-500 to-green-600' },
  ];

  const cheapest = providers.reduce((min, p) => 
    p.estimate.monthly < min.estimate.monthly ? p : min
  );

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Multi-Cloud Cost Comparison</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {providers.map((provider) => {
          const isCheapest = provider.name === cheapest.name;
          
          return (
            <div 
              key={provider.name}
              className={`relative rounded-lg p-6 text-white bg-gradient-to-br ${provider.color} ${
                isCheapest ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {isCheapest && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  Best Value
                </div>
              )}
              <div className="text-sm opacity-90 mb-1">{provider.name}</div>
              <div className="text-3xl font-bold mb-1">
                ${provider.estimate.monthly.toLocaleString()}
              </div>
              <div className="text-xs opacity-80">per month</div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-gray-600">
        Switching to {cheapest.name} could save you{' '}
        <span className="font-semibold">
          ${Math.max(...providers.map(p => p.estimate.monthly)) - cheapest.estimate.monthly} per month
        </span>
      </div>
    </div>
  );
}
