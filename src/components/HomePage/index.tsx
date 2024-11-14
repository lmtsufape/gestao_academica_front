// Tela inicial
"use client"
import Card from "@/components/CardDefault";
import style from "./home.module.scss";
import { useState } from "react";
import { getStorageItem } from "@/utils/localStore";
import { useSelector } from "react-redux";



export default function HomePage() {

  const [roles, setRoles] = useState<string[]>(getStorageItem("userRoles") || []);

  const userLogin = useSelector((state: any) => state.userLogin);
  function whatIsTypeUser() {
    if (roles) {
      if (roles.includes("administrador")){
        return <LayoutAdmin />
      } else if (roles.includes("tecnico")) {
        return <LayoutTecnico />
      }  if (roles.includes("professor")) {
        return <LayoutProfessor />
      } if (roles.includes("aluno")) {
        return <LayoutCoordenador />
      }  else {
        return <LayoutVisitante />
      }
    }

  }
  return (
    <div>
      <div className={style.container} >
        <div className={style.container__itens}>
          {whatIsTypeUser()}
        </div>
      </div>
    </div>
  )

}

const LayoutAdmin = () => {

  return (
    <>
        <Card title="Solicitações" icon="/assets/icons/solicitacoes.svg" description="Usuarios" link="/solicitacoes" />
        <Card title="Usuarios" icon="/assets/icons/usuarios.svg" description="Usuarios" link="/usuarios" />
        <Card title="Unidades Administrativas" icon="/assets/icons/unidadeAdministrativa.svg" description="Usuarios" link="/unidade-administrativa" />

    </>
  )
}
const LayoutTecnico = () => {

  return (
    <>
        <Card title="Solicitações" icon="/assets/icons/solicitacoes.svg" description="Usuarios" link="/solicitacoes" />
        <Card title="Solicitar Perfil" icon="/assets/icons/solicitar_perfil.svg" description="Usuarios" link="/solicitar-perfil" />

        <Card title="Usuarios" icon="/assets/icons/usuarios.svg" description="Usuarios" link="/usuarios" />
        <Card title="Unidades Administrativas" icon="/assets/icons/unidadeAdministrativa.svg" description="Usuarios" link="/unidade-administrativa" />

    </>
  )
}
const LayoutProfessor = () => {

  return (
    <>
        <Card title="Solicitações" icon="/assets/icons/solicitacoes.svg" description="Usuarios" link="/solicitacoes" />
        <Card title="Solicitar Perfil" icon="/assets/icons/solicitar_perfil.svg" description="Usuarios" link="/solicitar-perfil" />

        <Card title="Usuarios" icon="/assets/icons/usuarios.svg" description="Usuarios" link="/usuarios" />
        <Card title="Unidades Administrativas" icon="/assets/icons/unidadeAdministrativa.svg" description="Usuarios" link="/unidade-administrativa" />

    </>
  )
}
const LayoutCoordenador = () => {

  return (
    <>
        <Card title="Solicitações" icon="/assets/icons/solicitacoes.svg" description="Usuarios" link="/solicitacoes" />
        <Card title="Solicitar Perfil" icon="/assets/icons/solicitar_perfil.svg" description="Usuarios" link="/solicitar-perfil" />

        <Card title="Usuarios" icon="/assets/icons/usuarios.svg" description="Usuarios" link="/usuarios" />
        <Card title="Unidades Administrativas" icon="/assets/icons/unidadeAdministrativa.svg" description="Usuarios" link="/unidade-administrativa" />

    </>
  )
}
const LayoutVisitante = () => {

  return (
    <>
        <Card title="Solicitar Perfil" icon="/assets/icons/solicitar_perfil.svg" description="Usuarios" link="/solicitar-perfil" />
    </>
  )
}
