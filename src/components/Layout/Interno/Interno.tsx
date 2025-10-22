"use client";

import React, { ReactNode, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

// Ícones do Material-UI
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Serviço de autenticação
import { useAuthService } from "@/app/authentication/auth.hook";
import SidebarMenuItem from "./MenuItem";

// Contexto de roles
import { RoleProvider } from "@/context/roleContext";

// Tipos
export interface HeaderConfig {
  logo: { url: string; width?: number; height?: number; alt?: string };
  title: string;
  userActions?: Array<{ label: string; route: string; icon: React.ReactNode }>;
}

export interface MenuItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  roles?: string[];
  subItems?: MenuItem[];
}

export interface SidebarConfig {
  logo: { url: string; width?: number; height?: number; text?: string };
  menuItems: MenuItem[];
}

export interface InternalLayoutConfig {
  header: HeaderConfig;
  sidebar: SidebarConfig;
}

interface LayoutProps {
  children: ReactNode;
  layoutConfig?: InternalLayoutConfig;
}

export default function Layout({ children, layoutConfig }: LayoutProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [usuarioLogado, setUsuarioLogado] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<any>(null);
  const sidebarRef = useRef<any>(null);

  useEffect(() => {
    setIsLogin(
      pathname === "/home" ||
        pathname === "/conta/perfil" ||
        pathname === "/perfil"
    );
  }, [pathname]);

  const defaultConfig: InternalLayoutConfig = {
    header: {
      logo: {
        url: "/assets/SGU.png",
        width: 50,
        height: 50,
        alt: "Logo Padrão",
      },
      title: "Sistema de Gestão Universitária",
      userActions: [],
    },
    sidebar: {
      logo: {
        url: "/assets/default-sidebar-logo.png",
        width: 32,
        height: 32,
        text: "SGU",
      },
      menuItems: [
        {
          label: "Início",
          route: "/home",
          icon: <HomeOutlined fontSize="medium" />,
        },
      ],
    },
  };

  const config = layoutConfig || defaultConfig;
  const auth = useAuthService();
  const { session } = useAuth();

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.isAuthenticated) {
      const newRoles: string[] = [];
      if (auth.isAdmin()) newRoles.push("administrador");
      if (auth.isGestor()) newRoles.push("gestor");
      if (auth.isTecnico()) newRoles.push("tecnico");
      if (auth.isProfessor()) newRoles.push("professor");
      if (auth.isAluno()) newRoles.push("aluno");
      if (auth.isVisitante()) newRoles.push("visitante");

      setUserRoles(newRoles);
      if (!activeRole || !newRoles.includes(activeRole))
        setActiveRole(newRoles[0] || "");

      setUsuarioLogado(session?.email || "");
    } else {
      setUsuarioLogado(null);
      setUserRoles([]);
      setActiveRole("");
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }

      if (
        window.innerWidth < 640 &&
        isMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 640) setIsMenuOpen(true);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 640) {
      setIsMenuOpen(false);
      setOpenSubMenus({});
    }
  };
  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => {
      if (!prev) setOpenSubMenus({});
      return !prev;
    });
  };
  const toggleSubMenu = (key: string) =>
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenSubMenus({});
  };

  const handleLogout = () => router.push("/conta/sair");
  const handleLogin = () => {
    if (location.pathname !== "/login") router.push("/login");
  };
  const handleAutenticacao = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isAuthenticated) {
      handleLogout();
      setIsOpen(false);
    } else {
      handleLogin();
    }
  };

  const shouldShowMenuControls =
    !isLogin && pathname !== "/perfil" && pathname !== "/conta/perfil";

  return (
    <>
      {/* ======== HEADER ======== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md h-14">
        <div className="flex items-center justify-between px-2 h-full">
          <div className="flex items-center space-x-3">
            {/* Botão mobile */}
            {shouldShowMenuControls && (
              <button
                onClick={handleToggleMenu}
                className="sm:hidden mobile-menu-button p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <CloseIcon className="text-primary-600" />
                ) : (
                  <MenuIcon className="text-primary-600" />
                )}
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center">
              <img
                src={config.header.logo.url}
                alt={config.header.logo.alt || "Logo"}
                className="h-10 w-auto object-contain"
                style={{ maxHeight: "15px" }}
              />
            </div>

            {/* Título - escondido no mobile */}
            <span className="hidden sm:block text-body-small text-neutrals-900 font-medium">
              {config.header.title}
            </span>
          </div>

          {/* Seletor de roles */}
          {userRoles.length > 1 && (
            <select
              className="border rounded px-2 py-1 text-sm max-w-[100px] sm:max-w-[140px]"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
            >
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          )}

          {/* Usuário */}
          {isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center p-2 rounded-md hover:bg-gray-100"
              >
                <AccountCircleOutlined fontSize="medium" />
                {/* Esconde o email no mobile */}
                <span className="hidden sm:inline ml-2 text-sm">
                  {usuarioLogado}
                </span>
                {isOpen ? (
                  <ExpandLessIcon fontSize="small" className="ml-1" />
                ) : (
                  <ExpandMoreIcon fontSize="small" className="ml-1" />
                )}
              </button>

              {isOpen && (
                <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link
                    href="/conta/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Minha conta
                  </Link>
                  <button
                    onClick={handleAutenticacao}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ======== SIDEBAR ======== */}
      {shouldShowMenuControls && (
        <>
          {/* Overlay no mobile */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-20 sm:hidden"
              onClick={closeMenu}
            />
          )}

          <aside
            ref={sidebarRef}
            className={`fixed top-14 left-0 h-[calc(100%-3.5rem)] bg-extra-50 shadow-lg transition-all duration-300 z-30
        ${
          isMenuOpen
            ? "w-60"
            : "w-0 overflow-hidden sm:w-12 sm:hover:w-60 sm:overflow-visible"
        }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-col h-full">
              <div className="pt-4 px-2 flex-1 overflow-y-auto">
                <ul className="space-y-4 text-white">
                  {config.sidebar.menuItems.map((item, idx) => (
                    <SidebarMenuItem
                      key={idx}
                      item={item}
                      isMenuOpen={isMenuOpen}
                      openSubMenus={openSubMenus}
                      toggleSubMenu={toggleSubMenu}
                      activeRole={activeRole}
                      closeMenu={closeMenu}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ======== CONTEÚDO PRINCIPAL ======== */}
      <main
        className={`pt-12 min-h-screen transition-all duration-300 ${
          shouldShowMenuControls ? (isMenuOpen ? "sm:pl-60" : "sm:pl-4") : ""
        }`}
      >
        <RoleProvider activeRole={activeRole} userRoles={userRoles}>
          {children}
        </RoleProvider>
      </main>
    </>
  );
}
