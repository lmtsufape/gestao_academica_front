"use client"
import React, { useEffect, useState } from 'react';
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import { useParams } from 'next/navigation';
import { generica } from '@/utils/api';
import { Calendar, MapPin, User, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const estruturaPadrao: any = {
  cabecalho: {
    titulo: "Detalhes do Edital",
    migalha: [
      { nome: 'Início', link: '/home' },
      { nome: 'Editais', link: '/extra-sisu/editais' },
      { nome: 'Visualizar', link: '#' },
    ]
  }
}

const PageEvento = () => {
  const { id } = useParams(); 
  const router = useRouter();
  const [edital, setEdital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const buscarDadosEdital = async () => {
    try {
      const body = {
        metodo: 'get',
    
        uri: `/extra-sisu/editais/${id}`, 
        params: {}, 
        data: {}
      };
      
      const response = await generica(body);

      if (response?.data) {
        setEdital(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do edital:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      buscarDadosEdital();
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center">Carregando...</div>;

  return (
    <main className="flex flex-wrap justify-center mx-auto min-h-screen bg-white">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 2xl:p-20 pt-7 md:pt-8 md:pb-8">
        
        <Cabecalho dados={estruturaPadrao.cabecalho} />

        <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Banner*/}
          <div className="w-full md:w-3/5 h-64 rounded-lg overflow-hidden flex shadow-sm border border-gray-100">
            <div className="bg-[#0a1618] flex-1"></div>
            <div className="bg-[#0e2a30] flex-1"></div>
            <div className="bg-[#154a55] flex-1"></div>
            <div className="bg-[#1a6e83] flex-1"></div>
            <div className="bg-[#2490b0] flex-1"></div>
            <div className="bg-[#2eb9d6] flex-1"></div>
          </div>

          {/* Dados */}
          <div className="w-full md:w-2/5 space-y-5">
            <h2 className="text-[#003d3d] text-2xl font-bold leading-tight uppercase">
              {edital?.titulo || "Título não disponível"}
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-orange-600" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Período de Inscrição</p>
                  <span className="font-semibold text-orange-600 text-sm">
                    { edital?.dataInscricao ? new Date(edital.dataInscricao).toLocaleDateString() : '--'} até {edital?.dataFinalizacao ? new Date(edital.dataFinalizacao).toLocaleDateString() : '--'}
                  </span>
                </div>
              </div>
              <div>
              <button 
                onClick={() => router.push(`/gestao-extra-sisu/isencao/${edital.id}`)}
                className="font-semibold text-orange-600 text-sm"
                >
                Solicitar Isenção
             </button>
             </div>


              <div>
             <button 
                onClick={() => router.push(`/gestao-extra-sisu/isencao/${edital.id}`)}
                className="font-semibold text-orange-600 text-sm"
                >
                Realizar Inscrição
             </button>
             </div>
              
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-[#003d3d]" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Documento PDF</p>
                  <a href={edital?.pdf} target="_blank" className="text-blue-600 text-sm underline">
                    Visualizar Edital Completo
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User size={20} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Responsável</p>
                  <p className="text-gray-700 font-medium italic">Coordenação Extra-SISU</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <section className="mt-12 border-t border-gray-100 pt-8">
          <h3 className="text-[#003d3d] text-xl font-bold mb-4">Sobre o processo</h3>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-sm">
              {edital?.descricao || "Nenhuma descrição detalhada foi fornecida para este edital."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default withAuthorization(PageEvento);