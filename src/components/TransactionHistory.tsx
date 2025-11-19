import { useState } from 'react';
import { Investment } from '../types/asset';
import { formatDate, formatCurrency } from '../utils/calculations';
import { AssetTypeLabels, isUnitBased } from '../types/asset';

interface TransactionHistoryProps {
  investments: Investment[];
}

export const TransactionHistory = ({ investments }: TransactionHistoryProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (investments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma transação registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Transações</h2>
      
      {investments.map((investment) => {
        const isExpanded = expandedId === investment.id;
        
        return (
          <div
            key={investment.id}
            className="futuristic-card p-6 cursor-pointer hover:border-futuristic-blue-300 transition-all duration-300"
            onClick={() => toggleExpand(investment.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDate(investment.date)}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {investment.items.length} ativo(s)
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Planejado:</span>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(investment.plannedValue)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Executado:</span>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(investment.executedValue)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Diferença:</span>
                    <p
                      className={`font-semibold ${
                        investment.difference >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(Math.abs(investment.difference))}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Detalhes do Aporte:</h4>
                <div className="space-y-3">
                  {investment.items.map((item, index) => {
                    const isUnit = isUnitBased(item.assetType);
                    return (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{item.assetName}</p>
                            <p className="text-sm text-gray-500">
                              {AssetTypeLabels[item.assetType]}
                            </p>
                          </div>
                          <div className="text-right">
                            {isUnit ? (
                              <>
                                <p className="font-semibold text-gray-900">
                                  {item.quantity} un × {formatCurrency(item.price || 0)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  = {formatCurrency((item.price || 0) * (item.quantity || 0))}
                                </p>
                              </>
                            ) : (
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(item.investedValue || 0, item.currency || 'BRL')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

