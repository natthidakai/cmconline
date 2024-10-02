import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const Step3 = () => {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === 'authenticated') {
                const memberId = session.user.id; // ค่าที่ถูกต้องจาก session
                // console.log('Member ID:', memberId); // ตรวจสอบค่า

                try {
                    const response = await fetch(`/api/getUser?member_id=${memberId}`, {
                        headers: {
                            'Authorization': `Bearer ${session.token}`, // ใช้ token ที่ถูกต้อง
                        },
                    });

                    if (!response.ok) {
                        const errorResponse = await response.json();
                        console.error('Error response from API:', errorResponse);
                        throw new Error(errorResponse.message || 'Failed to fetch user data');
                    }

                    const data = await response.json();
                    setUserData(data.user);
                } catch (err) {
                    setError(err.message);
                    console.error('Error fetching user data:', err.message); // Log error message
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // Set loading to false if not authenticated
            }
        };

        fetchUserData();
    }, [session, status]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>No user data found.</div>;
    }

    return (
        <div>
            <h1>User Information</h1>
            <p><strong>Member ID:</strong> {userData.member_id}</p>
            <p><strong>First Name:</strong> {userData.fname}</p>
            <p><strong>Last Name:</strong> {userData.lname}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            {/* แสดงข้อมูลเพิ่มเติมที่คุณต้องการ */}
        </div>
    );
};

export default Step3;
