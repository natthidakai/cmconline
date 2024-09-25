import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useFetchUser = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/getUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const usersData = await response.json();
                if (!usersData || !usersData.member_id) {
                    throw new Error('Invalid user data');
                }

                setUser(usersData);
            } catch (err) {
                setError(err.message);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    return {user, loading, error};
};
