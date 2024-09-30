import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export const useFetchUser = () => {
    const { data: session, status } = useSession(); // Fetch session data
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === "loading" || !session) {
                return; // Avoid fetching while loading or if there's no session
            }

            try {
                const response = await fetch('/api/getUser', {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken || ''}`, // Ensure accessToken is defined
                    },
                });

                console.log('Response Status:', response.status); // Log the response status
                const usersData = await response.json();

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`); // Log HTTP error
                }

                if (!usersData || !usersData.member_id) {
                    throw new Error('Invalid user data');
                }

                setUser(usersData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err); // Log the actual error
                if (err.message === 'Invalid user data' || response.status === 401) {
                    router.push('/signin'); // Redirect to signin on specific errors
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [status, session, router]); // Run the effect when status or session changes

    return { user, loading, error };
};
