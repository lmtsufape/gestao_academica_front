import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Não faz retry automático
      refetchOnWindowFocus: false, // Evita refetch ao focar na janela
    },
    mutations: {
      retry: false, // Evita retries automáticos em mutações
    },
  },
});

const ProviderQuery = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ProviderQuery;
