// components/Password.tsx

import React from "react";

interface PasswordProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  message: string;
  label: string;
  required: boolean;
  value: string;
  disabled: boolean;
}

export default function Password({
  onChange,
  name,
  message,
  label,
  required,
  value,
  disabled
}: PasswordProps) {
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        type="password"
        id={name}
        name={name}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder={message}
        value={value}
        onChange={handlePasswordChange}
        disabled={disabled}
        required={required}
      />
    </>
  );
}
