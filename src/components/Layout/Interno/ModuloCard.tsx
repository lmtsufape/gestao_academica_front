import { ChevronRight } from "@mui/icons-material";

interface ModuloCardProps {
  modulo: {
    id: string;
    titulo: string;
    descricao: string;
    icone: React.ReactNode;
    rota?: string;
    acao?: string;
    cor: string;
    corHover?: string;
    disponivel: boolean;
  };
  onClick: () => void;
}

const ModuloCard = ({ modulo, onClick }: ModuloCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-md shadow-md border border-gray-200 p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg
        ${
          modulo.disponivel
            ? "cursor-pointer hover:border-primary-500"
            : "cursor-not-allowed opacity-60"
        }
      `}
    >
      {/* badge de indisponível  */}
      {!modulo.disponivel && (
        <div className="absolute top-3 right-3">
          <span
            className={`text-white inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-400`}
          >
            Indisponível
          </span>
        </div>
      )}

      {/* ícone do módulo */}
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-lg text-white mb-4
                  ${modulo.cor}`}
      >
        {modulo.icone}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {modulo.titulo}
      </h3>
      <p className="text-gray-600 mb-4">{modulo.descricao}</p>

      {/* Botão/Link para acessar módulo */}
      <div
        className={`
          inline-flex items-center text-sm font-medium
          ${
            modulo.disponivel
              ? "text-primary-600 hover:text-primary-800"
              : "text-gray-400"
          }
        `}
      >
        {modulo.disponivel && (
          <>
            <h6>Acessar módulo</h6>
            <ChevronRight className="ml-1 w-4 h-4" />
          </>
        )}
      </div>
    </div>
  );
};

export default ModuloCard;
