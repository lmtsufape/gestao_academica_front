"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import Interno from "@/components/Layout/Interno/Interno";
import Externo from "@/components/Layout/Externo/Externo";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";
import { RoleProvider } from "@/context/roleContext";

interface ClientWrapperProps {
  children: ReactNode;
  layoutConfig?: InternalLayoutConfig;
  activeRole?: string;
  userRoles?: string[];
}

export default function ClientWrapper({ children, layoutConfig, activeRole = "", userRoles = [] }: ClientWrapperProps) {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(
      pathname === "/login" ||
      pathname === "/conta/criar-conta" ||
      pathname === "/conta/recuperar-senha" ||
      pathname === "/relatorio-financeiro"
    );
  }, [pathname]);

  // Se for a página de login, exibe apenas o children.
  // Caso contrário, exibe o layout Interno com o RoleProvider.
  return isLogin ? (
    <Externo>{children}</Externo>
  ) : (
    <RoleProvider activeRole={activeRole} userRoles={userRoles}>
      <Interno layoutConfig={layoutConfig!}>{children}</Interno>
    </RoleProvider>
  );
}
