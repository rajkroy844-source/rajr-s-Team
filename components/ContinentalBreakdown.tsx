
import React from 'react';
import { ContinentalData } from '../types';

interface Props {
  data: ContinentalData[];
}

const ContinentalBreakdown: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
      <h3 className="text-xl font-semibold mb-6 text-slate-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Continental Market Share
      </h3>
      <div className="space-y-6">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-slate-200 font-bold">{item.continent}</span>
                <span className="text-xs text-slate-500 ml-2">Primary: {item.topCountry}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-slate-400 mr-2">{item.status}</span>
                <span className="text-lg font-bold text-white">{item.marketShare}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-1000"
                style={{ width: `${item.marketShare}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinentalBreakdown;
