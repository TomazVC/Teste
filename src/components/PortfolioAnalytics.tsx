import { Asset, Investment } from '../types/asset';
import { calculateMonthlyPortfolio } from '../utils/calculations';
import { EvolutionTable } from './EvolutionTable';
import { GrowthChart } from './GrowthChart';

interface PortfolioAnalyticsProps {
  assets: Asset[];
  investments: Investment[];
}

export const PortfolioAnalytics = ({ assets, investments }: PortfolioAnalyticsProps) => {
  const monthlyPortfolio = calculateMonthlyPortfolio(assets, investments);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Evolução do Patrimônio</h2>
        <p className="text-sm sm:text-base text-gray-600">Acompanhe a evolução mensal da sua carteira</p>
      </div>

      <div className="futuristic-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Tabela de Evolução Mensal</h3>
        <EvolutionTable portfolio={monthlyPortfolio} />
      </div>

      <div className="futuristic-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Gráfico de Crescimento</h3>
        <GrowthChart portfolio={monthlyPortfolio} />
      </div>
    </div>
  );
};

