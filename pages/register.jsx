import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useFormValidation } from "./hooks/useFormValidation";
import { useRouter } from "next/router";

import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";

const Register = () => {
    // เพิ่ม isLoading state
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
  
    const [formErrors, setFormErrors] = useState({});
    const { errors, regisInputChange, validateRegister } = useFormValidation();
    const [regisData, setRegisData] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      CFpassword: "",
    });
  
    const registerUser = async (e) => {
        e.preventDefault();
        
        // ตรวจสอบค่า regisData ล่าสุด
        console.log("Current regisData:", regisData);
      
        const isValid = validateRegister(regisData);
      
        if (!isValid) {
          console.error("Form validation failed");
          return;
        }
      
        setIsLoading(true); // เริ่มการโหลด
      
        try {
          const response = await fetch("/api/useRegister", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(regisData), // ใช้ค่า regisData ล่าสุด
          });
      
          if (response.ok) {
            router.push("/"); // เปลี่ยนไปที่หน้าแรกหลังจากสมัครสมาชิกสำเร็จ
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
              phone: errorData.message.includes("เบอร์โทรศัพท์")
                ? errorData.message
                : "",
            });
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาด:", error);
        } finally {
          setIsLoading(false); // หยุดการโหลด
        }
      };
      
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisData((prevData) => ({
          ...prevData,
          [name]: value, // อัปเดตค่าฟิลด์ที่เปลี่ยนแปลง
        }));
      };
      
  

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xxl="5" xl="6" lg="6" md="8" sm="10" xs="10">
          <Row className="box-step-3 p-5 box-shadow">
            <div>
              <Col className="center mb-3">
                <Image src={LOGO} alt="" width={100} height={100} />
                <br />
              </Col>
              <Col>
                <h3 className="th px-3 center mb-4">ลงทะเบียนใช้งาน</h3>
              </Col>
            </div>

            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
              <label htmlFor="first_name" className="form-label th">
                ชื่อ
              </label>
              <input
                name="first_name"
                type="text"
                id="first_name"
                className="form-control th"
                value={regisData.first_name}
                onChange={handleInputChange}
              />
              {errors.first_name && (
                <div className="text-danger mt-2 th">{errors.first_name}</div>
              )}
            </Col>

            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
              <label htmlFor="last_name" className="form-label th">
                นามสกุล
              </label>
              <input
                name="last_name"
                type="text"
                id="last_name"
                className="form-control th"
                value={regisData.last_name}
                onChange={handleInputChange}
              />
              {errors.last_name && (
                <div className="text-danger mt-2 th">{errors.last_name}</div>
              )}
            </Col>

            <Col
              xxl="12"
              xl="12"
              lg="12"
              md="12"
              sm="12"
              xs="12"
              className="mb-4"
            >
              <label htmlFor="phone" className="form-label th">
                เบอร์โทรศัพท์
              </label>
              <input
                name="phone"
                type="tel"
                id="phone"
                className="form-control th"
                value={regisData.phone}
                minLength={10}
                maxLength={10}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <div className="text-danger mt-2 th">{errors.phone}</div>
              )}

              {formErrors.phone && (
                <div className="text-danger mt-2 th">{formErrors.phone}</div>
              )}
            </Col>

            <Col
              xxl="12"
              xl="12"
              lg="12"
              md="12"
              sm="12"
              xs="12"
              className="mb-4"
            >
              <label htmlFor="email" className="form-label th">
                อีเมล
              </label>
              <input
                name="email"
                type="email"
                id="email"
                className="form-control th"
                value={regisData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="text-danger mt-2 th">{errors.email}</div>
              )}

              {formErrors.email && (
                <div className="text-danger mt-2 th">{formErrors.email}</div>
              )}
            </Col>

            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
              <label htmlFor="password" className="form-label th">
                รหัสผ่าน
              </label>
              <input
                name="password"
                type="password"
                id="password"
                className="form-control th"
                value={regisData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <div className="text-danger mt-2 th">{errors.password}</div>
              )}
            </Col>

            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-5">
              <label htmlFor="CFpassword" className="form-label th">
                ยืนยันรหัสผ่าน
              </label>
              <input
                name="CFpassword"
                type="password"
                id="CFpassword"
                className="form-control th"
                value={regisData.CFpassword}
                onChange={handleInputChange}
              />
              {errors.CFpassword && (
                <div className="text-danger mt-2 th">{errors.CFpassword}</div>
              )}
            </Col>

            {/* Submit Button */}
            <Row>
              <Col className="justify-content-center">
                <Button className="btn-xl th" onClick={registerUser}>
                  สมัครสมาชิก
                </Button>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
