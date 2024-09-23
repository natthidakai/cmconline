import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/getUser'); // ปรับ URL ตามที่คุณกำหนด
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
    
                const usersData = await response.json();
                setUser(usersData); // สมมติว่า setUser เป็น array
            } catch (err) {
                setError(err.message);
            }
        };
    
        fetchUsers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (error) {
        return <div>เกิดข้อผิดพลาด: {error}</div>;
    }

    if (!user) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div>
        <h1>ข้อมูลผู้ใช้ทั้งหมด</h1>
        {user.map((u) => (
            <div key={u.id}>
                <p>ชื่อ: {u.first_name} {u.last_name}</p>
                <p>อีเมล: {u.email}</p>
                <p>เบอร์โทรศัพท์: {u.phone}</p>
            </div>
        ))}
    </div>
    );
};

export default Profile;
