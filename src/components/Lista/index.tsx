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
import { getAllSolicitacoes } from "@/api/solicitacoes/getAllSolicitacoes";
import { ISolicitacao } from "@/interfaces/ISolicitacao";
import { ICurso } from "@/interfaces/ICurso";
import { getAllCursos } from "@/api/cursos/getAllCursos";
import { IUnidade } from "@/interfaces/IUnidade";
import { getAllUnidades } from "@/api/unidades/getAllUnidades";
import { getSolicitacoesUsuario } from "@/api/cursos/getSolicitacoesUsuario";
import { getStorageItem } from "@/utils/localStore";

// ...
interface ListaProps {
  titulo: string;
  hrefAnterior: string;
  diretorioAnterior: string;
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

export default function Listar(props: ListaProps) {
  const { titulo } = props;

  function whatIsPageIs() {
    if (titulo === "Usuarios") {
      return <LayoutListarUsuarios {...props} />;
    } else if (titulo === "Solicitações") {
      return <LayoutListarSolicitacoes {...props} />;
    } else if (titulo === "Cursos") {
      return <LayoutListarCursos {...props} />;
    } else if (titulo === "Unidades Administrativas") {
      return <LayoutListarUnidades {...props} />;
    }
    // Poderia ter mais condições...
    return null;
  }

  return <>{whatIsPageIs()}</>;
}

// ---------- LayoutListarUsuarios ------------
const LayoutListarUsuarios: React.FC<ListaProps> = (props) => {
  const {
    titulo,
    hrefAnterior,
    diretorioAnterior,
    diretorioAtual,
    firstbutton,
    routefirstbutton,
    lastbutton,
    routelastbutton,
    table1,
    table2,
    table3,
    table4,
    table5,
  } = props;

  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<IUsuario | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerfil, setSelectedPerfil] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  // Mutação para buscar usuários
  const { mutate } = useMutation(() => getAllUsuarios(selectedPerfil, currentPage, 3), {
    onSuccess: (res) => {
      // Ajuste conforme a estrutura da sua resposta
      setUsuarios(res.data);
      // setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error("Erro ao recuperar os usuários:", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [selectedPerfil, currentPage]);

  // Filtra pelo termo de busca
  const filteredUsuarios = usuarios.filter((u) =>
    u?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUsuario = (u: IUsuario) => {
    setSelectedUsuario(u);
  };

  const handleBackToList = () => {
    setSelectedUsuario(null);
  };

  if (selectedUsuario) {
    return (
      <Detalhar
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
    );
  }

  return (
    <div className={style.container}>
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

      {/* Filtro */}
      <div className={style.filterContainer}>
        <select
          onChange={(e) => setSelectedPerfil(e.target.value || null)}
          value={selectedPerfil || ""}
          className={style.perfilSelect}
        >
          <option value="">Todos os Perfis</option>
          <option value="professor">Professor</option>
          <option value="tecnico">Servidor</option>
          <option value="aluno">Aluno</option>
        </select>

        <input
          type="text"
          placeholder="Buscar usuário por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

// ---------- LayoutListarSolicitacoes ------------
const LayoutListarSolicitacoes: React.FC<ListaProps> = (props) => {
  const {
    titulo,
    hrefAnterior,
    diretorioAnterior,
    diretorioAtual,
    firstbutton,
    routefirstbutton,
    lastbutton,
    routelastbutton,
    table1,
    table2,
    table3,
    table4,
    table5,
  } = props;
  const [roles, setRoles] = useState<string[]>(getStorageItem("userRoles") || []);

  const [solicitacoes, setSolicitacoes] = useState<ISolicitacao[]>([]);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<ISolicitacao | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerfil, setSelectedPerfil] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { mutate } = useMutation(() => getAllSolicitacoes(), {
    onSuccess: (res) => {
      setSolicitacoes(res.data);
      // setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error("Erro ao recuperar as solicitações:", error);
    },
  });
  const mutateUsuarioSolicitacoes = useMutation(() => getSolicitacoesUsuario(), {
    onSuccess: (res) => {
      setSolicitacoes(res.data);
      // setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error("Erro ao recuperar as solicitações:", error);
    },
  });
  useEffect(() => {
    if (roles.includes("administrador")) {

      mutate();
    } else {
      mutateUsuarioSolicitacoes.mutate();
    }
  }, [selectedPerfil, currentPage]);

  // Filtra solicitacoes pelo nome do solicitante
  const filteredSolicitacoes = solicitacoes.filter((solicitacao) =>
    solicitacao.status !== "APROVADA" && solicitacao.status !== "REJEITADA" &&
    solicitacao?.solicitante?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSelectSolicitacao = (sol: ISolicitacao) => {
    setSelectedSolicitacao(sol);
  };

  const handleBackToList = () => {
    setSelectedSolicitacao(null);
  };

  if (selectedSolicitacao) {
    return (
      <Detalhar
        solicitacao={selectedSolicitacao}
        backDetalhamento={handleBackToList}
        titulo={"Informações da Solicitação"}
        hrefAnterior={APP_ROUTES.private.home.name}
        diretorioAnterior={"Home / Solicitações /"}
        diretorioAtual={"Informações da Solicitação"}
        firstbutton={firstbutton}
        routefirstbutton={routefirstbutton}
        lastbutton={lastbutton}
        routelastbutton={routelastbutton}
      />
    );
  }

  return (
    <div className={style.container}>
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

      <div className={style.filterContainer}>

        <input
          type="text"
          placeholder="Consultar por solicitante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={style.searchBar}
        />
      </div>

      <Table
        titulo={titulo}
        listSolicitacoes={filteredSolicitacoes}
        setSolicitacaoes={setSolicitacoes}
        onSelectSolicitacao={handleSelectSolicitacao}
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
// ---------- LayoutListarCursos ------------
const LayoutListarCursos: React.FC<ListaProps> = (props) => {
  const {
    titulo,
    hrefAnterior,
    diretorioAnterior,
    diretorioAtual,
    firstbutton,
    routefirstbutton,
    lastbutton,
    routelastbutton,
    table1,
    table2,
    table3,
    table4,
    table5,
  } = props;

  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<ICurso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerfil, setSelectedPerfil] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { mutate } = useMutation(() => getAllCursos(), {
    onSuccess: (res) => {
      setCursos(res.data);
      // setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error("Erro ao recuperar as solicitações:", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [selectedCurso, currentPage]);

  // Filtra solicitacoes pelo nome do solicitante
  const filteredCursos = cursos.filter((curso) =>
    curso?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSelectCurso = (curso: ICurso) => {
    setSelectedCurso(curso);
  };

  const handleBackToList = () => {
    setSelectedCurso(null);
  };

  return (
    <div className={style.container}>
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

      <div className={style.filterContainer}>

        <input
          type="text"
          placeholder="Buscar curso por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={style.searchBar}
        />
      </div>

      <Table
        titulo={titulo}
        listCursos={filteredCursos}
        setCursos={setCursos}
        onSelectCurso={handleSelectCurso}
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
// ---------- LayoutListarUnidades ------------
const LayoutListarUnidades: React.FC<ListaProps> = (props) => {
  const {
    titulo,
    hrefAnterior,
    diretorioAnterior,
    diretorioAtual,
    firstbutton,
    routefirstbutton,
    lastbutton,
    routelastbutton,
    table1,
    table2,
    table3,
    table4,
    table5,
  } = props;

  const [unidades, setUnidades] = useState<IUnidade[]>([]);
  const [selectedUnidade, setSelectedUnidade] = useState<IUnidade | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerfil, setSelectedPerfil] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { mutate } = useMutation(() => getAllUnidades(), {
    onSuccess: (res) => {
      setUnidades(res.data);
      // setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error("Erro ao recuperar as solicitações:", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [selectedUnidade, currentPage]);

  // Filtra solicitacoes pelo nome do solicitante
  const filteredUnidade = unidades.filter((unidade) =>
    unidade?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSelectUnidade = (unidade: IUnidade) => {
    setSelectedUnidade(unidade);
  };

  const handleBackToList = () => {
    setSelectedUnidade(null);
  };

  return (
    <div className={style.container}>
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

      <div className={style.filterContainer}>

        <input
          type="text"
          placeholder="Buscar unidade por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={style.searchBar}
        />
      </div>

      <Table
        titulo={titulo}
        listUnidades={filteredUnidade}
        setUnidades={setUnidades}
        onSelectUnidade={handleSelectUnidade}
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
