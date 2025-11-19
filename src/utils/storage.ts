import { Asset, Investment, MonthlyPortfolio } from '../types/asset';

const ASSETS_KEY = 's2-assets';
const TRANSACTIONS_KEY = 's2-transactions';
const MONTHLY_PORTFOLIO_KEY = 's2-monthly-portfolio';

export const storage = {
  // Assets
  getAssets: (): Asset[] => {
    try {
      const data = localStorage.getItem(ASSETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAssets: (assets: Asset[]): void => {
    try {
      localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
    } catch (error) {
      console.error('Error saving assets:', error);
    }
  },

  updateAsset: (updatedAsset: Asset): void => {
    const assets = storage.getAssets();
    const index = assets.findIndex((a) => a.id === updatedAsset.id);
    if (index >= 0) {
      assets[index] = updatedAsset;
      storage.saveAssets(assets);
    }
  },

  deleteAsset: (assetId: string): void => {
    const assets = storage.getAssets();
    const filtered = assets.filter((a) => a.id !== assetId);
    storage.saveAssets(filtered);
  },

  // Investments/Transactions
  getInvestments: (): Investment[] => {
    try {
      const data = localStorage.getItem(TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveInvestments: (investments: Investment[]): void => {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(investments));
    } catch (error) {
      console.error('Error saving investments:', error);
    }
  },

  addInvestment: (investment: Investment): void => {
    const investments = storage.getInvestments();
    investments.push(investment);
    investments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    storage.saveInvestments(investments);
  },

  deleteInvestments: (investmentIds: string[]): void => {
    const investments = storage.getInvestments();
    const filtered = investments.filter((inv) => !investmentIds.includes(inv.id));
    storage.saveInvestments(filtered);
  },

  // Monthly Portfolio
  getMonthlyPortfolio: (): MonthlyPortfolio[] => {
    try {
      const data = localStorage.getItem(MONTHLY_PORTFOLIO_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMonthlyPortfolio: (portfolio: MonthlyPortfolio[]): void => {
    try {
      localStorage.setItem(MONTHLY_PORTFOLIO_KEY, JSON.stringify(portfolio));
    } catch (error) {
      console.error('Error saving monthly portfolio:', error);
    }
  },
};

