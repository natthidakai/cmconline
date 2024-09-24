import { useState } from 'react';

export const useFormValidation = () => {

    const [errors, setErrors] = useState({});

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
        const phonePattern = /^\d+$/; // ตรวจสอบว่าเป็นเลขทั้งหมด
        return phonePattern.test(phone);
    };

    //user booking
    const validateForm = (formData, showAddressSection) => {
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
    
    
    const validateRegister = (regisData) => {
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

        setErrors(newErrors); // ตั้งค่า errors ทันทีหลังจากตรวจสอบ
        return isValid && Object.keys(newErrors).length === 0;
    };

    

    return { errors, validateForm, validateRegister, validateEmail };
};
