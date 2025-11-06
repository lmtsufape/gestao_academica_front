"use client";
import React, { useEffect, useState } from 'react';

interface CalendarProps {
  selectedDates?: string[]; // ou Date[] dependendo do seu uso
  onChange: (dias: string[]) => void;
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Calendar: React.FC<CalendarProps> = ({ selectedDates = [], onChange }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Função corrigida para verificar se o dia já passou
  const isPastDay = (date: Date): boolean => {
    const today = new Date();
    const compareDate = new Date(date);

    // Zera horas, minutos, segundos e milissegundos para comparar apenas a data
    today.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < today;
  };

  // Função para saber se é hoje
  const isToday = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate.getTime() === today.getTime();
  };

  useEffect(() => {
    if (selectedDates && selectedDates.length > 0) {
      const formatted = selectedDates.map(date => {
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        return formatDate(d);
      });

      // Só atualiza se for diferente do que já está
      const formattedStr = formatted.join(",");
      const currentStr = selectedDays.join(",");
      if (formattedStr !== currentStr) {
        setSelectedDays(formatted);
      }
    }
  }, [selectedDates]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => new Date(year, month, i + 1));
  };

  const handleCheckboxChange = (dateStr: string) => {
    const day = new Date(
      parseInt(dateStr.split('/')[2]), // ano
      parseInt(dateStr.split('/')[1]) - 1, // mês
      parseInt(dateStr.split('/')[0]) // dia
    );

    // Não permite selecionar dias passados
    if (isPastDay(day)) {
      return;
    }

    setSelectedDays(prev => {
      const alreadySelected = prev.includes(dateStr);
      const updated = alreadySelected
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr];

      return updated;
    });
  };

  useEffect(() => {
    const converted = selectedDays.map(dateStr => {
      const [dia, mes, ano] = dateStr.split('/');
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    });
    onChange(converted);
  }, [selectedDays]);

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    // REMOVIDA A LINHA QUE LIMPAVA AS SELEÇÕES:
    // setSelectedDays([]); // ← ESTA LINHA FOI REMOVIDA
  };

  const daysInMonth = getDaysInMonth();

  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth('prev')}
          className="px-4 py-2 bg-extra-100 text-white rounded-md border"
        >
          Anterior
        </button>
        <h2 className="text-xl font-bold text-neutrals-900 capitalize">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => changeMonth('next')}
          className="px-4 py-2 bg-extra-100 text-white rounded-md border"
        >
          Próximo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {daysInMonth.map((day, idx) => {
          const dateStr = formatDate(day);
          const pastDay = isPastDay(day);
          const today = isToday(day);

          // Classes baseadas no status do dia
          const containerClasses = `flex flex-col items-center border p-2 rounded-md ${pastDay
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
              : today
                ? 'border-extra-50 ring-2 ring-extra-50 cursor-pointer'
                : 'border-gray-300 cursor-pointer'
            }`;

          const textClasses = pastDay ? 'text-gray-400 line-through' : 'text-neutrals-900';
          const textClassesNumber = pastDay ? 'text-gray-400 line-through' : 'text-neutrals-800';

          return (
            <label
              key={dateStr}
              className={containerClasses}
            >
              <input
                type="checkbox"
                checked={selectedDays.includes(dateStr)}
                onChange={() => handleCheckboxChange(dateStr)}
                className="mb-2"
                disabled={pastDay} // Desabilita checkbox para dias passados
              />
              <span className={`text-xs font-bold ${textClasses}`}>
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </span>
              <span className={`text-lg font-semibold ${textClassesNumber}`}>
                {day.getDate()}
              </span>
              {pastDay && (
                <span className="text-xs text-gray-400 mt-1">Passado</span>
              )}
            </label>
          );
        })}
      </div>

      {/* Mostra quantas datas estão selecionadas*/}
      <div className="mt-4 text-sm text-gray-600">
        {selectedDays.length} data(s) selecionada(s)
      </div>
    </main>
  );
};

export default Calendar;