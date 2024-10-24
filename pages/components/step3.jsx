import React from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loading from "../components/loading";

import { useSignUp } from "../hooks/useSignUp";
import { validationForm } from "../hooks/validationForm"
import { useAuth } from "../api/auth/useAuth"

import LOGO from "../assert/images/logo.jpg";
import Image from "next/image";
import Link from "next/link";

const Step3 = () => {

  const router = useRouter();
  const { projectID, floorName, towerName, unitNumber } = router.query;

  const { handleEmailKeyPress } = validationForm();
  const { signInData, handleSignIn, handleSignInChange, errorsSignIn } = useAuth();

  const {
    errors,
    handleInputChange,
    isSameAddress,
    setIsSameAddress,
    handleCheckboxChange,
    user,
    setUser,
    status,
    formFieldsPersonal,
    formFieldsCurrentAddress,
    formFieldsAddress,
    showAddressSection,
    submitBooking,
    isLoading,
  } = useSignUp();


  const handleSubmit = (e) => {
    submitBooking(e, projectID, unitNumber, showAddressSection, floorName, towerName);
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <Container className="py-5">

      {status === "authenticated" ? (
        <Col>
          <h3 className="th px-3 center">ข้อมูลการจอง</h3>
          <Col className="th center font-18 text-blue font-500 mb-5">
            ข้อมูลส่วนบุคคลทั้งหมด จะถูกเก็บเป็นความลับ
          </Col>
          <Col>
            {user && (
              <Row className="justify-content-center">
                <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="10">
                  <h5 className="th">ข้อมูลส่วนบุคคล</h5>
                  <Row className="box-step-3 mb-5">
                    {formFieldsPersonal.map((field) => (
                      <Col key={field.id} xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-4" >
                        <label htmlFor={field.id} className="form-label th">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            id={field.id}
                            name={field.id}
                            className="form-select th"
                            value={field.value || ""}
                            onChange={handleInputChange}
                          >
                            {field.options.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.id}
                            id={field.id}
                            className="form-control th"
                            value={field.value || ""}
                            onChange={handleInputChange}
                          />
                        )}
                      </Col>
                    ))}

                    {Object.keys(errors).length > 0 && (
                      <div className="text-danger mb-3 th center">
                        {errors.title_name ||
                          errors.first_name ||
                          errors.last_name ||
                          errors.email ||
                          errors.phone ||
                          errors.id_card ||
                          errors.birth_date ||
                          errors.nationality ||
                          errors.marital_status}
                      </div>
                    )}
                  </Row>
                </Col>

                {showAddressSection && (
                  <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="10">
                    <Row>
                      <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                        <h5 className="th">ที่อยู่ปัจจุบัน</h5>
                        <Row className="box-step-3 mb-5">
                          {formFieldsCurrentAddress.map((field) => {
                            const colSize = ["current_address"].includes(field.id)
                              ? "12"
                              : "6";
                            return (
                              <Col
                                key={field.id}
                                xxl={colSize}
                                xl={colSize}
                                lg={colSize}
                                md={colSize}
                                sm={12}
                                xs={12}
                                className="mb-4"
                              >
                                <label
                                  htmlFor={field.id}
                                  className="form-label th"
                                >
                                  {field.label}
                                </label>
                                <input
                                  type={field.type}
                                  id={field.id}
                                  name={field.id}
                                  className="form-control th"
                                  value={field.value || ""}
                                  onChange={handleInputChange}
                                />
                              </Col>
                            );
                          })}

                          {Object.keys(errors).length > 0 && (
                            <div className="text-danger mb-3 th center">
                              {errors.current_address ||
                                errors.current_subdistrict ||
                                errors.current_district ||
                                errors.current_province ||
                                errors.current_postal_code}
                            </div>
                          )}
                        </Row>
                      </Col>

                      <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Row>
                          <Col>
                            <h5 className="th">ที่อยู่ตามทะเบียนบ้าน</h5>
                          </Col>
                          <Col className="sameAddressCheckbox">
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              id="sameAddressCheckbox"
                              checked={isSameAddress}
                              onChange={handleCheckboxChange(setUser, setIsSameAddress)}
                            />
                            <label
                              htmlFor="sameAddressCheckbox"
                              className="form-label th m-0 pl-1"
                            >
                              ที่อยู่เดียวกับที่อยู่ปัจจุบัน
                            </label>
                          </Col>
                        </Row>

                        {!isSameAddress && (
                          <Row className="box-step-3 mb-5">
                            {formFieldsAddress.map((field) => {
                              const colSize = ["address"].includes(field.id)
                                ? "12"
                                : "6";
                              return (
                                <Col key={field.id} xxl={colSize} xl={colSize} lg={colSize} md={colSize} sm={12} xs={12} className="mb-4" >
                                  <label htmlFor={field.id} className="form-label th" > {field.label} </label>
                                  <input
                                    type={field.type}
                                    id={field.id}
                                    name={field.id}
                                    className="form-control th"
                                    value={field.value || ''}
                                    onChange={handleInputChange}
                                  />
                                </Col>
                              );
                            })}

                            {Object.keys(errors).length > 0 && (
                              <div className="text-danger mb-3 th center">
                                {errors.address ||
                                  errors.subdistrict ||
                                  errors.district ||
                                  errors.province ||
                                  errors.postal_code
                                }
                              </div>
                            )}
                          </Row>
                        )}
                      </Col>
                    </Row>
                  </Col>
                )}

                <Row>
                  <Col className="justify-content-center">
                    <Button type="button" className="btn-xl th" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? 'กำลังดำเนินการ...' : 'บันทึกข้อมูล'}
                    </Button>
                  </Col>
                </Row>
              </Row>
            )}
          </Col>
        </Col>
      ) : (
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
                <label htmlFor="email" className="form-label th"> อีเมล </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control th"
                  value={signInData.email}
                  onChange={handleSignInChange}
                  onKeyDown={handleEmailKeyPress}
                  required
                />
              </Col>

              <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-2">
                <label htmlFor="password" className="form-label th"> รหัสผ่าน </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control th"
                  value={signInData.password}
                  onChange={handleSignInChange}
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

                {errorsSignIn.message && (
                  <div className="text-danger mb-3 th center">
                    {errorsSignIn.message}
                  </div>
                )}

                <Col className="justify-content-center">
                  <Button className="btn-xl th" onClick={handleSignIn} disabled={isLoading}>
                    {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </Button>
                </Col>
              </Row>
            </Row>
          </Col>
        </Row>
      )}

    </Container>
  );
};

export default Step3;
