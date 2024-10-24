"use client";

import style from "./dados-pessoais.module.scss";

interface DadosSecretariaProps {
  formik: any;
  editar: boolean;
  roles: string[]; // Array de roles para controle de perfil
  hrefAnterior: string;

}

const DadosPessoais: React.FC<DadosSecretariaProps> = ({ formik, editar, roles }) => {
  return (
    <>


      {/* Campos comuns a todos os tipos de usuários */}
      <div className={style.container__ContainerForm_form_threeContainer}>
        <div>
          <label htmlFor="nome">Nome Completo</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="nome"
            name="nome"
            placeholder="Digite o nome completo"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nome}
            disabled={!editar}
          />
          {formik.touched.nome && formik.errors.nome && (
            <span className={style.form__error}>{formik.errors.nome}</span>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="email"
            name="email"
            placeholder="Digite o email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            disabled={!editar}
          />
          {formik.touched.email && formik.errors.email && (
            <span className={style.form__error}>{formik.errors.email}</span>
          )}
        </div>

        <div>
          <label htmlFor="cpf">CPF</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="cpf"
            name="cpf"
            placeholder="Digite o CPF"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cpf}
            disabled={!editar}
          />
          {formik.touched.cpf && formik.errors.cpf && (
            <span className={style.form__error}>{formik.errors.cpf}</span>
          )}
        </div>

        <div>
          <label htmlFor="telefone">Telefone</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="telefone"
            name="telefone"
            placeholder="Digite o telefone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.telefone}
            disabled={!editar}
          />
          {formik.touched.telefone && formik.errors.telefone && (
            <span className={style.form__error}>{formik.errors.telefone}</span>
          )}
        </div>
      </div>

      {/* Campos específicos para cada tipo de usuário */}
      {formik.values.tipoUsuario === "Professor" && (
        <div className={style.container__ContainerForm_form_threeContainer}>
          <div>
            <label htmlFor="siape">SIAPE</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="siape"
              name="siape"
              placeholder="Digite o SIAPE"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.siape}
              disabled={!editar}
            />
          </div>
          <div>
            <label htmlFor="curso">Curso</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="curso"
              name="curso"
              placeholder="Digite o curso"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.curso}
              disabled={!editar}
            />
          </div>
          <div>
            <label htmlFor="instituicao">Instituição</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="instituicao"
              name="instituicao"
              placeholder="Digite a instituição"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.instituicao}
              disabled={!editar}
            />
          </div>
        </div>
      )}

      {formik.values.tipoUsuario === "Tecnico" && (
        <div className={style.container__ContainerForm_form_threeContainer}>
          <div>
            <label htmlFor="siape">SIAPE</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="siape"
              name="siape"
              placeholder="Digite o SIAPE"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.siape}
              disabled={!editar}
            />
          </div>
          <div>
            <label htmlFor="instituicao">Instituição</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="instituicao"
              name="instituicao"
              placeholder="Digite a instituição"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.instituicao}
              disabled={!editar}
            />
          </div>
        </div>
      )}

      {formik.values.tipoUsuario === "Aluno" && (
        <div className={style.container__ContainerForm_form_threeContainer}>
          <div>
            <label htmlFor="curso">Curso</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="curso"
              name="curso"
              placeholder="Digite o curso"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.curso}
              disabled={!editar}
            />
          </div>
          <div>
            <label htmlFor="instituicao">Instituição</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="instituicao"
              name="instituicao"
              placeholder="Digite a instituição"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.instituicao}
              disabled={!editar}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DadosPessoais;
