"use client";
import { useEffect, useState } from "react";

interface MoneyBRLProps {
  name: string;
  label: string;
  value?: number | string | null; // ex: 1234.56 (reais) ou 123456 (centavos, se mode="cents")
  required?: boolean;
  disabled?: boolean;
  message?: string;
  onChange: (event: { target: { name: string; value: number | null } }) => void;
  mode?: "decimal" | "cents";   // "decimal" (padrão) -> 1234.56 | "cents" -> 123456
  allowNegative?: boolean;
}

function formatDecimalToBRL(value: number): string {
  if (isNaN(value)) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function digitsToDecimal(digits: string, allowNegative = false): number {
  // "123456" -> 1234.56 | "" -> 0
  const negative = allowNegative && digits.trim().startsWith("-");
  const onlyDigits = digits.replace(/\D/g, "");
  const asNumber = Number(onlyDigits || "0") / 100;
  return negative ? -asNumber : asNumber;
}

export default function MoneyBRL({
  name,
  label,
  value = null,
  required = false,
  disabled = false,
  message = "0,00",
  onChange,
  mode = "decimal",
  allowNegative = false,
}: MoneyBRLProps) {
  const [display, setDisplay] = useState<string>("");

  // Sincroniza valor externo -> display
  useEffect(() => {
    if (value === null || value === "" || typeof value === "undefined") {
      setDisplay("");
      return;
    }
    const decimal =
      mode === "cents" ? Number(value) / 100 : Number(value);
    setDisplay(formatDecimalToBRL(decimal));
  }, [value, mode]);

  const notifyParent = (decimal: number) => {
    const outValue =
      mode === "cents" ? Math.round(decimal * 100) : decimal;
    onChange({ target: { name, value: isNaN(outValue as number) ? null : outValue } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aceita colar/editar; converte tudo para dígitos e formata
    let raw = e.target.value;
    const isNeg = allowNegative && raw.trim().startsWith("-");
    raw = raw.replace(/-/g, "");
    const decimal = digitsToDecimal((isNeg ? "-" : "") + raw, allowNegative);
    setDisplay(formatDecimalToBRL(decimal));
    notifyParent(decimal);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Mantém formatação conforme digita
    const target = e.currentTarget as HTMLInputElement;
    const onlyDigitsWithMinus = target.value.replace(/[^\d-]/g, "");
    const decimal = digitsToDecimal(onlyDigitsWithMinus, allowNegative);
    setDisplay(formatDecimalToBRL(decimal));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight",
      "Tab", "Home", "End",
    ];
    const isShortcut = e.ctrlKey || e.metaKey; // copiar/colar/recortar etc.
    if (allowed.includes(e.key) || isShortcut) return;

    const isNumber = /^[0-9]$/.test(e.key);
    const isMinus = e.key === "-" && allowNegative;

    if (!isNumber && !isMinus) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    if (display === "") return;
    const onlyDigitsWithMinus = display.replace(/[^\d-]/g, "");
    const decimal = digitsToDecimal(onlyDigitsWithMinus, allowNegative);
    setDisplay(formatDecimalToBRL(decimal));
    notifyParent(decimal);
  };

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-gray-700 uppercase">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="mt-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 select-none">
          R$
        </span>
        <input
          id={name}
          name={name}
          type="text"
          dir="ltr"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          autoComplete="off"
          placeholder={message}
          className="w-full pl-10 p-2 border rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      {message && (
        <small className="text-gray-500 mt-1 block">{message}</small>
      )}
    </div>
  );
}
