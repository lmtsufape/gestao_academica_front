import React, { useEffect, useRef } from 'react';
import { useCep } from './useCep';

interface EnderecoFieldsProps {
  cepValue: string;
  onFieldChange: (name: string, value: string) => void;
  values: Record<string, any>;
  disabled?: boolean;
  fieldMap?: {
    rua?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    complemento?: string;
  };
}

export const EnderecoFields: React.FC<EnderecoFieldsProps> = ({
  cepValue,
  onFieldChange,
  values,
  disabled = false,
  fieldMap = {
    rua: 'rua',
    bairro: 'bairro',
    cidade: 'cidade',
    estado: 'estado',
    complemento: 'complemento',
  }
}) => {
  const { endereco, loading } = useCep(cepValue);
  const lastCepAppliedRef = useRef<string | null>(null);

  useEffect(() => {
    if (disabled) return; 
    if (!endereco) return; 

    if (lastCepAppliedRef.current === endereco.cep) return;

    const mapKeys: { key?: string; value: string | undefined }[] = [
      { key: fieldMap.rua, value: endereco.rua },
      { key: fieldMap.bairro, value: endereco.bairro },
      { key: fieldMap.cidade, value: endereco.cidade },
      { key: fieldMap.estado, value: endereco.estado },
    ];

    mapKeys.forEach(item => {
      if (!item.key) return;
      const current = values[item.key];
      const next = item.value || '';
      if (current !== next) {
        onFieldChange(item.key, next);
      }
    });

    lastCepAppliedRef.current = endereco.cep;
  }, [endereco, disabled, onFieldChange, fieldMap, values]);

  return (
    <div className="text-xs text-gray-500 mt-1">
      {loading && 'Buscando CEP...'}
    </div>
  );
};
