import { InvestmentItem } from '../types/asset';
import { calculateInvestmentTotal, formatCurrency } from '../utils/calculations';
import { isUnitBased } from '../types/asset';

interface InvestmentStep3Props {
  plannedValue: number;
  items: InvestmentItem[];
  onBack: () => void;
  onConfirm: () => void;
}

export const InvestmentStep3 = ({
  plannedValue,
  items,
  onBack,
  onConfirm,
}: InvestmentStep3Props) => {
  const executedValue = calculateInvestmentTotal(items);
  const difference = plannedValue - executedValue;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Passo 3: Validação e Resumo</h2>
      <p className="text-gray-600 mb-8">Revise os dados antes de confirmar o aporte</p>

      <div className="space-y-6">
        <div className="futuristic-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Aporte</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Planejado:</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(plannedValue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Real Executado:</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(executedValue)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-gray-600">Diferença (Resto):</span>
              <span
                className={`text-lg font-semibold ${
                  difference >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(Math.abs(difference))}
                {difference < 0 && ' (excedente)'}
              </span>
            </div>
          </div>

          {difference !== 0 && (
            <div
              className={`p-4 rounded-lg ${
                difference > 0
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`text-sm ${
                  difference > 0 ? 'text-blue-800' : 'text-red-800'
                }`}
              >
                {difference > 0
                  ? `Ainda restam ${formatCurrency(difference)} do valor planejado.`
                  : `O valor executado excede o planejado em ${formatCurrency(Math.abs(difference))}.`}
              </p>
            </div>
          )}
        </div>

        <div className="futuristic-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes dos Ativos</h3>
          <div className="space-y-3">
            {items.map((item) => {
              const isUnit = isUnitBased(item.assetType);
              return (
                <div
                  key={item.assetId}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.assetName}</p>
                    {isUnit ? (
                      <p className="text-sm text-gray-600">
                        {item.quantity} un × {formatCurrency(item.price || 0)} ={' '}
                        {formatCurrency((item.price || 0) * (item.quantity || 0))}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.investedValue || 0, item.currency || 'BRL')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
        >
          Voltar
        </button>
        <button onClick={onConfirm} className="futuristic-button">
          Confirmar Aporte
        </button>
      </div>
    </div>
  );
};

