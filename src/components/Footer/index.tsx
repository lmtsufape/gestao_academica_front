// Footer.tsx ou Footer.jsx
import style from './footer.module.scss'
import Image from 'next/image'

interface FooterProps {
  className?: string;
}

function Footer({ className }: FooterProps) {
  return (
     <div className={`${style.footer} ${className || ''}`}>
          <div className={style.footer__logo_sementes}>
              <Image src="/assets/LogoBranca.svg" alt="Logo Coppabacs" width={250} height={50}/>
          </div>
          <div className={style.footer__logo_lmts}>
              <Image src="/assets/LogoUfape.svg" alt="Logo App" width={58} height={58}/>
              <Image src="/assets/LogoLmts.svg" alt="Logo App" width={99} height={42}/>  
          </div>
          <div className={style.footer__social}>
              <a href="#">
                  <Image src="/assets/icons/facebook.svg" alt="Facebook Icon" width={24} height={24}/>
              </a>
              <a href="#">
                  <Image src="/assets/icons/instagram.svg" alt="Instagram Icon" width={24} height={24}/>
              </a>
              <a href="#">
                  <Image src="/assets/icons/Email.svg" alt="Email Icon" width={27} height={26}/>
              </a>
          </div>
     </div>
  );
}

export default Footer;
