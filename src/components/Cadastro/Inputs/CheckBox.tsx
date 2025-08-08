// components/Text.tsx

import React from "react";

interface CheckBoxProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  message: string;
  label: string;
  required: boolean;
  value: boolean;
  disabled: boolean;
}

export default function CheckBox({
  onChange,
  name,
  message,
  label,
  required,
  value,
  disabled
}: CheckBoxProps) {
  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        type="checkbox"
        id={name}
        name={name}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder={message}
        checked={value}
        onChange={handleCheckBoxChange}
        disabled={disabled}
        required={required}
      />
      
    </>
  );
}
