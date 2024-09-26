"use client";

import ProviderQuery from "@/components/Providers/ProviderQuery";
import ProviderRedux from "@/components/Providers/provideRedux";
import { checkIsPublicRoute } from "@/functions/checkIsPublicRoute";
import { usePathname } from "next/navigation";
import PrivateRoute from "../privateRoute";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const isPublicPage = checkIsPublicRoute(pathName);
  return (
    <ProviderQuery>
      <ProviderRedux>
          <Header />
        { children}
        {/**<!isPublicPage && (
          <PrivateRoute>
          {children}
          </PrivateRoute>
          </ProviderQuery>)*/}
          <Footer />
      </ProviderRedux>
    </ProviderQuery>
  );
}
