"use client"
import style from "./endereco.module.scss";

interface DadosBarbeiroProps {
  formik: any;
  editar: boolean;
  hrefAnterior: string;
}

const DadosEndereco: React.FC<DadosBarbeiroProps> = ({ formik, editar }) => {


  return (
    <>
      <div className={style.container__ContainerForm_form_threePartsContainer}>

        {editar === false ? (
          <>
            <div>
              <label htmlFor="cep">CEP</label>
              <input
                id="cep"
                className={style.container__ContainerForm_form_input}
                name="cep"
                placeholder="Não informado"
                onBlur={formik.h1andleBlur}
                value={formik.values.address.cep}
                disabled
              />
            </div>
            <div>
              <label htmlFor="street">Rua</label>
              <input
                id="street"
                className={style.container__ContainerForm_form_input}
                name="street"
                placeholder="Não informado"
                onBlur={formik.h1andleBlur}
                value={formik.values.address.street}
                disabled
              />
            </div>
            <div>
              <label htmlFor="number">Número </label>


              <input
                id="number"
                className={style.container__ContainerForm_form_input}
                name="number"
                placeholder="Não informado"
                onBlur={formik.handleBlur}
                value={formik.values.address.number}
                disabled
              />
            </div>
            <div>
              <label htmlFor="neighborhood">Bairro</label>
              <input
                id="neighborhood"
                className={style.container__ContainerForm_form_input}
                name="neighborhood"
                placeholder="Não informado"
                onBlur={formik.handleBlur}
                value={formik.values.address.neighborhood}
                disabled
              />
            </div>

            <div>

              <label htmlFor="city">Cidade</label>

              <input
                id="city"
                className={style.container__ContainerForm_form_input}
                name="city"
                placeholder="Não informado"
                value={formik.values.address.city}
                disabled
              />
            </div>

            <div>
              <label htmlFor="state">Estado </label>
              <input
                id="state"
                className={style.container__ContainerForm_form_input}
                name="state"
                placeholder="Não informado"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.state}
                disabled
              />
            </div>
           

          </>
        ) : (
          <>

            <div>
              <label htmlFor="address.cep">CEP</label>

              <input
                className={style.container__ContainerForm_form_input}
                id="address.cep"
                name="address.cep"
                placeholder={formik.values.address.cep}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.cep}
                required
              />
            </div>
            {formik.touched.cep && formik.errors.cep ? (
              <span className={style.form__error}>{formik.errors.cep}</span>
            ) : null}
            <div>
              <label htmlFor="address.street">Rua</label>

              <input
                className={style.container__ContainerForm_form_input}
                id="address.street"
                name="address.street"
                placeholder={formik.values.address.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.street}
                required
              />
            </div>
            {formik.touched.street && formik.errors.street ? (
              <span className={style.form__error}>{formik.errors.street}</span>
            ) : null}

            <div>
              <label htmlFor="address.number">Número</label>

              <input
                className={style.container__ContainerForm_form_input}
                id="address.number"
                name="address.number"
                placeholder={formik.values.address.number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.number}
                required
              />
              {formik.touched.number && formik.errors.number ? (
                <span className={style.form__error}>{formik.errors.number}</span>
              ) : null}
            </div>
            <div>
              <label htmlFor="address.neighborhood">Bairro</label>

              <input
                className={style.container__ContainerForm_form_input}
                id="address.neighborhood"
                name="address.neighborhood"
                placeholder={formik.values.address.neighborhood}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.neighborhood}
                required
              />
            </div>
            {formik.touched.neighborhood && formik.errors.neighborhood ? (
              <span className={style.form__error}>{formik.errors.neighborhood}</span>
            ) : null}
            <div>

              <label htmlFor="address.city">Cidade </label>
              <input
                className={style.container__ContainerForm_form_input}
                id="address.city"
                name="address.city"
                placeholder={formik.values.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.city}
                required
              />
              {formik.touched.city && formik.errors.city ? (
                <span className={style.form__error}>{formik.errors.city}</span>
              ) : null}
            </div>
            <div>

              <label htmlFor="address.state">Estado </label>
              <input
                className={style.container__ContainerForm_form_input}
                id="address.state"
                name="address.state"
                placeholder={formik.values.address.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.state}
                required
              />
              {formik.touched.state && formik.errors.state ? (
                <span className={style.form__error}>{formik.errors.state}</span>
              ) : null}
            </div>
            
          </>
        )}

      </div>
    </>
  )
}


export default DadosEndereco;