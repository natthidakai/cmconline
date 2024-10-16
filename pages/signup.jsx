import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useSignUp } from "./hooks/useSignUp";
import { validationForm } from "./hooks/validationForm"

import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";

const SignUp = () => {

  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    regisData,
    errors,
    registerUser,
    isLoading,
    handleInputRegister,
    show,
    setRegisData,
    handleClose,
    handleShow,
    formRegister
  } = useSignUp();

  const { handleEmailKeyPress, handleNumberKeyPress } = validationForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  useEffect(() => {
    // ตรวจสอบสถานะการเข้าสู่ระบบ
    if (status === "authenticated" && session) {
      // รีไดเร็กไปยังหน้าโปรไฟล์เมื่อเข้าสู่ระบบสำเร็จ
      router.push("/profile");
    }
  }, [session, status, router]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xxl="5" xl="6" lg="6" md="8" sm="11" xs="11">
          <Row className="box-step-3 p-5 box-shadow">
            <div>
              <Col className="center mb-3">
                <Image src={LOGO} alt="" width={70} height={70} />
                <br />
              </Col>
              <Col>
                <h3 className="th px-3 center mb-4">ลงทะเบียนใช้งาน</h3>
              </Col>
            </div>

            {formRegister.map((field, index) => {
              // กำหนด colSize ตามชื่อฟิลด์
              const colSize = ["phone", "id_card", "email"].includes(field.name) ? "12" : "6";

              return (
                <Col key={`${field.name}-${index}`} xxl={colSize} xl={colSize} lg={colSize} md={colSize} sm={12} xs={12} className="mb-4">
                  <label htmlFor={field.name} className="form-label th">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="form-control th"
                    defaultValue={field.value} // ใช้ defaultValue เพื่อกำหนดค่าเริ่มต้น
                    onChange={handleInputRegister}
                    onKeyDown={field.name === "phone" || field.name === "id_card" ? handleNumberKeyPress : field.name === "email" ? handleEmailKeyPress : undefined}
                  />
                  {errors[field.name] && <div className="text-danger th mt-2">{errors[field.name]}</div>}
                </Col>
              );
            })}

            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-5">
              <input
                className="form-check-input"
                type="checkbox"
                checked={regisData.conditions}
                id="conditions"
                name="conditions"
                onChange={(e) => {
                  setRegisData({ ...regisData, conditions: e.target.checked });
                  handleShow(); // เรียก handleShow เมื่อมีการเปลี่ยนแปลงเช็คบ็อกซ์
                }}
              />
              <label className="form-check-label ms-2 th" htmlFor="conditions">
                <Col className="pointer text-blue">Terms & Conditions</Col>
              </label>
              {errors.conditions && (
                <div className="text-danger mt-2 th center">{errors.conditions}</div>
              )}
            </Col>

            {/* Submit Button */}
            <Row>
              <Col className="justify-content-center">
                <Button className="btn-xl th" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                </Button>
              </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="th">Terms & Conditions</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="th">ยินดีต้อนรับสู่เว็บไซต์ของเรา! การสมัครสมาชิกถือว่าท่านได้ยอมรับข้อตกลงและเงื่อนไขในการเก็บรวบรวม ใช้ และแบ่งปันข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ทางการตลาด กรุณาอ่านเงื่อนไขเหล่านี้อย่างละเอียดก่อนดำเนินการสมัครสมาชิก</p>
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn-xl th" onClick={handleClose}>ยอมรับเงื่อนไข</Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;