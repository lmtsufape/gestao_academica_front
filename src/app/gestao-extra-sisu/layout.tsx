import React from "react";
import ClientWrapper from "@/components/AuthProvider/ClientWrapper";
import {
  PendingActions,
  Description,
  AccountCircleOutlined,
  Home,
  ListAlt,
} from "@mui/icons-material";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";

export default function EditaisLayout({ children }: { children: React.ReactNode }) {
  const layoutConfig: InternalLayoutConfig = {
    header: {
      logo: {
        url: "/assets/SGU.png",
        width: 40,
        height: 40,
        alt: "Logo Auth",
        position: "left",
      },
      title: "Gestão Extra Sisu",
      userActions: [
        {
          label: "Minha conta",
          route: "/conta/perfil",
          icon: <AccountCircleOutlined fontSize="small" className="text-white" />,
        },
        {
          label: "Sair",
          route: "/conta/sair",
          icon: <PendingActions fontSize="small" className="text-white" />,
        },
      ],
    },
    sidebar: {
      logo: {
        url: "/assets/LogoUfape.svg",
        width: 32,
        height: 32,
        text: "SGU",
      },
      menuItems: [
        {
          label: "Início",
          route: "/home",
          icon: <Home fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
        },
        {
          label: "Editais",
          route: "/gestao-extra-sisu/editais",
          icon: <Description fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
        },
        {
          label: "Minhas Inscricoes",
          route: "/gestao-extra-sisu/minhas-inscricoes",
          icon: <ListAlt fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico", "professor", "profissional", "aluno", "visitante"],
        },
      ],
    },
  };
  return (
    <ClientWrapper layoutConfig={layoutConfig}>{children}</ClientWrapper>
  )
}
