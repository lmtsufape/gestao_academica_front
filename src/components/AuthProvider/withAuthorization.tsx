"use client";

import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";

const withAuthorization = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthorizationComponent = (props: P) => {
    const router = useRouter();
    const currentPath = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    
    // Use the new auth context
    const { isAuthenticated, session, isLoading } = useAuth();

    // Helper functions for role checking
    const isAdmin = () => session?.roles?.includes("administrador") ?? false;
    const isGestor = () => session?.roles?.includes("gestor") ?? false;
    const isTecnico = () => session?.roles?.includes("tecnico") ?? false;
    const isAluno = () => session?.roles?.includes("aluno") ?? false;
    const getUserRoles = () => session?.roles ?? [];

    useEffect(() => {
      // Wait for auth state to load
      if (isLoading) return;

      const restrictedURIsForGestor = [
        "/perfil",
        "/questionario",
        "/pesquisa",
        "/participantes",
        "/questao",
        "/escala",
      ];
      const restrictedURIsForTecnico = [
        "/perfil",
        "/questionario",
        "/pesquisa",
        "/participantes",
        "/questao",
        "/escala",
      ];
      const restrictedURIsForUsuario = [
        "/escala",
      ];

      const restrictedURIsForVisitante = ["/conta/token"];

      // Use the helper functions
      const usuarioRole = getUserRoles();
      const adminRole = isAdmin();
      const gestorRole = isGestor();
      const tecnicoRole = isTecnico();
      const alunoRole = isAluno();
      const isUriAllowed = (): boolean => {
        if (isAuthenticated && adminRole) return true;
        if (!isAuthenticated && restrictedURIsForVisitante.includes(currentPath)) return false;
        if (gestorRole && restrictedURIsForGestor.includes(currentPath)) return false;
        if (tecnicoRole && restrictedURIsForTecnico.includes(currentPath)) return false;
        if (alunoRole && restrictedURIsForUsuario.includes(currentPath)) return false;
        return true;
      };

      if (!checked) {
        const allowed = isUriAllowed();
        setIsAuthorized(allowed);

        if (!isAuthenticated && !allowed) {
          router.push("/login");
        } else if (isAuthenticated && !allowed) {
          router.push("/");
        }

        setChecked(true);
      }
    }, [router, checked, currentPath, isAuthenticated, isLoading]); // Added dependencies

    return checked && isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  WithAuthorizationComponent.displayName = `WithAuthorization(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthorizationComponent;
};

export default withAuthorization;
