import { MonthlyPortfolio } from '../types/asset';
import { AssetType, AssetTypeLabels } from '../types/asset';
import { formatCurrency } from '../utils/calculations';

interface EvolutionTableProps {
  portfolio: MonthlyPortfolio[];
}

export const EvolutionTable = ({ portfolio }: EvolutionTableProps) => {
  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum dado de evolução disponível ainda.</p>
      </div>
    );
  }

  const assetTypes = [
    AssetType.ACAO,
    AssetType.FII,
    AssetType.ETF_BR,
    AssetType.ETF_GB,
    AssetType.CRIPTO,
  ];

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 sticky left-0 bg-white z-10">Mês</th>
            {assetTypes.map((type) => (
              <th
                key={type}
                className="text-right py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap"
                style={{ color: AssetTypeLabels[type] }}
              >
                {AssetTypeLabels[type]}
              </th>
            ))}
            <th className="text-right py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Total</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((month, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">{month.month}</td>
              {assetTypes.map((type) => (
                <td key={type} className="text-right py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  {formatCurrency(month.assets[type])}
                </td>
              ))}
              <td className="text-right py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                {formatCurrency(month.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

