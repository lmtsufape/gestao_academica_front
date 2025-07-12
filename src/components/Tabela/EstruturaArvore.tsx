"use client";
import React, { useEffect, useRef, useState } from 'react';
import Pagination from './Itens/Paginacao';
import { Delete, Edit, Visibility } from '@mui/icons-material';

const TabelaArvore = ({ dados = null, estrutura = null, chamarFuncao = null }: any) => {
  // Estados
  const [dropdownAberto, setDropdownAberto] = useState<any>({});
  const dropdownRef = useRef<any>(null);
  const [bodyParams, setBodyParams] = useState<any>({ size: 25 });
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({});

  // Detecta se é desktop ou mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Converte dados planos em árvore (usando unidadePaiId)
  useEffect(() => {
    if (!dados || !Array.isArray(dados)) return;
    const dataMap = new Map<number, any>();
    dados.forEach((item: any) => {
      dataMap.set(item.id, { ...item, children: [] });
    });
    const tree: any[] = [];
    dataMap.forEach((item: any) => {
      if (item.unidadePaiId === null || !dataMap.has(item.unidadePaiId)) {
        tree.push(item);
      } else {
        const parent = dataMap.get(item.unidadePaiId);
        parent.children.push(item);
      }
    });
    setTreeData(tree);
  }, [dados]);

  // Atualiza filtros e chama função de pesquisa
  const paramsColuna = (chave: any = null, valor: any = null) => {
    if (chave != null && valor != null) {
      const updatedBodyParams = { ...bodyParams, [chave]: valor };
      setBodyParams(updatedBodyParams);
      chamarFuncao && chamarFuncao('pesquisar', updatedBodyParams);
    }
  };

  // Dropdown de ações
  const dropdownAbrirFechar = (id: any) => {
    setDropdownAberto((prevState: any) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const dropdownCliqueiFora = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownAberto({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', dropdownCliqueiFora);
    return () => document.removeEventListener('mousedown', dropdownCliqueiFora);
  }, []);

  // Formatação de datas (ISO8601)
  const verificaTexto = (texto: any) => {
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
    if (texto != null && iso8601Regex.test(texto)) {
      const [dataStr, rest] = texto.split("T");
      const [hora] = rest.split(".");
      const [ano, mes, dia] = dataStr.split("-");
      return `${dia}/${mes}/${ano} ${hora}`;
    }
    return texto;
  };

  // Renderiza filtros se configurados
  const renderFiltros = () => {
    if (!estrutura?.tabela?.colunas) return null;
    const filters = estrutura.tabela.colunas.filter((col: any) => col.pesquisar);
    return (
      <div className="flex flex-wrap gap-4 w-full">
        {filters.map((item: any, index: number) => (
          <div key={`filtro_${index}`} className="w-full sm:w-auto flex-1 min-w-[200px] flex flex-col">
            <label htmlFor={`filtro_${index}`} className="mb-1 text-sm font-bold text-neutrals-900">
              {item.nome}
            </label>
            {(item.tipo === 'texto' || item.tipo === 'json') &&
              !(item.selectOptions && item.selectOptions.length > 0) && (
                <input
                  type="text"
                  id={`filtro_${index}`}
                  className="pl-2 py-1 border rounded-md text-sm"
                  placeholder="Pesquisar"
                  onChange={(e) => paramsColuna(item.chave, e.target.value)}
                />
              )}
            {(item.tipo === 'booleano' ||
              (item.tipo === 'texto' && item.selectOptions && item.selectOptions.length > 0)) && (
                <select
                  id={`filtro_${index}`}
                  className="pl-2 py-1 border rounded-md text-sm bg-white"
                  onChange={(e) => paramsColuna(item.chave, e.target.value)}
                >
                  {!item.selectOptions?.some((option: any) => option.valor === "Todos") && (
                    <option value="">Selecionar</option>
                  )}
                  {item.selectOptions.map((option: { chave: any; valor: any }) => (
                    <option key={option.chave} value={option.chave}>
                      {option.valor}
                    </option>
                  ))}
                </select>
              )}
          </div>
        ))}
      </div>
    );
  };

  // Renderiza o conteúdo de cada célula
  const renderCellContent = (node: any, col: any) => {
    if (col.tipo === 'json') {
      const [key, jsonKey] = col.chave.split('|');
      try {
        const jsonItem = JSON.parse(node[key]);
        if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
          return verificaTexto(jsonItem[jsonKey]);
        }
        return '';
      } catch {
        return '';
      }
    } else if (node[col.chave] !== undefined) {
      if (col.tipo === "status" && col.selectOptions) {
        const selectOption = col.selectOptions.find((option: any) => option.chave === node[col.chave]);
        if (selectOption) {
          switch (selectOption.valor) {
            case 'Finalizado':
              return (
                <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-green-100 text-green-800">
                  {selectOption.valor}
                </span>
              );
            case 'Erro':
              return (
                <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-red-100 text-red-800">
                  {selectOption.valor}
                </span>
              );
            default:
              return (
                <span className="px-3 inline-flex text-sm leading-6 font-normal rounded-full bg-neutrals-100 text-neutrals-800">
                  {selectOption.valor}
                </span>
              );
          }
        }
        return '';
      } else if (col.tipo === "booleano" || col.selectOptions) {
        const selectOption = col.selectOptions && col.selectOptions.find((option: any) => option.chave === node[col.chave]);
        if (selectOption) {
          return (
            <div
              className={`py-2 text-center rounded-md text-label-medium font-normal ${selectOption.chave === true || selectOption.chave === "APROVADA"
                ? "bg-success-100 text-success-900"
                : selectOption.chave === "PENDENTE"
                  ? "bg-warning-100 text-warning-900"
                  : "bg-danger-100 text-danger-900"
                }`}
            >
              {selectOption.valor}
            </div>
          );
        }
        return '';
      } else if (typeof node[col.chave] !== 'object') {
        return verificaTexto(node[col.chave]);
      }
      return '';
    } else {
      // Trata campos aninhados (ex.: "tipoUnidade.nome")
      if (col.chave.indexOf('.') !== -1) {
        const keys = col.chave.split('.');
        let nestedValue = node;
        for (let k of keys) {
          if (nestedValue) nestedValue = nestedValue[k];
        }
        if (nestedValue !== undefined && typeof nestedValue !== 'object') {
          return verificaTexto(nestedValue);
        }
      }
      return '';
    }
  };

  // --------------------------------------------------
  // RENDERIZAÇÃO DESKTOP
  // --------------------------------------------------

  const renderRow = (node: any, level: number = 0, ancestorsHaveNextSibling: boolean[] = []) => {
    const spacing = 30;
    const offset = 0;

    // Pega irmãos para saber se o nó atual tem um próximo
    const parentChildren = node.unidadePaiId != null
      ? dados.filter((item: any) => item.unidadePaiId === node.unidadePaiId)
      : treeData;

    const currentIndex = parentChildren.findIndex((item: any) => item.id === node.id);
    const hasNextSibling = currentIndex < parentChildren.length - 1;

    return (
      <React.Fragment key={node.id}>
        <tr className="hover:bg-neutrals-100">
          {estrutura.tabela.colunas.map((col: any, index: number) => {
            if (index === 0) {
              return (
                <td key={col.chave} className="px-6 py-2 whitespace-nowrap font-normal relative">

                  {/* Linhas verticais dos ancestrais */}
                  {ancestorsHaveNextSibling.map((hasSibling, i) =>
                    hasSibling ? (
                      <div
                        key={i}
                        className="absolute inset-y-0"
                        style={{
                          left: `${(i + 1) * spacing - spacing / 111 + offset}px`,
                          width: "1px",
                          borderLeft: "1px dashed #000",
                        }}
                      />
                    ) : null
                  )}

                  {/* Linha horizontal (apenas no nível atual, se for filho) */}
                  {level > 0 && (
                    <div
                      className="absolute"
                      style={{
                        top: "50%",
                        left: `${level * spacing + offset}px`,
                        width: "20px",
                        height: "1px",
                        backgroundColor: "#000",
                      }}
                    />
                  )}

                  {/* Conteúdo com indentação */}
                  <div className="flex items-center" style={{ paddingLeft: `${level * spacing + offset}px` }}>
                    {node.children && node.children.length > 0 && (
                      <button onClick={() => toggleNode(node.id)} className="mr-2 focus:outline-none">
                        {expandedNodes[node.id] ? "▼" : "▶"}
                      </button>
                    )}
                    <span
                      className={`text-sm ${level === 0 ? "font-semibold text-neutrals-900" : "text-neutrals-700"}`}
                    >
                      {renderCellContent(node, col)}
                    </span>
                  </div>
                </td>
              );
            } else if (col.chave === 'acoes') {
              return (
                <td
                  key={col.chave}
                  className="py-2 whitespace-nowrap border-l border-neutrals-200 text-center"
                  style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {estrutura.tabela.acoes_dropdown &&
                      estrutura.tabela.acoes_dropdown.map((acao: any, idx: number) => (
                        <button
                          key={idx}
                          className="p-1 hover:bg-neutrals-100 rounded"
                          role="menuitem"
                          onClick={() => chamarFuncao(acao.chave, node)}
                        >
                          {acao.nome === 'Editar' && (
                            <Edit className="text-primary-700" />
                          )}
                          {acao.nome === 'Visualizar' && (
                            <Visibility className="text-primary-700" />
                          )}
                          {acao.nome === 'Deletar' && (
                            <Delete className="text-danger-500" />
                          )}
                        </button>
                      ))}
                  </div>
                </td>
              );
            }

            else {
              return (
                <td key={col.chave} className="px-6 py-2 whitespace-nowrap font-normal">
                  {renderCellContent(node, col)}
                </td>
              );
            }
          })}
        </tr>

        {/* Renderiza filhos se expandidos */}
        {node.children &&
          node.children.length > 0 &&
          expandedNodes[node.id] &&
          node.children.map((child: any, idx: number) =>
            renderRow(child, level + 1, [
              ...ancestorsHaveNextSibling,
              idx < node.children.length // só desenha linha se ainda houver irmãos depois
            ])
          )}
      </React.Fragment>
    );
  };

  // --------------------------------------------------
  // RENDERIZAÇÃO MOBILE
  // --------------------------------------------------
  const renderMobileRow = (node: any, level: number = 0) => {
    return (
      <div
        key={node.id}
        className="bg-white rounded-md mb-4 shadow"
        style={{
          // Linha-guia + indentação para filhos
          borderLeft: level >= 1 ? "0.05rem dashed #666" : "none",
          paddingLeft: level >= 1 ? `${level * 0.0015}rem` : "0",
        }}
      >
        {/* Cabeçalho do item (exibindo a primeira coluna) */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-neutrals-200">
          <div>
            <span className="font-semibold text-sm">
              {renderCellContent(node, estrutura.tabela.colunas[0])}
            </span>
          </div>
          {node.children && node.children.length > 0 && (
            <button
              onClick={() => toggleNode(node.id)}
              className="px-2 py-1 text-sm border rounded focus:outline-none"
            >
              {expandedNodes[node.id] ? "Fechar" : "Abrir"}
            </button>
          )}
        </div>

        {/* Demais colunas no "corpo" do card */}
        <div className="px-3 py-2">
          {estrutura.tabela.colunas.slice(1).map((col: any) => {
            if (col.chave === "acoes") {
              return (
                <div key={col.chave} className="mt-2 flex justify-end gap-2">
                  {estrutura.tabela.acoes_dropdown &&
                    estrutura.tabela.acoes_dropdown.map(
                      (acao: any, idx: number) => (
                        <button
                          key={idx}
                          className="px-4 py-1 text-sm text-white bg-primary-500 hover:bg-primary-700 rounded"
                          onClick={() => chamarFuncao(acao.chave, node.id)}
                        >
                          {acao.nome}
                        </button>
                      )
                    )}
                </div>
              );
            } else {
              return (
                <div key={col.chave} className="mt-2">
                  <span className="block text-xs font-bold text-gray-700">
                    {col.nome}:
                  </span>
                  <span className="block text-sm text-gray-800">
                    {renderCellContent(node, col)}
                  </span>
                </div>
              );
            }
          })}

          {/* Se tiver filhos e estiver expandido, renderiza recursivamente */}
          {node.children &&
            node.children.length > 0 &&
            expandedNodes[node.id] && (
              <div className="mt-3">
                {node.children.map((child: any) =>
                  renderMobileRow(child, level + 1)
                )}
              </div>
            )}
        </div>
      </div>
    );
  };

  // Alterna a expansão de um nó
  const toggleNode = (id: number) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="flex flex-col">
        {/* Linha de botões */}
        <div className="flex justify-between items-center overflow-x-auto mt-2.5">
          <div className="flex items-center">
            {estrutura?.tabela?.configuracoes?.pesquisar && (
              <div className="relative ml-2">
                <button
                  className="mb-2 px-4 py-2 bg-neutrals-100 text-primary-500 text-sm rounded-md border border-primary-500 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-colors duration-200"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? '▲' : '▼'} Filtrar
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {estrutura?.tabela?.botoes &&
              estrutura.tabela.botoes
                .filter((botao: any) => botao.nome !== 'Filtrar')
                .map((botao: any, index: number) => (
                  <button
                    key={index}
                    className="ml-2 mb-2 px-4 py-2 text-sm text-neutrals-50 bg-primary-500 hover:bg-primary-700 border rounded-md"
                    disabled={botao.bloqueado}
                    hidden={botao.oculto}
                    onClick={() => chamarFuncao(botao.chave, botao)}
                  >
                    {botao.nome}
                  </button>
                ))}
          </div>
        </div>
        {showFilters && (
          <div className="mb-4 p-4 bg-neutrals-50 rounded-md shadow">
            {renderFiltros()}
          </div>
        )}

        {/* Versão Desktop */}
        <div className="overflow-x-auto rounded-md border-2 border-neutrals-200 hidden md:block">
          <div className="min-w-full inline-block align-middle">
            <div className="rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-neutrals-200">
                <thead
                  className="bg-neutrals-50"
                  hidden={estrutura?.tabela?.configuracoes && !estrutura.tabela.configuracoes.cabecalho}
                >
                  <tr>
                    {estrutura.tabela.colunas.map((item: any, index: number) => (
                      <td
                        key={index}
                        className={
                          item.nome.toUpperCase() === 'AÇÕES'
                            ? 'px-6 py-3 whitespace-nowrap text-sm font-bold uppercase text-neutrals-900 text-center'
                            : 'px-6 py-3 whitespace-nowrap text-sm font-bold uppercase text-neutrals-900'
                        }
                        style={item.nome.toUpperCase() === 'AÇÕES' ? { width: '100px', minWidth: '100px', maxWidth: '100px' } : {}}
                        title={item.hint || ''}
                      >
                        <div
                          className={
                            item.nome.toUpperCase() === 'AÇÕES'
                              ? 'flex items-center justify-center gap-2'
                              : 'flex items-center gap-2'
                          }
                        >
                          {item.nome}
                          {item.hint && (
                            <div className="ml-2 relative group">
                              <svg
                                className="w-5 h-5 text-neutrals-800 cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          {item.sort && (
                            <button
                              className="ml-2"
                              onClick={() =>
                                paramsColuna(
                                  'sort',
                                  bodyParams.sort != null &&
                                    bodyParams.sort.split(',')[1] === 'asc'
                                    ? `${item.chave},desc`
                                    : `${item.chave},asc`
                                )
                              }
                              hidden={!item.sort}
                            >
                              {bodyParams.sort != null &&
                                bodyParams.sort.split(',')[0] === item.chave &&
                                bodyParams.sort.split(',')[1] === 'asc'
                                ? '▲'
                                : '▼'}
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutrals-200">
                  {treeData && treeData.length > 0 ? (
                    treeData.map((node: any) => renderRow(node))
                  ) : (
                    <tr>
                      <td colSpan={estrutura.tabela.colunas.length} className="text-center py-4 font-normal">
                        <h6 className="text-neutrals-600">Nenhum registro encontrado.</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Versão Mobile */}
        <div className="block md:hidden">
          {treeData && treeData.length > 0 ? (
            treeData.map((node: any) => renderMobileRow(node))
          ) : (
            <div className="text-center py-4 font-normal">
              <h6 className="text-neutrals-600">Nenhum registro encontrado.</h6>
            </div>
          )}
        </div>
      </div>

      {estrutura?.tabela?.configuracoes?.rodape && (
        <Pagination dados={dados} paramsColuna={paramsColuna} />
      )}
    </div>
  );
};

export default TabelaArvore;
