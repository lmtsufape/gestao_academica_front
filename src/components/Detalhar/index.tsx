"use client";

import { Form, Formik } from "formik";
import { useEffect, useState } from "react";

import style from "./detalhar.module.scss";
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import DadosPessoais from "./DadosPessoais";
import { IUsuario } from "@/interfaces/IUsuario";
import { patchUsuarioById } from "@/api/usuarios/patchUsuarioById";
import { title } from "process";

interface DetalharUsuarioProps {
  hrefAnterior: string;
  backDetalhamento: () => void;
  usuario: IUsuario | any;
  diretorioAnterior: string;
  diretorioAtual: string;
  titulo: string;
  firstbutton: string;
  lastbutton: string;
  routefirstbutton: any;
  routelastbutton: any;
}

export default function Listar({ backDetalhamento, usuario, diretorioAnterior, diretorioAtual, hrefAnterior, titulo, firstbutton, lastbutton, routefirstbutton, routelastbutton }: DetalharUsuarioProps) {
  // Define `roles` como um array de strings

  function whatIsPageIs() {
    if (titulo == "Informações do Usuario") {
      return <LayoutDetalharUsuario backDetalhamento={backDetalhamento} usuario={usuario} titulo={titulo} hrefAnterior={hrefAnterior} diretorioAnterior={diretorioAnterior} diretorioAtual={diretorioAtual} firstbutton={firstbutton} routefirstbutton=
        {routefirstbutton} lastbutton={lastbutton} routelastbutton={routelastbutton} />;

    } else if (titulo == "Informações da Solicitação") {
      return <LayoutDetalharUsuario backDetalhamento={backDetalhamento} usuario={usuario} titulo={titulo} hrefAnterior={hrefAnterior} diretorioAnterior={diretorioAnterior} diretorioAtual={diretorioAtual} firstbutton={firstbutton} routefirstbutton=
        {routefirstbutton} lastbutton={lastbutton} routelastbutton={routelastbutton} />;

    }
  }

  return (
    <>
      {whatIsPageIs()}
    </>
  );
}
const LayoutDetalharUsuario: React.FC<DetalharUsuarioProps> = ({ backDetalhamento, usuario, diretorioAnterior, diretorioAtual, hrefAnterior, titulo, firstbutton, lastbutton, routefirstbutton, routelastbutton }) => {
  const { push } = useRouter();
  const [editar, setEditar] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<IUsuario>({
    id: '',
    nome: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    email: '',
    telefone: '',
    siape: '',
    curso: '',
    nomeSocial: '',
    instituicao: '',
    tipoUsuario: '',
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        id: usuario.id || '',
        nome: usuario.nome || '',
        cpf: usuario.cpf || '',
        senha: usuario.senha || '',
        confirmarSenha: usuario.confirmarSenha || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        siape: usuario.siape || '',
        curso: usuario.curso || '',
        nomeSocial: usuario.nomeSocial || '',
        instituicao: usuario.instituicao || '',
        tipoUsuario: usuario.tipoUsuario || 'default',
        profilePhoto: undefined,
      });

      if (usuario.id) {
        //getSecretariaPhoto(usuario.id);
      }
    }
  }, [usuario]);

  const updateUsuario = useMutation(
    async (values: IUsuario) => {
      const profilePhoto = values.profilePhoto as File;
      const { profilePhoto: _, ...updatedValues } = values;

      return patchUsuarioById(usuario.id, updatedValues, profilePhoto);
    },
    {
      onSuccess: (res) => {
        // Handle success logic
      },
      onError: (error) => {
        console.log("Erro ao atualizar o usuario", error);
      }
    }
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    if (!editar) return;

    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("profilePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.container__header}>
        <HeaderDetalhamento
          titulo={titulo}
          hrefAnterior={backDetalhamento}
          diretorioAnterior={diretorioAnterior}
          diretorioAtual={diretorioAtual}
          firstbutton={firstbutton}
          routefirstbutton={routefirstbutton}
          lastbutton={lastbutton}
          routelastbutton={routelastbutton}
        />
      </div>

      <div className={style.container__body}>
        <div className={style.container__body_ContainerForm}>
          <Formik
            initialValues={formData}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              updateUsuario.mutate(values);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form className={style.container__body_ContainerForm_form}>
                <div className={style.container__body_ContainerForm_header}>
                  <div className={style.container__body_ContainerForm_header_title}>
                    <div className={style.container__body_ContainerForm_profilePhotoWrapper}>
                      <input
                        type="file"
                        id="profilePhoto"
                        name="profilePhoto"
                        accept="image/jpeg"
                        onChange={(event) => handleImageChange(event, formik.setFieldValue)}
                        disabled={!editar}
                      />
                      <label htmlFor="profilePhoto" className={style.container__body_ContainerForm_profilePhotoLabel}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Profile Preview" className={style.container__body_ContainerForm_profileImage} />
                        ) : (
                          <img src="/assets/icons/perfil.svg" alt="Upload Icon" />
                        )}
                      </label>
                      {editar && (
                        <span
                          className={style.container__body_ContainerForm_editIcon}
                          onClick={() => {
                            const fileInput = document.getElementById('profilePhoto');
                            if (fileInput) {
                              fileInput.click();
                            }
                          }}
                        >
                          <img src="/assets/icons/editar_white.svg" alt="Edit Icon" />
                        </span>
                      )}
                    </div>
                    <div className={style.container__body_ContainerForm_header_form}>
                    {titulo === "Informações da Solicitação" ? (
                      <>
                      <h1>Solicitação para o perfil <span>{formik.values.tipoUsuario}</span></h1>
                      </>
                    ):(
                      <h1>{formik.values.nome}</h1>
                    )}
                    </div>
                  </div>
                  {titulo !== "Informações da Solicitação" ? (
                    <>

                      {!editar ? (
                        <button
                          type="button"
                          onClick={() => setEditar(true)}
                          className={style.container__body_ContainerForm_header_button}
                        >
                          <span>Editar</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className={style.container__body_ContainerForm_header_button}
                          onClick={() => setEditar(false)}
                        >
                          <span>Salvar</span>
                        </button>
                      )}
                    </>
                  ) : ""}
                </div>

                <DadosPessoais formik={formik} editar={editar} hrefAnterior={hrefAnterior} roles={[]} />
              
                {titulo === "Informações da Solicitação" ? (
                    <div className={style.container__body_ContainerForm_form_submit}>

                        <button
                          type="button"
                          onClick={() => setEditar(true)}
                        >
                          <span>Recusar</span>
                        </button>
                        <button
                          type="submit"
                          onClick={() => setEditar(false)}
                        >
                          <span>Aprovar</span>
                        </button>
                    </div>
                  ) : ""}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

