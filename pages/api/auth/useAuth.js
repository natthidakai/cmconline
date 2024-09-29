import { useState } from "react";
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

export const useAuth = () => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors.message) {
            setErrors({}); // Clear previous errors
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
    
        // ตรวจสอบว่าอีเมลและรหัสผ่านไม่เป็นค่าว่าง
        if (!formData.email || !formData.password) {
            setErrors({ message: "กรุณาระบุอีเมลและรหัสผ่าน" });
            setIsLoading(false);
            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
        }
    
        // ลองเข้าสู่ระบบ
        const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
        });
    
        // ตรวจสอบผลการเข้าสู่ระบบ
        if (result.error) {
            setErrors({ message: result.error });
        } else {
            router.push("/");  // เปลี่ยนเส้นทางเมื่อเข้าสู่ระบบสำเร็จ
        }
        setIsLoading(false);
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        const { currentPassword, newPassword, confirmPassword } = formData;

        // Validate inputs
        if (!currentPassword) {
            setErrors({ message: 'กรุณาระบุรหัสผ่านปัจจุบัน' });
            setIsLoading(false);
            return;
        } else if (!newPassword) {
            setErrors({ message: 'กรุณากำหนดรหัสผ่านใหม่' });
            setIsLoading(false);
            return;
        } else if (!confirmPassword) {
            setErrors({ message: 'กรุณายืนยันรหัสผ่านใหม่' });
            setIsLoading(false);
            return;
        } else if (newPassword !== confirmPassword) {
            setErrors({ message: 'รหัสผ่านใหม่ไม่ตรงกัน' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/changePassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, member_id: session.user.member_id }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
            }

            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
            alert('เปลี่ยนรหัสผ่านเรียบร้อย');
            router.push('/profile');
        } catch (error) {
            setErrors({ message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSignIn,   // Use this directly in your sign-in form
        changePassword,
        handleSignOut,  // For logout
        isLoggedIn: !!session,
    };
};
