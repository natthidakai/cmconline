import React, { useState } from "react";
import { useRouter } from 'next/router';

const Login = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const loginUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
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
                localStorage.setItem('token', result.token); // สมมุติว่า API ส่ง token กลับมา
                router.push("/profile");
            } else {
                setErrors({ message: result.message });
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", error);
            setErrors({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="login-container">
            <h2>เข้าสู่ระบบ</h2>
            {errors.message && <div className="text-danger">{errors.message}</div>}
            <form onSubmit={loginUser}>
                <div>
                    <label htmlFor="email">อีเมล</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">รหัสผ่าน</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
            </form>
        </div>
    );
};

export default Login;
