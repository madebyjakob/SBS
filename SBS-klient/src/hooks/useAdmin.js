import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../utils/api';

export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth0();
    const { callApi } = useApi();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!isAuthenticated) {
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                // Verify admin status with backend
                const response = await callApi('/admin/verify', {
                    method: 'GET'
                });

                setIsAdmin(response.isAdmin);
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminStatus();
    }, [isAuthenticated, callApi]);

    return { isAdmin, isLoading };
}; 