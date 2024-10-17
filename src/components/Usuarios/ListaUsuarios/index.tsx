"use client"
import { useEffect, useState } from "react";
import style from "./usuarios.module.scss";
import { useMutation } from "react-query";
import Table from "./Table";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import { IUsuario } from "@/interfaces/IUsuario";
import { getAllUsuarios } from "@/api/usuarios/getAllUsuarios";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<IUsuario | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const {push} = useRouter();

  const { mutate } = useMutation(() => getAllUsuarios(), {
    //const { mutate } = useMutation(() => getAllUsuarios(currentPage, 3), {
      onSuccess: (res) => {
      setUsuarios(res.data);
      //setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error('Erro ao recuperar as promoções:', error);
    }
  });

  useEffect(() => {
    mutate();
  }, [currentPage]);

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUsuario = (usuario: IUsuario) => {
    setSelectedUsuario(usuario);
  };

  const handleBackToList = () => {
    setSelectedUsuario(null);
  };

  //if (selectedUsuario) {
  //  return <DetalharUsuario
  //    usuario={selectedUsuario}
  //    backDetalhamento={handleBackToList}
  //    hrefAnterior={APP_ROUTES.private.home.name}
  //  />
  //}

  return (
    <div className={style.global}>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo="Usuarios"
          hrefAnterior={APP_ROUTES.private.home.name}
          diretorioAnterior="Home /"
          diretorioAtual="Usuarios  "
          fistbutton="Solicitações"
          routefirstbutton={APP_ROUTES.private.solicitacoes.name}
          lastbutton="Criar Usuario"
          routelastbutton={APP_ROUTES.private.cadastrarUsuario.name}
        />
        
      </div>

      <Table
        listUsuarios={filteredUsuarios}
        setUsuarios={setUsuarios}
        onSelectUsuario={handleSelectUsuario}
        table1="Nome"
        table2="Nome Social"
        table3="Telefone"
        table4="CPF"
        table5="Ações"
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ListaUsuarios;