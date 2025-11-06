"use client"
import { FormEvent, useState, useEffect } from "react";
import '../auth-styles.css';
import Link from "next/link";
import { genericaApiAuth } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import TermosDeUso from "@/app/conta/criar-conta/termos-de-uso/page";
import Swal from "sweetalert2";
import SuccessModal from '@/components/Cadastro/modalSucesso';
import Image from "next/image";

const openPopup = (url: any) => {
    window.open(url, 'popup', 'width=600,height=600,scrollbars=no,resizable=no');
};

export default function PageRegister() {
    const router = useRouter();
    const [errorMessageEmail, setErrorMessageEmail] = useState<string | null>(null);
    const [errorMessageSenha, setErrorMessageSenha] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [etnias, setEtnias] = useState<any[]>([]);
    const [loadingEtnias, setLoadingEtnias] = useState(true);

    const [formData, setFormData] = useState<any>({
        nome: "",
        nomeSocial: "",
        cpf: "",
        telefone: "",
        email: "",
        repetirEmail: "",
        senha: "",
        repetirSenha: "",
        termosUso: false,
        etniaId: ""
    });
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

    useEffect(() => {
        const carregarEtnias = async (params = null) => {
            try {
                const response = await genericaApiAuth({
                    metodo: 'get',
                    uri: '/tipoEtnia',
                    params: params != null ? params : { size: 15, page: 0 },
                    data: {}
                });

                if (response.data && response.data.content && Array.isArray(response.data.content)) {
                    setEtnias(response.data.content);
                }
            } catch (error) {
                console.error("Erro ao carregar etnias:", error);
                toast.error("Erro ao carregar opções de etnia");
            } finally {
                setLoadingEtnias(false);
            }
        };

        carregarEtnias();
    }, []);

    const handleClickTermosDeUso = (e: any) => {
        e.preventDefault();
        openPopup('/conta/criar-conta/termos-de-uso');
    };

    const formatarCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const formatarTelefone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    };

    const handleMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "cpf") {
            newValue = formatarCPF(value);
        } else if (name === "telefone") {
            newValue = formatarTelefone(value);
        }

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    function validarTelefone(telefone: string) {
        const apenasNumeros = telefone.replace(/\D/g, '');
        return apenasNumeros.length === 11;
    }

    const validarCPF = (cpf: string) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setErrorMessageEmail(null);
        setErrorMessageSenha(null);

        const toastId = toast.loading("Processando...", {
            position: "top-right",
            closeButton: false,
            hideProgressBar: true,
            autoClose: false,
        });

        try {
            if (!validarCPF(formData.cpf)) {
                toast.dismiss(toastId);
                toast.error("CPF inválido!", { position: "top-right" });
                return;
            }

            if (!validarTelefone(formData.telefone)) {
                toast.dismiss(toastId);
                toast.error("Telefone inválido!", { position: "top-right" });
                return;
            }

            if (formData.senha.length < 8) {
                toast.dismiss(toastId);
                toast.error("A senha deve ter pelo menos 8 caracteres!", { position: "top-right" });
                return;
            }

            if (!formData.termosUso) {
                toast.dismiss(toastId);
                setErrorMessage("Você deve ler e aceitar os Termos de Uso antes de criar uma conta");
                return;
            }

            if (formData.email !== formData.repetirEmail) {
                toast.dismiss(toastId);
                toast.error("O e-mail e a confirmação não correspondem");
                setErrorMessageEmail("O e-mail e a confirmação não correspondem");
                return;
            }

            if (!mostrarSenha && formData.senha !== formData.repetirSenha) {
                toast.dismiss(toastId);
                setErrorMessageSenha("A senha e a confirmação não correspondem");
                return;
            }

            const formDataWithDate = {
                ...formData,
            };

            const body = {
                metodo: 'post',
                uri: '/usuario',
                params: {},
                data: formDataWithDate
            };

            const response = await genericaApiAuth(body);
            toast.dismiss(toastId);

            console.log("response: " + JSON.stringify(response));

            if (response.status === 401) {
                toast.error("Credenciais já cadastradas!", { position: "top-right" });
                return;
            }

            if (response.status === 409) {
                toast.error("CPF e/ou e-mail já cadastrado(s)!", { position: "top-right" });
                return;
            }

            if (response.status && response.status === 500) {
                if (response.data && response.data.message)
                    setErrorMessage(response.data.message);
                else
                    setErrorMessage(response.data);
            }

            if (response.data.errors) {
                const errors = response.data.errors;
                if (errors.email) setErrorMessageEmail(errors.email);
                if (errors.senha) setErrorMessageSenha(errors.senha);
                console.error("#1 " + JSON.stringify(errors));
            } else if (response.data.error) {
                console.error("#2 " + 'Erro ao salvar registro:', response.data.error.message);
                setErrorMessage("Erro ao criar a conta. " + response.data.error.message);
            } else if (response.data.detail) {
                console.error(`Erro: ${response.data.detail}`);
                setErrorMessage(`${response.data.detail}`);
            } else if (response.status === 201) {
                toast.success("Conta criada com sucesso!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                setShowModal(true);
            } else {
                console.log(JSON.stringify(response));
                if (response.status === 400)
                    console.log(JSON.stringify(response.data));
                else
                    console.log(`${response.data.detail}`);
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Ocorreu um erro inesperado", { position: "top-right" });
            console.error("Erro não tratado:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
            <div className="w-full max-w-4xl m-12 bg-white rounded-lg shadow-md">
                {/* Conteúdo principal */}
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-extra-50">Cadastro</h2>
                        <p className="text-extra-100 mt-2">Sistema de Gestão Universitária</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome */}
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-700">
                                    Nome <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="nome" 
                                    id="nome" 
                                    value={formData.nome} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required 
                                />
                            </div>

                            {/* Nome Social */}
                            <div>
                                <label htmlFor="nomeSocial" className="block mb-2 text-sm font-medium text-gray-700">
                                    Nome Social
                                </label>
                                <input 
                                    type="text" 
                                    name="nomeSocial" 
                                    id="nomeSocial" 
                                    value={formData.nomeSocial} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* CPF */}
                            <div>
                                <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-700">
                                    CPF <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="cpf" 
                                    id="cpf" 
                                    value={formData.cpf} 
                                    onChange={handleMask} 
                                    maxLength={14} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required 
                                />
                            </div>

                            {/* Telefone */}
                            <div>
                                <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-700">
                                    Telefone <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="telefone" 
                                    id="telefone" 
                                    value={formData.telefone} 
                                    onChange={handleMask} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                    placeholder="(00) 00000-0000" 
                                    maxLength={15} 
                                    required 
                                />
                            </div>

                            {/* E-mail */}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                    E-mail <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    placeholder="email@ufape.edu.br" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required 
                                />
                                {errorMessageEmail && <p className="text-red-500 text-sm mt-2">{errorMessageEmail}</p>}
                            </div>

                            {/* Repetir E-mail */}
                            <div>
                                <label htmlFor="repetirEmail" className="block mb-2 text-sm font-medium text-gray-700">
                                    Repetir E-mail <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    name="repetirEmail" 
                                    id="repetirEmail" 
                                    value={formData.repetirEmail} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required 
                                />
                            </div>

                            {/* Etnia */}
                            <div>
                                <label htmlFor="tipoEtniaId" className="block mb-2 text-sm font-medium text-gray-700">
                                    Etnia <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="tipoEtniaId"
                                    id="tipoEtniaId"
                                    value={formData.tipoEtniaId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                    disabled={loadingEtnias}
                                >
                                    <option value="">Selecione uma etnia</option>
                                    {etnias.map((etnia) => (
                                        <option key={etnia.id} value={etnia.id}>
                                            {etnia.tipo}
                                        </option>
                                    ))}
                                </select>
                                {loadingEtnias && <p className="text-sm text-gray-500 mt-2">Carregando opções...</p>}
                            </div>

                            {/* Senha */}
                            <div className="relative">
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-700">
                                    Senha <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type={mostrarSenha ? "text" : "password"} 
                                    name="senha" 
                                    id="senha" 
                                    value={formData.senha} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    {mostrarSenha ? (
                                        <Image
                                            src="/assets/icons/eyeOff.svg"
                                            alt="Ocultar senha"
                                            width={20}
                                            height={20}
                                        />
                                    ) : (
                                        <Image
                                            src="/assets/icons/eyeOn.svg"
                                            alt="Mostrar senha"
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                </button>
                                {errorMessageSenha && <p className="text-red-500 text-sm mt-2">{errorMessageSenha}</p>}
                            </div>

                            {/* Repetir Senha */}
                            {!mostrarSenha && (
                                <div>
                                    <label htmlFor="repetirSenha" className="block mb-2 text-sm font-medium text-gray-700">
                                        Repetir senha <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="password" 
                                        name="repetirSenha" 
                                        id="repetirSenha" 
                                        value={formData.repetirSenha} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Termos de Uso */}
                        <div className="flex items-start space-x-3">
                            <div className="flex items-center h-5 mt-1">
                                <input
                                    type="checkbox"
                                    name="termosUso"
                                    id="termosUso"
                                    checked={formData.termosUso}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-extra-50 border-gray-300 rounded focus:ring-extra-50"
                                    required
                                />
                            </div>
                            <label htmlFor="termosUso" className="text-sm text-gray-700">
                                Concordo com os <Link href="/conta/criar-conta/termos-de-uso" className="text-extra-50 hover:underline font-medium">Termos de Uso</Link> e <Link href="/conta/criar-conta/termos-de-uso#aviso-de-privacidade" className="text-extra-50 hover:underline font-medium">Política de Privacidade</Link>
                            </label>
                        </div>

                        {/* Link para termos */}
                        <div className="text-center">
                            <Link 
                                href="/conta/criar-conta/termos-de-uso" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-extra-50 hover:underline text-sm font-medium"
                            >
                                Os termos estão disponíveis acima, mas você pode acessá-los também clicando aqui.
                            </Link>
                        </div>

                        {/* Mensagens de erro */}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                            </div>
                        )}

                        {/* Botão de criar conta */}
                        <div className="flex justify-center">
                            <button 
                                type="submit"
                                className="w-full max-w-xs py-3 px-6 text-base font-medium rounded-lg text-white bg-extra-150 hover:bg-extra-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-sm"
                            >
                                Criar Conta
                            </button>
                        </div>

                        {/* Link para login */}
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Já possui uma conta?{" "}
                                <Link href="/login" className="text-extra-50 hover:underline font-medium">
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    </form>

                    {showModal && <SuccessModal />}
                </div>
            </div>
        </div>
    );
}