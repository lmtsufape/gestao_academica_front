"use client";
//http://localhost:3000/gestao-extra-sisu/pagamento
import { useState } from "react";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import { generica } from "@/utils/api";

const PagePagamentoExtraSisu = () => {
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<{ status: string; mensagem: string; codigoBarra?: string; urlPdf?: string } | null>(null);
    const [metodo, setMetodo] = useState<"CREDITO" | "BOLETO">("CREDITO");

    const [form, setForm] = useState({
        customerName: "",
        document: "",
        amount: "",
        cardNumber: "",
        cardholderName: "",
        expirationDate: "",
        cvv: "",
        address: "",
        city: "",
        state: "",
    });

    const formatCpfCnpj = (valor: string) => {
        const digits = valor.replace(/\D/g, "").slice(0, 14);
        if (digits.length <= 11) {
            const p1 = digits.slice(0, 3);
            const p2 = digits.slice(3, 6);
            const p3 = digits.slice(6, 9);
            const p4 = digits.slice(9, 11);
            if (digits.length <= 3) return p1;
            if (digits.length <= 6) return `${p1}.${p2}`;
            if (digits.length <= 9) return `${p1}.${p2}.${p3}`;
            return `${p1}.${p2}.${p3}-${p4}`;
        }
        const p1 = digits.slice(0, 2);
        const p2 = digits.slice(2, 5);
        const p3 = digits.slice(5, 8);
        const p4 = digits.slice(8, 12);
        const p5 = digits.slice(12, 14);
        return `${p1}.${p2}.${p3}/${p4}-${p5}`;
    };

    const formatCardNumber = (valor: string) => {
        const digits = valor.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    };

    const formatExpirationDate = (valor: string) => {
        const digits = valor.replace(/\D/g, "").slice(0, 4);
        const mm = digits.slice(0, 2);
        const yy = digits.slice(2, 4);
        if (digits.length <= 2) return mm;
        return `${mm}/${yy}`;
    };

    const formatCvv = (valor: string) => {
        return valor.replace(/\D/g, "").slice(0, 4);
    };

    const parseAmount = (valor: string) => {
        const raw = valor.trim();
        if (raw === "") return NaN;
        if (raw.includes(",")) {
            const normalized = raw.replace(/\./g, "").replace(",", ".");
            return Number(normalized);
        }
        return Number(raw);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "document") {
            setForm((prev) => ({ ...prev, [name]: formatCpfCnpj(value) }));
            return;
        }
        if (name === "cardNumber") {
            setForm((prev) => ({ ...prev, [name]: formatCardNumber(value) }));
            return;
        }
        if (name === "expirationDate") {
            setForm((prev) => ({ ...prev, [name]: formatExpirationDate(value) }));
            return;
        }
        if (name === "cvv") {
            setForm((prev) => ({ ...prev, [name]: formatCvv(value) }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResultado(null);
        setLoading(true);

        const documentoNumeros = form.document.replace(/\D/g, "");
        if (documentoNumeros.length !== 11) {
            setResultado({
                status: "ERRO",
                mensagem: "Informe um CPF vÃ¡lido com 11 dÃ­gitos.",
            });
            setLoading(false);
            return;
        }

        const amountNumber = parseAmount(form.amount);
        if (Number.isNaN(amountNumber) || amountNumber <= 0) {
            setResultado({
                status: "ERRO",
                mensagem: "Informe um valor vÃ¡lido.",
            });
            setLoading(false);
            return;
        }

        const payload: any = {
            customerName: form.customerName,
            document: documentoNumeros,
            amount: amountNumber,
            type: metodo,
        };

        if (metodo === "CREDITO") {
            payload.cardDetails = {
                number: form.cardNumber,
                holderName: form.cardholderName,
                expirationDate: form.expirationDate,
                cvv: form.cvv,
            };
        } else {
            payload.boletoDetails = {
                address: form.address,
                city: form.city,
                state: form.state,
            };
        }

        try {
            const resp = await generica({
                metodo: "post",
                uri: "/extra-sisu/pagamentos",
                data: payload,
            });
            const ok = resp && typeof resp.status === "number" && resp.status >= 200 && resp.status < 300;
            const data = resp?.data;
            if (!ok) {
                setResultado({
                    status: "ERRO",
                    mensagem: data?.message ?? "Erro ao processar pagamento.",
                });
                return;
            }
            setResultado({
                status: data?.status ?? "SUCESSO",
                mensagem: data?.mensagem ?? "Pagamento processado.",
                codigoBarra: data?.codigoBarra ?? undefined,
                urlPdf: data?.urlPdf ?? undefined,
            });
        } catch (error) {
            setResultado({
                status: "ERRO",
                mensagem: "Erro ao processar pagamento.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-wrap justify-center mx-auto">
            <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-4xl p-4 pt-10 md:pt-12 md:pb-12">
                <Cabecalho
                    dados={{
                        titulo: "Pagamento Extra Sisu",
                        migalha: [
                            { nome: "Início", link: "/home" },
                            { nome: "Extra Sisu", link: "/gestao-extra-sisu" },
                            { nome: "Pagamento", link: "/gestao-extra-sisu/pagamento" },
                        ],
                    }}
                />

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-md text-sm ${
                                metodo === "CREDITO"
                                    ? "bg-extra-150 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => setMetodo("CREDITO")}
                        >
                            Cartão de Crédito
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-md text-sm ${
                                metodo === "BOLETO"
                                    ? "bg-extra-150 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => setMetodo("BOLETO")}
                        >
                            Boleto
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">Nome do Cliente</label>
                            <input
                                name="customerName"
                                value={form.customerName}
                                onChange={handleChange}
                                className="border rounded-md p-2"
                                placeholder="Digite o nome"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">CPF / CNPJ</label>
                            <input
                                name="document"
                                value={form.document}
                                onChange={handleChange}
                                className="border rounded-md p-2"
                                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">Valor</label>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                value={form.amount}
                                onChange={handleChange}
                                className="border rounded-md p-2"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {metodo === "CREDITO" ? (
                            <>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-gray-700">Número do Cartão</label>
                                    <input
                                        name="cardNumber"
                                        value={form.cardNumber}
                                        onChange={handleChange}
                                        className="border rounded-md p-2"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-gray-700">Nome no Cartão</label>
                                    <input
                                        name="cardholderName"
                                        value={form.cardholderName}
                                        onChange={handleChange}
                                        className="border rounded-md p-2"
                                        placeholder="Como impresso no cartão"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-gray-700">Validade (MM/AA)</label>
                                        <input
                                            name="expirationDate"
                                            value={form.expirationDate}
                                            onChange={handleChange}
                                            className="border rounded-md p-2"
                                            placeholder="MM/AA"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-gray-700">CVV</label>
                                        <input
                                            name="cvv"
                                            value={form.cvv}
                                            onChange={handleChange}
                                            className="border rounded-md p-2"
                                            placeholder="123"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-gray-700">Endereço</label>
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="border rounded-md p-2"
                                        placeholder="Rua, número"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-gray-700">Cidade</label>
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className="border rounded-md p-2"
                                            placeholder="Cidade"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-gray-700">Estado</label>
                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className="border rounded-md p-2"
                                            placeholder="UF"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="bg-extra-150 hover:bg-extra-50 text-white px-4 py-2 rounded-md disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading
                                ? "Processando..."
                                : metodo === "BOLETO"
                                    ? "Gerar Boleto"
                                    : "Pagar com Crédito"}
                        </button>
                    </form>

                    {resultado && (
                        <div
                            className={`mt-4 rounded-md p-3 text-sm ${
                                resultado.status === "SUCESSO" || resultado.status === "PENDING"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            <strong>{resultado.status}:</strong> {resultado.mensagem}
                            {resultado.codigoBarra && (
                                <div className="mt-2">
                                    <span className="font-medium">Código de barras:</span>{" "}
                                    <span className="break-all">{resultado.codigoBarra}</span>
                                </div>
                            )}
                            {resultado.urlPdf && (
                                <div className="mt-2">
                                    <a
                                        href={resultado.urlPdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        Abrir boleto (PDF)
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default withAuthorization(PagePagamentoExtraSisu);
