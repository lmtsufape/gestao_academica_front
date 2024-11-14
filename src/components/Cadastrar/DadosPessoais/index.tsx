"use client";
import style from "./dados.module.scss";

interface DadosSecretariaProps {
  formik: any;
  roles: string[]; // Define 'roles' como um array de strings
  editar: boolean; // Controle de edição dos campos
  isSolicitacaoPerfil?: boolean;

}

const DadosPessoais: React.FC<DadosSecretariaProps> = ({ formik, roles, editar, isSolicitacaoPerfil }) => {
  return (
    <>
      {/* Dropdown para selecionar o tipo de usuário, visível apenas para visitantes */}
      {roles.includes("visitante") ? (
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
              disabled={!editar} // Controla edição com a prop `editar`
            >
              <option value="default" label="Selecione o tipo de usuário" />
              <option value="Professor" label="Professor" />
              <option value="Tecnico" label="Técnico" />
              <option value="Aluno" label="Aluno" />
            </select>
            {formik.touched.tipoUsuario && formik.errors.tipoUsuario && (
              <span className={style.form__error}>{formik.errors.tipoUsuario}</span>
            )}
          </div>
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
              required
              disabled={!editar} // Controla edição com a prop `editar`
            />
            {formik.touched.nome && formik.errors.nome && (
              <span className={style.form__error}>{formik.errors.nome}</span>
            )}
          </div>
        </div>
      ) : (
        <div className={style.container__ContainerForm_form}>
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
              required
              disabled={!editar} // Controla edição com a prop `editar`
            />
            {formik.touched.nome && formik.errors.nome && (
              <span className={style.form__error}>{formik.errors.nome}</span>
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
            disabled={!editar}
          />
          {formik.touched.email && formik.errors.email && (
            <span className={style.form__error}>{formik.errors.email}</span>
          )}
        </div>
        {!isSolicitacaoPerfil ? (
          <>
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
                disabled={!editar}
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
                disabled={!editar}
              />
              {formik.touched.confirmarSenha && formik.errors.confirmarSenha && (
                <span className={style.form__error}>{formik.errors.confirmarSenha}</span>
              )}
            </div>
          </>
        ) : ""}
        <div>
          <label htmlFor="nomeSocial">Nome Social</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="nomeSocial"
            name="nomeSocial"
            placeholder="Digite o nome social"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nomeSocial}
            disabled={!editar}
          />
          {formik.touched.nomeSocial && formik.errors.nomeSocial && (
            <span className={style.form__error}>{formik.errors.nomeSocial}</span>
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
            disabled={!editar}
          />
          {formik.touched.cpf && formik.errors.cpf && (
            <span className={style.form__error}>{formik.errors.cpf}</span>
          )}
        </div>
        {formik.values.tipoUsuario === "default" ? (
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
              required
              disabled={!editar}
            />
            {formik.touched.telefone && formik.errors.telefone && (
              <span className={style.form__error}>{formik.errors.telefone}</span>
            )}
          </div>
        ) : ""}

      </div>

      {/* Campos específicos para cada tipo de usuário */}
      {formik.values.tipoUsuario === "Professor" && (
        <div className={style.container__ContainerForm_form_threeContainer}>
          {isSolicitacaoPerfil ? (
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
                required
                disabled={!editar}
              />
              {formik.touched.telefone && formik.errors.telefone && (
                <span className={style.form__error}>{formik.errors.telefone}</span>
              )}
            </div>
          ) : null}
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
          {isSolicitacaoPerfil ? (
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
                required
                disabled={!editar}
              />
              {formik.touched.telefone && formik.errors.telefone && (
                <span className={style.form__error}>{formik.errors.telefone}</span>
              )}
            </div>
          ) : ""}
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
          {isSolicitacaoPerfil ? (
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
                required
                disabled={!editar}
              />
              {formik.touched.telefone && formik.errors.telefone && (
                <span className={style.form__error}>{formik.errors.telefone}</span>
              )}
            </div>
          ) : null}
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
              disabled={!editar}
            />
          </div>
          <div>
            <label htmlFor="matricula">Matricula</label>
            <input
              className={style.container__ContainerForm_form_input}
              id="matricula"
              name="matricula"
              placeholder="Digite sua matricula"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.matricula}
              required
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
      <div className={style.container__ContainerForm_form}>

        {isSolicitacaoPerfil ? (
          <>
            <div>
              <label htmlFor="documentos">Documentos</label>
              <input
                type="file"
                id="documentos"
                name="documentos"
                multiple // Permite upload de múltiplos arquivos
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (files) {
                    // Converte FileList para array e seta no Formik
                    formik.setFieldValue("documentos", Array.from(files));
                  }
                }}
                className={style.container__ContainerForm_form_input}
                disabled={!editar}
              />
              {formik.touched.documentos && formik.errors.documentos && (
                <span className={style.form__error}>{formik.errors.documentos}</span>
              )}
            </div>
          </>
        ) : ""}
      </div>
    </>
  );
};

export default DadosPessoais;
