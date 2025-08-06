"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthService } from "../authentication/auth.hook";
import { generica } from "@/utils/api";
import { toast } from "react-toastify";
import SuccessModal from "@/components/Cadastro/modalSucesso";
import Swal from "sweetalert2";

export default function PageEFrotas() {
  const router = useRouter();
  const auth = useAuthService();
  const [isAluno, setisAluno] = useState<boolean>(false);

  useEffect(() => {
    // Update isAluno when auth state changes
    if (!auth.isLoading) {
      setisAluno(auth.isAluno());
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  useEffect(() => {
    if (isAluno) {
      buscarEstudanteAtual();
      console.log();
    }
  }, [isAluno]);

  const buscarEstudanteAtual = async () => {
    try {
      const body = {
        metodo: "get",
        uri: "/prae/estudantes/current",
        params: {},
      };
      const response = await generica(body);
      if (!response) throw new Error("Resposta inválida do servidor.");
      if (response.status === 404) {
        criarEstudante();
        return;
      }
    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      alert("Erro ao localizar registro. Tente novamente!");
      toast.error("Erro ao localizar registro. Tente novamente!", {
        position: "top-left",
      });
    }
  };

  const criarEstudante = async () => {
    Swal.fire({
      title: "Para usar o módulo da Prae conclua seu cadastro!",
      icon: "warning",
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-html",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/prae/estudantes/criar");
      }
    });
  };

  useEffect(() => {
    // Se já houver efrotas_authenticated_user no localStorage, redireciona para dashboard
    const authDataStr = localStorage.getItem("efrotas_authenticated_user");
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (authData.usuarioRole) {
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Erro ao parsear authData:", error);
      }
    }
  }, [router]);

  return <></>; // ou um spinner de "Verificando..."
}
