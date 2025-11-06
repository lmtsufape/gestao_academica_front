const Pagination = ({ dados = null, paramsColuna = null }: any) => {
  const totalElements = dados?.totalElements ?? 0;
  const totalPages = dados?.totalPages ?? 1;
  const currentPage = (dados?.number ?? 0) + 1;
  const isFirst = dados?.first || currentPage === 1;
  const isLast = dados?.last || currentPage >= totalPages;
  const isSinglePage = totalPages <= 1 || totalElements <= 1;

  return (
    <div className="p-3 border-t border-neutrals-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full text-center sm:text-left">
        {/* Total de registros */}
        <h6 className="text-neutrals-700 text-sm">
          Nº total de registros: {totalElements}
        </h6>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3">
          {/* Select de tamanho */}
          <select
            className="py-1.5 text-sm border-2 border-extra-50 text-extra-50 rounded-full bg-transparent hover:bg-extra-50 hover:text-white transition-colors duration-200 cursor-pointer w-12 text-center"
            onChange={(e) =>
              paramsColuna && paramsColuna("size", e.target.value)
            }
            defaultValue="10"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>

          {/* Linha de botões e info */}
          <div className="flex items-center justify-center gap-2">
            {/* Voltar */}
            <button
              className={`px-4 py-1.5 text-sm font-medium border-2 border-extra-50 text-extra-50 rounded-full bg-transparent hover:bg-extra-50 hover:text-white transition-colors duration-200 ${
                isFirst || isSinglePage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                !isFirst && !isSinglePage && paramsColuna("page", dados?.number - 1)
              }
              disabled={isFirst || isSinglePage}
            >
              Voltar
            </button>

            {/* Info página */}
            <h6 className="text-sm text-extra-50 font-medium whitespace-nowrap">
              Página {currentPage} de {totalPages || 1}
            </h6>

            {/* Próximo */}
            <button
              className={`px-4 py-1.5 text-sm font-medium border-2 border-extra-50 text-extra-50 rounded-full bg-transparent hover:bg-extra-50 hover:text-white transition-colors duration-200 ${
                isLast || isSinglePage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                !isLast && !isSinglePage && paramsColuna("page", dados?.number + 1)
              }
              disabled={isLast || isSinglePage}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
