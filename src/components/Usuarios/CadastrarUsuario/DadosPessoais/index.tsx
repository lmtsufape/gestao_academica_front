"use client"
import style from "./promocao.module.scss";

interface DadosSecretariaProps {
  formik: any;
}

const DadosPessoais: React.FC<DadosSecretariaProps> = ({ formik }) => {

  return (
    <>
      <div className={style.container__ContainerForm_form}>
        <div>
          <label htmlFor="name">Nome Completo</label>

          <input
            className={style.container__ContainerForm_form_input}
            id="name"
            name="name"
            placeholder={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            required
          />
          {formik.touched.name && formik.errors.name ? (
            <span className={style.form__error}>{formik.errors.name}</span>
          ) : null}
        </div>
      </div>
      <div className={style.container__ContainerForm_form_halfContainer}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            className={style.container__ContainerForm_form_input}
            id="email"
            name="email"
            placeholder={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            required
          />
          {formik.touched.email && formik.errors.email ? (
            <span className={style.form__error}>{formik.errors.email}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="senha">Senha</label>

          <input
            className={style.container__ContainerForm_form_input}
            id="senha"
            name="senha"
            type="password"
            placeholder={formik.values.senha}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.senha}
            required
          />
          {formik.touched.senha && formik.errors.senha ? (
            <span className={style.form__error}>{formik.errors.senha}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmarSenha">Confirmar Senha</label>

          <input
            className={style.container__ContainerForm_form_input}
            id="confirmarSenha"
            name="confirmarSenha"
            type="confirmarSenha"
            placeholder={formik.values.confirmarSenha}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmarSenha}
            required
          />
          {formik.touched.confirmarSenha && formik.errors.confirmarSenha ? (
            <span className={style.form__error}>{formik.errors.confirmarSenha}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="nameSocial">Nome Social</label>

          <input
            className={style.container__ContainerForm_form_input}
            id="nameSocial"
            name="nameSocial"
            placeholder={formik.values.nameSocial}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nameSocial}
            required
          />
          {formik.touched.nameSocial && formik.errors.nameSocial ? (
            <span className={style.form__error}>{formik.errors.nameSocial}</span>
          ) : null}
        </div>

        <div>
          <label htmlFor="cpf">CPF </label>
          <input
            className={style.container__ContainerForm_form_input}
            id="cpf"
            name="cpf"
            placeholder={formik.values.cpf}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cpf}
            required
          />
          {formik.touched.cpf && formik.errors.cpf ? (
            <span className={style.form__error}>{formik.errors.cpf}</span>
          ) : null}
        </div>


        <div>

          <label htmlFor="contact">Telefone </label>
          <input
            className={style.container__ContainerForm_form_input}
            id="contact"
            name="contact"
            placeholder={formik.values.contact}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contact}
            required
          />
          {formik.touched.contact && formik.errors.contact ? (
            <span className={style.form__error}>{formik.errors.contact}</span>
          ) : null}
        </div>


      </div>
    </>
  )
}


export default DadosPessoais;