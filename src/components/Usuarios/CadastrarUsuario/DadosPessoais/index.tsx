"use client";
import style from "./dados.module.scss";

interface DadosSecretariaProps {
  formik: any;
  roles: string[]; // Define 'roles' como um array de strings
}

const DadosPessoais: React.FC<DadosSecretariaProps> = ({ formik, roles }) => {
  return (
    <>
      {/* Dropdown para selecionar o tipo de usuário, visível apenas para administradores */}
      {roles.includes("administrador") ? (
        <div className={style.container__ContainerForm_form_halfContainer}>
          <div>
            <label htmlFor="tipoUsuario">Tipo de Usuário</label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              value={formik.values.tipoUsuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={style.container__ContainerForm_form_input}
            >
              <option value="" label="Selecione o tipo de usuário" />
              <option value="Admin" label="Administrador" />
              <option value="Coordenador" label="Coordenador" />
              <option value="Professor" label="Professor" />
              <option value="Tecnico" label="Técnico" />
              <option value="Aluno" label="Aluno" />
              <option value="Externo" label="Externo" />
            </select>
            {formik.touched.tipoUsuario && formik.errors.tipoUsuario && (
              <span className={style.form__error}>{formik.errors.tipoUsuario}</span>
            )}
          </div>
          <div>
          <label htmlFor="name">Nome Completo</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="name"
            name="name"
            placeholder="Digite o nome completo"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <span className={style.form__error}>{formik.errors.name}</span>
          )}
        </div>
        </div>
      ):(
        <div className={style.container__ContainerForm_form}>
        <div>
          <label htmlFor="name">Nome Completo</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="name"
            name="name"
            placeholder="Digite o nome completo"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <span className={style.form__error}>{formik.errors.name}</span>
          )}
        </div>
      </div>
      )}

      {/* Campos comuns a todos os tipos de usuários */}
      <div className={style.container__ContainerForm_form_threeContainer}>
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
            required
          />
          {formik.touched.email && formik.errors.email && (
            <span className={style.form__error}>{formik.errors.email}</span>
          )}
        </div>

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="senha"
            name="senha"
            type="password"
            placeholder="Digite a senha"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.senha}
            required
          />
          {formik.touched.senha && formik.errors.senha && (
            <span className={style.form__error}>{formik.errors.senha}</span>
          )}
        </div>

        <div>
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            placeholder="Confirme a senha"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmarSenha}
            required
          />
          {formik.touched.confirmarSenha && formik.errors.confirmarSenha && (
            <span className={style.form__error}>{formik.errors.confirmarSenha}</span>
          )}
        </div>

        <div>
          <label htmlFor="nameSocial">Nome Social</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="nameSocial"
            name="nameSocial"
            placeholder="Digite o nome social"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nameSocial}
          />
          {formik.touched.nameSocial && formik.errors.nameSocial && (
            <span className={style.form__error}>{formik.errors.nameSocial}</span>
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
            required
          />
          {formik.touched.cpf && formik.errors.cpf && (
            <span className={style.form__error}>{formik.errors.cpf}</span>
          )}
        </div>

        <div>
          <label htmlFor="contact">Telefone</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="contact"
            name="contact"
            placeholder="Digite o telefone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contact}
            required
          />
          {formik.touched.contact && formik.errors.contact && (
            <span className={style.form__error}>{formik.errors.contact}</span>
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
              required
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
              required
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
              required
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
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DadosPessoais;
