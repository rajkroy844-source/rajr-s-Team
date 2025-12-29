
import React from 'react';
import { GlobalStats } from '../types';

interface Props {
  stats: GlobalStats;
}

const GlobalOverview: React.FC<Props> = ({ stats }) => {
  const metrics = [
    { label: 'Total Box Office', value: stats.totalBoxOffice, icon: '💰', color: 'text-emerald-400' },
    { label: 'Critics Score', value: `${stats.criticScore}%`, icon: '✍️', color: 'text-blue-400' },
    { label: 'Audience Score', value: `${stats.audienceScore}%`, icon: '🍿', color: 'text-amber-400' },
    { label: 'Reach Index', value: `${stats.globalReachIndex}/10`, icon: '🌍', color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-2xl mb-2">{m.icon}</span>
          <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">{m.label}</span>
          <span className={`text-xl font-black ${m.color}`}>{m.value}</span>
        </div>
      ))}
    </div>
  );
};

export default GlobalOverview;
