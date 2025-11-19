import { Asset, AssetType } from '../types/asset';
import { AssetCard } from './AssetCard';
import { AddAssetModal } from './AddAssetModal';
import { EditAssetModal } from './EditAssetModal';
import { DeleteAssetModal } from './DeleteAssetModal';
import { InvestmentFlow } from './InvestmentFlow';
import { useState, useMemo } from 'react';
import { storage } from '../utils/storage';
import { filterAssetsByName, filterAssetsByType, sortAssets, AssetSortBy, AssetSortOrder } from '../utils/filters';
import { AssetTypeLabels } from '../types/asset';

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
  
  // Estados para filtros e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<AssetType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<AssetSortBy>('name');
  const [sortOrder, setSortOrder] = useState<AssetSortOrder>('asc');

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

  // Aplicar filtros e ordenação
  const filteredAndSortedAssets = useMemo(() => {
    let result = [...assets];
    
    // Filtrar por nome
    result = filterAssetsByName(result, searchTerm);
    
    // Filtrar por tipo
    result = filterAssetsByType(result, filterType);
    
    // Ordenar
    result = sortAssets(result, sortBy, sortOrder);
    
    return result;
  }, [assets, searchTerm, filterType, sortBy, sortOrder]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('ALL');
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm !== '' || filterType !== 'ALL' || sortBy !== 'name' || sortOrder !== 'asc';

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

      {assets.length > 0 && (
        <div className="futuristic-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Campo de busca */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Buscar por nome
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome do ativo..."
                  className="futuristic-input pl-10 text-base"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filtro por tipo */}
            <div className="flex-1">
              <label htmlFor="filterType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Filtrar por tipo
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as AssetType | 'ALL')}
                className="futuristic-select text-base"
              >
                <option value="ALL">Todos os tipos</option>
                {Object.entries(AssetTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="flex-1">
              <label htmlFor="sortBy" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <div className="flex gap-2">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as AssetSortBy)}
                  className="futuristic-select flex-1 text-base"
                >
                  <option value="name">Nome</option>
                  <option value="value">Valor</option>
                  <option value="createdAt">Data de criação</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 min-h-[44px] flex items-center justify-center"
                  title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
                >
                  {sortOrder === 'asc' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Contador e botão limpar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              {filteredAndSortedAssets.length === assets.length ? (
                <span>{filteredAndSortedAssets.length} ativo(s) cadastrado(s)</span>
              ) : (
                <span>
                  Mostrando {filteredAndSortedAssets.length} de {assets.length} ativo(s)
                </span>
              )}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs sm:text-sm text-futuristic-blue-600 hover:text-futuristic-blue-700 font-medium transition-colors duration-200"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

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
      ) : filteredAndSortedAssets.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 px-4">
          <p className="text-gray-500 text-base sm:text-lg mb-4">
            Nenhum ativo encontrado com os filtros aplicados.
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="futuristic-button text-sm sm:text-base min-h-[44px]"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedAssets.map((asset) => (
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

