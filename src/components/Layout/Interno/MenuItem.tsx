"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface MenuItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  roles?: string[];
  subItems?: MenuItem[];
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isMenuOpen: boolean;
  openSubMenus: Record<string, boolean>;
  toggleSubMenu: (key: string) => void;
  activeRole: string; // Role ativa selecionada no header
  closeMenu: () => void; // Função para fechar o menu em mobile
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isMenuOpen,
  openSubMenus,
  toggleSubMenu,
  activeRole,
  closeMenu
}) => {
  const router = useRouter();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isOpen = openSubMenus[item.label] || false;

  // Normaliza a activeRole e as roles definidas no item
  const normalizedActiveRole = activeRole.trim().toLowerCase();
  const normalizedItemRoles = item.roles ? item.roles.map((role) => role.trim().toLowerCase()) : [];

  // Se o item define roles e a activeRole não está presente, não renderiza o item.
  if (normalizedItemRoles.length > 0 && !normalizedItemRoles.includes(normalizedActiveRole)) {
    return null;
  }

  const handleClick = () => {
    if (hasSubItems) {
      toggleSubMenu(item.label);
    } else {
      router.push(item.route);
      // Fecha o menu no mobile após clicar em um item
      if (window.innerWidth < 640) {
        closeMenu();
      }
    }
  };

  return (
    <li>
      <div
        onClick={handleClick}
        className={`flex items-center rounded-md p-2 transition-colors duration-200 cursor-pointer ${isMenuOpen ? "hover:bg-extra-150 justify-start" : "justify-center"
          }`}
      >
        {item.icon}
        {isMenuOpen && <span className="ml-3 text-white">{item.label}</span>}
        {hasSubItems && isMenuOpen && (
          <span className="ml-auto">
            {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </span>
        )}
      </div>
      {hasSubItems && isOpen && (
        <ul className="ml-4 mt-1">
          {item.subItems!.map((subItem, index) => (
            <SidebarMenuItem
              key={index}
              item={subItem}
              isMenuOpen={isMenuOpen}
              openSubMenus={openSubMenus}
              toggleSubMenu={toggleSubMenu}
              activeRole={activeRole}
              closeMenu={closeMenu} // Passa a função closeMenu para os subitens
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarMenuItem;