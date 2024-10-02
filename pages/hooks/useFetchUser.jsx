import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const useFetchUser = () => {
    const { data: session, status } = useSession(); // ดึงข้อมูล session
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === "loading") {
                return; // รอจนกว่า session จะโหลด
            }

            if (!session || !session.accessToken) {
                setLoading(false);
                setError('No session or access token found.');
                return; // ไม่มี session หรือ access token ไม่ต้องดึงข้อมูล
            }

            setLoading(true);

            try {
                const response = await fetch('/api/getUser', {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`, // ใส่ accessToken
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const usersData = await response.json();

                if (!usersData || !usersData.member_id) {
                    throw new Error('Invalid user data');
                }

                setUser(usersData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [status, session]);

    return { user, loading, error };
};
