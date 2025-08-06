import { useAuth } from '@/components/AuthProvider/AuthProvider';
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import router from 'next/router';
import { useEffect, useState } from 'react';
import '../auth-styles.css';

function PageProfile() {
    const { logout } = useAuth();
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        const handleLogout = async () => {
            if (!checked) {
                setChecked(true);

                const { id } = router.query;

                // Use the logout function from AuthProvider
                await logout();

                if (typeof (id) !== 'undefined' && id === '/login') {
                    router.push('/login');
                } else {
                    router.push('/login');
                }
            }
        };

        handleLogout();
    }, [checked, logout]);

    return null;
}

export default withAuthorization(PageProfile);
