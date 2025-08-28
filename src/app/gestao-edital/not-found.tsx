export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-5xl font-extrabold ">404</h1>
      <h2 className="text-2xl font-bold mt-2">Página não encontrada</h2>
      <p className="mt-2 text-lg text-gray-600">
      A página que você está procurando não existe.
      </p>
      <a 
        href={`/e-Frotas`} 
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}
