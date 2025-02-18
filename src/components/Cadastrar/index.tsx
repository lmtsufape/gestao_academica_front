"use client";

import { useMutation } from "react-query";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import style from "./cadastrar-usuario.module.scss";
import DadosPessoais from "./DadosPessoais";
import { APP_ROUTES } from "@/constants/app-routes";
import { IUsuario } from "@/interfaces/IUsuario";
import { postUsuario } from "@/api/usuarios/postUsuario";
import { getStorageItem } from "@/utils/localStore";
import { useSelector } from "react-redux";
import { postSolicitacoes } from "@/api/solicitacoes/postSolicitacoes";
import { ICurso } from "@/interfaces/ICurso";
import DadosCurso from "./DadosCurso";
import { postCurso } from "@/api/cursos/postCurso";
import { IUnidade } from "@/interfaces/IUnidade";
import { postUnidade } from "@/api/unidades/postUnidade";
import DadosUnidade from "./DadosUnidade";
import { toast } from "react-toastify";

interface CadastrarProps {
  hrefAnterior: string;
  backDetalhamento: () => void;
  usuario?: IUsuario | any;
  curso?: ICurso | any;
  unidade?: IUnidade | any;
  diretorioAnterior: string;
  diretorioAtual: string;
  titulo: string;
  firstbutton: string;
  lastbutton: string;
  routefirstbutton: any;
  routelastbutton: any;
}
interface LayoutSolicitacoesProps {
  usuario: IUsuario | any;
  roles: string[];
}


