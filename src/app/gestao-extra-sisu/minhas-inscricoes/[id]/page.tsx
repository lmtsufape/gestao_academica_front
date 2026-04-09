"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { ExtraSisuService } from "@/app/gestao-extra-sisu/gestao-extra-sisu.service";
import type { InscricaoDetalhada } from "@/app/gestao-extra-sisu/extra-sisu.types";

const formatDateTime = (value?: string) => {
  if (!value) return "Nao informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const StatusInscricaoPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [detalhes, setDetalhes] = useState<InscricaoDetalhada | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const response = await ExtraSisuService.buscarDetalhesInscricao(id);
        setDetalhes(response);
      } catch (error) {
        console.error(error);
        toast.error("Nao foi possivel carregar os detalhes da inscricao.", { position: "top-left" });
      } finally {
        setCarregando(false);
      }
    };

    if (Number.isFinite(id)) {
      carregar();
    }
  }, [id]);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8">
        <Cabecalho
          dados={{
            titulo: "Status da Inscricao",
            migalha: [
              { nome: "Inicio", link: "/home" },
              { nome: "Extra Sisu", link: "/gestao-extra-sisu" },
              { nome: "Minhas Inscricoes", link: "/gestao-extra-sisu/minhas-inscricoes" },
              { nome: "Status", link: null },
            ],
          }}
        />

        {carregando ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando status da inscricao...
          </div>
        ) : !detalhes ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            Nao foi possivel localizar a inscricao solicitada.
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      Inscricao #{detalhes.inscricao.id}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                      {detalhes.inscricao.statusAtual?.nome || "Status nao informado"}
                    </span>
                  </div>
                  <h2 className="text-3xl font-semibold text-slate-900">
                    {detalhes.inscricao.edital?.titulo || "Edital nao informado"}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Inscricao realizada em {formatDateTime(detalhes.inscricao.dataInscricao)}
                  </p>
                </div>

                <button
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  onClick={() => router.push("/gestao-extra-sisu/minhas-inscricoes")}
                >
                  Voltar para minhas inscricoes
                </button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de edital</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {detalhes.inscricao.edital?.tipoEdital?.nome || "Nao informado"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Inicio das inscricoes</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatDateTime(detalhes.inscricao.edital?.inicioInscricao)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fim das inscricoes</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatDateTime(detalhes.inscricao.edital?.fimIncricao)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Documentos enviados</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {detalhes.inscricao.documentos?.length ?? 0}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Historico</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">Linha do tempo da inscricao</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {detalhes.historico.length} registro(s)
                </span>
              </div>

              <div className="mt-8 space-y-5">
                {detalhes.historico.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                    Ainda nao ha movimentacoes registradas para esta inscricao.
                  </div>
                ) : (
                  detalhes.historico.map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Evento {index + 1}
                            </span>
                            {item.status && (
                              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                                {item.status.nome}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {item.etapa?.nome || "Etapa nao identificada"}
                          </h4>
                          <p className="text-sm leading-6 text-slate-600">
                            {item.observacao || "Sem observacoes registradas para esta movimentacao."}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600">
                          {formatDateTime(item.dataAcao)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default withAuthorization(StatusInscricaoPage);
