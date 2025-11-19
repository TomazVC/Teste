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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Evolução do Patrimônio</h2>
        <p className="text-gray-600">Acompanhe a evolução mensal da sua carteira</p>
      </div>

      <div className="futuristic-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Tabela de Evolução Mensal</h3>
        <EvolutionTable portfolio={monthlyPortfolio} />
      </div>

      <div className="futuristic-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Gráfico de Crescimento</h3>
        <GrowthChart portfolio={monthlyPortfolio} />
      </div>
    </div>
  );
};

