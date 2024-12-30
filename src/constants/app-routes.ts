export const APP_ROUTES = {
    private: {

        unauthorized: {
            name: "/unauthorized"
        },
        home: {
            name: '/home',
        },
        solicitacoes: {
            name: 'usuarios/solicitacoes',
        },
        usuarios: {
            name: '/usuarios',
        },
        cadastrarUsuario: {
            name: '/usuarios/criar-usuario',
        },
        cursos:{
            name: '/cursos',
        },
        cadastrarCurso:{
            name: '/cursos/registrar',
        }

    },
    public: {
        novoUsuario: '/novo-usuario',
        login: '/'
        
    }
};