import { useState, useEffect } from 'react';
import { Asset, Investment } from './types/asset';
import { storage } from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { PortfolioAnalytics } from './components/PortfolioAnalytics';

type View = 'dashboard' | 'history' | 'analytics';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const loadData = () => {
    setAssets(storage.getAssets());
    setInvestments(storage.getInvestments());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssetsUpdate = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-futuristic-blue-600">S²</h1>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 hidden sm:inline">
                Stonks ao Quadrado
              </span>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setView('dashboard')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] ${
                  view === 'dashboard'
                    ? 'bg-futuristic-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] ${
                  view === 'history'
                    ? 'bg-futuristic-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Histórico
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] ${
                  view === 'analytics'
                    ? 'bg-futuristic-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Patrimônio
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {view === 'dashboard' && (
          <Dashboard assets={assets} onAssetsUpdate={handleAssetsUpdate} />
        )}
        {view === 'history' && (
          <TransactionHistory investments={investments} onInvestmentsUpdate={handleAssetsUpdate} />
        )}
        {view === 'analytics' && (
          <PortfolioAnalytics assets={assets} investments={investments} />
        )}
      </main>
    </div>
  );
}

export default App;

