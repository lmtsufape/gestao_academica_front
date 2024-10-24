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
import Detalhar from "../Detalhar";

interface ListaProps {
  titulo: string;
  hrefAnterior: string;
  diretorioAnterior: any;
  diretorioAtual: string;
  firstbutton: string;
  routefirstbutton: string;
  lastbutton: string;
  routelastbutton: string;
  table1: string;
  table2: string;
  table3: string;
  table4: string;
  table5: string;
}
export default function Listar({ titulo, hrefAnterior, diretorioAnterior, diretorioAtual, firstbutton, routefirstbutton, lastbutton, routelastbutton, table1, table2, table3, table4, table5 }: ListaProps) {
  // Define `roles` como um array de strings

  function whatIsPageIs() {
    if (titulo == "Usuarios") {
      return <LayoutListarUsuarios titulo={titulo} hrefAnterior={hrefAnterior} diretorioAnterior={diretorioAnterior} diretorioAtual={diretorioAtual} firstbutton={firstbutton} routefirstbutton=
        {routefirstbutton} lastbutton={lastbutton} routelastbutton={routelastbutton} table1={table1} table2={table2} table3={table3} table4={table4} table5={table5} />;

    } else if (titulo == "Solicitações") {
      return <LayoutListarSolicitacoes titulo={titulo} hrefAnterior={hrefAnterior} diretorioAnterior={diretorioAnterior} diretorioAtual={diretorioAtual} firstbutton={firstbutton} routefirstbutton=
        {routefirstbutton} lastbutton={lastbutton} routelastbutton={routelastbutton} table1={table1} table2={table2} table3={table3} table4={table4} table5={table5} />;

    }
  }

  return (
    <>
      {whatIsPageIs()}
    </>
  );
}


const LayoutListarUsuarios: React.FC<ListaProps> = ({ titulo, hrefAnterior, diretorioAnterior, diretorioAtual, firstbutton, routefirstbutton, lastbutton, routelastbutton, table1, table2, table3, table4, table5 }) => {
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


  if (selectedUsuario) {
    return <Detalhar
      usuario={selectedUsuario}
      backDetalhamento={handleBackToList}
      titulo={"Informações do Usuario"}
      hrefAnterior={APP_ROUTES.private.usuarios.name}
      diretorioAnterior={"Home / Usuarios /"}
      diretorioAtual={"Informações do Usuario"}
      firstbutton={firstbutton}
      routefirstbutton={routefirstbutton}
      lastbutton={lastbutton}
      routelastbutton={routelastbutton}
    />
  }
  return (
    <div className={style.container}>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo={titulo}
          hrefAnterior={hrefAnterior}
          diretorioAnterior={diretorioAnterior}
          diretorioAtual={diretorioAtual}
          firstbutton={firstbutton}
          routefirstbutton={routefirstbutton}
          lastbutton={lastbutton}
          routelastbutton={routelastbutton}
        />
      </div>

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
        titulo={titulo}
        listUsuarios={filteredUsuarios}
        setUsuarios={setUsuarios}
        onSelectUsuario={handleSelectUsuario}
        table1={table1}
        table2={table2}
        table3={table3}
        table4={table4}
        table5={table5}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

const LayoutListarSolicitacoes: React.FC<ListaProps> = ({ titulo, hrefAnterior, diretorioAnterior, diretorioAtual, firstbutton, routefirstbutton, lastbutton, routelastbutton, table1, table2, table3, table4, table5 }) => {
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


  if (selectedUsuario) {
    return <Detalhar
      usuario={selectedUsuario}
      backDetalhamento={handleBackToList}
      titulo={"Informações da Solicitação"}
      hrefAnterior={APP_ROUTES.private.usuarios.name}
      diretorioAnterior={"Home / Solicitações /"}
      diretorioAtual={"Informações da Solicitação"}
      firstbutton={firstbutton}
      routefirstbutton={routefirstbutton}
      lastbutton={lastbutton}
      routelastbutton={routelastbutton}
    />
  }
  return (
    <div className={style.container}>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo={titulo}
          hrefAnterior={hrefAnterior}
          diretorioAnterior={diretorioAnterior}
          diretorioAtual={diretorioAtual}
          firstbutton={firstbutton}
          routefirstbutton={routefirstbutton}
          lastbutton={lastbutton}
          routelastbutton={routelastbutton}
        />
      </div>

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
        titulo={titulo}
        listUsuarios={filteredUsuarios}
        setUsuarios={setUsuarios}
        onSelectUsuario={handleSelectUsuario}
        table1={table1}
        table2={table2}
        table3={table3}
        table4={table4}
        table5={table5}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

