import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useSignUp } from "./hooks/useSignUp";

import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";

const SignUp = () => {

  const { regisData, handleInputChange, errors, formErrors, registerUser, isLoading, handleNumberKeyPress, handleEmailKeyPress  } = useSignUp();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

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

            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
              <label htmlFor="first_name" className="form-label th">ชื่อ</label>
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
              <label htmlFor="last_name" className="form-label th">นามสกุล</label>
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

            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
              <label htmlFor="phone" className="form-label th">เบอร์โทรศัพท์</label>
              <input
                name="phone"
                type="tel"
                id="phone"
                className="form-control th"
                value={regisData.phone}
                minLength={10}
                maxLength={10}
                onKeyPress={handleNumberKeyPress} 
                onChange={handleInputChange}
              />
              {errors.phone && (
                <div className="text-danger mt-2 th">{errors.phone}</div>
              )}

              {formErrors.phone && (
                <div className="text-danger mt-2 th">{formErrors.phone}</div>
              )}
            </Col>

            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
              <label htmlFor="email" className="form-label th">อีเมล</label>
              <input
                name="email"
                type="email"
                id="email"
                className="form-control th"
                value={regisData.email}
                onChange={handleInputChange}
                onKeyPress={handleEmailKeyPress}
              />
              {errors.email && (
                <div className="text-danger mt-2 th">{errors.email}</div>
              )}

              {formErrors.email && (
                <div className="text-danger mt-2 th">{formErrors.email}</div>
              )}
            </Col>

            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
              <label htmlFor="id_card" className="form-label th">เลขบัตรประชาชน</label>
              <input
                name="id_card"
                type="id_card"
                id="id_card"
                minLength={13}
                maxLength={13}
                className="form-control th"
                value={regisData.id_card}
                onChange={handleInputChange}
                onKeyPress={handleNumberKeyPress}
              />
              {errors.id_card && (
                <div className="text-danger mt-2 th">{errors.id_card}</div>
              )}

              {formErrors.id_card && (
                <div className="text-danger mt-2 th">{formErrors.id_card}</div>
              )}
            </Col>

            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
              <label htmlFor="password" className="form-label th">รหัสผ่าน</label>
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
              <label htmlFor="CFpassword" className="form-label th">ยืนยันรหัสผ่าน</label>
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
                <Button className="btn-xl th" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                </Button>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;