"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { ExtraSisuService } from "@/app/gestao-extra-sisu/gestao-extra-sisu.service";
import type { InscricaoResumo } from "@/app/gestao-extra-sisu/extra-sisu.types";
import { toast } from "react-toastify";

const formatDateTime = (value?: string) => {
  if (!value) return "Nao informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const MinhasInscricoesPage = () => {
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<InscricaoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const response = await ExtraSisuService.listarMinhasInscricoes();
        setInscricoes(response);
      } catch (error) {
        console.error(error);
        toast.error("Nao foi possivel carregar suas inscricoes.", { position: "top-left" });
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8">
        <Cabecalho
          dados={{
            titulo: "Minhas Inscricoes",
            migalha: [
              { nome: "Inicio", link: "/home" },
              { nome: "Extra Sisu", link: "/gestao-extra-sisu" },
              { nome: "Minhas Inscricoes", link: null },
            ],
            info: "Acompanhe o andamento das suas inscricoes e consulte rapidamente o status atual de cada processo.",
          }}
        />

        {carregando ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando suas inscricoes...
          </div>
        ) : inscricoes.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Voce ainda nao possui inscricoes vinculadas ao Extra Sisu.
          </div>
        ) : (
          <div className="grid gap-5">
            {inscricoes.map((inscricao) => (
              <article
                key={inscricao.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        Inscricao #{inscricao.id}
                      </span>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                        {inscricao.statusAtual?.nome || "Status nao informado"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {inscricao.edital?.titulo || "Edital nao informado"}
                    </h2>
                    <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                      <span>Data da inscricao: {formatDateTime(inscricao.dataInscricao)}</span>
                      <span>Documentos vinculados: {inscricao.documentos?.length ?? 0}</span>
                    </div>
                  </div>

                  <button
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                    onClick={() => router.push(`/gestao-extra-sisu/minhas-inscricoes/${inscricao.id}`)}
                  >
                    Visualizar status
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default withAuthorization(MinhasInscricoesPage);
