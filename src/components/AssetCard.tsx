import { Asset } from '../types/asset';
import { AssetTypeLabels, AssetTypeColors, isUnitBased } from '../types/asset';
import { formatCurrency } from '../utils/calculations';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
}

export const AssetCard = ({ asset, onClick, onEdit, onDelete }: AssetCardProps) => {
  const color = AssetTypeColors[asset.type];
  const isUnit = isUnitBased(asset.type);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(asset);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(asset);
  };

  return (
    <div
      onClick={onClick}
      className="futuristic-card p-6 cursor-pointer hover:border-futuristic-blue-300 transition-all duration-300 relative"
      style={{
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{asset.name}</h3>
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {AssetTypeLabels[asset.type]}
          </span>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-futuristic-blue-600 hover:bg-futuristic-blue-50 rounded-lg transition-all duration-200"
              title="Editar ativo"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Remover ativo"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {isUnit ? 'Quantidade' : 'Valor Atual'}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {isUnit
              ? `${asset.quantity.toLocaleString('pt-BR')} un`
              : formatCurrency(asset.value)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Preço Médio</p>
          <p className="text-lg font-semibold text-gray-900">
            {isUnit
              ? formatCurrency(asset.averagePrice)
              : formatCurrency(asset.averagePrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

