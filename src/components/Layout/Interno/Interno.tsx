"use client";

import React, { ReactNode, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

// Ícones do Material‑UI
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpen from "@mui/icons-material/MenuOpen";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import HelpOutline from "@mui/icons-material/HelpOutline";
import GpsFixed from "@mui/icons-material/GpsFixed";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Serviço de autenticação
import { useAuthService } from "@/app/authentication/auth.hook";
import SidebarMenuItem from "./MenuItem";

// Importa o RoleProvider do seu roleContext
import { RoleProvider } from "@/context/roleContext";

// Tipos de configuração
export interface HeaderConfig {
  logo: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  title: string;
  userActions?: Array<{
    label: string;
    route: string;
    icon: React.ReactNode;
  }>;
}

export interface MenuItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  roles?: string[];
  subItems?: MenuItem[];
}

export interface SidebarConfig {
  logo: {
    url: string;
    width?: number;
    height?: number;
    text?: string;
  };
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
  // Estados do menu lateral e submenus
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  // Estados de perfil e roles
  const [usuarioLogado, setUsuarioLogado] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string>("");

  // Dropdown de usuário
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    setIsLogin(
      pathname === "/home" ||
      pathname === "/conta/perfil"
    );
  }, [pathname]);
  // Configuração default (caso não seja passada)
  const defaultConfig: InternalLayoutConfig = {
    header: {
      logo: {
        url: "/assets/default-logo.png",
        width: 40,
        height: 40,
        alt: "Logo Padrão",
      },
      title: "Sistema de Gestão Universitaria",
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

  // Efeito de autenticação e definição das roles
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

    // ✅ só atualiza se houver diferenças
    if (JSON.stringify(newRoles) !== JSON.stringify(userRoles)) {
      setUserRoles(newRoles);
    }

    if (!activeRole || !newRoles.includes(activeRole)) {
      setActiveRole(newRoles[0] || "");
    }

    const newUser = session?.email || ""; // Get actual user email from session
    if (usuarioLogado !== newUser) {
      setUsuarioLogado(newUser);
    }
  } else {
    // ✅ só limpa se havia algo antes
    if (usuarioLogado || userRoles.length || activeRole) {
      setUsuarioLogado(null);
      setUserRoles([]);
      setActiveRole("");
    }
  }
}, [auth.isAuthenticated, auth.isLoading]); // 🚀 só depende de valores primitivos


  // Efeito para detectar clicks fora do dropdown
  useEffect(() => {
    function isPopup() {
      if (typeof window !== "undefined") {
        const hasOpener = !!window.opener;
        const isSmallWindow = window.innerWidth < 600 && window.innerHeight < 600;
        return hasOpener || isSmallWindow;
      }
      return false;
    }
    const isPopupWindow = isPopup();

    if (isPopupWindow) return;

    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers do menu lateral
  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
    setOpenSubMenus({});
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => {
      if (!prev) {
        setOpenSubMenus({});
      }
      return !prev;
    });
  };

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    router.push("/conta/sair");
  };

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

  return (
    <>
      {/* Cabeçalho */}
      <div
        className={`fixed top-0 z-10 bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] left-0 right-0 ${isLogin ? "sm:left: 0" : isMenuOpen ? "sm:left-60" : "sm:left-12"
          }`}
      >
        <div className="flex items-center justify-between p-3 pl-5 pr-5 shadow-lg">
          <div className="flex items-center">
            {/* Botão Hambúrguer (mobile) */}
            <div className="sm:hidden">
              <button onClick={handleToggleMenu} className="focus:outline-none">
                {isMenuOpen ? <MenuOpen /> : <MenuIcon />}
              </button>
            </div>
            {/* Logo (header) */}
            <div className="hidden sm:flex items-center">
              {isMenuOpen ? (
                <div className="flex items-center">
                  <span className="ml-2 text-body-small text-neutrals-900">
                    {config.header.title}
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="ml-2 text-body-small text-neutrals-900">
                    {config.header.title}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Seletor de Role (se houver mais de uma) */}
          {userRoles.length > 1 && (
            <select
              className="border rounded px-2 py-1 text-sm"
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
          {/* Menu de Ações */}
          <div className="flex items-center space-x-1">
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center w-full px-3 py-0 text-md font-normal text-black rounded-md hover:bg-gray-100 focus:outline-none"
                  style={{ color: "#1A4568" }}
                >
                  <AccountCircleOutlined fontSize="small" className="text-primary-500" />
                  <span className="ml-2">{usuarioLogado}</span>
                  {isOpen ? (
                    <ExpandLessIcon fontSize="small" className="ml-1" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" className="ml-1" />
                  )}
                </button>
                {isOpen && (
                  <div className="absolute right-0 w-56 mt-5 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg">
                    <div className="py-1">
                      <Link href="/conta/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Minha conta
                      </Link>
                      <Link
                        href="#"
                        onClick={handleAutenticacao}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sair
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU LATERAL */}
      {!isLogin && (
        <>

          <div
            className={`fixed top-0 left-0 h-screen bg-secondary-500 shadow-lg 
            transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
            z-20 ${isMenuOpen ? "w-60" : "w-12"} 
            ${!isMenuOpen ? "max-sm:hidden" : ""}
            will-change-transform`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transitionProperty: 'width, transform, opacity',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '300ms',
            }}
          >
            <div
              className={`border-b border-gray-500 overflow-hidden 
              transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              flex items-center justify-start pl-4 ${isMenuOpen ? "w-60" : "w-12"} h-12
              will-change-transform`}
            >
              <a href="/home" title="Sistema de Gestão Universitária" className="flex items-center">
                <GpsFixed fontSize="medium" className="text-white" />
              </a>
              {isMenuOpen && <span className="ml-3 text-white">{config.sidebar.logo.text}</span>}
            </div>
            <div className="flex flex-col h-[calc(100vh-3rem)]">
              <div className="pt-4 px-2 flex-1 overflow-y-auto">
                <ul className="space-y-4 text-gray-500">
                  {config.sidebar.menuItems.map((item, idx) => (
                    <SidebarMenuItem
                      key={idx}
                      item={item}
                      isMenuOpen={isMenuOpen}
                      openSubMenus={openSubMenus}
                      toggleSubMenu={toggleSubMenu}
                      activeRole={activeRole} // Passa a role ativa para filtrar os itens
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}


      {/* CONTEÚDO PRINCIPAL */}
      <div className="pt-12">
        {/* Agora, os children são envoltos pelo RoleProvider para repassar activeRole e userRoles */}
        <RoleProvider activeRole={activeRole} userRoles={userRoles}>
          {children}
        </RoleProvider>
      </div>
    </>
  );
}