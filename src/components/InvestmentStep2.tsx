import { Asset, InvestmentItem } from '../types/asset';
import { isUnitBased, isValueBased } from '../types/asset';

interface InvestmentStep2Props {
  assets: Asset[];
  items: InvestmentItem[];
  onItemsChange: (items: InvestmentItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const InvestmentStep2 = ({
  assets,
  items,
  onItemsChange,
  onBack,
  onNext,
}: InvestmentStep2Props) => {
  const updateItem = (assetId: string, updates: Partial<InvestmentItem>) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    const existingItemIndex = items.findIndex((item) => item.assetId === assetId);
    const baseItem: InvestmentItem = {
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
    };

    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], ...updates };
      onItemsChange(updatedItems);
    } else {
      onItemsChange([...items, { ...baseItem, ...updates }]);
    }
  };

  const removeItem = (assetId: string) => {
    onItemsChange(items.filter((item) => item.assetId !== assetId));
  };

  const getItem = (assetId: string): InvestmentItem | undefined => {
    return items.find((item) => item.assetId === assetId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      {/* Header Fixo */}
      <div className="flex-shrink-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Passo 2: Distribuição</h2>
        <p className="text-sm sm:text-base text-gray-600">Distribua o investimento entre os ativos cadastrados</p>
      </div>

      {/* Lista de Ativos Scrollável */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="space-y-6 pb-4">
          {assets.map((asset) => {
            const item = getItem(asset.id);
            const isUnit = isUnitBased(asset.type);
            const isValue = isValueBased(asset.type);

            return (
            <div
              key={asset.id}
              className="futuristic-card p-4 sm:p-6 border-l-4"
              style={{
                borderLeftColor: isUnit ? '#2563EB' : '#3B82F6',
              }}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{asset.name}</h3>
                  <span className="text-xs sm:text-sm text-gray-500">{asset.type}</span>
                </div>
                {item && (
                  <button
                    onClick={() => removeItem(asset.id)}
                    className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium ml-2 min-h-[44px] px-2"
                  >
                    Remover
                  </button>
                )}
              </div>

              {isUnit && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Preço Unitário Pago (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item?.price || ''}
                        onChange={(e) =>
                          updateItem(asset.id, {
                            price: parseFloat(e.target.value) || undefined,
                          })
                        }
                        className="futuristic-input text-base"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Quantidade Comprada
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={item?.quantity || ''}
                        onChange={(e) =>
                          updateItem(asset.id, {
                            quantity: parseInt(e.target.value) || undefined,
                          })
                        }
                        className="futuristic-input text-base"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

              {isValue && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Valor Investido
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item?.investedValue || ''}
                      onChange={(e) =>
                        updateItem(asset.id, {
                          investedValue: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="futuristic-input text-base"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Moeda
                    </label>
                    <select
                      value={item?.currency || 'BRL'}
                      onChange={(e) =>
                        updateItem(asset.id, {
                          currency: e.target.value as 'BRL' | 'USD',
                        })
                      }
                      className="futuristic-select text-base"
                    >
                      <option value="BRL">BRL (Real)</option>
                      <option value="USD">USD (Dólar)</option>
                    </select>
                  </div>
                </div>
              )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Fixo */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 min-h-[44px] text-sm sm:text-base"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={items.length === 0}
          className="futuristic-button w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

