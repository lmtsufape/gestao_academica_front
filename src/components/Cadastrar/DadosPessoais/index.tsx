"use client";
import { ICurso } from "@/interfaces/ICurso";
import style from "./dados.module.scss";
import { useEffect, useState } from "react";
import { getAllCursos } from "@/api/cursos/getAllCursos";
import { useMutation } from "react-query";
import Select, { SingleValue } from 'react-select';

interface DadosSecretariaProps {
  formik: any;
  roles: string[]; // Define 'roles' como um array de strings
  editar: boolean; // Controle de edição dos campos
  isSolicitacaoPerfil?: boolean;
}
interface OptionType {
  value: string;
  label: string;
}

const DadosPessoais: React.FC<DadosSecretariaProps> = ({ formik, roles, editar, isSolicitacaoPerfil }) => {

  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    mutate();
  }, []);

  const { mutate } = useMutation(() => getAllCursos(), {
    onSuccess: (res) => {
      // Ajuste conforme a estrutura da sua resposta
      setCursos(res.data);
      // setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error("Erro ao recuperar os usuários:", error);
    },
  });



  // Prepare options for react-select
  const cursoOptions = cursos.map((curso) => ({
    value: curso.id,
    label: curso.nome,
  }));

  const selectedOptions = cursoOptions.filter(option => formik.values.cursoIds.includes(option.value));

  const handleOneSelect = (selectedOption: SingleValue<OptionType>) => {
    formik.setFieldValue('cursoId', selectedOption ? selectedOption.value : null);
  };
  // Handle selection changes
  const handleSelectChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option: { value: any; }) => option.value) : [];
    formik.setFieldValue('cursoIds', selectedIds);
  };


  return (
    <>
      {/* Dropdown para selecionar o tipo de usuário, visível apenas para visitantes */}
      {roles.includes("visitante") ? (
        <div className={style.container__ContainerForm_form_halfContainer}>
          <div className={style.formGroup}>
            <label htmlFor="tipoUsuario">Tipo de Usuário</label>
            <div className={style.inputWrapper}>
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
                <span className={style.form__errorTooltip}>{formik.errors.tipoUsuario}</span>
              )}
            </div>
          </div>
          <div className={style.formGroup}>
            <label htmlFor="nome">Nome Completo</label>
            <div className={style.inputWrapper}>
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
                <span className={style.form__errorTooltip}>{formik.errors.nome}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={style.container__ContainerForm_form}>
          <div className={style.formGroup}>
            <label htmlFor="nome">Nome Completo</label>
            <div className={style.inputWrapper}>
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
                <span className={style.form__errorTooltip}>{formik.errors.nome}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Campos comuns a todos os tipos de usuários */}
      <div className={style.container__ContainerForm_form_threeContainer}>
        <div className={style.formGroup}>
          <label htmlFor="email">Email</label>
          <div className={style.inputWrapper}>
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
              <span className={style.form__errorTooltip}>{formik.errors.email}</span>
            )}
          </div>
        </div>

        {!isSolicitacaoPerfil ? (
          <>
            <div className={style.formGroup}>
              <label htmlFor="senha">Senha</label>
              <div className={style.inputWrapper}>
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
                  <span className={style.form__errorTooltip}>{formik.errors.senha}</span>
                )}
              </div>
            </div>

            <div className={style.formGroup}>
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <div className={style.inputWrapper}>
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
                  <span className={style.form__errorTooltip}>{formik.errors.confirmarSenha}</span>
                )}
              </div>
            </div>
          </>
        ) : ""}

        <div className={style.formGroup}>
          <label htmlFor="nomeSocial">Nome Social</label>
          <div className={style.inputWrapper}>
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
              <span className={style.form__errorTooltip}>{formik.errors.nomeSocial}</span>
            )}
          </div>
        </div>

        <div className={style.formGroup}>
          <label htmlFor="cpf">CPF</label>
          <div className={style.inputWrapper}>
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
              <span className={style.form__errorTooltip}>{formik.errors.cpf}</span>
            )}
          </div>
        </div>

        {formik.values.tipoUsuario === "default" ? (
          <div className={style.formGroup}>
            <label htmlFor="telefone">Telefone</label>
            <div className={style.inputWrapper}>
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
                <span className={style.form__errorTooltip}>{formik.errors.telefone}</span>
              )}
            </div>
          </div>
        ) : ""}
      </div>

      {/* Campos específicos para cada tipo de usuário */}
      {formik.values.tipoUsuario === "Professor" && (
        <div className={style.container__ContainerForm_form_threeContainer}>
          {isSolicitacaoPerfil ? (
            <div className={style.formGroup}>
              <label htmlFor="telefone">Telefone</label>
              <div className={style.inputWrapper}>
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
                  <span className={style.form__errorTooltip}>{formik.errors.telefone}</span>
                )}
              </div>
            </div>
          ) : null}
          <div className={style.formGroup}>
            <label htmlFor="siape">SIAPE</label>
            <div className={style.inputWrapper}>
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
          </div>

          <div className={style.formGroup}>
            <label htmlFor="instituicao">Instituição</label>
            <div className={style.inputWrapper}>
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
          <div className={style.formGroup}>
            <label htmlFor="cursoIds">Cursos</label>
            <div className={style.inputWrapper}>
              <Select<OptionType, true>
                id="cursoIds"
                name="cursoIds"
                isMulti
                options={cursoOptions}
                value={selectedOptions}
                onChange={handleSelectChange}
                onBlur={() => formik.setFieldTouched('cursoIds', true)}
                isDisabled={!editar}
                placeholder="Selecione os cursos..."
                className={style.reactSelect}
                classNamePrefix="select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    margin: '0.5em 0 1em 0',
                    border: state.isFocused ? '1px solid rgba(0, 0, 0, 0.70)' : '1px solid rgba(0, 0, 0, 0.50)',
                    boxShadow: state.isFocused ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none',
                    '&:hover': {
                      border: '1px solid rgba(0, 0, 0, 0.70)',
                    },
                  }),
                  indicatorSeparator: () => ({ 
                    display: 'none',
                  }),
                  dropdownIndicator: (base) => ({ 
                    ...base,
                    color: 'black',
                    '&:hover': {
                      color: 'black', 
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? 'rgba(109,109 ,109, 0.2)' : 'transparent',
                    color: 'rgba(var(--black))',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: 'rgba(var(--input-form), 0.8)',
                    },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'rgba(var(--black))',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgba(var(--grey), 0.5)',
                  }),
                }}
              />
              {formik.touched.cursoIds && formik.errors.cursoIds ? (
                <div className={style.error}>{formik.errors.cursoIds}</div>
              ) : null}
            </div>
          </div>


        </div>
      )}

      {formik.values.tipoUsuario === "Tecnico" && (
        <div className={style.container__ContainerForm_form_threeContainer}>
          {isSolicitacaoPerfil ? (
            <div className={style.formGroup}>
              <label htmlFor="telefone">Telefone</label>
              <div className={style.inputWrapper}>
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
                  <span className={style.form__errorTooltip}>{formik.errors.telefone}</span>
                )}
              </div>
            </div>
          ) : ""}
          <div className={style.formGroup}>
            <label htmlFor="siape">SIAPE</label>
            <div className={style.inputWrapper}>
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
          </div>
          <div className={style.formGroup}>
            <label htmlFor="instituicao">Instituição</label>
            <div className={style.inputWrapper}>
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
        </div>
      )}

      {formik.values.tipoUsuario === "Aluno" && (
        <div className={style.container__ContainerForm_form_threeContainer}>
          {isSolicitacaoPerfil ? (
            <div className={style.formGroup}>
              <label htmlFor="telefone">Telefone</label>
              <div className={style.inputWrapper}>
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
                  <span className={style.form__errorTooltip}>{formik.errors.telefone}</span>
                )}
              </div>
            </div>
          ) : null}
          <div className={style.formGroup}>
            <label htmlFor="instituicao">Instituição</label>
            <div className={style.inputWrapper}>
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
          <div className={style.formGroup}>
            <label htmlFor="cursoId">Curso</label>

            <div className={style.inputWrapper}>
              <Select<OptionType, false> 
                id="cursoId"
                name="cursoId"
                options={cursoOptions}
                value={cursoOptions.find(option => option.value === formik.values.cursoId)}
                onChange={handleOneSelect}
                onBlur={() => formik.setFieldTouched('cursoId', true)}
                isDisabled={!editar}
                placeholder="Selecione um curso..."
                classNamePrefix="input"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    margin: '0.5em 0 1em 0',
                    border: state.isFocused ? '1px solid rgba(0, 0, 0, 0.70)' : '1px solid rgba(0, 0, 0, 0.50)',
                    boxShadow: state.isFocused ? '0 0 5px rgba(0, 0, 0, 0.3)' : 'none',
                    '&:hover': {
                      border: '1px solid rgba(0, 0, 0, 0.70)',
                    },
                  }),
                  
                  indicatorSeparator: () => ({ 
                    display: 'none',
                  }),
                  dropdownIndicator: (base) => ({ 
                    ...base,
                    color: 'black',
                    '&:hover': {
                      color: 'black', 
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? 'rgba(109,109 ,109, 0.2)' : 'transparent',
                    color: 'rgba(var(--black))',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: 'rgba(var(--input-form), 0.8)',
                    },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'rgba(var(--black))',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgba(var(--grey), 0.5)',
                  }),
                }}
              />
              {formik.touched.cursoId && formik.errors.cursoId ? (
                <div className={style.error}>{formik.errors.cursoId}</div>
              ) : null}
            </div>
          </div>
          <div className={style.formGroup}>
            <label htmlFor="matricula">Matricula</label>
            <div className={style.inputWrapper}>
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
          </div>

        </div>
      )}

      <div className={style.container__ContainerForm_form}>
        {isSolicitacaoPerfil ? (
          <div className={style.formGroup}>
            <label htmlFor="documentos">Documentos</label>
            <div className={style.inputWrapper}>
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
                <span className={style.form__errorTooltip}>{formik.errors.documentos}</span>
              )}
            </div>
          </div>
        ) : ""}
      </div>
    </>
  );
};

export default DadosPessoais;
