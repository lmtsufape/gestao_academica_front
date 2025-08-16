import React from "react";
import { Metadata } from "next";
import ClientWrapper from "@/components/AuthProvider/ClientWrapper";
import { School, PendingActions, Groups2, Diversity3, AccountCircleOutlined, House, Book, Summarize, HowToReg, AssignmentInd } from "@mui/icons-material";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";


export const metadata: Metadata = {
  title: "Gestão de Acesso",
  description: "Modulo de Gestão de Acesso",
  icons: {
    icon: "/assets/crosshairs-gps.png",
  },
};



export default function EfrotasLayout({ children }: { children: React.ReactNode }) {
  // config/authLayoutConfig.tsx

  const authLayoutConfig: InternalLayoutConfig = {
    header: {
      logo: {
        url: "/assets/logo-auth.png",
        width: 40,
        height: 40,
        alt: "Logo Auth",
      },
      title: "Gestão de Acesso",
      userActions: [
        {
          label: "Minha conta",
          route: "/conta/perfil",
          icon: <AccountCircleOutlined fontSize="small" />,
        },
        {
          label: "Sair",
          route: "/conta/sair",
          icon: <PendingActions fontSize="small" />,
        },
      ],
    },
    sidebar: {
      logo: {
        url: "/assets/logo-sidebar.png",
        width: 32,
        height: 32,
        text: "SGU",
      },
      menuItems: [
        {
          label: "Início",
          route: "/home",
          icon: <House fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico", "professor", "aluno", "visitante"],
        },
        {
          label: "Cursos",
          route: "/gestao-acesso/cursos",
          icon: <Book fontSize="small" className="text-white" />,
          roles: ["administrador"],
        },
        {
          label: "Minhas Solicitações",
          route: "/gestao-acesso/solicitacoes",
          icon: <PendingActions fontSize="small" className="text-white" />,
          roles: ["aluno", "professor", "visitante", "tecnico", "gestor"],
          // subItems: [
          //   {
          //     label: "Aguardando",
          //     route: "/gestao-acesso/solicitacoes/aguardando",
          //     icon: <PendingActions fontSize="small" className="text-white"/>,
          //   },
          //   {
          //     label: "Aprovadas",
          //     route: "/gestao-acesso/solicitacoes/aprovadas",
          //     icon: <PendingActions fontSize="small"className="text-white" />,
          //   },
          // ],
        },
        {
          label: "Gerenciar Solicitações",
          route: "/gestao-acesso/solicitacoes",
          icon: <PendingActions fontSize="small" className="text-white" />,
          roles: ["administrador"],
        },
        {
          label: "Tipos de Unidades Administrativas",
          route: "/gestao-acesso/tipo-unidade-administrativa",
          icon: <Summarize fontSize="small" className="text-white" />,
          roles: ["administrador"],
        },
        {
          label: "Unidades Administrativas",
          route: "/gestao-acesso/unidades-administrativas",
          icon: <School fontSize="small" className="text-white" />,
          roles: ["administrador"],
        },
        {
          label: "Minhas Unidades Administrativas",
          route: "/gestao-acesso/minhas-unidades",
          icon: <Summarize fontSize="small" className="text-white" />,
          roles: ["gestor"]
        },
        {
          label: "Usuários",
          route: "/gestao-acesso/usuarios",
          icon: <Groups2 fontSize="small" className="text-white" />,
          roles: ["administrador"],
        },
        {
          label: "Tipo de Etnia",
          route: "/gestao-acesso/etnia",
          icon: <Diversity3 fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
        },
      ],
    },
  };
  return (
    <ClientWrapper layoutConfig={authLayoutConfig}>{children}</ClientWrapper>
  )
}
