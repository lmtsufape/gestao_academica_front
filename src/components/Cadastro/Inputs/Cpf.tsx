import React from "react";

interface CpfProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  message: string;
  label: string;
  required: boolean;
  value: string;
  disabled: boolean;
}

export default function Cpf({
  onChange,
  name,
  message,
  label,
  required,
  value,
  disabled
}: CpfProps) {
	
	
	const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		let cpfNumeros = value.replace(/\D/g, ""); // Remove tudo que não for dígito
		cpfNumeros = cpfNumeros.slice(0, 11); // Limita a 11 dígitos
		let cpfFormatado = cpfNumeros;
		// Aplica a máscara conforme os dígitos existentes
		if (cpfNumeros.length >= 4) {
			cpfFormatado = cpfNumeros.replace(/(\d{3})(\d)/, "$1.$2");
		}
		if (cpfNumeros.length >= 7) {
			cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, "$1.$2");
		}
		if (cpfNumeros.length >= 10) {
			cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
		}
		
		onChange({ target: { name, value: cpfFormatado } });
	};
  
  return (
    <>
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder={message}
        value={value}
        onChange={handleCpfChange}
        disabled={disabled}
        required={required}
      />
    </>
  );
}
