import { useState } from "react";
import { toast } from "react-toastify";
import { generica } from "@/utils/api";
import { Close } from "@mui/icons-material";
import { HistoricoStatusResponse } from "@/app/pdi/metas/types/types";

interface ModalHistoricoStatusProps {
  isOpen: boolean;
  onClose: () => void;
  metaId: string;
  onStatusAdded: (newStatus: HistoricoStatusResponse) => void;
  usuarioAtual?: {
    nome: string;
    email: string;
  };
}

interface updateOptions {
  minValue: number;
  maxValue: number;
}

const ModalHistoricoStatus = ({
  isOpen,
  onClose,
  metaId,
  onStatusAdded,
  usuarioAtual,
}: ModalHistoricoStatusProps) => {
  const [formData, setFormData] = useState({
    valor: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    option: updateOptions
  ) => {
    const { name, value } = e.target;

    if (option) {
      const numericValue = Number(value);
      if (
        (option.minValue !== undefined && numericValue < option.minValue) ||
        (option.maxValue !== undefined && numericValue > option.maxValue)
      ) {
        toast.error(
          `Por favor, insira um valor entre ${option.minValue} e ${option.maxValue}`,
          { position: "top-left"}
        );
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.valor || isNaN(Number(formData.valor))) {
      toast.error("Por favor, insira um valor numérico válido", {
        position: "top-left",
      });
      return;
    }

    try {
      const data = {
        valor: Number(formData.valor),
        dataAtualizacao: new Date().toISOString(),
        usuarioAtualizacao: usuarioAtual?.nome || "",
        meta: {
          id: Number(metaId),
        },
      };

      const body = {
        metodo: "post",
        uri: `/pdi/api/v1/meta/historicoStatus`,
        params: {},
        data: { ...data },
      };

      const response = await generica(body);

      if (
        response &&
        response.data &&
        !response.data.errors &&
        !response.data.error
      ) {
        toast.success("Valor adicionado com sucesso!", {
          position: "top-left",
        });

        setFormData({ valor: "" });
        onStatusAdded(response.data as HistoricoStatusResponse);
        onClose();
      } else {
        toast.error("Erro ao adicionar valor", { position: "top-left" });
      }
    } catch (error) {
      console.error("Erro ao adicionar valor:", error);
      toast.error("Erro ao adicionar valor. Tente novamente!", {
        position: "top-left",
      });
    }
  };

  const handleClose = () => {
    setFormData({ valor: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {" "}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Adicionar Valor
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          <div>
            <label
              htmlFor="valor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valor *
            </label>
            <select
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={(e) =>
                handleInputChange(e, { minValue: 0, maxValue: 5 })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecione um valor...</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary-500 bg-neutrals-100 text-left border border-primary-500 rounded hover:shadow-sm mr-1 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-colors duration-200"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalHistoricoStatus;
