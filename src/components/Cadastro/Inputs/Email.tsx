import React from "react";

interface EmailProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  message: string;
  label: string;
  required: boolean;
  value: string;
  disabled: boolean;
}

export default function Email({
  onChange,
  name,
  message,
  label,
  required,
  value,
  disabled
}: EmailProps) {
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        type="email"
        id={name}
        name={name}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder={message}
        value={value}
        onChange={handleEmailChange}
        disabled={disabled}
        required={required}
      />
    </>
  );
}
