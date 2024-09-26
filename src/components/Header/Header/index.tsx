"use client";

import Image from "next/image";
import style from "./header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { setStorageItem, getStorageItem } from "@/utils/localStore";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";
import { useMutation } from 'react-query';
//import { getUsuarioEmail } from "@/api/usuarios/getUsuarioEmail";
import Link from "next/link";
import { RootState } from "@/redux/store";

// Interface para usuário
interface User {
  nome: string;
  email: string;
}

// Função para detectar cliques fora de um elemento
const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, callback]);
};

const Header: React.FC = () => {
  const { push } = useRouter();

  const whatIsTypeUser = () => {
    const role = getStorageItem("userRole");

    if (role) {
      switch (role) {
        case "ROLE_COPPABACS":
          return <LayoutAdmin />;
        case "ROLE_GERENTE":
          //return <LayoutCoordenador />;
        case "ROLE_AGRICULTOR":
          //return <LayoutAgricultor />;
        case "ROLE_USUARIO":
          //push(APP_ROUTES.public.home);
          break;
        default:
          //return <LayoutPublic />;
      }
    } else {
      return <LayoutPublic />;
    }
  };

  return (
    <div>
      <div className={style.menu}>
        {whatIsTypeUser()}
      </div>
    </div>
  );
};

const LayoutAdmin: React.FC = () => {
  const { push, back } = useRouter();
  const pathName = usePathname();
  const userLogin = useSelector((state: RootState) => state.userLogin); 
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);
  const dispatch = useDispatch();
  const [role] = useState<string | null>(getStorageItem("userRole"));
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setOpen(false));
  useOutsideClick(dropdownRef, () => setDropdown(false));

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth && windowWidth >= 768) {
      setOpen(false);
    }
    mutate();
  }, [windowWidth]);

  const exitUser = () => {
    setStorageItem("token", "");
    setStorageItem("userLogin", "");
    setStorageItem("userRole", "");
    setUsuario(null);
    dispatch(setUserLogin(""));
    push("/login");
    setOpen(false);
    setDropdown(false);
  };

  const { mutate } = useMutation(
  //  async () => getUsuarioEmail(userLogin),
    {
      onSuccess: (res:any) => {
       // setUsuario(res.data);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return (
    <header className={style.header}>
      {pathName !== "/" && pathName !== "/login" && (
        <button className={style.header__voltar} onClick={() => back()}>
          <Image src="/assets/IconMenorQue.svg" alt="Voltar" width={27} height={24} />
        </button>
      )}
      {userLogin && (
        <button className={style.header__button_burguer} onClick={() => setOpen(!open)}>
          <Image src="/assets/burguer.png" alt="Burger" width={23.11} height={14.86} />
        </button>
      )}
      {open && (
        <div ref={menuRef} className={style.header__side_menu}>
          <div className={style.header__side_menu__content}>
            <div className={style.header__side_menu__content__header}>
              <button className={style.header__side_menu__content__header__button_back} onClick={() => setOpen(false)}>
                <Image src="/assets/BackWhite.svg" alt="Voltar" width={27} height={24} style={{ transform: "scaleX(-1)" }} />
              </button>
              <div className={style.header__side_menu__content__header_iconLogin}>
                <Image src="/assets/iconLogadoBranco.svg" alt="Home" width={50} height={50} />
                {userLogin ? (
                  <h3 className={style.header__side_menu__content__header_iconLogin_nome}>{usuario?.nome}</h3>
                ) : (
                  <h3 className={style.header__side_menu__content__header_iconLogin_nome}>Olá, visitante</h3>
                )}
                {userLogin && <h3 className={style.header__side_menu__content__header_iconLogin_email}>{usuario?.email}</h3>}
              </div>
            </div>
            <div className={style.header__side_menu__content__main}>
              {/* Botões de navegação */}
            </div>
          </div>
          <div className={style.header__side_menu__space} onClick={() => setOpen(false)}></div>
        </div>
      )}
      <button className={style.header__button_link} onClick={() => push("/")}>
        <Image className={style.header__logo} src="/assets/logoCoppabacs.svg" alt="Logo App" width={60} height={60} />
      </button>
      <div className={style.header__usuarioLogado}>
        {userLogin ? (
          <h3 className={style.header__usuarioLogado_h3}>Olá, {usuario?.nome}</h3>
        ) : (
          <h3 className={style.header__usuarioLogado_h3}>Olá, visitante</h3>
        )}
        {userLogin ? (
          <button className={style.header__button_perfil} onClick={() => setDropdown(!dropdown)}>
            <Image src="/assets/iconLogado.svg" alt="Perfil" width={50} height={50} />
          </button>
        ) : (
          <button className={style.header__button_home} onClick={() => push("/login")}>Login</button>
        )}
        {dropdown && userLogin && (
          <div ref={dropdownRef} className={style.header__dropdown}>
            <button className={style.header__dropdown__perfil} onClick={() => { push("/perfil"); setDropdown(false); setOpen(false); }}>
              <Image src="/assets/iconLogadoGray.svg" alt="Meu perfil" width={27} height={24} />
              <p>Meu perfil</p>
            </button>
            <button className={style.header__dropdown__exit} onClick={exitUser}>
              <Image src="/assets/download.svg" alt="Sair" width={27} height={24} />
              <p>Sair</p>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const LayoutPublic = () => {
  const { push, back } = useRouter();
  const pathName = usePathname();
  const userLogin = useSelector((state: RootState) => state.userLogin); // Tipagem adequada
  const [open, setOpen] = useState(false);
  const [dropdow, setDropdow] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null); // Tipagem correta para `usuario`
  const dispatch = useDispatch();
  const [role] = useState<string | null>(getStorageItem("userRole"));
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Função para tratar cliques fora do menu
  const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [ref, callback]);
  };

  useOutsideClick(menuRef, () => setOpen(false));
  useOutsideClick(dropdownRef, () => setDropdow(false));

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth && windowWidth >= 768) {
     // setOpen(false);
    }
    mutate();
  }, [windowWidth]);

  function exitUser() {
    setStorageItem("token", "");
    setStorageItem("userLogin", "");
    setStorageItem("userRole", "");
    setUsuario(null);
    dispatch(setUserLogin(""));
    push("/login");
    setOpen(false);
    setDropdow(false);
  }

  const { status, mutate } = useMutation(
    async () => {
      //return getUsuarioCpf(userLogin); // Supondo que `getUsuarioCpf` retorne os dados do usuário
    },
    {
      onSuccess: (res:any) => {
       // setUsuario(res.data);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return (
    <div className={style.header}>
      <button className={style.header__button_link} onClick={() => push("/")}>
        <Image className={style.header__logo} src="/assets/logoCoppabacs.svg" alt="Logo App" width={60} height={60} />
      </button>
      <div className={style.header__container}>
        <button className={style.header__button_link} onClick={() => push("/")}>
          Home
        </button>
        <button className={style.header__button_link} onClick={() => push("/")}>
        Sistema
        </button>
      </div>

    </div>
  );
};


export default Header;
