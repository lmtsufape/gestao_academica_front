import React from "react";
import { Metadata } from "next";
import ClientWrapper from "@/components/AuthProvider/ClientWrapper";
import { Article, PendingActions, Description, AccountCircleOutlined, Home, Flag, ListAlt, TrackChanges } from "@mui/icons-material";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";


export const metadata: Metadata = {
  title: "PDI",
  description: "Modulo do PDI",
  icons: {
    icon: "/assets/crosshairs-gps.png",
  },
};


export default function EditaisLayout({ children }: { children: React.ReactNode }) {
  // config/authLayoutConfig.tsx

  const layoutConfig: InternalLayoutConfig = {
    header: {
      logo: {
        url: "/assets/logo-auth.png",
        width: 40,
        height: 40,
        alt: "Logo Auth",
        position: "left",
      },
      title: "PDI",
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
        url: "/assets/logo-sidebar.png",
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
          label: "Metas",
          route: "/pdi/metas",
          icon: <Flag fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
        },
      ],
    },
  };
  return (
    <ClientWrapper layoutConfig={layoutConfig}>{children}</ClientWrapper>
  )
}

