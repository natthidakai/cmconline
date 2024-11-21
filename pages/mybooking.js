import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import ProjectInfo from "./api/data/projectinfo";
import { Container, Row, Col } from "react-bootstrap";
import Image from 'next/image';
import Link from 'next/link';
import Default from "../assert/images/default.jpg";
import Loading from "./components/loading";

const BookingList = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (status === "loading") return;

        if (!session && !token) {
            router.push("/signin");
        }
    }, [session, status, router]);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (status === "authenticated") {
                setLoading(true);
                try {
                    const response = await fetch('/api/getBookings'); // Adjust the endpoint as needed
                    if (!response.ok) {
                        throw new Error('Failed to fetch bookings');
                    }
                    const data = await response.json();
                    setBookings(data); // Assuming the API returns an array of bookings
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBookings();
    }, [status]);

    if (loading || status === "loading") {
        return <Loading />
    }

    const getStatusClassName = (status) => {
        switch (status) {
            case "รอชำระเงิน":
                return "awaiting-payment";
            case "ตรวจสอบการจอง":
                return "check-booking";
            case "ยกเลิกการจอง":
                return "cancel-reservation";
            case "การจองสำเร็จ":
                return "reservation-successful";
            default:
                return ""; // Default class if needed
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} className="text-center mb-4">
                    <h3 className="th px-3">รายการจองของฉัน</h3>
                    <Col className='th'>เลือกรายการที่ต้องการแจ้งชำระ และยืนยันสิทธิ์ <span className='text-red'>(ยกเว้นรายการที่ถูกยกเลิก และรายการที่จองสำเร็จ)</span></Col>
                </Col>
                <Col xx="12" xl="12" lg="11" md="11" sm="10" xs="10">
                    {bookings.length === 0 ? (
                        <Col className='none-booking'>

                            <p className='th center text-danger'>- ไม่มีรายการจอง -</p>

                        </Col>
                    ) : (
                        <Row>
                            {bookings.map((booking) => {
                                const projectInfo = ProjectInfo.find((s) => s.id === booking.projectID);
                                return (
                                    <Col xxl="3" xl="3" lg="4" md="6" sm="12" xs="12" className="border-radius-20 mb-4" key={booking.booking_id}>
                                        {/* <div className={`th  ${getStatusClassName(booking.status)}`}>
                                            {booking.status}
                                        </div> */}
                                        <div className="project-shadows border-radius-20">
                                            <div className="hoverImageWrapper">
                                                {booking.status === "รอชำระเงิน" ? (
                                                    <Link href={`/payment?projectID=${booking.projectID}&bookingID=${booking.booking_id}&unitNumber=${booking.unitNumber}`}>
                                                        <Image
                                                            src={projectInfo.pic || Default}
                                                            alt={projectInfo.nameProject}
                                                            className="img-100 p-0 hoverImage"
                                                            layout="responsive"
                                                            width={500} // Adjust width
                                                            height={300} // Adjust height
                                                        />
                                                    </Link>
                                                ) : (
                                                    <Image
                                                        src={projectInfo.pic || Default}
                                                        alt={projectInfo.nameProject}
                                                        className="img-100 p-0 hoverImage"
                                                        layout="responsive"
                                                        width={500} // Adjust width
                                                        height={300} // Adjust height
                                                    />
                                                )}
                                            </div>
                                            {booking.status === "รอชำระเงิน" ? (
                                                <Link href={`/payment?projectID=${booking.projectID}&bookingID=${booking.booking_id}&unitNumber=${booking.unitNumber}`}>
                                                    <Col className={`th ${getStatusClassName(booking.status)}`}>
                                                        {booking.status}
                                                    </Col>
                                                </Link>
                                            ) : (
                                                <Col className={`th ${getStatusClassName(booking.status)}`}>
                                                    {booking.status}
                                                </Col>
                                            )}

                                            <Col className="bg-white p-4 border-radius-bottom">
                                                <Col className="th project-name">{projectInfo.nameProject} {projectInfo.location}</Col>
                                                <Col className="th">หมายเลขการจอง : {booking.booking_id}</Col>
                                                <Col className="th">หมายเลขห้อง : {booking.unitNumber}</Col>
                                                <Col className="th">วันที่จอง : {new Date(booking.booking_date).toLocaleDateString('th-TH')}</Col>
                                            </Col>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default BookingList;
