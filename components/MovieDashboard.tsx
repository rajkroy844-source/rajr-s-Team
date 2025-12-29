
import React, { useState } from 'react';
import { MovieAnalysis } from '../types';
import RegionalChart from './RegionalChart';
import ContinentalBreakdown from './ContinentalBreakdown';
import GlobalOverview from './GlobalOverview';

interface Props {
  data: MovieAnalysis;
}

const MovieDashboard: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'markets' | 'evidence'>('overview');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-5xl font-black text-white">{data.title}</h2>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded border border-slate-700 font-bold uppercase">
              {data.globalStats.releaseStatus}
            </span>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
            {data.summary}
          </p>
        </div>
        <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <span className="text-sm font-bold text-blue-400 uppercase tracking-tighter">Verified by Search Grounding</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-8">
        {[
          { id: 'overview', label: 'Global Overview', icon: '📊' },
          { id: 'markets', label: 'Market Depth', icon: '🌐' },
          { id: 'evidence', label: 'Search Evidence', icon: '🔍' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <GlobalOverview stats={data.globalStats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-blue-500">⚡</span> Global Market Highlights
                  </h3>
                  <ul className="space-y-4">
                    {data.globalHighlights.map((h, i) => (
                      <li key={i} className="flex gap-4 group">
                        <span className="text-slate-600 font-mono text-sm pt-1">0{i+1}</span>
                        <p className="text-slate-300 group-hover:text-white transition-colors">{h}</p>
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="relative group overflow-hidden rounded-3xl">
                  <img 
                    src={`https://picsum.photos/seed/${encodeURIComponent(data.title)}/800/600`} 
                    alt={data.title} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h4 className="text-white text-2xl font-black">{data.title}</h4>
                    <p className="text-slate-400 text-sm">Visual Asset Insight</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RegionalChart data={data.regionalBreakdown} />
              <ContinentalBreakdown data={data.continentalBreakdown} />
            </div>
            
            <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Market Trends by Territory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.regionalBreakdown.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-200">{item.region}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                        {item.availability.join(' • ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-black text-xl">${item.boxOffice}M</div>
                      <div className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full inline-block font-bold mt-1">
                        SCORE: {item.popularityScore}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 border-dashed">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Search Evidence</h3>
                  <p className="text-slate-500">Data synthesized from real-time web grounding</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-blue-500 transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-slate-800 text-slate-500 text-[10px] px-2 py-1 rounded font-black">REF {idx + 1}</span>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <h4 className="text-slate-200 font-bold mb-2 group-hover:text-white transition-colors line-clamp-2">
                      {source.title}
                    </h4>
                    <p className="text-slate-600 text-[10px] break-all group-hover:text-slate-400">
                      {new URL(source.uri).hostname}
                    </p>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-center py-10 border border-slate-800 rounded-3xl bg-slate-900/20">
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Information provided is gathered through the Gemini Search Grounding engine. Market figures are estimates based on aggregated search results and official reports.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDashboard;
