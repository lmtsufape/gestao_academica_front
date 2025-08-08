import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ cep: string }> }
) {
  try {
    const { cep } = await context.params; 
    const rawCep = cep?.replace(/\D/g, '') || '';
    if (rawCep.length !== 8) {
      return NextResponse.json({ error: 'CEP inválido' }, { status: 400 });
    }

    const resp = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
    if (!resp.ok) {
      return NextResponse.json({ error: 'Falha ao consultar ViaCEP' }, { status: 502 });
    }
    const data = await resp.json();
    if ((data as any).erro) {
      return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 });
    }

    // Normalização opcional de chaves para o front
    const normalizado = {
      cep: data.cep,
      rua: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      ibge: data.ibge,
      gia: data.gia,
      ddd: data.ddd,
      siafi: data.siafi,
      raw: data,
    };

    return NextResponse.json(normalizado, { status: 200 });
  } catch (e: any) {
    console.error('Erro na rota /api/cep:', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
