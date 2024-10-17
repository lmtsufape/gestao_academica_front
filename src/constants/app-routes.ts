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
        }

    },
    public: {
        novoUsuario: '/novo-usuario',
        login: '/'
        
    }
};