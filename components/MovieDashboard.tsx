
import React from 'react';
import { MovieAnalysis } from '../types';
import RegionalChart from './RegionalChart';
import ContinentalBreakdown from './ContinentalBreakdown';

interface Props {
  data: MovieAnalysis;
}

const MovieDashboard: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400">Search Grounded</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white mb-4">{data.title}</h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              {data.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {data.globalHighlights.length > 0 ? (
                data.globalHighlights.slice(0, 4).map((highlight, i) => (
                  <span key={i} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                    {highlight}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm italic">Gathering highlights from search results...</span>
              )}
            </div>
          </div>
          <div className="md:w-1/3 flex flex-col justify-center">
             <img 
               src={`https://picsum.photos/seed/${encodeURIComponent(data.title)}/400/600`} 
               alt={data.title} 
               className="rounded-xl shadow-2xl object-cover h-64 w-full border border-slate-700" 
             />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RegionalChart data={data.regionalBreakdown} />
        <ContinentalBreakdown data={data.continentalBreakdown} />
      </div>

      {/* Detailed Regional List */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-semibold mb-6 text-slate-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Live Market Trends & Platforms
        </h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {data.regionalBreakdown.length > 0 ? (
            data.regionalBreakdown.map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center group hover:bg-slate-800 transition-colors">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-200">{item.region}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.availability.map((plat, pIdx) => (
                      <span key={pIdx} className="text-[10px] font-bold uppercase tracking-tight text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-emerald-400 font-mono text-xl font-bold">${item.boxOffice.toLocaleString()}M</div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Interest:</span>
                      <span className="text-xs font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded">{item.popularityScore}%</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 italic">
              No detailed regional data found. Search grounding is processing...
            </div>
          )}
        </div>
      </div>

      {/* Grounding Source Attribution */}
      {data.sources.length > 0 && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 text-slate-500">
             <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12.545 11.027v2.909h4.145c-.173 1.1-.982 2.8-2.836 4.091l-2.436-1.891c1.236-1.055 1.964-2.618 1.964-4.473 0-.309-.036-.618-.091-.918l-4.145.001c-.136 2.027.709 3.864 2.145 5.2l.001.001c-1.4 1.1-3.236 1.764-5.273 1.764-4.418 0-8-3.582-8-8s3.582-8 8-8c2.182 0 4.145.8 5.673 2.1l-2.4 2.4c-1.018-.945-2.291-1.5-3.273-1.5-2.473 0-4.473 2-4.473 4.473s2 4.473 4.473 4.473c2.727 0 3.745-1.927 3.909-2.909h-3.909z"/>
             </svg>
             <h4 className="text-sm font-bold uppercase tracking-widest">Search Citations</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 transition-all hover:border-blue-500/50"
              >
                <span className="text-xs text-blue-400 font-medium mb-1 flex items-center gap-1">
                  Reference {idx + 1}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
                <span className="text-slate-300 text-sm font-semibold line-clamp-1">
                  {source.title || "External Market Report"}
                </span>
                <span className="text-slate-600 text-[10px] mt-1 break-all line-clamp-1">
                  {source.uri}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDashboard;
