import { useState, useEffect } from 'react';
import { Asset, AssetType, AssetTypeLabels } from '../types/asset';
import { storage } from '../utils/storage';

interface EditAssetModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onSave: () => void;
}

export const EditAssetModal = ({ isOpen, asset, onClose, onSave }: EditAssetModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>(AssetType.ACAO);
  const [hasTransactions, setHasTransactions] = useState(false);
  const [typeChanged, setTypeChanged] = useState(false);

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setType(asset.type);
      
      // Verificar se há transações associadas
      const investments = storage.getInvestments();
      const hasTrans = investments.some((inv) =>
        inv.items.some((item) => item.assetId === asset.id)
      );
      setHasTransactions(hasTrans);
      setTypeChanged(false);
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const handleTypeChange = (newType: AssetType) => {
    setType(newType);
    setTypeChanged(newType !== asset.type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const updatedAsset: Asset = {
        ...asset,
        name: name.trim(),
        type: type,
      };
      storage.updateAsset(updatedAsset);
      onSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Ativo</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome/Ticker
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="futuristic-input"
              placeholder="Ex: PETR4, HGLG11, BTC"
              required
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ativo
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as AssetType)}
              className="futuristic-select"
              disabled={hasTransactions}
            >
              {Object.values(AssetType).map((assetType) => (
                <option key={assetType} value={assetType}>
                  {AssetTypeLabels[assetType]}
                </option>
              ))}
            </select>
            {hasTransactions && (
              <p className="mt-2 text-sm text-amber-600">
                Não é possível alterar o tipo de ativo que possui transações associadas.
              </p>
            )}
            {!hasTransactions && typeChanged && (
              <p className="mt-2 text-sm text-blue-600">
                A alteração do tipo pode afetar os cálculos históricos.
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="futuristic-button flex-1"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

