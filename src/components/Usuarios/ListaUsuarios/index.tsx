"use client";
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
  const [selectedPerfil, setSelectedPerfil] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { push } = useRouter();

  // Mutação para buscar usuários
  const { mutate } = useMutation(() => getAllUsuarios(selectedPerfil, currentPage, 3), {
    onSuccess: (res) => {
      setUsuarios(res.data);
      // setTotalPages(res.data.totalPages); // Comentado conforme solicitado
    },
    onError: (error) => {
      console.error("Erro ao recuperar os usuários:", error);
    },
  });

  // Executa a mutação sempre que o perfil ou a página atual mudam
  useEffect(() => {
    mutate(); // Faz a chamada direta ao `mutate`
  }, [selectedPerfil, currentPage]);

  // Filtra os usuários pelo termo de busca
  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUsuario = (usuario: IUsuario) => {
    setSelectedUsuario(usuario);
  };

  const handleBackToList = () => {
    setSelectedUsuario(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePerfilChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPerfil(e.target.value || null);
  };

  return (
    <div className={style.global}>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo="Usuarios"
          hrefAnterior={APP_ROUTES.private.home.name}
          diretorioAnterior="Home /"
          diretorioAtual="Usuarios"
          fistbutton="Solicitações"
          routefirstbutton={APP_ROUTES.private.solicitacoes.name}
          lastbutton="Criar Usuario"
          routelastbutton={APP_ROUTES.private.cadastrarUsuario.name}
        />
      </div>

      {/* Barra de busca e filtro por perfil */}
      <div className={style.filterContainer}>
        <select onChange={handlePerfilChange} value={selectedPerfil || ""} className={style.perfilSelect}>
          <option value="">Todos os Perfis</option>
          <option value="admin">Admin</option>
          <option value="gestor">Gestor</option>
          <option value="professor">Professor</option>
          <option value="servidor">Servidor</option>
          <option value="aluno">Aluno</option>
        </select>
        <input
          type="text"
          placeholder="Buscar usuario por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={style.searchBar}
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
