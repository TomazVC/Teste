interface InvestmentStep1Props {
  plannedValue: number;
  date: string;
  onPlannedValueChange: (value: number) => void;
  onDateChange: (date: string) => void;
  onNext: () => void;
}

export const InvestmentStep1 = ({
  plannedValue,
  date,
  onPlannedValueChange,
  onDateChange,
  onNext,
}: InvestmentStep1Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plannedValue > 0 && date) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Passo 1: Definição Inicial</h2>
      <p className="text-gray-600 mb-8">Defina o valor total planejado e a data do aporte</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="plannedValue" className="block text-sm font-medium text-gray-700 mb-2">
            Valor Total Planejado (R$)
          </label>
          <input
            id="plannedValue"
            type="number"
            step="0.01"
            min="0"
            value={plannedValue || ''}
            onChange={(e) => onPlannedValueChange(parseFloat(e.target.value) || 0)}
            className="futuristic-input"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Data do Aporte
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="futuristic-input"
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={plannedValue <= 0 || !date}
            className="futuristic-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
      </form>
    </div>
  );
};

