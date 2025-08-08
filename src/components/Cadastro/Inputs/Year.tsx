interface YearProps {
  value: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string; 
  label: string;
  required: boolean;
  disabled: boolean;
  message?: string; 
}

export default function Year({
  value,
  onChange,
  name,
  label,
  required,
  disabled,
  message="Selecione o ano"
}: YearProps) {

   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange({ target: { name, value } });
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear; i >= 1980; i--) {
      years.push(i);
    }
    return years;
  };


  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-gray-700 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
      	id={name}
      	name={name}
      	className="mt-1 p-2 w-full border rounded-md bg-white"
      	value={value}
      	onChange={handleSelectChange}
        disabled={disabled}
        required={required}
      >
      	<option value="">{message}</option>
      	{generateYears().map((year, yearIdx) => (
			<option key={yearIdx} value={year}>
				{year}
			</option>
		))}
	  </select>
    </div>
  );
}
