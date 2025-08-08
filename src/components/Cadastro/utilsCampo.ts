import { Campo } from './campoTypes';

// Helpers de notação ponto
export const getNestedValue = (obj: any, path: string): any =>
  path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);

export const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const newObj = { ...obj };
  let curr = newObj as any;
  keys.forEach((key) => {
    curr[key] = curr[key] ? { ...curr[key] } : {};
    curr = curr[key];
  });
  if (lastKey) curr[lastKey] = value;
  return newObj;
};

export const updateNestedField = (prev: any, name: string, value: any): any =>
  name.includes('.') ? setNestedValue(prev, name, value) : { ...prev, [name]: value };

export const asArray = <T,>(v: any): T[] => (Array.isArray(v) ? v : []);

export function normalizarLinhas(campos: Campo[] | Campo[][] | null | undefined): Campo[][] {
  if (!campos) return [];
  const original = campos as any[];
  if (Array.isArray(original[0])) return original as any;
  const agrupado: Record<string, Campo[]> = {};
  (original as Campo[]).forEach((c) => {
    const linha = (c?.line ?? 1).toString();
    if (!agrupado[linha]) agrupado[linha] = [];
    agrupado[linha].push(c);
  });
  return Object.keys(agrupado)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map((k) => agrupado[k]);
}

export function flattenCampos(campos: Campo[] | Campo[][] | null | undefined): Campo[] {
  if (!campos) return [];
  return Array.isArray((campos as any[])[0])
    ? (campos as any[]).flat() as Campo[]
    : (campos as Campo[]);
}

export function findCampoByChave(campos: Campo[] | Campo[][] | null | undefined, chave: string): Campo | undefined {
  return flattenCampos(campos).find(c => c.chave === chave);
}

export function getColSpanValue(campo: Campo): number {
  if (campo.colSpan) {
    const match = campo.colSpan.match(/col-span-(\d+)/);
    if (match) return parseInt(match[1], 10);
  }
  return 1;
}
