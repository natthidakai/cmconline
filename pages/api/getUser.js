import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token'); // หรือวิธีการที่คุณใช้เพื่อเก็บ token

            if (!token) {
                router.push('/login'); // ถ้าไม่มี token เปลี่ยนไปหน้า login
                return;
            }

            try {
                const response = await fetch('/api/getUser', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, [router]);

    if (error) {
        return <div>เกิดข้อผิดพลาด: {error}</div>;
    }

    if (!user) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div>
            <h1>โปรไฟล์ของคุณ</h1>
            <p>ชื่อ: {user.first_name} {user.last_name}</p>
            <p>อีเมล: {user.email}</p>
            <p>เบอร์โทรศัพท์: {user.phone}</p>
        </div>
    );
};

export default Profile;
