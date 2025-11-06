import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/Tabela/Itens/Paginacao';
import { Delete, Edit, Visibility } from '@mui/icons-material';

const Tabela = ({ dados = null, estrutura = null, chamarFuncao = null }: any) => {
  const [dropdownAberto, setDropdownAberto] = useState<any>({});
  const dropdownRef = useRef<any>(null);
  const [bodyParams, setBodyParams] = useState<any>({ size: 10 });
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Função auxiliar para gerar keys únicas
  const generateUniqueKey = (base: string, suffix?: string) => {
    return `${base || 'key'}_${suffix || Math.random().toString(36).substr(2, 9)}`;
  };

  // NORMALIZA os dados recebidos:
  const linhas = Array.isArray(dados) ? dados : (dados?.content ?? []);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) {
        setShowFilters(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const paramsColuna = (chave: any = null, valor: any = null) => {
    if (chave != null && valor != null) {
      const updatedBodyParams = { ...bodyParams, [chave]: valor };
      setBodyParams(updatedBodyParams);
      chamarFuncao('pesquisar', updatedBodyParams);
    }
  };

  const dropdownAbrirFechar = (id: any) => {
    setDropdownAberto((prevState: any) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const dropdownCliqueiFora = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownAberto({});
    }
  };

  const verificaTexto = (texto: any) => {
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
    if (texto != null && iso8601Regex.test(texto)) {
      let dataString = texto;
      let data = dataString.split("T")[0];
      let hora = dataString.split("T")[1].split(".")[0];
      let dia = data.split('-')[2];
      let mes = data.split('-')[1];
      let ano = data.split('-')[0];
      return `${dia}/${mes}/${ano} ${hora}`;
    } else {
      return texto;
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', dropdownCliqueiFora);
    return () => {
      document.removeEventListener('mousedown', dropdownCliqueiFora);
    };
  }, []);

  const renderFiltros = () => {
    const filters = estrutura.tabela.colunas.filter((col: any) => col.pesquisar);
    return (
      <div className={`${isDesktop ? 'flex gap-4 items-end' : 'flex flex-col gap-4'} w-full pt-2`}>
        {filters?.map((item: any) => (
          <div
            key={generateUniqueKey('filtro', item.chave)}
            className={`${isDesktop ? 'flex-1' : 'w-full'} flex flex-col`}
          >
            <label
              htmlFor={`filtro_${item.chave}`}
              className="mb-2 text-sm font-bold text-gray-700"
            >
              {item.nome}
            </label>

            {(item.tipo === 'texto' || item.tipo === 'json') &&
              !(item.selectOptions && item.selectOptions.length > 0) && (
                <input
                  type="text"
                  id={`filtro_${item.chave}`}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder=""
                  onChange={(e) => paramsColuna(item.chave, e.target.value)}
                />
              )}

            {(item.tipo === 'booleano' || item.tipo === 'status' ||
              (item.selectOptions && item.selectOptions.length > 0)) && (
                <select
                  id={`filtro_${item.chave}`}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => paramsColuna(item.chave, e.target.value)}
                >
                  {!item.selectOptions?.some((option: any) => option.valor === "Todos") && (
                    <option value="">Selecionar</option>
                  )}
                  {item.selectOptions.map((option: { chave: any; valor: any }) => (
                    <option key={generateUniqueKey(option.chave, 'option')} value={option.chave}>
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

  const isColunaAcoes = (nomeColuna: string) => {
    return nomeColuna.toUpperCase() === "AÇÕES";
  };

  const getAlinhamentoColuna = () => {
    return "text-center";
  };

  const getAlinhamentoConteudo = () => {
    return "justify-center";
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        {/* Cabeçalho com filtros e botões */}
        <div className="mb-6 pt-2">
          {/* Filtros e Botão de Toggle (Mobile) */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            {/* Área de Filtros */}
            {estrutura.tabela.configuracoes?.pesquisar && (
              <div className="flex-1">
                {/* Botão de toggle para mobile e botões de ação */}
                <div className="md:hidden mb-4 flex justify-between items-center gap-2">
                  <button
                    className="px-4 py-2 bg-white text-extra-50 text-sm rounded-md border border-extra-50 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? '▲' : '▼'} Filtrar
                  </button>
                  
                  {/* Botões de Ação (Mobile) */}
                  <div className="flex items-center gap-2">
                    {estrutura.tabela.botoes &&
                      estrutura.tabela.botoes.map((botao: any) => (
                        <button
                          key={generateUniqueKey('botao-mobile', botao.chave)}
                          className="px-6 py-2 text-sm font-medium text-white bg-extra-150 hover:bg-extra-50 rounded-lg shadow-sm transition-colors duration-200"
                          disabled={botao.bloqueado}
                          hidden={botao.oculto}
                          onClick={() => chamarFuncao(botao.chave, botao)}
                        >
                          {botao.nome}
                        </button>
                      ))}
                  </div>
                </div>
                
                {/* Filtros - Sempre visíveis no desktop */}
                <div className={`${isDesktop ? 'block' : showFilters ? 'block' : 'hidden'}`}>
                  {renderFiltros()}
                </div>
              </div>
            )}

            {/* Botões de Ação - Alinhados com os filtros (Desktop apenas) */}
            <div className="hidden md:flex items-end gap-2 flex-shrink-0 pt-2">
              {estrutura.tabela.botoes &&
                estrutura.tabela.botoes.map((botao: any) => (
                  <button
                    key={generateUniqueKey('botao', botao.chave)}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-extra-150 hover:bg-extra-50 rounded-lg shadow-sm transition-colors duration-200"
                    disabled={botao.bloqueado}
                    hidden={botao.oculto}
                    onClick={() => chamarFuncao(botao.chave, botao)}
                  >
                    {botao.nome}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Tabela (Desktop) */}
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className="bg-gray-50"
              hidden={estrutura.tabela.configuracoes && !estrutura.tabela.configuracoes.cabecalho}
            >
              <tr>
                {estrutura.tabela.colunas.map((item: any) => (
                  <th
                    key={generateUniqueKey('cabecalho', item.chave)}
                    className={`px-6 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider ${getAlinhamentoColuna()} ${
                      isColunaAcoes(item.nome) ? 'w-32' : ''
                    }`}
                  >
                    <div className={`flex items-center gap-2 ${getAlinhamentoConteudo()}`}>
                      {item.nome}
                      {item.hint && (
                        <div className="relative group">
                          <svg
                            className="w-4 h-4 text-gray-500 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
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
                      <button
                        className="ml-1"
                        onClick={() =>
                          paramsColuna(
                            "sort",
                            bodyParams.sort != null &&
                              bodyParams.sort.split(",")[1] === "asc"
                              ? `${item.chave},desc`
                              : `${item.chave},asc`
                          )
                        }
                        hidden={!item.sort}
                      >
                        {bodyParams.sort != null &&
                          bodyParams.sort.split(",")[0] === item.chave &&
                          bodyParams.sort.split(",")[1] === "asc"
                          ? "▲"
                          : "▼"}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {linhas.length > 0 ? (
                linhas.map((item: any) => {
                  const rowKey = item.id || generateUniqueKey('row');
                  return (
                    <tr key={rowKey} className="hover:bg-gray-50 transition-colors duration-150">
                      {estrutura.tabela.colunas.map(({ chave, tipo, selectOptions, nome }: any) => {
                        const cellKey = generateUniqueKey(rowKey, chave);

                        if (chave === 'acoes') {
                          return (
                            <td
                              key={cellKey}
                              className="px-2 py-4 whitespace-nowrap text-center w-32"
                            >
                              <div className="flex items-center justify-center gap-1">
                                {estrutura.tabela.acoes_dropdown.map((acao: any) => (
                                  <button
                                    key={generateUniqueKey(cellKey, acao.chave)}
                                    className="inline-flex items-center justify-center p-1 text-gray-600 hover:text-blue-600 transition-colors duration-150"
                                    title={acao.nome}
                                    onClick={() => chamarFuncao(acao.chave, item)}
                                  >
                                    {acao.nome === 'Editar' && <Edit className="w-5 h-5" />}
                                    {acao.nome === 'Visualizar' && <Visibility className="w-5 h-5" />}
                                    {acao.nome === 'Deletar' && <Delete className="w-5 h-5 text-red-700" />}
                                    {acao.nome === 'Selecionar' && (
                                      <span className="px-2 py-1 text-xs bg-extra-150 text-white rounded hover:bg-extra-50">
                                        Selecionar
                                      </span>
                                    )}
                                    {acao.nome === 'Alocar' && (
                                      <span className="px-2 py-1 text-xs bg-extra-150 text-white rounded hover:bg-extra-50">
                                        Alocar Colaborador
                                      </span>
                                    )}
                                    {acao.nome === 'Remover' && (
                                      <span className="px-2 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50">
                                        Remover Colaborador
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </td>
                          );
                        } else if (item[chave] !== undefined && tipo === "status") {
                          const selectOption = selectOptions.find(
                            (option: any) => option.chave === item[chave]
                          );
                          if (selectOption) {
                            let element;
                            switch (selectOption.valor) {
                              case 'Finalizado':
                                element = (
                                  <td key={cellKey} className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-green-100 text-green-800">
                                      {selectOption.valor}
                                    </span>
                                  </td>
                                );
                                break;
                              case 'Erro':
                                element = (
                                  <td key={cellKey} className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-red-100 text-red-800">
                                      {selectOption.valor}
                                    </span>
                                  </td>
                                );
                                break;
                              default:
                                element = (
                                  <td key={cellKey} className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                      {selectOption.valor}
                                    </span>
                                  </td>
                                );
                            }
                            return element;
                          }
                        } else if (item[chave] !== undefined && (tipo === "booleano" || selectOptions)) {
                          const selectOption = selectOptions.find(
                            (option: any) => option.chave === item[chave]
                          );
                          if (selectOption) {
                            return (
                              <td key={cellKey} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center`}>
                                <span className={`${selectOption.chave === true || selectOption.chave === "APROVADA"
                                  ? "text-green-600"
                                  : selectOption.chave === "PENDENTE"
                                    ? "text-yellow-600"
                                    : "text-red-600"}`}>
                                  {selectOption.valor}
                                </span>
                              </td>
                            );
                          } else {
                            return null;
                          }
                        } else if (tipo === "json") {
                          const partes = chave.split('|');
                          let key = partes[0];
                          let jsonKey = partes[1];
                          let jsonItem = JSON.parse(item[key]);
                          if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
                            return (
                              <td key={cellKey} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center`}>
                                {verificaTexto(jsonItem[jsonKey])}
                              </td>
                            );
                          } else {
                            return <td key={cellKey} className={`px-6 py-4 whitespace-nowrap text-center`}></td>;
                          }
                        } else if (item[chave] !== undefined) {
                          if (typeof item[chave] !== 'object') {
                            return (
                              <td key={cellKey} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center`}>
                                {verificaTexto(item[chave])}
                              </td>
                            );
                          } else if (chave === 'beneficios') {
                            const beneficio = item.beneficios?.[0];
                            return (
                              <td key={generateUniqueKey(cellKey, 'beneficio')} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center`}>
                                {verificaTexto(beneficio?.tipoAuxilio?.tipo)}
                              </td>
                            );
                          } else {
                            return <td key={cellKey} className={`px-6 py-4 whitespace-nowrap text-center`}></td>;
                          }
                        } else if (item[chave] === undefined) {
                          const keys = chave.split('.');
                          let nestedValue = item;
                          for (let key of keys) {
                            if (nestedValue) {
                              nestedValue = nestedValue[key];
                              if (nestedValue === undefined) break;
                            }
                          }
                          if (typeof nestedValue !== 'object' && nestedValue !== undefined) {
                            return (
                              <td key={cellKey} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center`}>
                                {verificaTexto(nestedValue)}
                              </td>
                            );
                          } else {
                            return <td key={cellKey} className={`px-6 py-4 whitespace-nowrap text-center`}></td>;
                          }
                        }
                        return null;
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={estrutura.tabela.colunas.length} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">Nenhum registro encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Layout Stacked (Mobile) */}
        <div className="block md:hidden">
          {linhas.length > 0 ? (
            linhas.map((item: any) => {
              const rowKey = item.id || generateUniqueKey('row');
              return (
                <div
                  key={rowKey}
                  className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
                >
                  {estrutura.tabela.colunas.map((col: any) => {
                    const cellKey = generateUniqueKey(rowKey, col.chave);

                    if (col.chave === 'acoes') {
                      return (
                        <div key={generateUniqueKey(cellKey, 'actions')} className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 justify-center">
                          {estrutura.tabela.acoes_dropdown.map((acao: any) => (
                            <button
                              key={generateUniqueKey(cellKey, acao.chave)}
                              className="px-4 py-2 text-sm text-white bg-extra-150 hover:bg-extra-50 rounded-md"
                              onClick={() => chamarFuncao(acao.chave, item)}
                            >
                              {acao.nome}
                            </button>
                          ))}
                        </div>
                      );
                    } else {
                      let label = col.nome;
                      let value: any = '';
                      if (item[col.chave] !== undefined) {
                        if (typeof item[col.chave] !== 'object') {
                          value = verificaTexto(item[col.chave]);
                        }
                      } else {
                        const keys = col.chave.split('.');
                        let nestedValue = item;
                        for (let key of keys) {
                          if (nestedValue) {
                            nestedValue = nestedValue[key];
                          }
                        }
                        if (nestedValue !== undefined && typeof nestedValue !== 'object') {
                          value = verificaTexto(nestedValue);
                        }
                      }
                      if (col.tipo === "status" && col.selectOptions) {
                        const selectOption = col.selectOptions.find((option: any) => option.chave === item[col.chave]);
                        if (selectOption) {
                          value = (
                            <div className="flex justify-center">
                              <span
                                className={
                                  selectOption.valor === 'Finalizado'
                                    ? 'px-3 py-1 inline-flex text-xs font-medium rounded-full bg-green-100 text-green-800'
                                    : selectOption.valor === 'Erro'
                                      ? 'px-3 py-1 inline-flex text-xs font-medium rounded-full bg-red-100 text-red-800'
                                      : 'px-3 py-1 inline-flex text-xs font-medium rounded-full bg-gray-100 text-gray-800'
                                }
                              >
                                {selectOption.valor}
                              </span>
                            </div>
                          );
                        }
                      } else if (item[col.chave] !== undefined && (col.tipo === "booleano" || col.selectOptions)) {
                        const selectOption = col.selectOptions.find((option: any) => option.chave === item[col.chave]);
                        if (selectOption) {
                          value = (
                            <div className="flex justify-center">
                              {selectOption.valor}
                            </div>
                          );
                        }
                      } else if (col.tipo === "json") {
                        const partes = col.chave.split('|');
                        let key = partes[0];
                        let jsonKey = partes[1];
                        let jsonItem = JSON.parse(item[key]);
                        if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
                          value = verificaTexto(jsonItem[jsonKey]);
                        }
                      }
                      return (
                        <div key={cellKey} className="mb-3">
                          <span className="block text-xs font-medium text-gray-700 mb-1 text-center">
                            {label}
                          </span>
                          <div className="flex justify-center">
                            <span className="block text-sm text-gray-900 text-center">{value}</span>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">Nenhum registro encontrado.</p>
            </div>
          )}
        </div>
      </div>
      {estrutura.tabela.configuracoes.rodape && (
        <Pagination dados={dados} paramsColuna={paramsColuna} />
      )}
    </div>
  );
};

export default Tabela;