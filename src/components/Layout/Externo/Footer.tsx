import React from 'react';
import Image from 'next/image';

const Footer = ({ dados }: any) => {
    return (
        <footer className="bg-extra-50 text-white py-6 px-6 md:px-10 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-shrink-0">
                    <Image src="/assets/LogoUfape.svg" alt="Logo Ufape" width={80} height={50} />
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">    
                    <a href="http://lmts.uag.ufrpe.br/br" target="_blank" rel="noopener noreferrer">
                        <Image src="/assets/LogoLmts.svg" alt="Logo LMTS" width={100} height={60} />
                    </a>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-4">
                    <a
                        href="https://www.facebook.com/LMTSUFAPE/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition"
                    >
                        <Image src="/assets/icons/facebook.svg" alt="Facebook Icon" width={24} height={24} />
                    </a>
                    <a
                        href="https://www.instagram.com/lmts_ufape/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition"
                    >
                        <Image src="/assets/icons/instagram.svg" alt="Instagram Icon" width={24} height={24} />
                    </a>
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=lmts@ufape.edu.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition"
                    >
                        <Image src="/assets/icons/Email.svg" alt="Email Icon" width={27} height={26} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;