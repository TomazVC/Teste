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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-4 px-4 font-semibold text-gray-900">Mês</th>
            {assetTypes.map((type) => (
              <th
                key={type}
                className="text-right py-4 px-4 font-semibold text-gray-900"
                style={{ color: AssetTypeLabels[type] }}
              >
                {AssetTypeLabels[type]}
              </th>
            ))}
            <th className="text-right py-4 px-4 font-semibold text-gray-900">Total</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((month, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="py-4 px-4 font-medium text-gray-900">{month.month}</td>
              {assetTypes.map((type) => (
                <td key={type} className="text-right py-4 px-4 text-gray-700">
                  {formatCurrency(month.assets[type])}
                </td>
              ))}
              <td className="text-right py-4 px-4 font-semibold text-gray-900">
                {formatCurrency(month.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

