export enum AssetType {
  ACAO = 'ACAO',
  FII = 'FII',
  ETF_BR = 'ETF_BR',
  ETF_GB = 'ETF_GB',
  CRIPTO = 'CRIPTO',
}

export const AssetTypeLabels: Record<AssetType, string> = {
  [AssetType.ACAO]: 'Ação',
  [AssetType.FII]: 'FIIs',
  [AssetType.ETF_BR]: 'ETF-BR',
  [AssetType.ETF_GB]: 'ETF-GB',
  [AssetType.CRIPTO]: 'Cripto',
};

export const AssetTypeColors: Record<AssetType, string> = {
  [AssetType.ACAO]: '#2563EB', // Blue 600
  [AssetType.FII]: '#1D4ED8', // Blue 700
  [AssetType.ETF_BR]: '#1E40AF', // Blue 800
  [AssetType.ETF_GB]: '#3B82F6', // Blue 500
  [AssetType.CRIPTO]: '#60A5FA', // Blue 400
};

export const isUnitBased = (type: AssetType): boolean => {
  return type === AssetType.ACAO || type === AssetType.FII || type === AssetType.ETF_BR;
};

export const isValueBased = (type: AssetType): boolean => {
  return type === AssetType.ETF_GB || type === AssetType.CRIPTO;
};

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  quantity: number; // Para ativos unitários
  value: number; // Para ETF-GB e Cripto (em BRL)
  averagePrice: number; // Preço médio (para unitários) ou valor acumulado (para value-based)
  createdAt: string;
}

export interface InvestmentItem {
  assetId: string;
  assetName: string;
  assetType: AssetType;
  price?: number; // Para ativos unitários
  quantity?: number; // Para ativos unitários
  investedValue?: number; // Para ETF-GB e Cripto
  currency?: 'BRL' | 'USD'; // Para ETF-GB e Cripto
}

export interface Investment {
  id: string;
  date: string;
  plannedValue: number;
  executedValue: number;
  difference: number; // Resto
  items: InvestmentItem[];
  createdAt: string;
}

export interface MonthlyPortfolio {
  month: string; // Formato: "Jan/23"
  year: number;
  monthNumber: number; // 1-12
  assets: {
    [AssetType.ACAO]: number;
    [AssetType.FII]: number;
    [AssetType.ETF_BR]: number;
    [AssetType.ETF_GB]: number;
    [AssetType.CRIPTO]: number;
  };
  total: number;
}

