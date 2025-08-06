const Pagination = ({ dados = null, paramsColuna = null }: any) => {
    return (
      <div className="p-3 flex justify-end  border-t-neutrals-100">
        <div className="flex justify-between w-full">
          <div>
            <h6 className="text-neutrals-700 mt-3 text-sm">
              Nº total de registros: {dados?.totalElements ?? 0}
            </h6>
          </div>
          <div className="flex">
            <select
              name=""
              id=""
              className="mr-2 bg-neutrals-100 text-primary-500 border border-primary-500  rounded hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-colors duration-200"
              onChange={(e) => paramsColuna && paramsColuna("size", e.target.value)}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="30">30</option>
            </select>
            <button
              className="block px-4 py-2 text-sm text-primary-500 bg-neutrals-100 text-left border border-primary-500 rounded hover:shadow-sm mr-1 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-colors duration-200"
              role="menuitem"
              onClick={() => paramsColuna && paramsColuna("page", dados?.number - 1)}
              disabled={dados?.first}
            >
              Voltar
            </button>
            <h6 className="text-sm text-neutrals-700 mt-2 ml-2 mr-2">
              {" "}
              Página {(dados?.number ?? 0) + 1} de{" "}
              {dados?.totalPages
                ? dados.totalPages === 0
                  ? 1
                  : dados.totalPages
                : 1}
            </h6>
            <button
              className="block px-4 py-2 text-sm text-primary-500 bg-neutrals-100 text-left border border-primary-500 rounded hover:shadow-sm mr-1 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-colors duration-200"
              role="menuitem"
              onClick={() => paramsColuna && paramsColuna("page", dados?.number + 1)}
              disabled={dados?.last}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default Pagination;  