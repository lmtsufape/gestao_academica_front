"use client";

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import { generica } from '@/utils/api';
import EtapaForm from '@/components/EditalModelo/EtapaForm';
import CampoPersonalizadoForm from '@/components/EditalModelo/CampoPersonalizadoForm';
import { tipoEditalSchema, TipoEditalFormData } from './types';

export default function CriarTipoEditalPage() {
  // Estado para carregar opções de Unidade Administrativa
  const [unidadesAdm, setUnidadesAdm] = useState<any[]>([]);
  const [loadingUnidadesAdm, setLoadingUnidadesAdm] = useState<boolean>(false);

  // Formulário RHF + Zod
  const { control, handleSubmit, formState: { errors } } = useForm<TipoEditalFormData>({
    resolver: zodResolver(tipoEditalSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      idUnidadeAdministrativa: 0,
      etapas: [],
      campos: [],
    },
  });

  // Field Arrays
  const { fields: etapasFields, append: appendEtapa, remove: removeEtapa, move: moveEtapa } = useFieldArray({ control, name: 'etapas' });
  const { fields: camposModeloFields, append: appendCampoModelo, remove: removeCampoModelo } = useFieldArray({ control, name: 'campos' });

  // Helper para montar options [{chave, valor}]
  const getOptions = (lista: any[], selecionado?: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [] as { chave: number; valor: string }[];
    const opts = lista.map((item: any) => ({ chave: Number(item.id), valor: item.nome ?? `Unidade #${item.id}` }));
    const selectedId = selecionado ? Number(selecionado) : null;
    if (selectedId && opts.some((o) => o.chave === selectedId)) {
      const sel = opts.find((o) => o.chave === selectedId)!;
      return [sel, ...opts.filter((o) => o.chave !== selectedId)];
    }
    return opts;
  };

  // Carregar lista de Unidades Administrativas
  useEffect(() => {
    const carregarUnidades = async () => {
      try {
        setLoadingUnidadesAdm(true);
        const resp = await generica({
          metodo: 'get',
          uri: '/auth/unidade-administrativa',
          params: { size: 50, page: 0 },
          data: {},
        });
        const lista = resp?.data?.content ?? resp?.data ?? [];
        setUnidadesAdm(Array.isArray(lista) ? lista : []);
      } catch (e) {
        setUnidadesAdm([]);
      } finally {
        setLoadingUnidadesAdm(false);
      }
    };
    carregarUnidades();
  }, []);

  const onSubmit = (data: TipoEditalFormData) => {
    const dataComOrdem = {
      ...data,
      etapas: data.etapas.map((etapa, idx) => ({ ...etapa, ordem: idx + 1 })),
    };
    //  Falta fazer a integração com o backend
    console.log('Dados do Formulário:', JSON.stringify(dataComOrdem, null, 2));
    alert('Dados do formulário enviados! Verifique o console.');
  };

  const estrutura = {
    cabecalho: {
      titulo: 'Criar Novo Tipo de Edital',
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão de Editais', link: '/gestao-edital' },
        { nome: 'Criar Tipo de Edital', link: '/teste' },
      ],
    },
  };

  return (
    <main className="flex flex-wrap justify-center mx-auto bg-gray-50 min-h-screen">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-4/5 max-w-7xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Informações Gerais do Tipo de Edital</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome do Tipo de Edital</label>
                <Controller name="nome" control={control} render={({ field }) => (
                  <input id="nome" {...field} className="mt-1 block w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                )} />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message as string}</p>}
              </div>
              <div>
                <label htmlFor="idUnidadeAdministrativa" className="block text-sm font-medium text-gray-700 mb-1">Unidade Administrativa</label>
                <Controller
                  name="idUnidadeAdministrativa"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="idUnidadeAdministrativa"
                      className="mt-1 block w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={field.value ? String(field.value) : ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={loadingUnidadesAdm}
                    >
                      <option value="" disabled>
                        {loadingUnidadesAdm ? 'Carregando opções…' : 'Selecione uma unidade'}
                      </option>
                      {getOptions(unidadesAdm, field.value).map((opt) => (
                        <option key={opt.chave} value={opt.chave}>
                          {opt.valor}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.idUnidadeAdministrativa && (
                  <p className="text-red-500 text-xs mt-1">{errors.idUnidadeAdministrativa.message as string}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <Controller name="descricao" control={control} render={({ field }) => (
                  <textarea id="descricao" {...field} rows={3} className="mt-1 block w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                )} />
                {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message as string}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Campos Gerais</h2>
            <div className="space-y-4">
              {camposModeloFields.map((item, index) => (
                <CampoPersonalizadoForm key={item.id} control={control} pathPrefix="campos" index={index} onRemove={removeCampoModelo} />
              ))}
              <button
                type="button"
                onClick={() => appendCampoModelo({ nome: '', rotulo: '', obrigatorio: true, tipoCampo: 'TEXTO_CURTO', opcoes: '' })}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
              >
                + Adicionar Campo
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Etapas</h2>
            <div className="space-y-6">
              {etapasFields.map((item, index) => (
                <EtapaForm
                  key={item.id}
                  control={control}
                  index={index}
                  totalEtapas={etapasFields.length}
                  onRemoveEtapa={removeEtapa}
                  onMoveEtapa={moveEtapa}
                />
              ))}
              <button
                type="button"
                onClick={() => appendEtapa({ nome: '', descricao: '', obrigatoria: true, ordem: etapasFields.length + 1, campos: [] })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                + Adicionar Etapa
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 text-lg font-semibold shadow-lg">
              Salvar tipo de Edital
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}