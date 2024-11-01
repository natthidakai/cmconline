import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useSignUp } from "../hooks/useSignUp";
import { validationForm } from "../hooks/validationForm"

import Image from "next/image";
import LOGO from "../assert/images/logo.jpg";

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
              <Modal.Body className="p-4">
                <div className="th mb-4">
                  ยินดีต้อนรับสู่เว็บไซต์ของเรา! การสมัครสมาชิกและการให้ข้อมูลส่วนบุคคลถือว่าท่านได้ยอมรับข้อตกลงและเงื่อนไขต่อไปนี้ 
                  กรุณาอ่านอย่างละเอียดก่อนดำเนินการสมัครสมาชิก เพื่อให้ท่านเข้าใจถึงวัตถุประสงค์และการดำเนินการเกี่ยวกับข้อมูลส่วนบุคคลของท่าน
                </div>

                <h6 className="th">1. การเก็บรวบรวมข้อมูลส่วนบุคคล</h6>
                <div className="th mb-4">
                  เมื่อท่านทำการสมัครสมาชิกหรือทำการจองผ่านเว็บไซต์นี้ เราจะทำการเก็บรวบรวมข้อมูลที่จำเป็น เช่น ชื่อ นามสกุล ที่อยู่อีเมล หมายเลขโทรศัพท์ ที่อยู่ และข้อมูลอื่นๆ 
                  ที่เกี่ยวข้องกับการสมัครสมาชิกหรือการจอง ข้อมูลเหล่านี้จะถูกใช้เพื่อให้บริการที่ตรงตามวัตถุประสงค์และเพื่อพัฒนาการบริการของเรา
                </div>

                <h6 className="th">2. การใช้งานข้อมูลส่วนบุคคล</h6>
                <div className="th mb-4">
                  ข้อมูลส่วนบุคคลที่เราเก็บรวบรวมจะถูกใช้เพื่อวัตถุประสงค์ดังนี้ :
                  <ul>
                    <li>เพื่อดำเนินการจองและให้บริการตามที่ท่านร้องขอ</li>
                    <li>เพื่อสื่อสารและให้ข้อมูลอัปเดตเกี่ยวกับการจอง สถานะการสมัครสมาชิก หรือการบริการอื่นๆ ที่เกี่ยวข้อง</li>
                    <li>เพื่อพัฒนาประสบการณ์การใช้งาน และเพื่อปรับปรุงบริการและผลิตภัณฑ์ของเรา</li>
                    <li>เพื่อการตลาด เช่น การส่งข่าวสาร โปรโมชั่น หรือข้อเสนอพิเศษที่เกี่ยวข้องกับความสนใจของท่าน</li>
                  </ul>
                </div>

                <h6 className="th">3. การแบ่งปันข้อมูลส่วนบุคคล</h6>
                <div className="th mb-4">
                  เราจะไม่ขายหรือเปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สามโดยไม่ได้รับความยินยอม ยกเว้นกรณีที่กฎหมายกำหนดให้ต้องเปิดเผยข้อมูล หรือเพื่อวัตถุประสงค์ในการให้บริการที่เกี่ยวข้องกับการดำเนินธุรกิจ 
                  เช่น การประมวลผลการชำระเงิน การส่งข้อมูลผ่านระบบอีเมล หรือการจัดส่งสินค้า โดยหน่วยงานที่เกี่ยวข้องจะต้องรักษาความปลอดภัยของข้อมูลตามมาตรฐาน
                </div>

                <h6 className="th">4. ความปลอดภัยของข้อมูล</h6>
                <div className="th mb-4">
                  เราให้ความสำคัญกับความปลอดภัยของข้อมูลส่วนบุคคล โดยใช้มาตรการในการรักษาความปลอดภัยของข้อมูล เพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต การสูญหาย หรือการทำลายข้อมูลโดยไม่ได้ตั้งใจ
                </div>


                <h6 className="th">5. สิทธิของผู้ใช้</h6>
                <div className="th mb-4">
                  ท่านมีสิทธิในการขอเข้าถึงข้อมูลส่วนบุคคลที่เราเก็บรวบรวม และขอแก้ไข ลบ หรือลงทะเบียนคัดค้านการใช้งานข้อมูลของท่านในบางกรณี 
                  หากท่านมีคำถามหรือต้องการดำเนินการใดๆ เกี่ยวกับข้อมูลส่วนบุคคล กรุณาติดต่อเราผ่านช่องทางที่ระบุในเว็บไซต์
                </div>

                <h6 className="th">6. การเปลี่ยนแปลงข้อกำหนดและเงื่อนไข</h6>
                <div className="th mb-4">
                  เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อตกลงและเงื่อนไขการเก็บรวบรวม ใช้ และแบ่งปันข้อมูลส่วนบุคคล โดยจะแจ้งให้ท่านทราบผ่านการประกาศบนเว็บไซต์ 
                  กรุณาตรวจสอบข้อตกลงและเงื่อนไขเหล่านี้อย่างสม่ำเสมอเพื่อความเข้าใจที่ถูกต้องในการใช้บริการ
                </div>

                <div className="th">การดำเนินการสมัครสมาชิกหรือการจองผ่านเว็บไซต์ของเราถือว่าท่านได้ยอมรับและเข้าใจข้อตกลงและเงื่อนไขทั้งหมดนี้</div>
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