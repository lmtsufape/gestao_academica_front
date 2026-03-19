"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/api/userAuthenticate"; 
import { toast } from "react-toastify";

export default function IsencaoPage() {
  const { id: editalId } = useParams();
  
  // Estado para dados do usuário (ID vem do Auth, Nome/CPF preenchidos pelo usuário)
  const [usuario, setUsuario] = useState({ id: null, nome: "", cpf: "" });
  const [modalidadeId, setModalidadeId] = useState("");
  const [documentos, setDocumentos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarIdUsuario() {
      try {
        // Busca apenas o ID e dados iniciais do módulo Auth
        const response = await api.get("/auth/me"); 
        
        if (response.data) {
          setUsuario(prev => ({
            ...prev,
            id: response.data.id // Garante que o ID seja persistido do Auth
          }));
        }
      } catch (error) {
        console.error("Erro ao identificar usuário:", error);
        toast.error("Sessão expirada. Por favor, faça login novamente.");
      } finally {
        setLoading(false);
      }
    }
    carregarIdUsuario();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulação de upload. No mundo real, você enviaria para um S3/Firebase e pegaria a URL.
    if (e.target.files) {
      const file = e.target.files[0];
      setDocumentos([file.name]); // Armazenando o nome/referência para o backend
    }
  };

  const handleSubmit = async () => {
    if (!usuario.id) {
      toast.error("Erro: Usuário não identificado.");
      return;
    }

    try {
      const payload = {
        usuarioId: usuario.id, // ID vindo do Auth (não editável)
        editalId: Number(editalId),
        modalidadeId: Number(modalidadeId),
        documentoUrl: documentos // Lista de URLs/nomes de arquivos
      };

      await api.post("/isencoes", payload);
      alert("Solicitação de isenção enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar isenção:", error);
      alert("Falha ao solicitar isenção.");
    }
  };

  if (loading) return <div className="p-6 text-center">Validando acesso...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Solicitar Isenção - Edital {editalId}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border">
        {/* Campos preenchidos pelo Usuário */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Nome Completo</label>
          <input 
            type="text"
            value={usuario.nome} 
            onChange={(e) => setUsuario({...usuario, nome: e.target.value})}
            placeholder="Digite seu nome conforme o documento"
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">CPF</label>
          <input 
            type="text"
            value={usuario.cpf} 
            onChange={(e) => setUsuario({...usuario, cpf: e.target.value})}
            placeholder="000.000.000-00"
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700">Modalidade de Isenção</label>
          <select 
            value={modalidadeId} 
            onChange={(e) => setModalidadeId(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Selecione uma modalidade</option>
            <option value="1">CadÚnico (Baixa Renda)</option>
            <option value="2">Doador de Medula Óssea</option>
          </select>
        </div>

        {/* Campo de Upload */}
        <div className="md:col-span-2 border-2 border-dashed border-blue-100 p-6 rounded-lg bg-blue-50">
          <label className="block text-sm font-bold text-blue-800 mb-2">Documentação Comprobatória (PDF)</label>
          <p className="text-xs text-blue-600 mb-4">
             Todos os documentos solicitados (Identidade, Comprovantes, etc.) devem estar digitalizados em um **único arquivo PDF**.
          </p>
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {documentos.length > 0 && (
            <p className="mt-2 text-sm text-green-600 font-medium"> Arquivo selecionado: {documentos[0]}</p>
          )}
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!usuario.id || !modalidadeId || documentos.length === 0}
        className="mt-8 w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        Confirmar e Enviar Solicitação
      </button>
    </div>
  );
}