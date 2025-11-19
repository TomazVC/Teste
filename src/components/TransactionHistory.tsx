import { useState, useMemo, useCallback } from 'react';
import { Investment } from '../types/asset';
import { formatDate, formatCurrency } from '../utils/calculations';
import { AssetTypeLabels, isUnitBased } from '../types/asset';
import { storage } from '../utils/storage';
import { exportInvestmentToPDF } from '../utils/pdfExport';
import { filterInvestmentsByPeriod, sortInvestments, InvestmentSortBy, InvestmentSortOrder } from '../utils/filters';

interface TransactionHistoryProps {
  investments: Investment[];
  onInvestmentsUpdate: () => void;
}

export const TransactionHistory = ({ investments, onInvestmentsUpdate }: TransactionHistoryProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados para filtros e ordenação
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<InvestmentSortBy>('date');
  const [sortOrder, setSortOrder] = useState<InvestmentSortOrder>('desc');

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

  const handleDelete = () => {
    if (selectedIds.size > 0) {
      storage.deleteInvestments(Array.from(selectedIds));
      setSelectedIds(new Set());
      setShowDeleteModal(false);
      onInvestmentsUpdate();
    }
  };

  const handleExportPDF = (investment: Investment, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      exportInvestmentToPDF(investment);
    } catch (error) {
      alert('Erro ao gerar PDF. Tente novamente.');
      console.error('Erro ao exportar PDF:', error);
    }
  };

  // Aplicar filtros e ordenação
  const filteredAndSortedInvestments = useMemo(() => {
    let result = [...investments];
    
    // Filtrar por período
    result = filterInvestmentsByPeriod(
      result,
      startDate || null,
      endDate || null
    );
    
    // Ordenar
    result = sortInvestments(result, sortBy, sortOrder);
    
    return result;
  }, [investments, startDate, endDate, sortBy, sortOrder]);

  const selectAll = useCallback(() => {
    if (selectedIds.size === filteredAndSortedInvestments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedInvestments.map((inv) => inv.id)));
    }
  }, [selectedIds.size, filteredAndSortedInvestments]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const hasActiveFilters = startDate !== '' || endDate !== '' || sortBy !== 'date' || sortOrder !== 'desc';

  if (investments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma transação registrada ainda.</p>
      </div>
    );
  }

  const allSelected = selectedIds.size === filteredAndSortedInvestments.length && filteredAndSortedInvestments.length > 0;
  const hasSelection = selectedIds.size > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Histórico de Transações</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {investments.length > 0 && (
            <>
              <button
                onClick={selectAll}
                className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 text-xs sm:text-sm min-h-[44px]"
              >
                {allSelected ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </button>
              {hasSelection && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 text-xs sm:text-sm min-h-[44px]"
                >
                  Excluir ({selectedIds.size})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {investments.length > 0 && (
        <div className="futuristic-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Filtro por período - Data inicial */}
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Data inicial
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="futuristic-input text-base"
              />
            </div>

            {/* Filtro por período - Data final */}
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Data final
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className="futuristic-input text-base"
              />
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
                  onChange={(e) => setSortBy(e.target.value as InvestmentSortBy)}
                  className="futuristic-select flex-1 text-base"
                >
                  <option value="date">Data</option>
                  <option value="executedValue">Valor executado</option>
                  <option value="name">Nome</option>
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
              {filteredAndSortedInvestments.length === investments.length ? (
                <span>{filteredAndSortedInvestments.length} transação(ões) registrada(s)</span>
              ) : (
                <span>
                  Mostrando {filteredAndSortedInvestments.length} de {investments.length} transação(ões)
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

      {investments.length > 0 && filteredAndSortedInvestments.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 px-4">
          <p className="text-gray-500 text-base sm:text-lg mb-4">
            Nenhuma transação encontrada com os filtros aplicados.
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
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-8 w-full max-w-md mx-auto border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Confirmar Exclusão</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Tem certeza que deseja excluir {selectedIds.size} transação(ões) selecionada(s)?
            </p>
            <p className="text-xs sm:text-sm text-amber-600 mb-4 sm:mb-6">
              ⚠️ Esta ação não pode ser desfeita. As transações serão removidas permanentemente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 min-h-[44px] text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 min-h-[44px] text-sm sm:text-base"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      
            {filteredAndSortedInvestments.map((investment) => {
        const isSelected = selectedIds.has(investment.id);
        
        return (
          <div
            key={investment.id}
            className={`futuristic-card p-4 sm:p-6 transition-all duration-300 ${
              isSelected ? 'border-2 border-futuristic-blue-500 bg-blue-50' : 'hover:border-futuristic-blue-300'
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelect(investment.id);
                }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-futuristic-blue-600 border-gray-300 rounded focus:ring-futuristic-blue-500 cursor-pointer flex-shrink-0"
              />
              <div
                className="flex-1 cursor-pointer min-w-0"
                onClick={() => toggleExpand(investment.id)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {formatDate(investment.date)}
                      </h3>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {investment.items.length} ativo(s)
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500">Planejado:</span>
                        <p className="font-semibold text-gray-900 break-words">
                          {formatCurrency(investment.plannedValue)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Executado:</span>
                        <p className="font-semibold text-gray-900 break-words">
                          {formatCurrency(investment.executedValue)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Diferença:</span>
                        <p
                          className={`font-semibold break-words ${
                            investment.difference >= 0 ? 'text-blue-600' : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(Math.abs(investment.difference))}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-auto sm:ml-4 flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={(e) => handleExportPDF(investment, e)}
                      className="p-2 text-gray-400 hover:text-futuristic-blue-600 hover:bg-futuristic-blue-50 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Exportar como PDF"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-transform duration-300 ${
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
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Detalhes do Aporte:</h4>
                <div className="space-y-2 sm:space-y-3">
                  {investment.items.map((item, index) => {
                    const isUnit = isUnitBased(item.assetType);
                    return (
                      <div
                        key={index}
                        className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base text-gray-900 break-words">{item.assetName}</p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {AssetTypeLabels[item.assetType]}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            {isUnit ? (
                              <>
                                <p className="font-semibold text-sm sm:text-base text-gray-900 break-words">
                                  {item.quantity} un × {formatCurrency(item.price || 0)}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  = {formatCurrency((item.price || 0) * (item.quantity || 0))}
                                </p>
                              </>
                            ) : (
                              <p className="font-semibold text-sm sm:text-base text-gray-900 break-words">
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

