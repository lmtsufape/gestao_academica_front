"use client";
import React from 'react';
import { Controller } from 'react-hook-form';
import { tipoCampoDisplay } from "@/types/editalTypes";

export type CampoPersonalizadoFormProps = {
  control: any;
  pathPrefix: string; // "campos" OU `etapas.${index}.campos`
  index: number;
  onRemove: (i: number) => void;
};

export const CampoPersonalizadoForm: React.FC<CampoPersonalizadoFormProps> = ({ control, pathPrefix, index, onRemove }) => {
  const tipoCampoOptions = Object.keys(tipoCampoDisplay) as Array<keyof typeof tipoCampoDisplay>;
  const base = `${pathPrefix}.${index}`;

  return (
    <div className="border p-3 rounded-md bg-gray-50 mb-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm mb-2">Campo {index + 1}</h4>
        <button type="button" onClick={() => onRemove(index)} className="text-red-500 text-xs">
          Remover Campo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`${base}.rotulo`}
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Rótulo (Ex: Nome Completo)" className="border p-2 rounded-md w-full text-sm" />
          )}
        />
        <Controller
          name={`${base}.nome`}
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="Nome do Atributo (Ex: nomeCompleto)" className="border p-2 rounded-md w-full text-sm" />
          )}
        />
        <Controller
          name={`${base}.tipoCampo`}
          control={control}
          render={({ field }) => (
            <select {...field} className="border p-2 rounded-md w-full text-sm">
              {tipoCampoOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {tipoCampoDisplay[opt]}
                </option>
              ))}
            </select>
          )}
        />
        <div className="flex items-center gap-2">
          <Controller
            name={`${base}.obrigatorio`}
            control={control}
            render={({ field }) => (
              <input type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} className="h-4 w-4" />
            )}
          />
          <label className="text-sm">Obrigatório</label>
        </div>
      </div>
    </div>
  );
};

export default CampoPersonalizadoForm;
