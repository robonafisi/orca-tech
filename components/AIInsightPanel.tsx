import React, { useState } from 'react';
import { Truck, InsightResult } from '../types';
import { analyzeFleetEfficiency } from '../services/geminiService';
import { Sparkles, AlertTriangle, CheckCircle, AlertOctagon, RefreshCw } from 'lucide-react';

interface AIInsightPanelProps {
  selectedTruck: Truck;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ selectedTruck }) => {
  const [insights, setInsights] = useState<InsightResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const results = await analyzeFleetEfficiency(selectedTruck);
    setInsights(results);
    setLoading(false);
  };

  // Reset insights when truck changes
  React.useEffect(() => {
    setInsights(null);
  }, [selectedTruck.id]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Sparkles size={20} />
          </div>
          <h3 className="font-semibold text-slate-800">Orca AI Analysis</h3>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-orca-900 hover:bg-orca-800 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        {!insights && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl">
            <Sparkles className="mb-3 text-slate-300" size={48} />
            <p className="max-w-xs">Click "Generate Insights" to let Orca AI analyze telemetry data for anomalies and efficiency gains.</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-slate-100 rounded-xl w-full"></div>
            <div className="h-24 bg-slate-100 rounded-xl w-full"></div>
            <div className="h-24 bg-slate-100 rounded-xl w-full"></div>
          </div>
        )}

        {insights && (
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1 rounded-full ${
                    insight.severity === 'critical' ? 'text-red-500 bg-red-50' :
                    insight.severity === 'medium' ? 'text-amber-500 bg-amber-50' :
                    'text-green-500 bg-green-50'
                  }`}>
                    {insight.severity === 'critical' ? <AlertOctagon size={20} /> :
                     insight.severity === 'medium' ? <AlertTriangle size={20} /> :
                     <CheckCircle size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{insight.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Recommendation</p>
                      <p className="text-sm text-slate-700">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};