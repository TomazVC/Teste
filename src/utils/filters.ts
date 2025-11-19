import { Asset, AssetType, Investment } from '../types/asset';
import { isUnitBased } from '../types/asset';

// Tipos para ordenação
export type AssetSortBy = 'name' | 'value' | 'createdAt';
export type AssetSortOrder = 'asc' | 'desc';
export type InvestmentSortBy = 'date' | 'executedValue' | 'name';
export type InvestmentSortOrder = 'asc' | 'desc';

// Calcular valor total de um ativo
const getAssetValue = (asset: Asset): number => {
  if (isUnitBased(asset.type)) {
    return asset.quantity * asset.averagePrice;
  } else {
    return asset.value;
  }
};

// Filtrar ativos por nome
export const filterAssetsByName = (assets: Asset[], searchTerm: string): Asset[] => {
  if (!searchTerm.trim()) {
    return assets;
  }
  const term = searchTerm.toLowerCase().trim();
  return assets.filter((asset) => asset.name.toLowerCase().includes(term));
};

// Filtrar ativos por tipo
export const filterAssetsByType = (assets: Asset[], type: AssetType | 'ALL'): Asset[] => {
  if (type === 'ALL') {
    return assets;
  }
  return assets.filter((asset) => asset.type === type);
};

// Ordenar ativos
export const sortAssets = (
  assets: Asset[],
  sortBy: AssetSortBy,
  sortOrder: AssetSortOrder
): Asset[] => {
  const sorted = [...assets].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
        break;
      case 'value':
        const valueA = getAssetValue(a);
        const valueB = getAssetValue(b);
        comparison = valueA - valueB;
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

// Filtrar investimentos por período
export const filterInvestmentsByPeriod = (
  investments: Investment[],
  startDate: string | null,
  endDate: string | null
): Investment[] => {
  if (!startDate && !endDate) {
    return investments;
  }

  return investments.filter((investment) => {
    const investmentDate = new Date(investment.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      // Ajustar para incluir o dia inteiro
      const endDateWithTime = new Date(end);
      endDateWithTime.setHours(23, 59, 59, 999);
      return investmentDate >= start && investmentDate <= endDateWithTime;
    } else if (start) {
      return investmentDate >= start;
    } else if (end) {
      const endDateWithTime = new Date(end);
      endDateWithTime.setHours(23, 59, 59, 999);
      return investmentDate <= endDateWithTime;
    }

    return true;
  });
};

// Ordenar investimentos
export const sortInvestments = (
  investments: Investment[],
  sortBy: InvestmentSortBy,
  sortOrder: InvestmentSortOrder
): Investment[] => {
  const sorted = [...investments].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'executedValue':
        comparison = a.executedValue - b.executedValue;
        break;
      case 'name':
        // Usar o nome do primeiro ativo da transação
        const nameA = a.items.length > 0 ? a.items[0].assetName : '';
        const nameB = b.items.length > 0 ? b.items[0].assetName : '';
        comparison = nameA.localeCompare(nameB, 'pt-BR', { sensitivity: 'base' });
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

