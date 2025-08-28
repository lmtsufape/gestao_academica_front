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
import CloseIcon from "@mui/icons-material/Close";

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
  const sidebarRef = useRef<any>(null);

  useEffect(() => {
    setIsLogin(
      pathname === "/home" ||
      pathname === "/conta/perfil" ||
      pathname === "/perfil"
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
}, [auth.isAuthenticated, auth.isLoading]);


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
      // Fechar dropdown do usuário
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      
      // Fechar menu lateral no mobile quando clicar fora
      if (window.innerWidth < 640 && 
          isMenuOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          !event.target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Handlers do menu lateral
  const handleMouseEnter = () => {
    if (window.innerWidth >= 640) {
      setIsMenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 640) {
      setIsMenuOpen(false);
      setOpenSubMenus({});
    }
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

  // Função para fechar o menu lateral completamente
  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenSubMenus({});
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

  // Verifica se é a página home para ocultar os controles do menu lateral no mobile
  const isHomePage = pathname === "/home";
  // Verifica se deve mostrar controles do menu (não mostrar na home nem nas páginas de perfil)
  const shouldShowMenuControls = !isLogin && !isHomePage && pathname !== "/perfil" && pathname !== "/conta/perfil";

  return (
    <>
      {/* Cabeçalho */}
      <div
        className={`fixed top-0 z-30 bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] left-0 right-0 ${isLogin ? "sm:left: 0" : isMenuOpen ? "sm:left-60" : "sm:left-12"
          }`}
      >
        <div className="flex items-center justify-between p-3 pl-5 pr-5 shadow-lg">
          <div className="flex items-center">
            {/* Botão Hambúrguer (mobile) - Oculto na página home e perfil */}
            {shouldShowMenuControls && (
              <div className="sm:hidden mr-3">
                <button 
                  onClick={handleToggleMenu} 
                  className="mobile-menu-button focus:outline-none p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                >
                  {isMenuOpen ? (
                    <CloseIcon className="text-primary-600" />
                  ) : (
                    <MenuIcon className="text-primary-600" />
                  )}
                </button>
              </div>
            )}
            
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

      {/* MENU LATERAL - Oculto na página home e perfil no mobile */}
      {shouldShowMenuControls && (
        <>
          {/* Overlay para mobile quando menu está aberto */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
              onClick={closeMenu}
            />
          )}
          
          <div
            ref={sidebarRef}
            className={`fixed top-0 left-0 h-full bg-secondary-500 shadow-lg 
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
            z-30 ${isMenuOpen ? "w-60 translate-x-0" : "-translate-x-full"} 
            sm:translate-x-0 sm:w-12
            sm:hover:w-60
            will-change-transform`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transitionProperty: 'transform, width',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '300ms',
            }}
          >
            {/* Cabeçalho do menu lateral com botão de fechar para mobile */}
            <div
              className={`border-b border-gray-500 overflow-hidden 
              transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              flex items-center justify-between pl-4 pr-2 ${isMenuOpen ? "w-60" : "w-12"} h-12
              will-change-transform`}
            >
              <a href="/home" title="Sistema de Gestão Universitária" className="flex items-center">
                <GpsFixed fontSize="medium" className="text-white" />
                {isMenuOpen && <span className="ml-3 text-white">{config.sidebar.logo.text}</span>}
              </a>
              
              {/* Botão de fechar no menu lateral (visível apenas no mobile) */}
              {isMenuOpen && (
                <button 
                  onClick={closeMenu}
                  className="sm:hidden text-white p-1 rounded-full hover:bg-secondary-600 transition-colors"
                  aria-label="Fechar menu"
                >
                  <CloseIcon fontSize="medium" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col h-full">
              <div className="pt-4 px-2 flex-1 overflow-y-auto">
                <ul className="space-y-4 text-gray-500">
                  {config.sidebar.menuItems.map((item, idx) => (
                    <SidebarMenuItem
                      key={idx}
                      item={item}
                      isMenuOpen={isMenuOpen}
                      openSubMenus={openSubMenus}
                      toggleSubMenu={toggleSubMenu}
                      activeRole={activeRole}
                      closeMenu={closeMenu} // Passa a função para fechar o menu
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className={`pt-12 min-h-screen ${shouldShowMenuControls ? (isMenuOpen ? "sm:pl-60" : "sm:pl-12") : ""}`}>
        <RoleProvider activeRole={activeRole} userRoles={userRoles}>
          {children}
        </RoleProvider>
      </div>
    </>
  );
}