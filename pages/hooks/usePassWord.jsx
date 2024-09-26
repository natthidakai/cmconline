import { useState } from 'react';
import { useRouter } from 'next/router';

export const usePassword = (user) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState('');

    const router = useRouter();

    const changePassword = async (e) => {
        e.preventDefault();
        setErrors('');

        if (currentPassword === '') {
            setErrors('กรุณาระบุรหัสผ่านปัจจุบัน');
            return;
        } else if (newPassword === '') {
            setErrors('กรุณากำหนดรหัสผ่านใหม่');
            return;
        } else if (confirmPassword === '') {
            setErrors('กรุณายืนยันรหัสผ่านใหม่');
            return;
        } else if (newPassword !== confirmPassword) {
            setErrors('รหัสผ่านใหม่ไม่ตรงกัน');
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
                throw new Error(data.message);
            }

            // Reset form fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            alert('เปลี่ยนรหัสผ่านเรียบร้อย');
            router.push('/profile');
        } catch (error) {
            setErrors(error.message);
        }
    };

    const sendResetPassword = async (email) => {
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
    
        if (!response.ok) {
            throw new Error('Failed to send reset password email');
        }
    };

    return {
        currentPassword,
        newPassword,
        confirmPassword,
        errors,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        changePassword,
        sendResetPassword
    };
};