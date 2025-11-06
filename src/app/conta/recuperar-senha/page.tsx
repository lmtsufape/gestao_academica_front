"use client"
import { AuthService } from "@/app/authentication/auth.service";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import '../auth-styles.css';

export default function PageLogin() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState<any>({ email: "" });
    const [showModal, setShowModal] = useState(false); // <-- controla o modal

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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

        try {
            const response = await AuthService.resetPassword(email);

            if (response.status === 401) {
                // Caso a API retorne 404 para e-mail inexistente
                setErrorMessage("E-mail não encontrado no sistema.");
            }
            else if (response.status === 400 && response.data?.message?.toLowerCase().includes("não encontrado")) {
                // Caso a API retorne 400 e a mensagem contenha algo indicando que não encontrou
                setErrorMessage(response.data.message);
            }
            else if (response.status && response.status === 500) {
                setErrorMessage(response.data.message);
            }
            else if (response.data.errors) {
                const errors = response.data.errors;
                if (errors.email) setErrorMessage(errors.email);
                console.error("#1 " + JSON.stringify(errors));
            }
            else if (response.data.error) {
                setErrorMessage("Erro ao recuperar a senha. " + response.data.error.message);
            }
            else if (response.data.detail) {
                setErrorMessage(`${response.data.detail}`);
            }
            else if (response.ok) {
                setShowModal(true);
            }
            else {
                console.log(JSON.stringify(response));
                if (response.status === 400) console.log(JSON.stringify(response.data));
                else console.log(`${response.data.detail}`);
            }
        } catch (err) {
            setErrorMessage("Erro inesperado. Tente novamente mais tarde.");
            console.error(err);
        }
    };


    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <div className="min-h-[78vh] flex flex-col items-center justify-center px-6 pt-50 mx-auto bg-gray-100">
            <div className="max-w-md w-full p-6 space-y-8 sm:p-8 bg-white rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold text-extra-50">Recuperar Senha</h2>
                <form onSubmit={handleSubmit} className="space-y-6" style={{ marginTop: '9px' }}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                            Informe o e-mail vinculado ao sistema
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 ${errorMessage ? 'border-red-500' : ''}`}
                            placeholder="email@ufape.edu.br"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleChange;
                                setErrorMessage("");
                            }}
                        />
                        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-extra-50 hover:bg-extra-150 focus:outline-none"
                    >
                        Enviar
                    </button>
                </form>
            </div>

            {/* MODAL DE SUCESSO */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all scale-100 sm:scale-105">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                        >
                            ×
                        </button>

                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                            Token de recuperação gerado com sucesso!
                        </h1>

                        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                            Um token de recuperação foi enviado para o e-mail informado.<br />
                            Verifique sua caixa de entrada e utilize o link para cadastrar uma nova senha.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                            <Link
                                href="/login"
                                className="w-full sm:w-auto px-5 py-2 text-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                            >
                                Voltar para pagina inicial
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
