import { useEffect, useState } from 'react';

export interface CepEndereco {
  cep: string;
  rua: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  raw?: any;
}

export function useCep(cep: string) {
  const [data, setData] = useState<CepEndereco | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onlyNums = (cep || '').replace(/\D/g, '');
    if (onlyNums.length !== 8) {
      setData(null);
      setError(null);
      return;
    }

    let abort = false;
    setLoading(true);
    setError(null);

    fetch(`/api/cep/${onlyNums}`)
      .then(r => {
        if (!r.ok) throw new Error('Erro ao buscar CEP');
        return r.json();
      })
      .then(json => {
        if (!abort) setData(json);
      })
      .catch(e => {
        if (!abort) {
          console.error('useCep error', e);
            setError('Não foi possível localizar o CEP');
            setData(null);
        }
      })
      .finally(() => {
        if (!abort) setLoading(false);
      });

    return () => { abort = true; };
  }, [cep]);

  return { endereco: data, loading, error };
}
