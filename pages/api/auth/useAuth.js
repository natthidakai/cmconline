import { useState } from "react";
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

export const useAuth = () => {
    const { data: session } = useSession();

    const [errorsSignIn, setErrorsSignIn] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [changPsw, setChangPsw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [resetPsw, setResetPsw] = useState({ email: '', newPassword: '', confirmPassword: '' })
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorsSignIn({}); // ล้างข้อผิดพลาดก่อน
    
        // ตรวจสอบว่าอีเมลและรหัสผ่านไม่เป็นค่าว่าง
        if (!signInData.email || !signInData.password) {
            setErrorsSignIn({ message: "กรุณาระบุอีเมลและรหัสผ่าน" });
            setIsLoading(false);
            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
        }
    
        try {
            // ลองเข้าสู่ระบบ
            const result = await signIn("credentials", {
                redirect: false,
                email: signInData.email,
                password: signInData.password,
            });
    
            // ตรวจสอบผลการเข้าสู่ระบบ
            if (result.error) {
                setErrorsSignIn({ message: result.error });
            } else {
                // router.push("/");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error during sign in:", error);
            setErrorsSignIn({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
        } finally {
            setIsLoading(false); // กำหนดเป็น false ในทุกกรณี
        }
    };
    
    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSignInData((prevData) => ({
          ...prevData,
          [id]: value, // Update the specific input's value
        }));
        if (errorsSignIn.message) {
            setErrorsSignIn({}); // Clear errors if any
        }
      };

    const changePassword = async (e, session) => {
        e.preventDefault(); // ป้องกันการส่งฟอร์ม
        setErrorsSignIn(null);
        setIsLoading(true);

        const { currentPassword, newPassword, confirmPassword } = changPsw;

        // Validate inputs
        if (!currentPassword) {
            setErrorsSignIn({ message: 'กรุณาระบุรหัสผ่านปัจจุบัน' });
            setIsLoading(false);
            return;
        } else if (!newPassword) {
            setErrorsSignIn({ message: 'กรุณากำหนดรหัสผ่านใหม่' });
            setIsLoading(false);
            return;
        } else if (!confirmPassword) {
            setErrorsSignIn({ message: 'กรุณายืนยันรหัสผ่านใหม่' });
            setIsLoading(false);
            return;
        } else if (newPassword !== confirmPassword) {
            setErrorsSignIn({ message: 'รหัสผ่านใหม่ไม่ตรงกัน' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/changePassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, member_id: session.user.id }),
            });

            // ตรวจสอบว่าการตอบสนองไม่ถูกต้อง
            if (!response.ok) {
                const data = await response.json();
                // ถ้ารหัสผ่านปัจจุบันไม่ถูกต้อง
                if (data.error && data.error === 'Invalid current password') {
                    setErrorsSignIn({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
                } else {
                    throw new Error(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
                }
                setIsLoading(false);
                return; // หยุดการดำเนินการต่อหากพบข้อผิดพลาด
            }

            // รีเซ็ตฟอร์มหลังจากเปลี่ยนรหัสผ่าน
            setChangPsw({ currentPassword: '', newPassword: '', confirmPassword: '' });
            alert('เปลี่ยนรหัสผ่านเรียบร้อย'); // แสดงข้อความยืนยัน
            router.push('/profile'); // ไปยังหน้าโปรไฟล์
        } catch (error) {
            setErrorsSignIn({ message: error.message }); // ตั้งค่าข้อผิดพลาดหากเกิดข้อผิดพลาด
        } finally {
            setIsLoading(false); // ปิดสถานะการโหลด
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await fetch('/api/resetPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }), // ส่งอีเมลไปในรูปแบบ JSON
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.exists; // คาดว่า API จะส่งข้อมูลในรูปแบบ { exists: true } หรือ { exists: false }
        } catch (error) {
            console.error('Error checking email:', error);
            return false; // หากเกิดข้อผิดพลาด ให้คืนค่า false
        }
    };

    const checkEmail = async (e) => {
        e.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ

        // ตรวจสอบว่ามีการกรอกอีเมลหรือไม่
        if (!resetPsw.email) {
            setErrorsSignIn({ message: 'กรุณากรอกอีเมล' }); // ตั้งค่าข้อความเตือน
            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
        }

        // ตรวจสอบรูปแบบอีเมล
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetPsw.email)) {
            setErrorsSignIn({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }); // ตั้งค่าข้อความเตือน
            return; // หยุดการทำงานถ้ารูปแบบอีเมลไม่ถูกต้อง
        }

        const response = await fetch('/api/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: resetPsw.email }), // ส่งอีเมลที่กรอก
        });

        const data = await response.json();

        if (response.ok) {
            // อีเมลมีอยู่ในระบบ ให้แสดงช่องกรอก newPassword
            setShowNewPasswordInput(true); // ตั้งค่าสถานะเพื่อแสดงฟอร์มกรอกรหัสผ่านใหม่
            setEmailChecked(true); // ตั้งค่าสถานะอีเมลที่ตรวจสอบแล้ว
            setErrorsSignIn('')
        } else {
            setErrorsSignIn({ message: data.message }); // แสดงข้อความข้อผิดพลาด
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ

        // ตรวจสอบว่ามีการกรอกอีเมลหรือไม่
        if (!resetPsw.email) {
            setErrorsSignIn({ message: 'กรุณากรอกอีเมล' }); // ตั้งค่าข้อความเตือน
            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
        }

        // ตรวจสอบว่ามีการกรอกรหัสผ่านใหม่หรือไม่
        if (!resetPsw.newPassword) {
            setErrorsSignIn({ message: 'กรุณากรอกรหัสผ่านใหม่' }); // ตั้งค่าข้อความเตือน
            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
        }

        // ตรวจสอบว่ามีการกรอกรหัสผ่านใหม่หรือไม่
        if (!resetPsw.confirmPassword) {
            setErrorsSignIn({ message: 'กรุณายืนยันรหัสผ่านใหม่' }); // ตั้งค่าข้อความเตือน
            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
        }

        // ตรวจสอบว่ารหัสผ่านใหม่และการยืนยันรหัสผ่านตรงกันหรือไม่
        if (resetPsw.newPassword !== resetPsw.confirmPassword) {
            setErrorsSignIn({ message: 'การยืนยันรหัสผ่านไม่สำเร็จ' }); // ตั้งค่าข้อความเตือน
            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
        }

        const response = await fetch('/api/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: resetPsw.email, newPassword: resetPsw.newPassword }), // ส่งอีเมลและรหัสผ่านใหม่
        });

        const data = await response.json();

        if (response.ok) {
            alert('รีเซ็ตรหัสผ่านสำเร็จ'); // แสดงข้อความสำเร็จเป็น string
            router.push('/signin'); // หรือเปลี่ยนไปยังหน้าที่ต้องการหลังจากรีเซ็ตรหัสผ่านสำเร็จ
        } else {
            setErrorsSignIn({ message: data.message }); // แจ้งข้อผิดพลาด
        }
    };

    return {
        signInData,
        setSignInData,
        handleInputChange,
        setErrorsSignIn,
        errorsSignIn,
        isLoading,
        handleSignIn,
        handleSignOut,
        changePassword,
        changPsw,
        setChangPsw,
        currentPassword,
        newPassword,
        confirmPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        resetPassword,
        checkEmail,
        checkEmailExists,
        resetPsw,
        setResetPsw,
        emailChecked,
        setEmailChecked,
        showNewPasswordInput,
        setShowNewPasswordInput,
        isLoggedIn: !!session,
    };
};
