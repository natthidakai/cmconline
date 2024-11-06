import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import React, {  useEffect } from "react";
import { useSignUp } from "../hooks/useSignUp";
import { Container, Row, Col, Button } from "react-bootstrap";

const Profile = () => {
  const { data: session, status } = useSession();
    const router = useRouter();

  const {
    isSameAddress,
    setIsSameAddress,
    handleCheckboxChange,
    user,
    setUser,
    handleChange,
    formFieldsPersonal,
    formFieldsCurrentAddress,
    formFieldsAddress,
    updateUserData,
    isLoading,
    setIsLoading,
    errors = {}, // Ensure errors is always defined as an object
    setErrors
  } = useSignUp();


  useEffect(() => {
    const token = localStorage.getItem('token');
    // ตรวจสอบสถานะการโหลด
    if (status === "loading") return; // ถ้ากำลังโหลดไม่ทำอะไร

    // หากไม่มี session หรือ token
    if (!session && !token) {
        router.push("/signin");
    }
}, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // อัปเดตข้อมูลผู้ใช้
    const response = await updateUserData(user);

    if (response && response.success) {
      // อัปเดตข้อมูลใน state ของ user ด้วยข้อมูลที่อัปเดต
      setUser((prevUser) => ({
        ...prevUser,
        ...response.updatedUserData,
      }));
      console.log("Updated user data:", response.updatedUserData); // ตรวจสอบข้อมูลที่อัปเดต
    } else {
      // แสดงข้อผิดพลาดที่เกิดขึ้น
      setErrors((prevErrors) => ({
        ...prevErrors,
        update: "ไม่สามารถอัปเดตข้อมูลได้",
      }));
      console.error("Update user error:", response); // ดูข้อมูลผิดพลาด
    }

    setIsLoading(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xxl="7" xl="6" lg="8" md="10" sm="10" xs="10">
          <h3 className="th px-3 center mb-4">ข้อมูลของฉัน</h3>
          <Row className="box-step-3 px-3 py-5 box-shadow">
            <h5 className="th mb-4">ข้อมูลส่วนบุคคล</h5>
            {formFieldsPersonal.map((field) => (
              <Col key={field.id} xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-4">
                <label htmlFor={field.id} className="form-label th">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    className="form-select th"
                    value={user[field.id] || ""}
                    onChange={handleChange}
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
                    value={user[field.id] || ""}
                    onChange={handleChange}
                  />
                )}
              </Col>
            ))}

            <hr className="my-5" />

            <h5 className="th mb-4">ที่อยู่ปัจจุบัน</h5>
            {formFieldsCurrentAddress.map((field) => {
              const colSize = ["current_address"].includes(field.id) ? "12" : "6";
              return (
                <Col key={field.id} xxl={colSize} xl={colSize} lg={colSize} md={colSize} sm={12} xs={12} className="mb-4">
                  <label htmlFor={field.id} className="form-label th">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    className="form-control th"
                    value={user[field.id] || ""}
                    onChange={handleChange}
                  />
                </Col>
              );
            })}

            <hr className="my-5" />

            <Row>
              <Col>
                <h5 className="mb-4 th">ที่อยู่ตามทะเบียนบ้าน</h5>
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
            {formFieldsAddress.map((field) => {
              const colSize = ["address"].includes(field.id) ? "12" : "6";
              return (
                <Col key={field.id} xxl={colSize} xl={colSize} lg={colSize} md={colSize} sm={12} xs={12} className="mb-4">
                  <label htmlFor={field.id} className="form-label th">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.id}
                    id={field.id}
                    className="form-control th"
                    value={user[field.id] || ""}
                    onChange={handleChange}
                  />
                </Col>
              );
            })}

            {Object.keys(errors).length > 0 && (
              <div className="text-danger mb-3 th center">
                {errors.first_name || errors.last_name || errors.phone || errors.email || errors.id_card || errors.update}
              </div>
            )}

            <Row>
              <Col className="justify-content-center">
                <Button
                  className="btn-xl th"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'กำลังดำเนินการ...' : 'บันทึกข้อมูล'}
                </Button>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