const Cadastrar: React.FC<CadastrarProps> = ({
  usuario,
  backDetalhamento,
  titulo,
  hrefAnterior,
  diretorioAnterior,
  diretorioAtual,
  firstbutton,
  lastbutton,
  routefirstbutton,
  routelastbutton,
}) => {
  // Define `roles` como um array de strings
  const [roles, setRoles] = useState<string[]>(getStorageItem("userRoles") || []);
  const userLogin = useSelector((state: any) => state.userLogin);
  function whatIsTypeUser() {
    if (titulo === "Solicitar Perfil de Acesso" && roles.includes("visitante")) {
      return <LayoutSolicitacoes usuario={usuario} roles={roles} />;
    } else if (titulo === "Cadastrar Curso" && roles.includes("administrador")) {
      return <LayoutCurso roles={roles} />;
    } else if (titulo === "Cadastrar Unidade Administrativa" && roles.includes("administrador")) {
      return <LayoutUnidade roles={roles} />;
    } else if (roles.includes("administrador")) {
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
export default Cadastrar;

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
    matricula: '',
    email: '',
    telefone: '',
    siape: '',
    cursoId: '',
    cursoIds: [],
    nomeSocial: '',
    instituicao: '',
    tipoUsuario: '',
    documentos: [],

  };

  const validateSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    senha: Yup.string().required("Senha é obrigatória"),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref("senha")], "As senhas precisam coincidir")
      .required("Confirmação de senha é obrigatória"),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Número (CPF) inválido")
      .required("CPF é obrigatório"),
    telefone: Yup.string()
      .matches(
        /^\(\d{2}\) \d{5}-\d{4}$/, "Formato: (XX) XXXXX-XXXX"
      )
      .required("Telefone é obrigatório"),
  });

  const userRoutes = {
    Admin: "/usuario/registrar",
    Coordenador: "/usuario/registrar",
    Professor: "/usuario/registrar",
    Tecnico: "/usuario/registrar",
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
        toast.success("Usuário cadastrado com sucesso!");
        push(APP_ROUTES.private.usuarios.name);
      },
      onError: (error) => {
        toast.error("Erro ao cadastrar usuário!");
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

                <DadosPessoais formik={formik} roles={roles} editar={true} />

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

const LayoutCurso = ({ roles }: { roles: string[] }) => {
  const { push } = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Inicializa os valores do formulário
  const initialValues: ICurso = {
    id: '',
    nome: '',
    ativo: true,
  };

  const validateSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    senha: Yup.string().required("Senha é obrigatória"),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref("senha")], "As senhas precisam coincidir")
      .required("Confirmação de senha é obrigatória"),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Número (CPF) inválido")
      .required("CPF é obrigatório"),
    telefone: Yup.string()
      .matches(
        /^\(\d{2}\) \d{5}-\d{4}$/, "Formato: (XX) XXXXX-XXXX"
      )
      .required("Telefone é obrigatório"),
  });

  const userRoutes = {
    Admin: "/usuario/registrar",
    Coordenador: "/usuario/registrar",
    Professor: "/usuario/registrar",
    Tecnico: "/usuario/registrar",
    Aluno: "/usuario/registrar",
  };


  const cadastrarCurso = useMutation(
    async (values: ICurso) => {
      return postCurso(values.nome);
    }, {
    onSuccess: () => {
      toast.success("Curso cadastrado com sucesso!");
      push(APP_ROUTES.private.cursos.name);
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar curso!");
      console.log("Erro ao aprovar a solicitação:", error);
    },
  }
  );

  return (
    <>
      <div className={style.header}>
        <div className={style.header__title}>
          <h1>Cadastrar Curso</h1>
          <div className={style.header__title_line}></div>
        </div>

      </div>
      <div id="header" className={style.container}>
        <div className={style.container__ContainerForm}>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, { setSubmitting }) => {
              cadastrarCurso.mutate(values);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form className={style.container__ContainerForm_form}>

                <div className={style.container__photo}>
                  <h1>Informações do Curso</h1>
                </div>

                <DadosCurso formik={formik} editar={true} />

                <div className={style.container__ContainerForm_buttons}>
                  <button
                    className={style.container__ContainerForm_buttons_link}
                    type="button"
                    onClick={() => push(APP_ROUTES.private.usuarios.name)}
                  >
                    <h1>Voltar</h1>
                  </button>
                  <button
                    className={style.container__ContainerForm_buttons_linkWhite}
                    type="button"
                    onClick={() => {
                      cadastrarCurso.mutate(formik.values as ICurso);
                    }}
                  >
                    <h1>Cadastrar</h1>
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
const LayoutUnidade = ({ roles }: { roles: string[] }) => {
  const { push } = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Inicializa os valores do formulário
  const initialValues: IUnidade = {
    id: '',
    nome: '',
    codigo: '',
  };

  const validateSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    senha: Yup.string().required("Senha é obrigatória"),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref("senha")], "As senhas precisam coincidir")
      .required("Confirmação de senha é obrigatória"),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Número (CPF) inválido")
      .required("CPF é obrigatório"),
    telefone: Yup.string()
      .matches(
        /^\(\d{2}\) \d{5}-\d{4}$/, "Formato: (XX) XXXXX-XXXX"
      )
      .required("Telefone é obrigatório"),
  });



  const cadastrarUnidade = useMutation(
    async (values: IUnidade) => {
      return postUnidade(values);
    }, {
    onSuccess: () => {
      toast.success("Unidade cadastrada com sucesso!");
      push(APP_ROUTES.private.unidades.name);
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar unidade. Verifique os dados!");
      console.log("Erro ao aprovar a solicitação:", error);
    },
  }
  );

  return (
    <>
      <div className={style.header}>
        <div className={style.header__title}>
          <h1>Cadastrar Unidade Administrativa</h1>
          <div className={style.header__title_line}></div>
        </div>

      </div>
      <div id="header" className={style.container}>
        <div className={style.container__ContainerForm}>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, { setSubmitting }) => {
              cadastrarUnidade.mutate(values);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form className={style.container__ContainerForm_form}>

                <div className={style.container__photo}>
                  <h1>Informações da Unidade</h1>
                </div>

                <DadosUnidade formik={formik} editar={true} />

                <div className={style.container__ContainerForm_buttons}>
                  <button
                    className={style.container__ContainerForm_buttons_link}
                    type="button"
                    onClick={() => push(APP_ROUTES.private.unidades.name)}
                  >
                    <h1>Voltar</h1>
                  </button>
                  <button
                    className={style.container__ContainerForm_buttons_linkWhite}
                    type="button"
                    onClick={() => {
                      cadastrarUnidade.mutate(formik.values as IUnidade);
                    }}
                  >
                    <h1>Cadastrar</h1>
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
    matricula: '',
    email: '',
    telefone: '',
    siape: '',
    cursoId: '',
    cursoIds: [],
    nomeSocial: '',
    instituicao: '',
    tipoUsuario: 'default',
    profilePhoto: undefined,
    documentos: [],

  };

  const validateSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    senha: Yup.string().required("Senha é obrigatória"),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref("senha")], "As senhas precisam coincidir")
      .required("Confirmação de senha é obrigatória"),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Número do (CPF) inválido")
      .required("CPF é obrigatório"),
    telefone: Yup.string()
      .matches(
        /^\(\d{2}\) \d{5}-\d{4}$/, "Formato: (XX) XXXXX-XXXX"
      )
      .required("Telefone é obrigatório"),
  });



  const userRoutes = {
    default: "usuario/registrar",
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
        toast.success("Conta criada com sucesso!");
        push(APP_ROUTES.public.login);
      },
      onError: (error) => {
        toast.error("Erro ao criar nova conta. Verifique os dados!");
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
                <DadosPessoais formik={formik} roles={[]} editar={true} />

                <div className={style.container__ContainerForm_buttons}>
                  <button
                    className={style.container__ContainerForm_buttons_link}
                    type="button"
                    onClick={() => push(APP_ROUTES.public.login)}
                  >
                    <h1>Voltar</h1>
                  </button>
                  <button
                    type="button"
                    onClick={() => mutate(formik.values)}
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

const LayoutSolicitacoes: React.FC<LayoutSolicitacoesProps> = ({ usuario, roles }) => {
  const { push } = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<IUsuario>({
    id: "",
    nome: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
    matricula: '',
    email: "",
    telefone: "",
    siape: "",
    cursoId: "",
    cursoIds: [], // Inicializa como array vazio
    nomeSocial: "",
    instituicao: "",
    tipoUsuario: "default",
    profilePhoto: undefined,
    documentos: [],
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        id: usuario.id || "",
        nome: usuario.nome || "",
        cpf: usuario.cpf || "",
        senha: "", // Resetar senha para segurança
        confirmarSenha: "",
        matricula: usuario.matricula || "",
        email: usuario.email || "",
        telefone: usuario.telefone || "",
        siape: usuario.siape || "",
        cursoId: usuario.cursoId || "",
        cursoIds: usuario.cursoIds || [], // Garantir array vazio se não houver `cursoIds`
        nomeSocial: usuario.nomeSocial || "",
        instituicao: usuario.instituicao || "",
        tipoUsuario: usuario.tipoUsuario || "default",
        profilePhoto: undefined,
        documentos: [],

      });
    }
  }, [usuario]);

  const validateSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    senha: Yup.string()
      .when("isSolicitacaoPerfil", {
        is: false, // Define a condição
        then: (schema) => schema.required("Senha é obrigatória"),
        otherwise: (schema) => schema.optional(),
      }),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref("senha")], "As senhas precisam coincidir")
      .when("isSolicitacaoPerfil", {
        is: false,
        then: (schema) => schema.required("Confirmação de senha é obrigatória"),
        otherwise: (schema) => schema.optional(),
      }),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Número de CPF inválido")
      .required("CPF é obrigatório"),
    telefone: Yup.string()
      .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato: (XX) XXXXX-XXXX")
      .required("Telefone é obrigatório"),
  });


  const userRoutes = {
    Professor: "professor",
    Tecnico: "tecnico",
    Aluno: "aluno",
  };

  const { mutate } = useMutation(
    async (values: IUsuario) => {
      const route = userRoutes[values.tipoUsuario as keyof typeof userRoutes];
      return postSolicitacoes(route, values);
    },
    {
      onSuccess: () => {
        toast.success("Solicitação enviada com sucesso!");
        push(APP_ROUTES.private.home.name);
      },
      onError: (error) => {
        toast.error("Erro ao solicitar perfil. verificar os dados!");
        console.log("Erro ao solicitar perfil.", error);
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
          <h1>Solicitar Perfil</h1>
          <div className={style.header__title_line}></div>
        </div>
      </div>

      <div id="header" className={style.container}>
        <div className={style.container__ContainerForm}>
          <Formik
            initialValues={formData}
            enableReinitialize
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
                        const fileInput = document.getElementById("profilePhoto");
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    >
                      <img src="/assets/icons/editar.svg" alt="Edit Icon" />
                    </span>
                  </div>
                  <h1>Informações do Usuário</h1>
                </div>

                <DadosPessoais formik={formik} roles={roles} editar={true} isSolicitacaoPerfil={true} />

                <div className={style.container__ContainerForm_buttons}>
                  <button
                    className={style.container__ContainerForm_buttons_link}
                    type="button"
                    onClick={() => push(APP_ROUTES.private.home.name)}
                  >
                    <h1>Voltar</h1>
                  </button>
                  <button type="submit" className={style.container__ContainerForm_buttons_linkWhite}>
                    <h1>Solicitar</h1>
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
