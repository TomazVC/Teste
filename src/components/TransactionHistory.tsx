import { useState } from 'react';
import { Investment } from '../types/asset';
import { formatDate, formatCurrency } from '../utils/calculations';
import { AssetTypeLabels, isUnitBased } from '../types/asset';
import { storage } from '../utils/storage';

interface TransactionHistoryProps {
  investments: Investment[];
  onInvestmentsUpdate: () => void;
}

export const TransactionHistory = ({ investments, onInvestmentsUpdate }: TransactionHistoryProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === investments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(investments.map((inv) => inv.id)));
    }
  };

  const handleDelete = () => {
    if (selectedIds.size > 0) {
      storage.deleteInvestments(Array.from(selectedIds));
      setSelectedIds(new Set());
      setShowDeleteModal(false);
      onInvestmentsUpdate();
    }
  };

  if (investments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma transação registrada ainda.</p>
      </div>
    );
  }

  const allSelected = selectedIds.size === investments.length && investments.length > 0;
  const hasSelection = selectedIds.size > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Histórico de Transações</h2>
        <div className="flex gap-3">
          {investments.length > 0 && (
            <>
              <button
                onClick={selectAll}
                className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 text-sm"
              >
                {allSelected ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </button>
              {hasSelection && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 text-sm"
                >
                  Excluir ({selectedIds.size})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmar Exclusão</h2>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir {selectedIds.size} transação(ões) selecionada(s)?
            </p>
            <p className="text-sm text-amber-600 mb-6">
              ⚠️ Esta ação não pode ser desfeita. As transações serão removidas permanentemente.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      
      {investments.map((investment) => {
        const isSelected = selectedIds.has(investment.id);
        
        return (
          <div
            key={investment.id}
            className={`futuristic-card p-6 transition-all duration-300 ${
              isSelected ? 'border-2 border-futuristic-blue-500 bg-blue-50' : 'hover:border-futuristic-blue-300'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelect(investment.id);
                }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 w-5 h-5 text-futuristic-blue-600 border-gray-300 rounded focus:ring-futuristic-blue-500 cursor-pointer"
              />
              <div
                className="flex-1 cursor-pointer"
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
                        expandedId === investment.id ? 'transform rotate-180' : ''
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
              </div>
            </div>

            {expandedId === investment.id && (
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

