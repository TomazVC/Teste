import { Asset } from '../types/asset';
import { storage } from '../utils/storage';
import { AssetTypeLabels } from '../types/asset';

interface DeleteAssetModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAssetModal = ({ isOpen, asset, onClose, onConfirm }: DeleteAssetModalProps) => {
  if (!isOpen || !asset) return null;

  const investments = storage.getInvestments();
  const hasTransactions = investments.some((inv) =>
    inv.items.some((item) => item.assetId === asset.id)
  );

  const handleConfirm = () => {
    storage.deleteAsset(asset.id);
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-8 w-full max-w-md mx-auto border border-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Remover Ativo</h2>
        
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Tem certeza que deseja remover o ativo <strong>{asset.name}</strong> ({AssetTypeLabels[asset.type]})?
          </p>
          
          {hasTransactions && (
            <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-xs sm:text-sm text-amber-800 font-medium mb-2">
                ⚠️ Atenção: Este ativo possui transações associadas.
              </p>
              <p className="text-xs sm:text-sm text-amber-700">
                A remoção do ativo não excluirá as transações, mas elas não serão mais exibidas no histórico relacionado a este ativo.
              </p>
            </div>
          )}
          
          <p className="text-xs sm:text-sm text-gray-600">
            Esta ação não pode ser desfeita.
          </p>
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
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md min-h-[44px] text-sm sm:text-base"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

