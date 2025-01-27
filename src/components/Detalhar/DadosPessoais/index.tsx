"use client";

import { useState } from "react";
import style from "./dados-pessoais.module.scss";
import { ICurso } from "@/interfaces/ICurso";
import Select from 'react-select';
import { Fredericka_the_Great } from "next/font/google";

interface DadosPessoaisProps {
  formik: any;
  editar: boolean;
  roles: string[]; // Array de roles para controle de perfil
  hrefAnterior: string;

}
interface OptionType {
  value: string;
  label: string;
}
const DadosPessoais: React.FC<DadosPessoaisProps> = ({ formik, editar, roles }) => {
  const [cursos, setCursos] = useState<ICurso[]>([]);

  // Prepare options for react-select
  const cursoOptions = cursos.map((curso) => ({
    value: curso.id,
    label: curso.nome,
  }));

  const selectedOptions = cursoOptions.filter(option => formik.values.cursoIds.includes(option.value));

  // Handle selection changes
  const handleSelectChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option: { value: any; }) => option.value) : [];
    formik.setFieldValue('cursoIds', selectedIds);
  };
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
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
            value={formik.values.cpf}
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
            value={formik.values.telefone}
            disabled={!editar}
          />
        </div>

        {roles.includes("professor") && !roles.includes("aluno") && (
          <>
            <div>
              <label htmlFor="instituicao">Instituição</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="instituicao"
                name="instituicao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.instituicao}
                disabled={!editar}
              />
            </div>
            <div>
              <label htmlFor="siape">SIAPE</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="siape"
                name="siape"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.siape}
                disabled={!editar}
              />
            </div>
            <div>
              <label htmlFor="cursoIds">Cursos</label>
              <Select<OptionType, true>
                id="cursoIds"
                name="cursoIds"
                isMulti
                options={cursoOptions}
                value={selectedOptions}
                onChange={handleSelectChange}
                onBlur={() => formik.setFieldTouched('cursoIds', true)}
                isDisabled={!editar}
                placeholder="Carregando cursos..."
                classNamePrefix="select"

              />
            </div>
          </>
        )}

        {roles.includes("tecnico") && !roles.includes("aluno") && !roles.includes("professor") && (
          <>
            <div>
              <label htmlFor="siape">SIAPE</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="siape"
                name="siape"
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.instituicao}
                disabled={!editar}
              />
            </div>
          </>
        )}

        {roles.includes("aluno") && !roles.includes("tecnico") && !roles.includes("professor") && (
          <>
            <div>
              <label htmlFor="curso">Curso</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="curso"
                name="curso"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.curso.nome}
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
                value={formik.values.instituicao}
                disabled={!editar}
              />
            </div>
          </>
        )}
        {roles.includes("tecnico") && roles.includes("aluno") && !roles.includes("professor") && (
          <>
            <div>
              <label htmlFor="siape">SIAPE</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="siape"
                name="siape"
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.instituicao}
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
                value={formik.values.curso.nome}
                disabled={!editar}
              />
            </div>

          </>
        )}
        {roles.includes("professor") && roles.includes("aluno") && (
          <>

            <div>
              <label htmlFor="siape">SIAPE</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="siape"
                name="siape"
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.instituicao}
                disabled={!editar}
              />
            </div>
            <div>
              <label htmlFor="cursoIds">Cursos</label>
              <Select<OptionType, true>
                id="cursoIds"
                name="cursoIds"
                isMulti
                options={cursoOptions}
                value={selectedOptions}
                onChange={handleSelectChange}
                onBlur={() => formik.setFieldTouched('cursoIds', true)}
                isDisabled={!editar}
                placeholder="Carregando cursos..."
                classNamePrefix="select"

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
                value={formik.values.curso.nome}
                disabled={!editar}
              />
            </div>
          </>
        )}

      </div>
    </>
  );
};

export default DadosPessoais;
