import { Asset, AssetType, InvestmentItem, MonthlyPortfolio } from '../types/asset';
import { isUnitBased, isValueBased } from '../types/asset';

export const calculateNewAveragePrice = (
  currentQuantity: number,
  currentAveragePrice: number,
  purchaseQuantity: number,
  purchasePrice: number
): number => {
  if (currentQuantity === 0) {
    return purchasePrice;
  }
  const totalValue = currentQuantity * currentAveragePrice + purchaseQuantity * purchasePrice;
  const totalQuantity = currentQuantity + purchaseQuantity;
  return totalValue / totalQuantity;
};

export const updateAssetAfterInvestment = (
  asset: Asset,
  item: InvestmentItem
): Asset => {
  if (isUnitBased(asset.type)) {
    if (item.price === undefined || item.quantity === undefined) {
      return asset;
    }
    const newAveragePrice = calculateNewAveragePrice(
      asset.quantity,
      asset.averagePrice,
      item.quantity,
      item.price
    );
    return {
      ...asset,
      quantity: asset.quantity + item.quantity,
      averagePrice: newAveragePrice,
    };
  } else if (isValueBased(asset.type)) {
    if (item.investedValue === undefined) {
      return asset;
    }
    // Converter USD para BRL se necessário (taxa fixa 5.0 para exemplo)
    const conversionRate = item.currency === 'USD' ? 5.0 : 1.0;
    const investedValueBRL = item.investedValue * conversionRate;
    return {
      ...asset,
      value: asset.value + investedValueBRL,
      averagePrice: asset.averagePrice + investedValueBRL,
    };
  }
  return asset;
};

export const calculateInvestmentTotal = (items: InvestmentItem[]): number => {
  return items.reduce((total, item) => {
    if (isUnitBased(item.assetType)) {
      if (item.price !== undefined && item.quantity !== undefined) {
        return total + item.price * item.quantity;
      }
    } else if (isValueBased(item.assetType)) {
      if (item.investedValue !== undefined) {
        const conversionRate = item.currency === 'USD' ? 5.0 : 1.0;
        return total + item.investedValue * conversionRate;
      }
    }
    return total;
  }, 0);
};

export const formatCurrency = (value: number, currency: 'BRL' | 'USD' = 'BRL'): string => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const formatMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${year}`;
};

export const getMonthYearKey = (dateString: string): { month: number; year: number } => {
  const date = new Date(dateString);
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

export const calculateMonthlyPortfolio = (
  assets: Asset[],
  investments: Investment[]
): MonthlyPortfolio[] => {
  if (investments.length === 0) {
    return [];
  }

  // Simular estado da carteira mês a mês
  const monthlyState = new Map<string, Map<string, Asset>>();
  
  // Processar investimentos em ordem cronológica
  const sortedInvestments = [...investments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sortedInvestments.forEach((investment) => {
    const { month, year } = getMonthYearKey(investment.date);
    const key = `${year}-${month}`;
    
    // Obter estado anterior ou inicializar
    let currentState: Map<string, Asset>;
    if (monthlyState.has(key)) {
      currentState = new Map(monthlyState.get(key)!);
    } else {
      // Inicializar com cópia do estado do mês anterior ou ativos iniciais
      const previousKey = Array.from(monthlyState.keys())
        .sort()
        .reverse()
        .find((k) => k < key);
      if (previousKey) {
        currentState = new Map(monthlyState.get(previousKey)!);
      } else {
        currentState = new Map(
          assets.map((asset) => [
            asset.id,
            { ...asset, quantity: 0, value: 0, averagePrice: 0 },
          ])
        );
      }
    }

    // Aplicar investimento
    investment.items.forEach((item) => {
      const asset = currentState.get(item.assetId);
      if (asset) {
        const updatedAsset = updateAssetAfterInvestment(asset, item);
        currentState.set(item.assetId, updatedAsset);
      }
    });

    monthlyState.set(key, currentState);
  });

  // Calcular valores totais por mês
  const result: MonthlyPortfolio[] = [];
  const sortedKeys = Array.from(monthlyState.keys()).sort();

  sortedKeys.forEach((key) => {
    const state = monthlyState.get(key)!;
    const portfolio: MonthlyPortfolio = {
      month: formatMonthYear(sortedInvestments.find((inv) => {
        const { month, year } = getMonthYearKey(inv.date);
        return `${year}-${month}` === key;
      })!.date),
      year: parseInt(key.split('-')[0]),
      monthNumber: parseInt(key.split('-')[1]),
      assets: {
        [AssetType.ACAO]: 0,
        [AssetType.FII]: 0,
        [AssetType.ETF_BR]: 0,
        [AssetType.ETF_GB]: 0,
        [AssetType.CRIPTO]: 0,
      },
      total: 0,
    };

    // Calcular valor total por tipo
    state.forEach((asset) => {
      if (isUnitBased(asset.type)) {
        portfolio.assets[asset.type] += asset.quantity * asset.averagePrice;
      } else if (isValueBased(asset.type)) {
        portfolio.assets[asset.type] += asset.value;
      }
    });

    portfolio.total = Object.values(portfolio.assets).reduce((sum, val) => sum + val, 0);
    result.push(portfolio);
  });

  return result;
};

