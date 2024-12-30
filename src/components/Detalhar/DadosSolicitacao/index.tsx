"use client";

import style from "./dados-solicitacao.module.scss";

interface DadosSolicitacaoProps {
  formik: any;
  editar: boolean;
  roles: string[]; // Array de roles para controle de perfil
  hrefAnterior: string;

}

const DadosSolicitacao: React.FC<DadosSolicitacaoProps> = ({ formik, editar, roles }) => {
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
            value={formik.values.solicitante.nome}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.solicitante.email}
            disabled={!editar}
          />
        </div>

        <div>
          <label htmlFor="cpf">CPF</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="cpf"
            name="cpf"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.solicitante.cpf}
            disabled={!editar}
          />
        </div>

        <div>
          <label htmlFor="telefone">Telefone</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="telefone"
            name="telefone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.solicitante.telefone}
            disabled={!editar}
          />
        </div>

        {formik.values.perfil.tipo === "PROFESSOR" && (
          <>
            <div>
              <label htmlFor="siape">SIAPE</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="siape"
                name="siape"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.solicitante.siape}
                disabled={!editar}
              />
            </div>
            <div>
              <label htmlFor="curso">Curso</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="curso"
                name="curso"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.solicitante.curso}
                disabled={!editar}
              />
            </div>
            <div>
              <label htmlFor="instituicao">Instituição</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="instituicao"
                name="instituicao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.solicitante.instituicao}
                disabled={!editar}
              />
            </div>
          </>
        )}

        {formik.values.perfil.tipo === "TECNICO" && (
          <>
            <div>
              <label htmlFor="siape">SIAPE</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="siape"
                name="siape"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.solicitante.siape}
                disabled={!editar}
              />
            </div>
            <div>
              <label htmlFor="instituicao">Instituição</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="instituicao"
                name="instituicao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.solicitante.instituicao}
                disabled={!editar}
              />
            </div>
          </>
        )}

        {formik.values.perfil.tipo === "ALUNO" && (
          <>
            <div>
              <label htmlFor="curso">Curso</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="curso"
                name="curso"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.perfil.curso.nome}
                disabled={!editar}
              />
            </div>
            <div>
              <label htmlFor="instituicao">Instituição</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="instituicao"
                name="instituicao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.solicitante.instituicao}
                disabled={!editar}
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="solicitacao">Data da Solicitacao</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="solicitacao"
            name="solicitacao"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dataSolicitacao}
            disabled={!editar}
          />

        </div>

        <div>
          <label htmlFor="status">Status</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="status"
            name="status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.status}
            disabled={!editar}
          />
        </div>

      </div>

      {/* Campos específicos para cada tipo de usuário */}
      <div className={style.container__ContainerForm_form}>
        <div className={style.inputWrapper}>
          <label htmlFor="parecer">Parecer</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="parecer"
            name="parecer"
            placeholder="Digite o parecer"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.parecer}
            required
          />
          {formik.touched.parecer && formik.errors.parecer && (
            <span className={style.form__error}>{formik.errors.parecer}</span>
          )}
        </div>

      </div>
    </>
  );
};

export default DadosSolicitacao;
