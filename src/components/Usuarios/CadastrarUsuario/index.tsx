"use client";

import { useMutation } from "react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import style from "./cadastrar-usuario.module.scss";
import DadosPessoais from "./DadosPessoais";
import { APP_ROUTES } from "@/constants/app-routes";
import { IUsuario } from "@/interfaces/IUsuario";
import { postUsuario } from "@/api/usuarios/postUsuario";
import { getStorageItem } from "@/utils/localStore";
import { useSelector } from "react-redux";

export default function CadastrarUsuario() {
  // Define `roles` como um array de strings
  const [roles, setRoles] = useState<string[]>(getStorageItem("userRoles") || []);
  const userLogin = useSelector((state: any) => state.userLogin);

  function whatIsTypeUser() {
    if (roles.includes("administrador")) {
      return <LayoutAdmin roles={roles} />;

    } else {
      return <LayoutPublic />;

    }
  }

  return (
    <div>
      <div className={style.container}>
        <div className={style.container__itens}>
          {whatIsTypeUser()}
        </div>
      </div>
    </div>
  );
}

const LayoutAdmin = ({ roles }: { roles: string[] }) => {
  const { push } = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Inicializa os valores do formulário
  const initialValues: IUsuario = {
    id: '',
    nome: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    email: '',
    celular: '',
    siape: '',
    curso: '',
    nomeSocial: '',
    instituicao: '',
    tipoUsuario: '',
  };

  const validateSchema = Yup.object().shape({
    nome: Yup.string().min(5, "O nome deve ter no mínimo 5 caracteres").required("Obrigatório"),
    email: Yup.string().email("Email inválido").required("Obrigatório"),
    cpf: Yup.string().required("Obrigatório"),
    senha: Yup.string().required("Obrigatório"),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref("senha")], "As senhas devem corresponder")
      .required("Obrigatório"),
    tipoUsuario: Yup.string().required("Selecione um tipo de usuário"),
  });

  const userRoutes = {
    Admin: "/usuario/registrar",
    Coordenador: "/usuario/registrar",
    Professor: "/usuario/registrar",
    Servidor: "/usuario/registrar",
    Aluno: "/usuario/registrar",
  };

  const { mutate } = useMutation(
    async (values: IUsuario) => {
      const profilePhoto = values.profilePhoto as File;
      const updatedValues = { ...values };
      delete updatedValues.profilePhoto;

      const route = userRoutes[values.tipoUsuario as keyof typeof userRoutes];
      return postUsuario(updatedValues, profilePhoto, route);
    },
    {
      onSuccess: () => {
        push(APP_ROUTES.private.usuarios.name);
      },
      onError: (error) => {
        console.log("Erro ao cadastrar usuário", error);
      },
    }
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("profilePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className={style.header}>
        <div className={style.header__title}>
          <h1>Cadastrar Usuario</h1>
          <div className={style.header__title_line}></div>
        </div>

      </div>
      <div id="header" className={style.container}>
        <div className={style.container__ContainerForm}>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, { setSubmitting }) => {
              mutate(values);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form className={style.container__ContainerForm_form}>

                <div className={style.container__photo}>
                  <div className={style.profilePhotoWrapper}>
                    <input
                      type="file"
                      id="profilePhoto"
                      name="profilePhoto"
                      accept="image/jpeg"
                      onChange={(event) => handleImageChange(event, formik.setFieldValue)}
                    />
                    <label htmlFor="profilePhoto" className={style.profilePhotoLabel}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile Preview" className={style.profileImage} />
                      ) : (
                        <img src="/assets/icons/perfil.svg" alt="Upload Icon" />
                      )}
                    </label>
                    <span
                      className={style.editIcon}
                      onClick={() => {
                        const fileInput = document.getElementById('profilePhoto');
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    >
                      <img src="/assets/icons/editar.svg" alt="Edit Icon" />
                    </span>
                  </div>

                  {/*formik.touched.profilePhoto && formik.errors.profilePhoto && (
                <span className={style.form__error}>{formik.errors.profilePhoto}</span>
              )*/}
                  <h1>Informações do Usuario</h1>
                </div>

                <DadosPessoais formik={formik} roles={roles} />

                <div className={style.container__ContainerForm_buttons}>
                  <button
                    className={style.container__ContainerForm_buttons_link}
                    type="button"
                    onClick={() => push(APP_ROUTES.private.usuarios.name)}
                  >
                    <h1>Voltar</h1>
                  </button>
                  <button
                    type="submit"
                    className={style.container__ContainerForm_buttons_linkWhite}
                  >
                    <h1>Criar</h1>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};


const LayoutPublic = () => {

  const { push } = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const initialValues: IUsuario = {
    id: '',
    nome: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    email: '',
    celular: '',
    siape: '',
    curso: '',
    nomeSocial: '',
    instituicao: '',
    tipoUsuario: 'default',
    profilePhoto: undefined,
  };

  const validateSchema = Yup.object().shape({

  });
  const userRoutes = {
    default: "/usuario/registrar",
    Coordenador: "/usuario/registrar",
    Professor: "/usuario/registrar",
    Servidor: "/usuario/registrar",
    Aluno: "/usuario/registrar",
  };
  const { mutate } = useMutation(
    async (values: IUsuario) => {

      const profilePhoto = values.profilePhoto as File;
      const updatedValues = { ...values };
      delete updatedValues.profilePhoto;

      const route = userRoutes[values.tipoUsuario as keyof typeof userRoutes];
      return postUsuario(values, profilePhoto, route);
    },
    {
      onSuccess: () => {
        push(APP_ROUTES.private.usuarios.name);
      },
      onError: (error) => {
        console.log("Erro ao criar nova conta.", error);
      },
    }
  );


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
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
    <>
      <div className={style.header}>
        <div className={style.header__title}>
          <h1>Criar Conta</h1>
          <div className={style.header__title_line}></div>
        </div>

      </div>
      <div id="header" className={style.container}>
        <div className={style.container__ContainerForm}>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, { setSubmitting }) => {
              mutate(values);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form className={style.container__ContainerForm_form}>

                <div className={style.container__photo}>
                  <div className={style.profilePhotoWrapper}>
                    <input
                      type="file"
                      id="profilePhoto"
                      name="profilePhoto"
                      accept="image/jpeg"
                      onChange={(event) => handleImageChange(event, formik.setFieldValue)}
                    />
                    <label htmlFor="profilePhoto" className={style.profilePhotoLabel}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile Preview" className={style.profileImage} />
                      ) : (
                        <img src="/assets/icons/perfil.svg" alt="Upload Icon" />
                      )}
                    </label>
                    <span
                      className={style.editIcon}
                      onClick={() => {
                        const fileInput = document.getElementById('profilePhoto');
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    >
                      <img src="/assets/icons/editar.svg" alt="Edit Icon" />
                    </span>
                  </div>

                  {/*formik.touched.profilePhoto && formik.errors.profilePhoto && (
                  <span className={style.form__error}>{formik.errors.profilePhoto}</span>
                )*/}
                  <h1>Informações do Usuario</h1>
                </div>

                <DadosPessoais formik={formik} roles={[]} />

                <div className={style.container__ContainerForm_buttons}>
                  <button
                    className={style.container__ContainerForm_buttons_link}
                    type="button"
                    onClick={() => push(APP_ROUTES.public.login)}
                  >
                    <h1>Voltar</h1>
                  </button>
                  <button
                    type="submit"
                    className={style.container__ContainerForm_buttons_linkWhite}
                  >
                    <h1>Criar</h1>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

