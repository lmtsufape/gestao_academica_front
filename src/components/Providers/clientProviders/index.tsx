// ClientProviders.tsx
"use client";
import styles from './client.module.scss';
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
        <div className={styles.appContainer}>
          <Header />
          <div className={styles.content}>
            {isPublicPage && children}
            {!isPublicPage && (
              <PrivateRoute>
                {children}
              </PrivateRoute>
            )}
          </div>
          <Footer className={styles.footer} />
        </div>
      </ProviderRedux>
    </ProviderQuery>
  );
}
