import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { useAuth } from "./api/auth/useAuth";
import { validationForm } from "./hooks/validationForm";

import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";
import Link from "next/link";


const SignIn = () => {

  const { data: session, status } = useSession();
  const router = useRouter();
  const { formData, setFormData, setErrors, handleSignIn, errors } = useAuth();
  const { handleEmailKeyPress } = validationForm();


  useEffect(() => {
    // ตรวจสอบสถานะการเข้าสู่ระบบ
    if (status === "authenticated" && session) {
      // รีไดเร็กไปยังหน้าโปรไฟล์เมื่อเข้าสู่ระบบสำเร็จ
      router.push("/");
    }
  }, [session, status, router]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [id]: value, // Update the specific input's value
    }));
    if (errors.message) {
        setErrors({}); // Clear errors if any
    }
};

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xxl="4" xl="4" lg="5" md="7" sm="10" xs="10">
          <Row className="box-step-3 p-5 box-shadow">
            <div>
              <Col className="center mb-3">
                <Image src={LOGO} alt="Logo" width={70} height={70} />
                <br />
              </Col>
              <Col>
                <h3 className="th px-3 center mb-4">เข้าสู่ระบบ</h3>
              </Col>
            </div>

            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
              <label htmlFor="email" className="form-label th">
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control th"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleEmailKeyPress}
                required
              />
            </Col>

            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-2">
              <label htmlFor="password" className="form-label th">
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control th"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Col>

            <Col className="th mb-4 right">
              <Link href={`/forgotpass`} className="text-blue">
                ลืมรหัสผ่าน
              </Link>
              |
              <Link href={`/signup`} className="text-blue">
                ยังไม่มีบัญชี ?
              </Link>
            </Col>

            <Row>
              {errors.message && (
                <div className="text-danger mb-3 th center">
                  {errors.message}
                </div>
              )}
              <Col className="justify-content-center">
                <Button className="btn-xl th" onClick={handleSignIn}>
                  เข้าสู่ระบบ
                </Button>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
