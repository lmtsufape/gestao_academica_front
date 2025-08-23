"use client"
import { AuthService } from "@/app/authentication/auth.service";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import '../auth-styles.css';

export default function PageLogin() 
{
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState<any>({
        email: "",
    });

    const handleChange = (e: React.ChangeEvent < HTMLInputElement | HTMLSelectElement > ) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (!validateEmail(email)) {
            setErrorMessage("Informe o seu e-mail vinculado ao sistema");
            return;
        }

        const formDataWithEmail = {
            ...formData,
            "email" : email
        };

        const response = await AuthService.resetPassword(email);

        if (response.status && response.status === 500)
            setErrorMessage(response.data.message);
        else 
        if (response.data.errors) 
        {
            // Tratando erros individuais para cada campo
            const errors = response.data.errors;

            if (errors.email) setErrorMessage(errors.email);

            //setErrorMessage("Por favor, corrija os erros no formulário.");
            console.error("#1 " + JSON.stringify(errors));
        } 
        else 
        if (response.data.error) 
            setErrorMessage("Erro ao recuperar a senha. " + response.data.error.message);
        else 
        if (response.data.detail) 
            setErrorMessage(`${response.data.detail}`);
        else 
        if (response.ok) 
            router.push('/conta/recuperar-senha/sucesso')
        else
        {
            console.log(JSON.stringify(response));

            if (response.status === 400)
                console.log(JSON.stringify(response.data));
            else
                console.log(`${response.data.detail}`);
        }
    };

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <div className="min-h-[78vh] flex flex-col items-center justify-center px-6 pt-50 mx-auto bg-gray-100">
            <div className="max-w-md w-full p-6 space-y-8 sm:p-8 bg-white rounded-xl shadow-xl">
                {/* <a href="/">
                    <img src="/logo/logo_1.png" className='mb-4 mx-auto block' alt="smartApSUS" width={120} />
                </a>
                <h1 className="text-gray-400 text-center text font-normal">Descubra informações essenciais sobre sua região, incluindo unidades de Atenção Primária à Saúde, profissionais de saúde e muito mais.</h1> */}

                <h2 className="text-2xl font-bold custom-text-color">Recuperar Senha</h2>
                <form onSubmit={handleSubmit} className="space-y-6" style={{marginTop:'9px'}}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Informe o e-mail vinculado ao sistema</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${errorMessage ? 'border-red-500' : ''}`}
                            placeholder="email@ufape.edu.br" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleChange
                                setErrorMessage("");
                            }}
                            
                        />
                        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    </div>
                    <button type="submit" 
                        className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                        Recuperar senha</button>
                </form>
            </div>
        </div>
    );
}
