import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export const useSignUp = () => {

  const { data: session, status } = useSession();
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
  const [navigateToProfile, setNavigateToProfile] = useState(false);

  const [showAddressSection, setShowAddressSection] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated') {
        const token = session.user?.token;
        const memberID = session.user.id;

        if (!token) {
          console.error('No token found in session');
          return;
        }

        try {
          const response = await fetch(`/api/getUser?member_id=${memberID}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching user data:', errorData.message);
            setErrors(errorData.message);
            return;
          }

          const data = await response.json();
          setUser(data); // Set user data here
        } catch (err) {
          console.error('Error fetching user data:', err);
          setErrors('Failed to fetch user data');
        }
      }
    };

    fetchUserData();
  }, [session, status]);

  const initialUserState = {
    title_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    id_card: "",
    birth_date: "",
    nationality: "",
    marital_status: "",
    current_address: "",
    current_subdistrict: "",
    current_district: "",
    current_province: "",
    current_postal_code: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postal_code: "",
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
      newErrors.first_name = "กรุณาระบุชื่อ";
      isValid = false;
    }

    if (!regisData.last_name) {
      newErrors.last_name = "กรุณาระบุนามสกุล";
      isValid = false;
    }

    if (!regisData.phone) {
      newErrors.phone = "กรุณาระบุเบอร์โทรศัพท์";
      isValid = false;
    } else if (!validatePhone(regisData.phone)) {
      newErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น";
      isValid = false;
    }

    if (!regisData.email) {
      newErrors.email = "กรุณาระบุอีเมล";
      isValid = false;
    } else if (!validateEmail(regisData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
      isValid = false;
    }

    if (!regisData.id_card) {
      newErrors.id_card = "กรุณาระบุเลขบัตรประชาชน";
      isValid = false;
    } else if (!validateIdCard(regisData.id_card)) {
      newErrors.id_card = "หมายเลขบัตรประชาชนไม่ถูกต้อง";
      isValid = false;
    }

    if (!regisData.password) {
      newErrors.password = "กรุณาระบุรหัสผ่าน";
      isValid = false;
    }

    if (!regisData.CFpassword) {
      newErrors.CFpassword = "กรุณายืนยันรหัสผ่าน";
      isValid = false;
    } else if (regisData.password !== regisData.CFpassword) {
      newErrors.CFpassword = "รหัสผ่านไม่ตรงกัน";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const registerUser = async () => {
    setIsLoading(true);

    try {
      // ตรวจสอบข้อมูลการลงทะเบียน
      const isValid = await validateSignUp(regisData);

      if (!isValid) {
        console.error("การตรวจสอบความถูกต้องของฟอร์มล้มเหลว");
        return; // หยุดถ้าการตรวจสอบล้มเหลว
      }

      // ลงทะเบียนผู้ใช้
      const response = await fetch("/api/useRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regisData),
      });

      if (response.ok) {
        // เข้าสู่ระบบอัตโนมัติหลังจากลงทะเบียนสำเร็จ
        const loginResult = await signIn("credentials", {
          redirect: false, // อย่าทำการเปลี่ยนเส้นทางโดยอัตโนมัติ ให้จัดการเอง
          email: regisData.email,
          password: regisData.password,
        });

        if (loginResult.ok) {
          // ตั้งค่าสถานะเพื่อทำการนำทางไปที่โปรไฟล์หลังจากเข้าสู่ระบบสำเร็จ
          setNavigateToProfile(true);
        } else {
          setErrors({ message: loginResult.error });
          console.error("การเข้าสู่ระบบล้มเหลว:", loginResult.error);
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

  // จัดการการนำทางใน useEffect
  useEffect(() => {
    if (navigateToProfile) {
      router.push("/profile");
    }
  }, [navigateToProfile]); // รัน effect เมื่อ navigateToProfile เปลี่ยนแปลง

  const updateUserData = async (user) => {
    setIsLoading(true);
    try {
      const isValid = await validateProfile(user);

      if (!isValid) {
        console.error("การตรวจสอบความถูกต้องของฟอร์มล้มเหลว");
        return { success: false }; // เพิ่มการคืนค่าเพื่อแสดงความล้มเหลว
      }

      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to save user data";
        console.error(errorMessage);
        alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
        return { success: false }; // เพิ่มการคืนค่าเพื่อแสดงความล้มเหลว
      }

      alert("ข้อมูลถูกบันทึกเรียบร้อย");
      router.push("/profile");
      return { success: true }; // คืนค่าสำเร็จ
    } catch (error) {
      console.error("Error saving user data:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
      return { success: false }; // เพิ่มการคืนค่าเพื่อแสดงความล้มเหลว
    } finally {
      setIsLoading(false);
    }
  };

  const validateProfile = (user) => {
    let isValid = true;
    const newErrors = {};

    if (!user.first_name) {
      newErrors.first_name = "กรุณาระบุชื่อ";
      isValid = false;
    }

    if (!user.last_name) {
      newErrors.last_name = "กรุณาระบุนามสกุล";
      isValid = false;
    }

    if (!user.phone) {
      newErrors.phone = "กรุณาระบุเบอร์โทรศัพท์";
      isValid = false;
    } else if (!validatePhone(user.phone)) {
      newErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น";
      isValid = false;
    }

    if (!user.email) {
      newErrors.email = "กรุณาระบุอีเมล";
      isValid = false;
    } else if (!validateEmail(user.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
      isValid = false;
    }

    if (!user.id_card) {
      newErrors.id_card = "กรุณาระบุเลขบัตรประชาชน";
      isValid = false;
    } else if (!validateIdCard(user.id_card)) {
      newErrors.id_card = "หมายเลขบัตรประชาชนไม่ถูกต้อง";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  ;

  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    id_card: "",
    birth_date: "",
    nationality: "",
    current_address: "",
    current_subdistrict: "",
    current_district: "",
    current_province: "",
    current_postal_code: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postal_code: "",
  });

  const formFieldsPersonal = [
    { label: "คำนำหน้าชื่อ", id: "title_name", type: "select", options: ["-- กรุณาเลือก --", "นาย", "นาง", "นางสาว"], value: user.title_name, name: 'title_name' },
    { label: "ชื่อ", id: "first_name", type: "text", value: user.first_name },
    { label: "นามสกุล", id: "last_name", type: "text", value: user.last_name },
    { label: "อีเมล", id: "email", type: "text", value: user.email },
    { label: "เบอร์โทรศัพท์", id: "phone", type: "text", value: user.phone },
    { label: "เลขบัตรประชาชน", id: "id_card", type: "text", value: user.id_card, name: 'id_card' },
    { label: "วันเกิด", id: "birth_date", type: "date", value: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '', nacme: 'birth_date' },
    { label: "สัญชาติ", id: "nationality", type: "text", value: user.nationality, name: 'nationality' },
    { label: "สถานะภาพ", id: "marital_status", type: "select", options: ["-- กรุณาเลือก --", "โสด", "สมรส", "หย่า", "หม้าย", "ไม่ระบุ"], value: user.marital_status, name: 'marital_status' },
  ];

  const formFieldsCurrentAddress = [
    { label: "ที่อยู่", id: "current_address", type: "text", name: 'current_address', value: user.current_address, },
    { label: "แขวง/ตำบล", id: "current_subdistrict", type: "text", name: 'current_subdistrict', value: user.current_subdistrict, },
    { label: "เขต/อำเภอ", id: "current_district", type: "text", name: 'current_district', value: user.current_district, },
    { label: "จังหวัด", id: "current_province", type: "text", name: 'current_province', value: user.current_province, },
    { label: "รหัสไปรษณีย์", id: "current_postal_code", type: "text", name: 'current_postal_code', value: user.current_postal_code, },
  ];

  const formFieldsAddress = [
    { label: "ที่อยู่", id: "address", type: "text", name: "address", value: user.address },
    { label: "แขวง/ตำบล", id: "subdistrict", type: "text", name: "subdistrict", value: user.subdistrict, },
    { label: "เขต/อำเภอ", id: "district", type: "text", name: "district", value: user.district },
    { label: "จังหวัด", id: "province", type: "text", name: "province", value: user.province },
    { label: "รหัสไปรษณีย์", id: "postal_code", type: "text", name: "postal_code", value: user.postal_code, },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;

    // ตรวจสอบว่ามี id หรือไม่
    if (!id) {
      console.error("ID is missing in the event target.");
      return; // ออกจากฟังก์ชันถ้าไม่มี id
    }

    let newValue = value;

    // กำหนดเงื่อนไขการอัปเดตค่าใหม่
    const formatters = {
      email: (val) => {
        const sanitized = val.replace(/[\u0E00-\u0E7F]/g, "").replace(/[^a-zA-Z0-9@._-]/g, "");
        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
          console.warn("Invalid email format:", sanitized);
          return sanitized; // Return sanitized value even if it's invalid
        }
        return sanitized;
      },
      phone: (val) => val.replace(/\D/g, "").slice(0, 10),
      id_card: (val) => val.replace(/\D/g, "").slice(0, 13),
      current_postal_code: (val) => val.replace(/\D/g, "").slice(0, 5),
      postal_code: (val) => val.replace(/\D/g, "").slice(0, 5),
    };

    // ใช้ formatters เพื่ออัปเดต newValue
    if (formatters[id]) {
      newValue = formatters[id](newValue);
    }

    // อัปเดต state ของ user
    setUser((prevUser) => ({
      ...prevUser,
      [id]: newValue,
    }));
  };


  const handleInputRegister = (e) => {
    const { name, value } = e.target;

    // อัปเดตข้อมูล regisData ตามการเปลี่ยนแปลงของฟิลด์
    setRegisData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        address: "",
        subdistrict: "",
        district: "",
        province: "",
        postal_code: "",
      }));
    }
  };

  const checkFormPersonal = (user) => {
    const requiredFields = ["title_name", "first_name", "last_name", "phone", "email", "id_card", "birth_date", "nationality", "marital_status"];
    const allRequiredFieldsFilled = requiredFields.every((field) => {
      const value = user[field];
      if (field === "id_card") return value && value.length === 13;
      if (field === "phone") return value && value.length === 10;
      return value && value.trim() !== '';
    });
    // console.log("All required fields filled:", allRequiredFieldsFilled);
    setShowAddressSection(allRequiredFieldsFilled);
  };

  const validateBooking = (user, showAddressSection) => {
    // Clear previous error messages
    setErrors('');

    // Validate personal info fields one by one
    if (!user.title) {
      setErrors('กรุณาเลือกคำนำหน้าชื่อ');
      return false;
    }

    if (!user.first_name) {
      setErrors('กรุณาระบุชื่อ');
      return false;
    }

    if (!user.last_name) {
      setErrors('กรุณาระบุนามสกุล');
      return false;
    }

    if (!user.phone) {
      setErrors('กรุณาระบุเบอร์โทรศัพท์');
      return false;
    }

    if (!user.email) {
      setErrors('กรุณาระบุอีเมล');
      return false;
    } else if (!validateEmail(user.email)) {
      setErrors('รูปแบบอีเมลไม่ถูกต้อง');
      return false;
    }

    if (!validateIdCard(user.id_card)) {
      setErrors('หมายเลขบัตรประชาชนไม่ถูกต้อง');
      return false;
    }

    if (!user.birth_date) {
      setErrors('กรุณาระบุวันเกิด');
      return false;
    }

    if (!user.nationality) {
      setErrors('กรุณาระบุสัญชาติ');
      return false;
    }

    if (!user.marital_status) {
      setErrors('กรุณาระบุสถานะภาพ');
      return false;
    }

    // Only validate address fields if the address section is visible
    if (showAddressSection) {
      if (!user.current_address) {
        setErrors('กรุณาระบุที่อยู่ปัจจุบัน');
        return false;
      }

      if (!user.current_subdistrict) {
        setErrors('กรุณาระบุ แขวง/ตำบล');
        return false;
      }

      if (!user.current_district) {
        setErrors('กรุณาระบุ เขต/อำเภอ');
        return false;
      }

      if (!user.current_province) {
        setErrors('กรุณาระบุจังหวัด');
        return false;
      }

      if (!user.current_postal_code) {
        setErrors('กรุณาระบุรหัสไปรษณีย์');
        return false;
      }

      if (!user.address) {
        setErrors('กรุณาระบุที่อยู่ตามทะเบียนบ้าน');
        return false;
      }

      if (!user.subdistrict) {
        setErrors('กรุณาระบุ แขวง/ตำบล');
        return false;
      }

      if (!user.district) {
        setErrors('กรุณาระบุ เขต/อำเภอ');
        return false;
      }

      if (!user.province) {
        setErrors('กรุณาระบุจังหวัด');
        return false;
      }

      if (!user.postal_code) {
        setErrors('กรุณาระบุรหัสไปรษณีย์');
        return false;
      }
    }

    // If no errors were found
    setErrors(''); // Clear errors if everything is valid
    return true;
};



  const submitBooking = async (e, projectID, unitNumber, showAddressSection, floorName, towerName) => {
    e.preventDefault();

    if (!user.member_id) {
      console.error("Member ID is missing");
      return;
    }

    const isValid = validateBooking(user, showAddressSection);

    if (isValid) {
      try {
        const updatedUser = {
          ...user,
          projectID,
          unitNumber,
        };

        const response = await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          // Booking successful
          router.push(
            `/step/4?projectID=${projectID}&floorName=${floorName}&towerName=${towerName}&unitNumber=${unitNumber}`
          );
          // Clear user data
          setUser(initialUserState);
        } else {
          // Handle error when booking fails
          const errorData = await response.json();
          console.error("Failed to book", errorData);

          if (errorData.redirect) {
            alert(errorData.alert);
            router.push(errorData.redirect);
          } else {
            alert(errorData.alert); // Show alert message
          }
        }
      } catch (error) {
        console.error("Error submitting form", error);
      }
    } else {
      console.error("Form validation failed");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Check if ID is present
    if (!id) {
      console.error("ID is missing in the event target.");
      return; // Exit if ID is not present
    }

    let newValue = value;

    // Define formatting conditions
    const formatters = {
      email: (val) => {
        const sanitized = val.replace(/[\u0E00-\u0E7F]/g, "").replace(/[^a-zA-Z0-9@._-]/g, "");
        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
          console.warn("Invalid email format:", sanitized);
          return sanitized; // Return sanitized value even if it's invalid
        }
        return sanitized;
      },
      phone: (val) => val.replace(/\D/g, "").slice(0, 10),
      id_card: (val) => val.replace(/\D/g, "").slice(0, 13),
      current_postal_code: (val) => val.replace(/\D/g, "").slice(0, 5),
      postal_code: (val) => val.replace(/\D/g, "").slice(0, 5),
    };

    // Use formatters to update newValue
    if (formatters[id]) {
      newValue = formatters[id](value); // Pass the value to the formatter
    }

    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        [id]: newValue,
      };
      // console.log("Updated User Data:", updatedUser); // Log updated user data
      return updatedUser;
    });
  };

  return {
    regisData,
    isSameAddress,
    status,
    setIsSameAddress,
    handleCheckboxChange,
    errors,
    setErrors,
    formErrors,
    registerUser,
    isLoading,
    updateUserData,
    setUser,
    user,
    submitBooking,
    formData,
    handleChange,
    handleInputRegister,
    formFieldsPersonal,
    formFieldsCurrentAddress,
    formFieldsAddress,
    checkFormPersonal,
    showAddressSection,
    handleInputChange,
    submitBooking,
  };
};
