import Link from "next/link";

import '../../auth-styles.css';

export default function PageRegister() {

    return (
        <div className="flex flex-col items-center justify-center px-6 pt-10 mx-auto text-center">
            <div className="w-full max-w-xl p-6 space-y-12 sm:p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold custom-text-color dark:text-white">
                    Conta criada com sucesso!
                </h1>
                <div className="container text-base">
                    <p><strong>Quase lá!</strong> Para acessar o Sistema de Gestão Universitária, confirme seu e-mail na sua caixa de entrada. Clique no botão logo abaixo para ser redirecionado para a tela de login.</p>
                </div>
                <div className="flex justify-center">
                    <button className="py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                        <Link href="/login" className="text-white text-sm">Ir para a tela de login</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}
