import { useEffect, useState } from "react";

const Pagination = ({ dados = null, paramsColuna = null }: any) => {
  const [size, setSize] = useState("25");

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value;
    setSize(newSize);
    if (paramsColuna) {
      paramsColuna("size", newSize);
    }
  };

  useEffect(() => {
    if (dados?.size) {
      setSize(dados.size.toString());
    }
  }, [dados]);

  return (
    <div className="p-3 flex justify-end border border-white border-t-gray-100">
      <div className="flex justify-between w-full">
        <div>
          <h6 className="text-gray-400 mt-3 text-sm">Nº total de registros: {dados?.totalElements ?? 0}</h6>
        </div>
        <div className="flex">

          <select
            name="size"
            id="size"
            className="mr-2 bg-gray-50 rounded hover:text-blue-700"
            onChange={handleSizeChange}
            value={size}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
          </select>
          <button
            className="block px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 text-left rounded hover:shadow-sm mr-1 hover:text-blue-700"
            role="menuitem"
            onClick={() => paramsColuna && paramsColuna("page", dados?.number - 1)}
            disabled={dados?.first}
          >
            Voltar
          </button>
          <h6 className="text-sm text-gray-500 mt-2 ml-2 mr-2">
            Página {(dados?.number ?? 0) + 1} de {dados?.totalPages ?? 1}
          </h6>
          <button
            className="block px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 text-left rounded hover:shadow-sm ml-1 hover:text-blue-700"
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
