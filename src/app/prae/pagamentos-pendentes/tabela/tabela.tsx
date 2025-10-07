"use client"
import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/Tabela/Itens/Paginacao';
import { Delete, Edit, Visibility } from '@mui/icons-material';

interface TabelaProps {
    dados?: any;
    estrutura?: any;
    chamarFuncao?: (nome: string, valor?: any) => void;
    itensSelecionados?: Set<string>;
    onSelecionarItens?: (itens: Set<string>) => void;
}

const Tabela = ({
    dados = null,
    estrutura = null,
    chamarFuncao = () => { },
    itensSelecionados = new Set(),
    onSelecionarItens = () => { }
}: TabelaProps) => {
    const [dropdownAberto, setDropdownAberto] = useState<any>({});
    const dropdownRef = useRef<any>(null);
    const [bodyParams, setBodyParams] = useState<any>({ size: 25 });
    const [showFilters, setShowFilters] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
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
        const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof texto === 'string' && dataRegex.test(texto)) {
            const [ano, mes, dia] = texto.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
        if (texto != null && iso8601Regex.test(texto)) {
            let dataString = texto;
            let data = dataString.split("T")[0];
            let hora = dataString.split("T")[1].split(".")[0];
            let dia = data.split('-')[2];
            let mes = data.split('-')[1];
            let ano = data.split('-')[0];
            return `${dia}/${mes}/${ano} ${hora}`;
        }
        return texto;
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
            <div className="flex flex-wrap gap-4 w-full">
                {filters?.map((item: any, index: any) => (
                    <div
                        key={`filtro_${index}`}
                        className="w-full sm:w-auto flex-1 min-w-[200px] flex flex-col"
                    >
                        <label
                            htmlFor={`filtro_${index}`}
                            className="mb-1 text-sm font-bold text-neutrals-900"
                        >
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

    return (
        <div>
            <div className="flex flex-col">
                {/* Linha de botões */}
                <div className="flex justify-between items-center overflow-x-auto mt-2.5">
                    {/* Botão Filtrar */}
                    <div className="flex items-center">
                        {estrutura.tabela.configuracoes?.pesquisar && (
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
                    {/* Outros botões */}
                    <div className="flex items-center">
                        {estrutura.tabela.botoes &&
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

                {/* Tabela Desktop */}
                <div className="overflow-x-auto rounded-md border-2 border-neutrals-200 hidden md:block">
                    <div className="min-w-full inline-block align-middle">
                        <div className="rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-neutrals-200">
                                <thead
                                    className="bg-neutrals-50"
                                    hidden={estrutura.tabela.configuracoes && !estrutura.tabela.configuracoes.cabecalho}
                                >
                                    <tr>
                                        {estrutura.tabela.colunas.map((item: any, index: any) => (
                                            <td
                                                key={"menu_" + index}
                                                className="px-6 py-3 whitespace-nowrap text-sm font-bold uppercase text-neutrals-900 text-center"
                                                title={item.hint || ""}
                                            >
                                                <div className="flex items-center justify-center gap-2">
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
                                                    <button
                                                        className="ml-2"
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
                                            </td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutrals-200">
                                    {dados?.content && dados.content.length > 0 ? (
                                        dados.content.map((item: any) => (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-gray-50 ${itensSelecionados.has(item.id)
                                                        ? '!bg-blue-100 border-l-4 border-blue-500'
                                                        : 'bg-white'
                                                    }`}
                                            >
                                                {estrutura.tabela.colunas.map(({ chave, tipo, selectOptions }: any) => {
                                                    if (chave === 'acoes') {
                                                        return (
                                                            <td key={`${item.id}_${chave}`} className="px-4 py-2 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                    checked={itensSelecionados.has(item.id)}
                                                                    onChange={(e) => {
                                                                        const novosSelecionados = new Set(itensSelecionados);
                                                                        if (e.target.checked) {
                                                                            novosSelecionados.add(item.id);
                                                                        } else {
                                                                            novosSelecionados.delete(item.id);
                                                                        }
                                                                        onSelecionarItens(novosSelecionados);
                                                                    }}
                                                                />
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
                                                                        <td
                                                                            key={`${item.id}_${chave}`}
                                                                            className="px-6 py-2 whitespace-nowrap flex items-center font-normal"
                                                                        >
                                                                            <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-green-100 text-green-800">
                                                                                {selectOption.valor}
                                                                            </span>
                                                                        </td>
                                                                    );
                                                                    break;
                                                                case 'Erro':
                                                                    element = (
                                                                        <td
                                                                            key={`${item.id}_${chave}`}
                                                                            className="px-6 py-2 whitespace-nowrap flex items-center font-normal"
                                                                        >
                                                                            <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-red-100 text-red-800">
                                                                                {selectOption.valor}
                                                                            </span>
                                                                        </td>
                                                                    );
                                                                    break;
                                                                default:
                                                                    element = (
                                                                        <td
                                                                            key={`${item.id}_${chave}`}
                                                                            className="px-6 py-2 whitespace-nowrap flex items-center font-normal"
                                                                        >
                                                                            <span className="px-3 inline-flex text-sm leading-6 font-normal rounded-full bg-neutrals-100 text-neutrals-800">
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
                                                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                    <div className={`py-2 text-center rounded-md text-label-medium font-normal ${selectOption.chave === true || selectOption.chave === "APROVADA"
                                                                            ? "bg-success-100 text-success-900"
                                                                            : selectOption.chave === "PENDENTE"
                                                                                ? "bg-warning-100 text-warning-900"
                                                                                : "bg-danger-100 text-danger-900"
                                                                        }`}>
                                                                        {selectOption.valor}
                                                                    </div>
                                                                </td>
                                                            );
                                                        }
                                                    } else if (tipo === "json") {
                                                        const partes = chave.split('|');
                                                        let key = partes[0];
                                                        let jsonKey = partes[1];
                                                        try {
                                                            let jsonItem = JSON.parse(item[key]);
                                                            if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
                                                                return (
                                                                    <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                        {verificaTexto(jsonItem[jsonKey])}
                                                                    </td>
                                                                );
                                                            }
                                                        } catch (e) {
                                                            console.error("Erro ao parsear JSON", e);
                                                        }
                                                    } else if (tipo === "quantidade" && Array.isArray(item[chave])) {
                                                        return (
                                                            <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                {item[chave].length}
                                                            </td>
                                                        );
                                                    } else if (item[chave] !== undefined) {
                                                        if (typeof item[chave] !== 'object') {
                                                            return (
                                                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                    {verificaTexto(item[chave])}
                                                                </td>
                                                            );
                                                        } else if (Array.isArray(item[chave])) {
                                                            return (
                                                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                    {item[chave].length > 0 ? (
                                                                        <ul className="list-disc pl-4">
                                                                            {item[chave].map((element: any, idx: number) => (
                                                                                <li key={element.id || idx}>
                                                                                    {element.horaInicio && element.horaFim
                                                                                        ? `${element.horaInicio} - ${element.horaFim}`
                                                                                        : JSON.stringify(element)}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <span>-</span>
                                                                    )}
                                                                </td>
                                                            );
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
                                                        if (tipo === "quantidade" && Array.isArray(nestedValue)) {
                                                            return (
                                                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                    {nestedValue.length}
                                                                </td>
                                                            );
                                                        }
                                                        if (typeof nestedValue !== 'object' && nestedValue !== undefined) {
                                                            return (
                                                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                    {verificaTexto(nestedValue)}
                                                                </td>
                                                            );
                                                        } else if (Array.isArray(nestedValue)) {
                                                            return (
                                                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle">
                                                                    {nestedValue.length > 0 ? (
                                                                        <ul className="list-disc pl-4">
                                                                            {nestedValue.map((element: any, idx: number) => (
                                                                                <li key={element.id || idx}>
                                                                                    {element.horaInicio && element.horaFim
                                                                                        ? `${element.horaInicio} - ${element.horaFim}`
                                                                                        : JSON.stringify(element)}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <span>-</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        }
                                                    }
                                                    return (
                                                        <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal text-center align-middle"></td>
                                                    );
                                                })}
                                            </tr>
                                        ))
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

                {/* Layout Stacked (Mobile) */}
                <div className="block md:hidden">
                    {dados?.content && dados.content.length > 0 ? (
                        dados.content.map((item: any) => (
                            <div
                                key={item.id}
                                className={`bg-white border border-neutrals-200 rounded-md p-4 mb-4 shadow ${itensSelecionados.has(item.id) ? 'ring-2 ring-blue-500' : ''
                                    }`}
                            >
                                {estrutura.tabela.colunas.map((col: any, index: number) => {
                                    if (col.chave === 'acoes') {
                                        return (
                                            <div key={`${item.id}_${col.chave}`} className="mt-2 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={itensSelecionados.has(item.id)}
                                                    onChange={(e) => {
                                                        const novosSelecionados = new Set(itensSelecionados);
                                                        if (e.target.checked) {
                                                            novosSelecionados.add(item.id);
                                                        } else {
                                                            novosSelecionados.delete(item.id);
                                                        }
                                                        onSelecionarItens(novosSelecionados);
                                                    }}
                                                />
                                                <span className="ml-2 text-sm">Selecionar para pagamento</span>
                                            </div>
                                        );
                                    } else {
                                        let label = col.nome;
                                        let value: any = '';
                                        if (col.tipo === "quantidade" && Array.isArray(item[col.chave])) {
                                            value = item[col.chave].length;
                                        } else if (item[col.chave] !== undefined) {
                                            if (typeof item[col.chave] !== 'object') {
                                                value = verificaTexto(item[col.chave]);
                                            } else if (Array.isArray(item[col.chave])) {
                                                value = (
                                                    <ul className="list-disc pl-4">
                                                        {item[col.chave].map((element: any, idx: number) => (
                                                            <li key={element.id || idx}>
                                                                {element.horaInicio && element.horaFim
                                                                    ? `${element.horaInicio} - ${element.horaFim}`
                                                                    : JSON.stringify(element)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                );
                                            }
                                        } else {
                                            const keys = col.chave.split('.');
                                            let nestedValue = item;
                                            for (let key of keys) {
                                                if (nestedValue) {
                                                    nestedValue = nestedValue[key];
                                                }
                                            }
                                            if (col.tipo === "quantidade" && Array.isArray(nestedValue)) {
                                                value = nestedValue.length;
                                            } else if (nestedValue !== undefined && typeof nestedValue !== 'object') {
                                                value = verificaTexto(nestedValue);
                                            } else if (Array.isArray(nestedValue)) {
                                                value = (
                                                    <ul className="list-disc pl-4">
                                                        {nestedValue.map((element: any, idx: number) => (
                                                            <li key={element.id || idx}>
                                                                {element.horaInicio && element.horaFim
                                                                    ? `${element.horaInicio} - ${element.horaFim}`
                                                                    : JSON.stringify(element)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                );
                                            }
                                        }
                                        if (col.tipo === "status" && col.selectOptions) {
                                            const selectOption = col.selectOptions.find(
                                                (option: any) => option.chave === item[col.chave]
                                            );
                                            if (selectOption) {
                                                value = (
                                                    <span
                                                        className={
                                                            selectOption.valor === 'Finalizado'
                                                                ? 'px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-green-100 text-green-800'
                                                                : selectOption.valor === 'Erro'
                                                                    ? 'px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-red-100 text-red-800'
                                                                    : 'px-3 inline-flex text-sm leading-6 font-normal rounded-full bg-neutrals-100 text-neutrals-800'
                                                        }
                                                    >
                                                        {selectOption.valor}
                                                    </span>
                                                );
                                            }
                                        } else if (item[col.chave] !== undefined && (col.tipo === "booleano" || col.selectOptions)) {
                                            const selectOption = col.selectOptions.find(
                                                (option: any) => option.chave === item[col.chave]
                                            );
                                            if (selectOption) {
                                                value = selectOption.valor;
                                            }
                                        } else if (col.tipo === "json") {
                                            const partes = col.chave.split('|');
                                            let key = partes[0];
                                            let jsonKey = partes[1];
                                            try {
                                                let jsonItem = JSON.parse(item[key]);
                                                if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
                                                    value = verificaTexto(jsonItem[jsonKey]);
                                                }
                                            } catch (e) {
                                                console.error("Erro ao parsear JSON", e);
                                            }
                                        }
                                        return (
                                            <div key={`${item.id}_${col.chave}_${index}`} className="mb-2">
                                                <span className="block text-sm font-bold text-neutrals-900">
                                                    {label}:
                                                </span>
                                                <span className="block text-sm text-neutrals-700 font-normal">{value}</span>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 font-normal">
                            <h6 className="text-neutrals-600">Nenhum registro encontrado.</h6>
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