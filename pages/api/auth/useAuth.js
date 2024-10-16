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
    const [resetPsw, setResetPsw] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' })
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailChecked, setEmailChecked] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

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

    const handleSignInChange = (e) => {
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
        e.preventDefault(); 

        if (!resetPsw.email) {
            setErrorsSignIn({ message: 'กรุณาระบุอีเมล' });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetPsw.email)) {
            setErrorsSignIn({ message: 'รูปแบบอีเมลไม่ถูกต้อง โปรดลองอีกครั้ง' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resetPsw.email }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowNewPassword(true);
                setEmailChecked(true);
                setErrorsSignIn(''); // Clear errors on success
            } else {
                setErrorsSignIn({ message: data.message }); // Display error message
            }
        } catch (error) {
            console.error('Error during email check:', error);
            setErrorsSignIn({ message: 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล' }); // General error message
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
    
        // Validate email
        if (!resetPsw.email) {
            setErrorsSignIn({ message: 'กรุณาระบุอีเมล' });
            return;
        }
    
        // Validate OTP
        if (!resetPsw.otp) {
            setErrorsSignIn({ message: 'กรุณาระบุ OTP' });
            return;
        }
    
        // Validate new password
        if (!resetPsw.newPassword) {
            setErrorsSignIn({ message: 'กรุณากรอกรหัสผ่านใหม่' });
            return;
        }
    
        // Validate confirm password
        if (!resetPsw.confirmPassword) {
            setErrorsSignIn({ message: 'กรุณายืนยันรหัสผ่านใหม่' });
            return;
        }
    
        // Check if new password and confirm password match
        if (resetPsw.newPassword !== resetPsw.confirmPassword) {
            setErrorsSignIn({ message: 'การยืนยันรหัสผ่านไม่สำเร็จ' });
            return;
        }

        setIsLoading(true);
    
        try {
            // Send data to API
            const response = await fetch('/api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: resetPsw.email, 
                    otp: resetPsw.otp, 
                    newPassword: resetPsw.newPassword 
                }),
            });
    
            const data = await response.json();
    
            // Check the result from API
            if (response.ok) {
                alert('รีเซ็ตรหัสผ่านสำเร็จ');
                router.push('/signin'); // Navigate to sign-in page
            } else {
                setErrorsSignIn({ message: data.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' });
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            setErrorsSignIn({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์' });
        } finally {
            setIsLoading(false); // Stop loading
        }
    };   
    
    const requestNewOTP = () => {
        // Call the API to request a new OTP
        fetch('/api/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: resetPsw.email }), // Send email to request new OTP
        })
        .then(response => response.json())
        .then(data => {
            // Handle response, e.g. show success message
            if (data.message) {
                console.log(data.message);
            }
        })
        .catch(error => {
            console.error('Error requesting new OTP:', error);
        });
    };
    
    return {
        signInData,
        setSignInData,
        handleSignInChange,
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
        showNewPassword,
        requestNewOTP,
        isLoggedIn: !!session,
    };
};
