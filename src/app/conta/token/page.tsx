"use client"

import { useAuthService } from '@/app/authentication/auth.hook';
import { useEffect, useState } from 'react';

import withAuthorization from '@/components/AuthProvider/withAuthorization';
import '../auth-styles.css';

function PageProfile() 
{
    const [tokenInfo, setTokenInfo] = useState<string[]>([]);
    const auth = useAuthService();

    useEffect(() => 
    {
        const messages: string[] = [];

        // With cookie-based authentication, we don't have direct access to tokens
        // Instead, we show the session information available through the auth context
        
        messages.push("Authentication Method: Cookie-based");
        messages.push("Is Authenticated: " + auth.isAuthenticated);
        messages.push("User Roles: " + JSON.stringify(auth.getUserRoles()));
        
        messages.push("isAdmin: " + auth.isAdmin());
        messages.push("isGestor: " + auth.isGestor());
        messages.push("isTecnico: " + auth.isTecnico());
        messages.push("isAluno: " + auth.isAluno());
        messages.push("isProfessor: " + auth.isProfessor());
        messages.push("isVisitante: " + auth.isVisitante());
        
        // Note: In cookie-based auth, tokens are HttpOnly and not accessible via JavaScript
        messages.push("");
        messages.push("Note: With cookie-based authentication, access tokens are stored");
        messages.push("as HttpOnly cookies and are not accessible via JavaScript for security.");
        messages.push("This prevents XSS attacks but means token details cannot be displayed.");
        
        setTokenInfo(messages);
    }, [auth.isAuthenticated, auth.getUserRoles()]); // Fix dependencies - use getUserRoles() instead of auth.session

    if (auth.isLoading) {
        return (
            <div className="justify-left px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900" style={{ maxWidth: '50%' }}>
                <h2 className="text-2xl font-bold custom-text-color dark:text-white">Carregando...</h2>
            </div>
        );
    }

    return (
        <div className="justify-left px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900" style={{ maxWidth: '50%' }}>
            <h2 className="text-2xl font-bold custom-text-color dark:text-white">Informações de Autenticação</h2><br/>
            {tokenInfo.map((message, index) => (
                <div key={index}>
                    <div style={{ fontSize: 'small', textAlign: 'left', maxWidth: '100%', wordWrap: 'break-word' }}>{message}</div>
                    <br />
                </div>
            ))}
        </div>
    );
}

export default withAuthorization(PageProfile);