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
            // Check if the session is authenticated
            if (status === 'loading') {
                return; // Wait for session to load
            }

            if (status === 'unauthenticated') {
                router.push('/signin'); // Redirect to sign-in if unauthenticated
                return;
            }

            try {
                const response = await fetch('/api/getUser', {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`, // Use the access token from session
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
                // Optionally redirect to sign-in on error
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [status, session, router]); // Run the effect when status or session changes

    return { user, loading, error };
};
