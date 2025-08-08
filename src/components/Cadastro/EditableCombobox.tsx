// Sem filtragem 

import { useState } from 'react';

const EditableCombobox = ({ field, value, onChange }: any) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleInputChange = (event: any) => {
    onChange(event.target.value);
  };

  const handleOptionClick = (optionValue: any) => {
    onChange(optionValue);
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <label htmlFor={field.chave} className="block text-gray-700 uppercase">
        {field.nome}
        <samp className="text-red-500 ml-1" hidden={!field.obrigatorio}>*</samp>
      </label>
      <input
        id={field.chave}
        name={field.chave}
        className="mt-1 p-2 w-full border rounded-md bg-white"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 200)}
        required={field.obrigatorio}
        disabled={field.bloqueado}
      />
      {showOptions && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {field.selectOptions.map((option: any, index: any) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2"
              onClick={() => handleOptionClick(option.valor)}
            >
              {option.valor}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EditableCombobox;
