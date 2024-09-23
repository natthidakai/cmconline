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

        if (!validateIdCard(formData.idCard)) {
            newErrors.idCard = 'หมายเลขบัตรประชาชนไม่ถูกต้อง';
            isValid = false;
        }

        if (!formData.birthday) {
            newErrors.birthday = 'กรุณาระบุวันเกิด';
            isValid = false;
        }

        // Only validate address fields if the address section is visible
        if (showAddressSection) {
            if (!formData.nationality) {
                newErrors.nationality = 'กรุณาระบุสัญชาติ';
                isValid = false;
            }

            if (!formData.status) {
                newErrors.status = 'กรุณาระบุสถานะภาพ';
                isValid = false;
            }

            if (!formData.address1) {
                newErrors.address1 = 'กรุณาระบุที่อยู่ปัจจุบัน';
                isValid = false;
            }

            if (!formData.subdistrict1) {
                newErrors.subdistrict1 = 'กรุณาระบุ แขวง/ตำบล';
                isValid = false;
            }

            if (!formData.districts1) {
                newErrors.districts1 = 'กรุณาระบุ เขต/อำเภอ';
                isValid = false;
            }

            if (!formData.provinces1) {
                newErrors.provinces1 = 'กรุณาระบุจังหวัด';
                isValid = false;
            }

            if (!formData.postalCode1) {
                newErrors.postalCode1 = 'กรุณาระบุรหัสไปรษณีย์';
                isValid = false;
            }

            if (!formData.address2) {
                newErrors.address2 = 'กรุณาระบุที่อยู่ตามทะเบียนบ้าน';
                isValid = false;
            }

            if (!formData.subdistrict2) {
                newErrors.subdistrict2 = 'กรุณาระบุ แขวง/ตำบล';
                isValid = false;
            }

            if (!formData.districts2) {
                newErrors.districts2 = 'กรุณาระบุ เขต/อำเภอ';
                isValid = false;
            }

            if (!formData.provinces2) {
                newErrors.provinces2 = 'กรุณาระบุจังหวัด';
                isValid = false;
            }

            if (!formData.postalCode2) {
                newErrors.postalCode2 = 'กรุณาระบุรหัสไปรษณีย์';
                isValid = false;
            }
        }

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

    const bookInputChange = (e, setFormData) => {
        const { name, value } = e.target;

        let filteredValue = value;

        // กรองข้อมูลตามชื่อฟิลด์ที่ต้องการ
        if (name === 'idCard' || name === 'phone' || name === 'postalCode1' || name === 'postalCode2') {
            filteredValue = value.replace(/\D/g, '');
        } else if (name === 'email') {
            filteredValue = value.replace(/[\u0E00-\u0E7F]/g, '');
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: filteredValue
        }));
    };

    const regisInputChange = (e, setRegisData) => {

        const { name, value } = e.target;
        
        let filteredValue = value;

        if (name === 'phone') {
            filteredValue = value.replace(/\D/g, ''); // อนุญาตให้กรอกแค่ตัวเลข
        } else if (name === 'email') {
            filteredValue = value.replace(/[\u0E00-\u0E7F]/g, ''); // ลบตัวอักษรไทย
        }

        setRegisData(prevData => ({
            ...prevData,
            [name]: filteredValue
        }));
    };

    return { errors, bookInputChange, regisInputChange, validateForm, validateRegister };
};
