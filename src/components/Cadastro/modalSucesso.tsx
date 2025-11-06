import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    School,
    PendingActions,
    Groups2,
    Diversity3,
    AccountCircleOutlined,
    CheckCircleOutline,
    EmailOutlined,
    Close,
    ArrowForward
} from "@mui/icons-material";


function ModalTipo() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    return (
        <div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg w-full max-w-md mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <Close className="h-6 w-6" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <CheckCircleOutline className="h-16 w-16 text-green-500 mx-auto mb-3" />
                            <h2 className="text-2xl font-bold text-gray-800">Conta criada com sucesso!</h2>
                            <p className="text-gray-600 mt-1">Siga os próximos passos para começar</p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                                    <EmailOutlined className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">1. Confirme seu e-mail</h3>
                                    <p className="text-gray-600 text-sm">Acesse sua caixa de entrada e clique no link de confirmação</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-3">
                                    <AccountCircleOutlined className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">2. Acesso Inicial</h3>
                                    <p className="text-gray-600 text-sm">Após confirmação, você terá acesso como <strong>visitante</strong></p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-amber-100 rounded-full p-2 mr-3">
                                    <Groups2 className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">3. Solicite seu perfil</h3>
                                    <p className="text-gray-600 text-sm">Se for estudante, professor ou técnico, solicite a alteração do seu nível de acesso</p>
                                </div>
                            </div>
                        </div>


                        {/* CTA Button */}
                        <Link
                            href="/login"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white bg-gradient-to-r from-extra-150 to-extra-150 hover:from-extra-150 hover:to-extra-50 transition-all shadow-md hover:shadow-lg"
                        >
                            Ir para a tela de login
                            <ArrowForward className="h-5 w-5" />
                        </Link>


                    </div>
                </div>
            )}
        </div>
    );
}

export default ModalTipo;