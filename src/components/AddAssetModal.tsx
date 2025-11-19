import { useState } from 'react';
import { AssetType, AssetTypeLabels } from '../types/asset';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, type: AssetType) => void;
}

export const AddAssetModal = ({ isOpen, onClose, onSave }: AddAssetModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>(AssetType.ACAO);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), type);
      setName('');
      setType(AssetType.ACAO);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-8 w-full max-w-md mx-auto border border-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Adicionar Novo Ativo</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome/Ticker
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="futuristic-input text-base"
              placeholder="Ex: PETR4, HGLG11, BTC"
              required
              autoFocus
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ativo
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as AssetType)}
              className="futuristic-select text-base"
            >
              {Object.values(AssetType).map((assetType) => (
                <option key={assetType} value={assetType}>
                  {AssetTypeLabels[assetType]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 min-h-[44px] text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="futuristic-button flex-1 min-h-[44px] text-sm sm:text-base"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

