"use client";
import style from "./admissao.module.scss";
interface DadosSecretariaProps {
  formik: any;
  editar: boolean;
  hrefAnterior: string;
}

const DadosAdmissao: React.FC<DadosSecretariaProps> = ({ formik, editar  }) => {

  return (
    <>
      <div className={style.container__ContainerForm_form_threePartsContainer}>
        <div>
          <label htmlFor="salary">Salario</label>
          <input
            id="salary"
            className={style.container__ContainerForm_form_input}
            name="salary"
            placeholder="Não informado"
            onBlur={formik.handleBlur}
            value={formik.values.salary}
            disabled={!editar}
            onChange={editar ? formik.handleChange : undefined}
          />
        </div>

        <div>
          <label htmlFor="admissionDate">Data de Admissão </label>
          <input
            id="admissionDate"
            className={style.container__ContainerForm_form_input}
            name="admissionDate"
            type="date"
            placeholder="Não informado"
            onBlur={formik.handleBlur}
            value={formik.values.admissionDate}
            disabled={!editar}
            onChange={editar ? formik.handleChange : undefined}
          />
        </div>

        <div>
          <label htmlFor="workload">Jornada de Trabalho</label>
          <input
            id="workload"
            className={style.container__ContainerForm_form_input}
            name="workload"
            placeholder="Não informado"
            value={formik.values.workload}
            disabled={!editar}
            onChange={editar ? formik.handleChange : undefined}
          />
        </div>

        <div>
          <label htmlFor="start">Inicio de Expediente </label>
          <input
            id="start"
            className={style.container__ContainerForm_form_input}
            name="start"
            placeholder="Não informado"
            onChange={editar ? formik.handleChange : undefined}
            onBlur={formik.handleBlur}
            value={formik.values.start}
            disabled={!editar}
          />
        </div>

        <div>
          <label htmlFor="end">Fim de Expediente </label>
          <input
            id="end"
            className={style.container__ContainerForm_form_input}
            name="end"
            placeholder="Não informado"
            onChange={editar ? formik.handleChange : undefined}
            onBlur={formik.handleBlur}
            value={formik.values.end}
            disabled={!editar}
          />
        </div>
      </div>
    </>
  );
};

export default DadosAdmissao;
