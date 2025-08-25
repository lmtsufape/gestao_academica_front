"use client";

import withAuthorization from "@/components/AuthProvider/withAuthorization";
import TabelaMeta from "./(tabelas)/tabelaMeta";

const PageLista = () => {
  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
        <TabelaMeta />
      </div>
    </main>
  );
};

export default withAuthorization(PageLista);
