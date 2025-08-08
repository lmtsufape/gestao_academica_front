import React from "react";

interface DateProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  label: string;
  required: boolean;
  value: string;
  disabled: boolean;
}

export default function Date({
  onChange,
  name,
  label,
  required,
  value,
  disabled
}: DateProps) {
	
	
	const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		/*if (!value) 
			return "";
		
		const partes = value.split("-");
		if (partes.length !== 3) 
			return value;
    
    	const [ano, mes, dia] = partes;
    	let formattedDate =  `${dia}/${mes}/${ano}`;*/
		
		onChange({ target: { name, value: value } });
	};
	
	const formatt = (dataStr: string) => {
    	if (!dataStr) return "";
    		const partes = dataStr.split("/");
    	if (partes.length !== 3) return dataStr;
    		const [dia, mes, ano] = partes;
    	return `${ano}-${mes}-${dia}`;
    };
  
  return (
    <>
      <label htmlFor={name} className="block text-gray-700 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
      	type="date"
        id={name}
        name={name}      	
        className="mt-1 p-2 w-full border rounded-md"
        value={ value ? formatt(value) : "" }
        onChange={handleDateChange}
        disabled={disabled}
        required={required}        
      />
    </>
  );
}
