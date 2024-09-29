import { useState } from 'react';
import { useRouter } from 'next/router';


export const useSignUp = () => {

    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [regisData, setRegisData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        id_card: "",
        password: "",
        CFpassword: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSameAddress, setIsSameAddress] = useState(false);

    const initialUserState = {
        title: '',
        first_name: '',
        last_name: '',
        projectID: '',
        unitNumber: '',
        phone: '',
        email: '',
        id_card: '',
        birth_date: '',
        nationality: '',
        marital_status: '',
        current_address: '',
        current_subdistrict: '',
        current_district: '',
        current_province: '',
        current_postal_code: '',
        address: '',
        subdistrict: '',
        district: '',
        province: '',
        postal_code: ''
    };

    const [user, setUser] = useState(initialUserState);

    const validateIdCard = (id) => {
        if (!/^\d{13}$/.test(id)) return false;
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(id.charAt(i)) * (13 - i);
        }
        const mod = sum % 11;
        const checkDigit = (11 - mod) % 10;
        return checkDigit === parseInt(id.charAt(12));
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const validatePhone = (phone) => {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(phone);
    };

    const validateSignUp = (regisData) => {
        let isValid = true;
        const newErrors = {};

        if (!regisData.first_name) {
            newErrors.first_name = 'กรุณาระบุชื่อ';
            isValid = false;
        }

        if (!regisData.last_name) {
            newErrors.last_name = 'กรุณาระบุนามสกุล';
            isValid = false;
        }

        if (!regisData.phone) {
            newErrors.phone = 'กรุณาระบุเบอร์โทรศัพท์';
            isValid = false;
        } else if (!validatePhone(regisData.phone)) {
            newErrors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น';
            isValid = false;
        }

        if (!regisData.email) {
            newErrors.email = 'กรุณาระบุอีเมล';
            isValid = false;
        } else if (!validateEmail(regisData.email)) {
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
            isValid = false;
        }

        if (!regisData.id_card) {
            newErrors.id_card = 'กรุณาระบุเลขบัตรประชาชน';
            isValid = false;
        } else if (!validateIdCard(regisData.id_card)) {
            newErrors.id_card = 'หมายเลขบัตรประชาชนไม่ถูกต้อง';
            isValid = false;
        }

        if (!regisData.password) {
            newErrors.password = 'กรุณาระบุรหัสผ่าน';
            isValid = false;
        }

        if (!regisData.CFpassword) {
            newErrors.CFpassword = 'กรุณายืนยันรหัสผ่าน';
            isValid = false;
        } else if (regisData.password !== regisData.CFpassword) {
            newErrors.CFpassword = 'รหัสผ่านไม่ตรงกัน';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const registerUser = async () => {
        setIsLoading(true);
        try {
            // ตรวจสอบข้อมูลการลงทะเบียน
            const isValid = await validateSignUp(regisData); // ใช้ await ที่นี่

            if (!isValid) {
                console.error("การตรวจสอบความถูกต้องของฟอร์มล้มเหลว");
                return; // หยุดถ้าการตรวจสอบล้มเหลว
            }

            // Register the user (use your API endpoint)
            const response = await fetch("/api/useRegister", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(regisData),
            });

            if (response.ok) {
                // รอ signIn หลังจากลงทะเบียนสำเร็จ
                const loginResponse = await fetch("/api/useLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: regisData.email,
                        password: regisData.password,
                    }),
                });

                const loginResult = await loginResponse.json();

                if (loginResponse.ok) {
                    localStorage.setItem('token', loginResult.token);
                    router.push("/profile").then(() => { // แก้ไขเครื่องหมายคำพูดที่นี่
                        router.reload();
                    });
                } else {
                    setErrors({ message: loginResult.message });
                }

                // รีเซ็ตข้อมูลการลงทะเบียน
                setRegisData({
                    first_name: "",
                    last_name: "",
                    phone: "",
                    email: "",
                    password: "",
                    CFpassword: "",
                });
            } else {
                const errorData = await response.json();
                setFormErrors({
                    email: errorData.message.includes("อีเมล") ? errorData.message : "",
                    phone: errorData.message.includes("เบอร์โทรศัพท์") ? errorData.message : "",
                });
                console.error("การลงทะเบียนล้มเหลว:", errorData.message);
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            setFormErrors({ general: "เกิดข้อผิดพลาดในการสมัครสมาชิก" });
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserData = async (user) => {
        const token = localStorage.getItem('token');
        
        // ตรวจสอบว่ามีค่า user หรือไม่
        if (!user) {
            console.error('User data is missing.');
            alert('ไม่พบข้อมูลผู้ใช้');
            return;
        }
    
        try {
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(user), // ส่งข้อมูล user
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // รับข้อมูลข้อผิดพลาดจากเซิร์ฟเวอร์
                throw new Error(errorData.message || 'Failed to save user data'); // แสดงข้อความข้อผิดพลาด
            }
    
            alert('ข้อมูลถูกบันทึกเรียบร้อย');
            router.push('/profile');
        } catch (error) {
            console.error('Error saving user data:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`); // แสดงข้อผิดพลาดให้ผู้ใช้ทราบ
        }
    };
    
    const validateBooking = (formData, showAddressSection) => {
        let isValid = true;
        const newErrors = {};
    
        // Validate personal info fields
        if (!formData.title) {
            newErrors.title = 'กรุณาเลือกคำนำหน้าชื่อ';
            isValid = false;
        }
    
        if (!formData.first_name) {
            newErrors.first_name = 'กรุณาระบุชื่อ';
            isValid = false;
        }
    
        if (!formData.last_name) {
            newErrors.last_name = 'กรุณาระบุนามสกุล';
            isValid = false;
        }
    
        if (!formData.phone) {
            newErrors.phone = 'กรุณาระบุเบอร์โทรศัพท์';
            isValid = false;
        }
    
        if (!formData.email) {
            newErrors.email = 'กรุณาระบุอีเมล';
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
            isValid = false;
        }
    
        if (!validateIdCard(formData.id_card)) {
            newErrors.id_card = 'หมายเลขบัตรประชาชนไม่ถูกต้อง';
            isValid = false;
        }
    
        if (!formData.birth_date) {
            newErrors.birth_date = 'กรุณาระบุวันเกิด';
            isValid = false;
        }
    
        if (!formData.nationality) {
            newErrors.nationality = 'กรุณาระบุสัญชาติ';
            isValid = false;
        }
    
        if (!formData.marital_status) {
            newErrors.marital_status = 'กรุณาระบุสถานะภาพ';
            isValid = false;
        }
    
        // Only validate address fields if the address section is visible
        if (showAddressSection) {
            if (!formData.current_address) {
                newErrors.current_address = 'กรุณาระบุที่อยู่ปัจจุบัน';
                isValid = false;
            }
    
            if (!formData.current_subdistrict) {
                newErrors.current_subdistrict = 'กรุณาระบุ แขวง/ตำบล';
                isValid = false;
            }
    
            if (!formData.current_district) {
                newErrors.current_district = 'กรุณาระบุ เขต/อำเภอ';
                isValid = false;
            }
    
            if (!formData.current_province) {
                newErrors.current_province = 'กรุณาระบุจังหวัด';
                isValid = false;
            }
    
            if (!formData.current_postal_code) {
                newErrors.current_postal_code = 'กรุณาระบุรหัสไปรษณีย์';
                isValid = false;
            }
    
            if (!formData.address) {
                newErrors.address = 'กรุณาระบุที่อยู่ตามทะเบียนบ้าน';
                isValid = false;
            }
    
            if (!formData.subdistrict) {
                newErrors.subdistrict = 'กรุณาระบุ แขวง/ตำบล';
                isValid = false;
            }
    
            if (!formData.district) {
                newErrors.district = 'กรุณาระบุ เขต/อำเภอ';
                isValid = false;
            }
    
            if (!formData.province) {
                newErrors.province = 'กรุณาระบุจังหวัด';
                isValid = false;
            }
    
            if (!formData.postal_code) { // แก้ชื่อให้ตรงกัน
                newErrors.postal_code = 'กรุณาระบุรหัสไปรษณีย์';
                isValid = false;
            }
        }
    
        // Set errors state
        setErrors(newErrors);
        return isValid;
    };

    const [formData, setFormData] = useState({
        title: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        id_card: '',
        birth_date: '',
        nationality: '',
        current_address: '',
        current_subdistrict: '',
        current_district: '',
        current_province: '',
        current_postal_code: '',
        address: '',
        subdistrict: '',
        district: '',
        province: '',
        postal_code: ''
    });
    

    const handleInputChange = (id, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        if (id === 'email') {setFormErrors((prevErrors) => ({ ...prevErrors, email: '' }));}
        if (id === 'phone') {setFormErrors((prevErrors) => ({ ...prevErrors, phone: '' }));}
        if (id === 'id_card') {setFormErrors((prevErrors) => ({ ...prevErrors, id_card: '' }));}
    };

    const handleCheckboxChange = (setUser, setIsSameAddress) => (event) => {
        const { checked } = event.target;
        setIsSameAddress(checked);
    
        if (checked) {
            setUser((prevUser) => ({
                ...prevUser,
                address: prevUser.current_address,
                subdistrict: prevUser.current_subdistrict,
                district: prevUser.current_district,
                province: prevUser.current_province,
                postal_code: prevUser.current_postal_code,
            }));
        } else {
            setUser((prevUser) => ({
                ...prevUser,
                address: '',
                subdistrict: '',
                district: '',
                province: '',
                postal_code: '',
            }));
        }
    };

    const submitBooking = async (e, projectID, unitNumber, showAddressSection, floorName, towerName) => {
        e.preventDefault();

        if (!user.member_id) {
            console.error('Member ID is missing');
            return;
        }

        console.log("Form Data Being Sent (user):", { ...user, projectID, unitNumber });

        const isValid = validateBooking(user, showAddressSection);

        if (isValid) {
            try {
                const updatedUser = {
                    ...user,
                    projectID,
                    unitNumber,
                };

                const response = await fetch('/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (response.ok) {
                    // การจองสำเร็จ
                    router.push(`/step/4?projectID=${projectID}&floorName=${floorName}&towerName=${towerName}&unitNumber=${unitNumber}`);
                    // ล้างข้อมูลผู้ใช้
                    setUser(initialUserState);
                } else {
                    // จัดการข้อผิดพลาดเมื่อการจองไม่สำเร็จ
                    const errorData = await response.json();
                    console.error('Failed to book', errorData);

                    if (errorData.redirect) {
                        alert(errorData.alert);
                        router.push(errorData.redirect);
                    } else {
                        alert(errorData.alert); // แสดงข้อความแจ้งเตือน
                    }
                }
            } catch (error) {
                console.error('Error submitting form', error);
            }
        } else {
            console.error('Form validation failed');
        }
    };

    return {
        regisData,
        isSameAddress,
        handleInputChange,
        handleCheckboxChange,
        errors,
        formErrors,
        registerUser,
        isLoading,
        updateUserData,
        setUser,
        user,
        submitBooking,
        formData,
    };
};