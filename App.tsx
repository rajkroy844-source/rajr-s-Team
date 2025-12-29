
import React, { useState, useCallback } from 'react';
import { analyzeMovieRegionally } from './services/geminiService';
import { MovieAnalysis, AppState } from './types';
import MovieDashboard from './components/MovieDashboard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<AppState>({
    isSearching: false,
    movieData: null,
    error: null
  });

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setState(prev => ({ ...prev, isSearching: true, error: null }));
    
    try {
      const data = await analyzeMovieRegionally(query);
      setState({
        isSearching: false,
        movieData: data,
        error: null
      });
    } catch (err: any) {
      setState({
        isSearching: false,
        movieData: null,
        error: err.message || 'An unexpected error occurred'
      });
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-950 pb-20">
      {/* Navbar / Header */}
      <header className="w-full bg-slate-900/50 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">CineRegional</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <span className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors">Global Markets</span>
            <span className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors">Streaming Trends</span>
            <span className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors">Grounding Search</span>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-6xl px-6 pt-12">
        {/* Search Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Global Movie <span className="text-blue-500">Market Insights</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Analyze regional box office, streaming availability, and popularity trends for any movie using Gemini 3 and Real-time Search Grounding.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter movie title (e.g., Dune: Part Two, Avengers, Godzilla...)"
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-2xl placeholder:text-slate-600"
            />
            <button
              type="submit"
              disabled={state.isSearching}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 rounded-xl font-semibold transition-all flex items-center gap-2 active:scale-95"
            >
              {state.isSearching ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Analyze</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Content Area */}
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {state.error}
          </div>
        )}

        {state.isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-slate-400 animate-pulse">Fetching global data and search results...</p>
          </div>
        ) : state.movieData ? (
          <MovieDashboard data={state.movieData} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl h-64 flex items-center justify-center italic text-slate-500">
                Search for a movie to see analysis
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-20 py-10 border-t border-slate-900 w-full text-center">
        <p className="text-slate-500 text-sm">
          Powered by Gemini 3 Flash & Google Search Grounding • © 2024 CineRegional
        </p>
      </footer>
    </div>
  );
};

export default App;
