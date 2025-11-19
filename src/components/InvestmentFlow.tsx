import { useState } from 'react';
import { Asset, Investment, InvestmentItem } from '../types/asset';
import { InvestmentStep1 } from './InvestmentStep1';
import { InvestmentStep2 } from './InvestmentStep2';
import { InvestmentStep3 } from './InvestmentStep3';
import { storage } from '../utils/storage';
import { calculateInvestmentTotal, updateAssetAfterInvestment } from '../utils/calculations';

interface InvestmentFlowProps {
  assets: Asset[];
  onClose: () => void;
  onAssetsUpdate: () => void;
}

export const InvestmentFlow = ({ assets, onClose, onAssetsUpdate }: InvestmentFlowProps) => {
  const [step, setStep] = useState(1);
  const [plannedValue, setPlannedValue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvestmentItem[]>([]);

  const handleConfirm = () => {
    const executedValue = calculateInvestmentTotal(items);
    const difference = plannedValue - executedValue;

    // Criar investimento
    const investment: Investment = {
      id: Date.now().toString(),
      date,
      plannedValue,
      executedValue,
      difference,
      items: [...items],
      createdAt: new Date().toISOString(),
    };

    // Atualizar ativos
    const updatedAssets = assets.map((asset) => {
      const item = items.find((i) => i.assetId === asset.id);
      if (item) {
        return updateAssetAfterInvestment(asset, item);
      }
      return asset;
    });

    // Salvar no storage
    storage.saveAssets(updatedAssets);
    storage.addInvestment(investment);

    // Atualizar estado
    onAssetsUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] border border-gray-200 flex flex-col">
        {/* Header Fixo */}
        <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Realizar Aporte/Investimento</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-futuristic-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-futuristic-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {step === 1 && (
            <InvestmentStep1
              plannedValue={plannedValue}
              date={date}
              onPlannedValueChange={setPlannedValue}
              onDateChange={setDate}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <InvestmentStep2
              assets={assets}
              items={items}
              onItemsChange={setItems}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <InvestmentStep3
              plannedValue={plannedValue}
              items={items}
              onBack={() => setStep(2)}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

