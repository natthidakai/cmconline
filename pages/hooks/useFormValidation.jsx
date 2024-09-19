// useFormValidation.js
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

    const validateForm = (formData) => {
        let isValid = true;
        const newErrors = {};

        if (!formData.namesTitle) {
            newErrors.namesTitle = 'กรุณาเลือกคำนำหน้าชื่อ';
            isValid = false;
        }

        if (!formData.fname) {
            newErrors.fname = 'กรุณาระบุชื่อ';
            isValid = false;
        }

        if (!formData.lname) {
            newErrors.lname = 'กรุณาระบุนามสกุล';
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
            newErrors.subdistrict1 = 'แขวง/ตำบล';
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

        setErrors(newErrors);
        return isValid;
    };

    return { errors, validateForm };
};
