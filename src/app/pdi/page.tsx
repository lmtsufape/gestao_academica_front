"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PdiHome() {
  const router = useRouter();

  useEffect(() => {
    // Se já houver efrotas_authenticated_user no localStorage, redireciona para dashboard
    
  }, [router]);

  return (
    <>
    </>
  ); 
}