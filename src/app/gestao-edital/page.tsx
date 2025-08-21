"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PageEFrotas() {
  const router = useRouter();

  useEffect(() => {

    const authDataStr = localStorage.getItem("efrotas_authenticated_user");
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (authData.usuarioRole) {
          return;
        }
      } catch (error) {
        console.error("Erro ao parsear authData:", error);
      }
    }
  }, [router]);

  return (
    <>
    </>
  );
}