import { Asset } from '../types/asset';
import { AssetCard } from './AssetCard';
import { AddAssetModal } from './AddAssetModal';
import { EditAssetModal } from './EditAssetModal';
import { DeleteAssetModal } from './DeleteAssetModal';
import { InvestmentFlow } from './InvestmentFlow';
import { useState } from 'react';
import { storage } from '../utils/storage';

interface DashboardProps {
  assets: Asset[];
  onAssetsUpdate: () => void;
}

export const Dashboard = ({ assets, onAssetsUpdate }: DashboardProps) => {
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isEditAssetModalOpen, setIsEditAssetModalOpen] = useState(false);
  const [isDeleteAssetModalOpen, setIsDeleteAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isInvestmentFlowOpen, setIsInvestmentFlowOpen] = useState(false);

  const handleAddAsset = (name: string, type: Asset['type']) => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      name,
      type,
      quantity: 0,
      value: 0,
      averagePrice: 0,
      createdAt: new Date().toISOString(),
    };

    const currentAssets = storage.getAssets();
    currentAssets.push(newAsset);
    storage.saveAssets(currentAssets);
    onAssetsUpdate();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Carteira de Investimentos</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Gerencie seus ativos e acompanhe sua evolução</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => setIsAddAssetModalOpen(true)}
            className="futuristic-button w-full sm:w-auto text-sm sm:text-base min-h-[44px]"
          >
            Adicionar Novo Ativo
          </button>
          <button
            onClick={() => setIsInvestmentFlowOpen(true)}
            className="futuristic-button w-full sm:w-auto text-sm sm:text-base min-h-[44px]"
            disabled={assets.length === 0}
          >
            Realizar Aporte/Investimento
          </button>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 px-4">
          <p className="text-gray-500 text-base sm:text-lg mb-4">
            Nenhum ativo cadastrado ainda.
          </p>
          <button
            onClick={() => setIsAddAssetModalOpen(true)}
            className="futuristic-button text-sm sm:text-base min-h-[44px]"
          >
            Adicionar Primeiro Ativo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={(asset) => {
                setSelectedAsset(asset);
                setIsEditAssetModalOpen(true);
              }}
              onDelete={(asset) => {
                setSelectedAsset(asset);
                setIsDeleteAssetModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <AddAssetModal
        isOpen={isAddAssetModalOpen}
        onClose={() => setIsAddAssetModalOpen(false)}
        onSave={handleAddAsset}
      />

      <EditAssetModal
        isOpen={isEditAssetModalOpen}
        asset={selectedAsset}
        onClose={() => {
          setIsEditAssetModalOpen(false);
          setSelectedAsset(null);
        }}
        onSave={onAssetsUpdate}
      />

      <DeleteAssetModal
        isOpen={isDeleteAssetModalOpen}
        asset={selectedAsset}
        onClose={() => {
          setIsDeleteAssetModalOpen(false);
          setSelectedAsset(null);
        }}
        onConfirm={onAssetsUpdate}
      />

      {isInvestmentFlowOpen && (
        <InvestmentFlow
          assets={assets}
          onClose={() => setIsInvestmentFlowOpen(false)}
          onAssetsUpdate={onAssetsUpdate}
        />
      )}
    </div>
  );
};

