"use client";
import style from "./dados.module.scss";

interface DadosCursoProps {
  formik: any;
  editar: boolean; // Controle de edição dos campos
}

const DadosCurso: React.FC<DadosCursoProps> = ({ formik, editar,  }) => {
  return (
    <div className={style.container__ContainerForm_form}>
          <div className={style.formGroup}>
            <label htmlFor="nome">Nome do Curso</label>
            <div className={style.inputWrapper}>
              <input
                className={style.container__ContainerForm_form_input}
                id="nome"
                name="nome"
                placeholder="Digite o nome do curso"
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
  );
};

export default DadosCurso;
