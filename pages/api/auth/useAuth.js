import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export const useAuth = (user) => {

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isChangePassPage = router.pathname === '/changepass';

        if (token && !isChangePassPage) {
            router.push('/profile');
        }
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const loginUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!loginData.email || !loginData.password) {
            setErrors({ message: 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน' }); // Set error as an object
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/useLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token);
                router.push("/").then(() => {
                    router.reload();
                });
            } else {
                setErrors({ message: result.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' }); // Set error as an object
            }
        } catch (error) {
            // console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", error);
            setErrors({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors
        setIsLoading(true); // Start loading state

        // Validate inputs
        if (currentPassword === '') {
            setErrors({ message: 'กรุณาระบุรหัสผ่านปัจจุบัน' });
            setIsLoading(false); // Stop loading state
            return;
        } else if (newPassword === '') {
            setErrors({ message: 'กรุณากำหนดรหัสผ่านใหม่' });
            setIsLoading(false); // Stop loading state
            return;
        } else if (confirmPassword === '') {
            setErrors({ message: 'กรุณายืนยันรหัสผ่านใหม่' });
            setIsLoading(false); // Stop loading state
            return;
        } else if (newPassword !== confirmPassword) {
            setErrors({ message: 'รหัสผ่านใหม่ไม่ตรงกัน' });
            setIsLoading(false); // Stop loading state
            return;
        }

        try {
            const response = await fetch('/api/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword, member_id: user.member_id }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
            }

            // Reset form fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            alert('เปลี่ยนรหัสผ่านเรียบร้อย');
            router.push('/profile');
        } catch (error) {
            setErrors({ message: error.message }); // Set error message as an object
        } finally {
            setIsLoading(false); // Ensure loading state is stopped
        }
    };


    return {
        loginData,
        errors,
        isLoading,
        handleInputChange,
        loginUser,
        currentPassword,
        newPassword,
        confirmPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        changePassword
    };
};