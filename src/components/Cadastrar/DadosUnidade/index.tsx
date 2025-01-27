"use client";
import style from "./dados.module.scss";

interface DadosCursoProps {
  formik: any;
  editar: boolean; // Controle de edição dos campos
}

const DadosUnidade: React.FC<DadosCursoProps> = ({ formik, editar, }) => {
  return (
    <div className={style.container__ContainerForm_form_halfContainer}>
      <div className={style.formGroup}>
        <label htmlFor="nome">Nome da Unidade</label>
        <div className={style.inputWrapper}>
          <input
            className={style.container__ContainerForm_form_input}
            id="nome"
            name="nome"
            placeholder="Digite o nome da unidade"
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
        <div className={style.formGroup}>
          <label htmlFor="codigo">Código</label>
          <div className={style.inputWrapper}>
            <input
              className={style.container__ContainerForm_form_input}
              id="codigo"
              name="codigo"
              placeholder="Digite o codigo da unidade"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.codigo}
              required
              disabled={!editar} // Controla edição com a prop `editar`
            />
            {formik.touched.codigo && formik.errors.codigo && (
              <span className={style.form__errorTooltip}>{formik.errors.codigo}</span>
            )}
          </div>
      </div>

    </div>
  );
};

export default DadosUnidade;
