import { useEffect, useRef, useState } from "react";

interface OptionItem {
  chave: string | number;
  valor: string;
}

interface ObjectMultiSelectProps {
  name: string;
  label: string;
  required?: boolean;
  options: OptionItem[];
  selected: (string | number)[];
  onChange: (event: { target: { name: string; value: (string | number)[] } }) => void;
  message?: string;
}

export default function ObjectMultiSelect({
  name,
  label,
  required = false,
  options,
  selected,
  onChange,
  message = "Selecione...",
}: ObjectMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Converte todos os selecionados para string para facilitar comparação
  const selectedAsString = selected.map(String);

  const handleChange = (chave: string | number) => {
    const chaveStr = String(chave);
    const alreadySelected = selectedAsString.includes(chaveStr);

    let updated: (string | number)[];
    if (alreadySelected) {
      updated = selected.filter((item) => String(item) !== chaveStr);
    } else {
      updated = [...selected, chave];
    }

    onChange({ target: { name, value: updated } });
  };

  const handleSelectAll = () => {
    const allSelected = selectedAsString.length === options.length;
    const updated = allSelected ? [] : options.map((opt) => opt.chave);
    onChange({ target: { name, value: updated } });
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.valor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <label htmlFor={name} className="block text-gray-700 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <button
        type="button"
        className="mt-1 p-2 w-full border rounded-md text-left bg-white"
        onClick={toggleDropdown}
      >
        {selected.length > 0 ? `Selecionados: ${selected.length}` : message}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>
          <div className="flex items-center p-2 hover:bg-gray-100 border-b">
            <input
              id={`select-all-${name}`}
              type="checkbox"
              checked={selectedAsString.length === options.length && options.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor={`select-all-${name}`}
              className={`ms-2 text-sm font-medium ${
                selectedAsString.length === options.length && options.length > 0
                  ? "font-semibold text-blue-600"
                  : "text-gray-900"
              }`}
            >
              Selecionar todos
            </label>
          </div>
          {filteredOptions.map((opt, idx) => {
            const optStr = String(opt.chave);
            const isChecked = selectedAsString.includes(optStr);

            return (
              <div key={idx} className="flex items-center p-2 hover:bg-gray-100">
                <input
                  id={`checkbox-${name}-${idx}`}
                  type="checkbox"
                  value={optStr}
                  checked={isChecked}
                  onChange={() => handleChange(opt.chave)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor={`checkbox-${name}-${idx}`}
                  className={`ms-2 text-sm font-medium ${
                    isChecked ? "font-semibold text-blue-600" : "text-gray-900"
                  }`}
                >
                  {opt.valor}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
