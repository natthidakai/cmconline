// import { useEffect, useState } from 'react';
// import { useFetchUser } from './hooks/useFetchUser';
// import { useRouter } from 'next/router';
// import { useSession } from "next-auth/react";
// import ProjectInfo from "./data/projectinfo";
// import { Container, Row, Col } from "react-bootstrap";
// import Image from 'next/image';
// import Default from "./assert/images/default.jpg";

// const BookingList = () => {
//   const { data: session, status } = useSession(); // Check user session
//   const router = useRouter();

//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true); // To track loading state

//   useEffect(() => {
//     // Redirect to sign-in page if unauthenticated
//     if (status === "unauthenticated") {
//       router.push("/signin");
//     } else if (status === "authenticated") {
//       setLoading(false); // Stop loading when authenticated
//     }
//   }, [status, router]);

//   useEffect(() => {
//     if (status === "authenticated") {
//       const fetchBookings = async () => {
//         try {
//           const response = await fetch('/api/getBookings'); // Adjust the endpoint as needed
//           if (!response.ok) {
//             throw new Error('Failed to fetch bookings');
//           }
//           const data = await response.json();
//           setBookings(data); // Assuming the API returns an array of bookings
//         } catch (error) {
//           console.error('Error fetching bookings:', error);
//         }
//       };
//       fetchBookings();
//     }
//   }, [status]);

//   if (loading || status === "loading") {
//     return <p>กำลังโหลดข้อมูล...</p>; // Show loading message while session is being checked
//   }

//   return (
//     <Container className="py-5">
//       <Row className="justify-content-center">
//         <Col xs={12} className="text-center mb-4">
//           <h3 className="th px-3">รายการจองของฉัน</h3>
//         </Col>

//         <Col xx="12" xl="12" lg="11" md="11" sm="10" xs="10">
//           {bookings.length === 0 ? (
//             <p className='th center text-danger'>- ไม่มีรายการจอง -</p>
//           ) : (
//             <Row>
//               {bookings.map((booking) => {
//                 const projectInfo = ProjectInfo.find((s) => s.id === booking.projectID);
//                 return (
//                   <Col xxl="3" xl="3" lg="4" md="6" sm="12" xs="12" className="border-radius-20 mb-4" key={booking.booking_id}>
//                     <div className="project-shadows border-radius-20">
//                       <div className="hoverImageWrapper">
//                         <Image
//                           src={projectInfo.pic || Default}
//                           alt={projectInfo.nameProject}
//                           className="img-100 p-0 hoverImage"
//                           layout="responsive"
//                           width={500} // Adjust width
//                           height={300} // Adjust height
//                         />
//                       </div>

//                       <Col className="bg-white p-4 border-radius-bottom">
//                         <Col className="th project-name">{projectInfo.nameProject} {projectInfo.location}</Col>
//                         <Col className="th">หมายเลขการจอง : {booking.booking_id}</Col>
//                         <Col className="th">หมายเลขห้อง : {booking.unitNumber}</Col>
//                         <Col className="th">วันที่จอง : {new Date(booking.booking_date).toLocaleDateString('th-TH')}</Col>
//                       </Col>
//                     </div>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default BookingList;
