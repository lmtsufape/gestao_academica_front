"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { ExtraSisuService } from "@/app/gestao-extra-sisu/gestao-extra-sisu.service";
import type {
  AdminEditalDetalhado,
  EtapaAdminResumo,
  StatusPersonalizadoResumo,
  TipoEditalResumo,
} from "@/app/gestao-extra-sisu/extra-sisu.types";

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const toLocalDateTime = (value: string) => {
  if (!value) return undefined;
  return `${value}T00:00:00`;
};

const formatDateTime = (value?: string) => {
  if (!value) return "Nao informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const emptyEditalForm = {
  titulo: "",
  descricao: "",
  dataPublicacao: "",
  inicioInscricao: "",
  fimIncricao: "",
  statusAtualId: "",
  tipoEditalId: "",
};

const emptyEtapaForm = {
  id: 0,
  nome: "",
  descricao: "",
  obrigatoria: false,
  ordem: 1,
  statusAtualId: "",
};

const VisualizarEditalAdmin = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [detalhes, setDetalhes] = useState<AdminEditalDetalhado | null>(null);
  const [status, setStatus] = useState<StatusPersonalizadoResumo[]>([]);
  const [tiposEdital, setTiposEdital] = useState<TipoEditalResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvandoEdital, setSalvandoEdital] = useState(false);
  const [salvandoEtapa, setSalvandoEtapa] = useState(false);
  const [modalEditalAberta, setModalEditalAberta] = useState(false);
  const [modalEtapaAberta, setModalEtapaAberta] = useState(false);
  const [formEdital, setFormEdital] = useState(emptyEditalForm);
  const [formEtapa, setFormEtapa] = useState(emptyEtapaForm);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [detalheResponse, statusResponse, tiposResponse] = await Promise.all([
        ExtraSisuService.buscarEditalAdmin(id),
        ExtraSisuService.listarStatusPersonalizados(),
        ExtraSisuService.listarTiposEdital(),
      ]);
      setDetalhes(detalheResponse);
      setStatus(statusResponse);
      setTiposEdital(tiposResponse);
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel carregar o edital.", { position: "top-left" });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    carregarDados();
  }, [id]);

  const abrirModalEdital = () => {
    if (!detalhes?.edital) return;
    setFormEdital({
      titulo: detalhes.edital.titulo ?? "",
      descricao: detalhes.edital.descricao ?? "",
      dataPublicacao: toDateInputValue(detalhes.edital.dataPublicacao),
      inicioInscricao: toDateInputValue(detalhes.edital.inicioInscricao),
      fimIncricao: toDateInputValue(detalhes.edital.fimIncricao),
      statusAtualId: detalhes.edital.statusAtual?.id?.toString() ?? "",
      tipoEditalId: detalhes.edital.tipoEdital?.id?.toString() ?? "",
    });
    setModalEditalAberta(true);
  };

  const abrirModalEtapa = (etapa: EtapaAdminResumo) => {
    setFormEtapa({
      id: etapa.id,
      nome: etapa.nome ?? "",
      descricao: etapa.descricao ?? "",
      obrigatoria: Boolean(etapa.obrigatoria),
      ordem: etapa.ordem ?? 1,
      statusAtualId: etapa.statusAtual?.id?.toString() ?? "",
    });
    setModalEtapaAberta(true);
  };

  const salvarEdital = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSalvandoEdital(true);
      await ExtraSisuService.atualizarEditalAdmin(id, {
        titulo: formEdital.titulo,
        descricao: formEdital.descricao,
        dataPublicacao: toLocalDateTime(formEdital.dataPublicacao),
        inicioInscricao: toLocalDateTime(formEdital.inicioInscricao),
        fimIncricao: toLocalDateTime(formEdital.fimIncricao),
        statusAtualId: formEdital.statusAtualId ? Number(formEdital.statusAtualId) : undefined,
        tipoEditalId: formEdital.tipoEditalId ? Number(formEdital.tipoEditalId) : undefined,
      });
      toast.success("Edital atualizado com sucesso.", { position: "top-left" });
      setModalEditalAberta(false);
      await carregarDados();
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel atualizar o edital.", { position: "top-left" });
    } finally {
      setSalvandoEdital(false);
    }
  };

  const salvarEtapa = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSalvandoEtapa(true);
      await ExtraSisuService.atualizarEtapaAdmin(formEtapa.id, {
        nome: formEtapa.nome,
        descricao: formEtapa.descricao,
        obrigatoria: formEtapa.obrigatoria,
        ordem: Number(formEtapa.ordem),
        editalId: detalhes?.edital?.id,
        statusAtualId: formEtapa.statusAtualId ? Number(formEtapa.statusAtualId) : undefined,
      });
      toast.success("Etapa atualizada com sucesso.", { position: "top-left" });
      setModalEtapaAberta(false);
      await carregarDados();
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel atualizar a etapa.", { position: "top-left" });
    } finally {
      setSalvandoEtapa(false);
    }
  };

  const deletarEdital = async () => {
    const confirmacao = await Swal.fire({
      title: "Excluir edital?",
      text: "Essa acao remove o edital permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacao.isConfirmed) return;

    try {
      await ExtraSisuService.deletarEditalAdmin(id);
      toast.success("Edital excluido com sucesso.", { position: "top-left" });
      router.push("/gestao-extra-sisu/editais");
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel excluir o edital.", { position: "top-left" });
    }
  };

  const revogarEtapa = async (etapa: EtapaAdminResumo) => {
    const confirmacao = await Swal.fire({
      title: "Revogar etapa?",
      text: `A etapa "${etapa.nome}" sera removida do edital.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Revogar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacao.isConfirmed) return;

    try {
      await ExtraSisuService.revogarEtapa(etapa.id);
      toast.success("Etapa revogada com sucesso.", { position: "top-left" });
      await carregarDados();
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel revogar a etapa.", { position: "top-left" });
    }
  };

  const statusEdital = status.filter((item) => item.tipoStatus === "EDITAL");
  const statusEtapa = status.filter((item) => item.tipoStatus === "ETAPA");

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8">
        <Cabecalho
          dados={{
            titulo: "Visualizacao do Edital",
            migalha: [
              { nome: "Inicio", link: "/home" },
              { nome: "Extra Sisu", link: "/gestao-extra-sisu" },
              { nome: "Editais", link: "/gestao-extra-sisu/editais" },
              { nome: "Visualizar", link: null },
            ],
          }}
        />

        {carregando ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando dados do edital...
          </div>
        ) : !detalhes ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            Nao foi possivel localizar o edital solicitado.
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      Edital #{detalhes.edital.id}
                    </span>
                    {detalhes.edital.statusAtual && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                        {detalhes.edital.statusAtual.nome}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-semibold text-slate-900">{detalhes.edital.titulo}</h2>
                  <p className="max-w-3xl text-sm leading-6 text-slate-600">
                    {detalhes.edital.descricao || "Sem descricao cadastrada para este edital."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    onClick={() => router.push(`/gestao-extra-sisu/editais/${id}`)}
                  >
                    Editar no formulario
                  </button>
                  <button
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    onClick={abrirModalEdital}
                  >
                    Editar rapido
                  </button>
                  <button
                    className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                    onClick={deletarEdital}
                  >
                    Deletar edital
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {detalhes.edital.tipoEdital?.nome || "Nao informado"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Publicacao</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatDateTime(detalhes.edital.dataPublicacao)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Inicio das inscricoes</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatDateTime(detalhes.edital.inicioInscricao)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fim das inscricoes</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatDateTime(detalhes.edital.fimIncricao)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Etapas</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                    Cronograma e fluxo do edital
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {detalhes.etapas.length} etapa(s)
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {detalhes.etapas.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                    Nenhuma etapa vinculada a este edital.
                  </div>
                ) : (
                  detalhes.etapas
                    .slice()
                    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
                    .map((etapa) => (
                      <article
                        key={etapa.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Ordem {etapa.ordem ?? "-"}
                              </span>
                              {etapa.statusAtual && (
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                                  {etapa.statusAtual.nome}
                                </span>
                              )}
                              <span
                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                  etapa.obrigatoria
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {etapa.obrigatoria ? "Obrigatoria" : "Opcional"}
                              </span>
                            </div>
                            <h4 className="text-xl font-semibold text-slate-900">{etapa.nome}</h4>
                            <p className="text-sm leading-6 text-slate-600">
                              {etapa.descricao || "Sem descricao cadastrada para esta etapa."}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                              onClick={() => abrirModalEtapa(etapa)}
                            >
                              Editar etapa
                            </button>
                            <button
                              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                              onClick={() => revogarEtapa(etapa)}
                            >
                              Revogar etapa
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                )}
              </div>
            </section>
          </div>
        )}

        {modalEditalAberta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Edicao rapida</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">Atualizar edital</h3>
                </div>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 hover:bg-slate-50"
                  onClick={() => setModalEditalAberta(false)}
                >
                  Fechar
                </button>
              </div>

              <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={salvarEdital}>
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Titulo</span>
                  <input
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEdital.titulo}
                    onChange={(event) => setFormEdital((current) => ({ ...current, titulo: event.target.value }))}
                    required
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Descricao</span>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEdital.descricao}
                    onChange={(event) => setFormEdital((current) => ({ ...current, descricao: event.target.value }))}
                    required
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Data de publicacao</span>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEdital.dataPublicacao}
                    onChange={(event) =>
                      setFormEdital((current) => ({ ...current, dataPublicacao: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Tipo de edital</span>
                  <select
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEdital.tipoEditalId}
                    onChange={(event) =>
                      setFormEdital((current) => ({ ...current, tipoEditalId: event.target.value }))
                    }
                  >
                    <option value="">Selecione</option>
                    {tiposEdital.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Inicio das inscricoes</span>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEdital.inicioInscricao}
                    onChange={(event) =>
                      setFormEdital((current) => ({ ...current, inicioInscricao: event.target.value }))
                    }
                    required
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Fim das inscricoes</span>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEdital.fimIncricao}
                    onChange={(event) =>
                      setFormEdital((current) => ({ ...current, fimIncricao: event.target.value }))
                    }
                    required
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Status atual</span>
                  <select
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEdital.statusAtualId}
                    onChange={(event) =>
                      setFormEdital((current) => ({ ...current, statusAtualId: event.target.value }))
                    }
                  >
                    <option value="">Selecione</option>
                    {statusEdital.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setModalEditalAberta(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    disabled={salvandoEdital}
                  >
                    {salvandoEdital ? "Salvando..." : "Salvar edital"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalEtapaAberta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Edicao de etapa</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">Atualizar etapa</h3>
                </div>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 hover:bg-slate-50"
                  onClick={() => setModalEtapaAberta(false)}
                >
                  Fechar
                </button>
              </div>

              <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={salvarEtapa}>
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Nome</span>
                  <input
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEtapa.nome}
                    onChange={(event) => setFormEtapa((current) => ({ ...current, nome: event.target.value }))}
                    required
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Descricao</span>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEtapa.descricao}
                    onChange={(event) =>
                      setFormEtapa((current) => ({ ...current, descricao: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Ordem</span>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEtapa.ordem}
                    onChange={(event) =>
                      setFormEtapa((current) => ({ ...current, ordem: Number(event.target.value) }))
                    }
                    required
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
                  <select
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    value={formEtapa.statusAtualId}
                    onChange={(event) =>
                      setFormEtapa((current) => ({ ...current, statusAtualId: event.target.value }))
                    }
                  >
                    <option value="">Selecione</option>
                    {statusEtapa.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formEtapa.obrigatoria}
                    onChange={(event) =>
                      setFormEtapa((current) => ({ ...current, obrigatoria: event.target.checked }))
                    }
                  />
                  <span className="text-sm font-medium text-slate-700">Etapa obrigatoria</span>
                </label>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setModalEtapaAberta(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    disabled={salvandoEtapa}
                  >
                    {salvandoEtapa ? "Salvando..." : "Salvar etapa"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default withAuthorization(VisualizarEditalAdmin);
