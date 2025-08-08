// components/Text.tsx

import React from "react";

interface NumberProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  message: string;
  label: string;
  required: boolean;
  value: string;
  disabled: boolean;
}

export default function Number({
  onChange,
  name,
  message,
  label,
  required,
  value,
  disabled
}: NumberProps) {
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChange({ target: { name, value } });
  };

  return (
    <>
      <label htmlFor={name} className="block text-gray-700 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        id={name}
        name={name}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder={message}
        value={value}
        onChange={handleTextChange}
        disabled={disabled}
        required={required}
      />
    </>
  );
}
