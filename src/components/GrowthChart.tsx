import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { MonthlyPortfolio } from '../types/asset';
import { AssetType, AssetTypeColors, AssetTypeLabels } from '../types/asset';
import { formatCurrency } from '../utils/calculations';

interface GrowthChartProps {
  portfolio: MonthlyPortfolio[];
}

export const GrowthChart = ({ portfolio }: GrowthChartProps) => {
  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum dado disponível para o gráfico.</p>
      </div>
    );
  }

  const chartData = portfolio.map((month) => ({
    month: month.month,
    [AssetTypeLabels[AssetType.ACAO]]: month.assets[AssetType.ACAO],
    [AssetTypeLabels[AssetType.FII]]: month.assets[AssetType.FII],
    [AssetTypeLabels[AssetType.ETF_BR]]: month.assets[AssetType.ETF_BR],
    [AssetTypeLabels[AssetType.ETF_GB]]: month.assets[AssetType.ETF_GB],
    [AssetTypeLabels[AssetType.CRIPTO]]: month.assets[AssetType.CRIPTO],
    Total: month.total,
  }));

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value as number)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
              return `R$ ${value}`;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey={AssetTypeLabels[AssetType.ACAO]}
            stroke={AssetTypeColors[AssetType.ACAO]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey={AssetTypeLabels[AssetType.FII]}
            stroke={AssetTypeColors[AssetType.FII]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey={AssetTypeLabels[AssetType.ETF_BR]}
            stroke={AssetTypeColors[AssetType.ETF_BR]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey={AssetTypeLabels[AssetType.ETF_GB]}
            stroke={AssetTypeColors[AssetType.ETF_GB]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey={AssetTypeLabels[AssetType.CRIPTO]}
            stroke={AssetTypeColors[AssetType.CRIPTO]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#111827"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

