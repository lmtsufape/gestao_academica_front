import { useEffect, useState } from "react";

interface MultiSelectProps {
  availableItems: string[];
  selectedItems: string[];
  onChange: (event: { target: { name: string; value: string[] } }) => void;
  name: string; 
  label: string;
  required: boolean;
}

export default function MultiSelect({
  availableItems,
  selectedItems,
  onChange,
  name,
  label,
  required
}: MultiSelectProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(selectedItems);
  }, [selectedItems]);

  const toggleItem = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];

    setSelected(updated);
    onChange({ target: { name, value: updated } });
    
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-gray-700 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="border rounded-md p-2 h-40 overflow-y-auto bg-white space-y-2">
        {availableItems.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem(item)}
              className={`w-full text-left px-3 py-1 text-sm rounded border transition
                ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
