import { generica } from '@/utils/api';
import type { EditalExtraSisuResponse } from '@/types/editalTypes';

type EditalPage = {
  content?: EditalExtraSisuResponse[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

function ensureOk(resp: any, errorMessage: string) {
  const ok = resp && typeof resp.status === 'number' && resp.status >= 200 && resp.status < 300;
  if (!ok) throw new Error(errorMessage);
}

export class ExtraSisuService {
  static async listarEditais(busca?: string): Promise<EditalPage> {
    const params = busca ? { busca } : {};
    const resp = await generica({ metodo: 'get', uri: '/extra-sisu/editais', params });
    ensureOk(resp, 'Falha ao listar editais do Extra Sisu');
    return resp.data ?? { content: [] };
  }
}
