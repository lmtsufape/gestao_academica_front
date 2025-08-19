"use client";
import React, { useEffect, useMemo, useState } from "react";

// === Componentes de campo (seus) ===

// === Utilidades que você já usava ===
import aplicarMascara from "@/utils/mascaras";
// Substitui tipos e helpers locais por módulos
import { Campo } from "./campoTypes";
import { getNestedValue, setNestedValue, updateNestedField, asArray, normalizarLinhas, findCampoByChave, getColSpanValue, flattenCampos } from "./utilsCampo";
import RenderCampo from "./RenderCampo";

// ===================== Tipos =====================

// ===================== Helpers (notação ponto) =====================

// ===================== Componente principal =====================
const Cadastro = ({
  estrutura = null,
  dadosPreenchidos = null,
  setDadosPreenchidos = null,
  chamarFuncao = null,
}: any) => {
  const [expandedDocUrl, setExpandedDocUrl] = useState<string | null>(null);
  const [expandedDocType, setExpandedDocType] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  // Responsividade
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Substitua os dois useEffects por este:
  useEffect(() => {
    // Inicialização única dos multi-selects
    if (estrutura?.cadastro?.campos && !dadosPreenchidos?._initialized) {
      const flat = flattenCampos(estrutura.cadastro.campos);
      const updates: Record<string, any> = {};

      // Processar multi-selects
      flat.forEach((campo: Campo) => {
        if (campo.tipo === "multi-select" || campo.tipo === "multi-select2") {
          const curr = getNestedValue(dadosPreenchidos, campo.chave);
          if (!Array.isArray(curr)) updates[campo.chave] = [];
          if (campo.allSelect && campo.selectOptions?.length) {
            updates[campo.chave] = campo.selectOptions.map((o) => o.chave.toString());
          }
        }

        // Processar foto
        if (campo.tipo === "foto") {
          const valor = getNestedValue(dadosPreenchidos, campo.chave);
          if (valor && typeof valor === "string" && valor !== photoPreview) {
            setPhotoPreview(valor);
          }
        }
      });

      if (Object.keys(updates).length > 0) {
        updates._initialized = true;
        setDadosPreenchidos((prev: any) => ({ ...prev, ...updates }));
      }
    }
  }, [dadosPreenchidos, estrutura, photoPreview]); // Dependências completas

  // Perfil atual (para exibir campos condicionais)
  const perfilAtual = useMemo(
    () =>
      (
        dadosPreenchidos?.perfilSolicitado ||
        dadosPreenchidos?.tipoUsuario ||
        dadosPreenchidos?.perfil?.tipo ||
        ""
      )
        .toString()
        .toUpperCase(),
    [dadosPreenchidos]
  );

  // ======= Handlers genéricos =======
  const alterarInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = (event as any).target;
    const campoMeta: Campo | undefined = findCampoByChave(estrutura?.cadastro?.campos, name);
    let finalValue: any = value;
    if (campoMeta?.tipo === 'select' && campoMeta.selectOptions?.some(o => typeof o.chave === 'boolean')) {
      if (value === 'true') finalValue = true; else if (value === 'false') finalValue = false; else finalValue = value;
    }
    const masked = campoMeta?.mascara ? aplicarMascara(finalValue, campoMeta.mascara) : finalValue;
    setDadosPreenchidos((prev: any) => updateNestedField(prev ?? {}, name, masked));
  };

  const alterarRatio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const ratioValue = value !== "" ? parseFloat(value) / 100 : null;
    setDadosPreenchidos((prev: any) => updateNestedField(prev ?? {}, name, ratioValue));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    chamarFuncao?.("salvar", dadosPreenchidos);
  };

  const linhasNormalizadas = useMemo(() => normalizarLinhas(estrutura?.cadastro?.campos), [estrutura]);

  // ======= Render =======
  return (
    <div className="rounded-md p-6">
      <form onSubmit={handleSubmit} className="w-full">
        {/* ID oculto */}
        <input type="hidden" name="id" value={dadosPreenchidos?.id || ""} />

        {linhasNormalizadas.map((linha, idxLinha) => {
          // Filtra por exibição condicional
          const camposFiltrados = linha.filter((campo) => {
            if (campo.oculto) return false;
            if (campo.exibirPara && !campo.exibirPara.map((v) => v.toUpperCase()).includes(perfilAtual)) return false;
            return true;
          });

          const totalCols = isMobile
            ? 1
            : camposFiltrados.reduce((acc, c) => acc + getColSpanValue(c), 0);
          const gridColumns = isMobile
            ? "repeat(1, minmax(0, 1fr))"
            : `repeat(${totalCols}, minmax(0, 1fr))`;

          return (
            <div
              key={idxLinha}
              className="grid gap-4 mb-6"
              style={{ gridTemplateColumns: gridColumns }}
            >
              {camposFiltrados.map((e: Campo, idx) => (
                <RenderCampo key={idx} campo={e} dados={dadosPreenchidos} setDados={setDadosPreenchidos} perfilAtual={perfilAtual} isMobile={isMobile} photoPreview={photoPreview} setPhotoPreview={setPhotoPreview} expandedDocUrl={expandedDocUrl} setExpandedDocUrl={setExpandedDocUrl} expandedDocType={expandedDocType} setExpandedDocType={setExpandedDocType} alterarInput={alterarInput} alterarRatio={alterarRatio} />
              ))}
            </div>
          );
        })}

        {/* Ações */}
        <div className="flex justify-end mt-4 gap-2">
          {estrutura?.cadastro?.acoes?.map((botao: any, index: number) => {
            const isSubmit = botao.tipo === "submit";
            return (
              <button
                key={index}
                type={isSubmit ? "submit" : "button"}
                name={botao.chave}
                className={
                  isSubmit
                    ? "bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded text-body-medium"
                    : "bg-neutrals-200 hover:bg-neutrals-300 text-neutrals-700 px-4 py-2 rounded text-body-medium"
                }
                onClick={!isSubmit ? () => chamarFuncao?.(botao.chave, dadosPreenchidos) : undefined}
              >
                {botao.nome}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default Cadastro;
