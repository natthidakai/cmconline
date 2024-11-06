import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

import { Container } from "react-bootstrap";
import SignINform from "./components/formsignin";


const SignIn = () => {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบสถานะการเข้าสู่ระบบ
    if (status === "authenticated" && session) {
      // รีไดเร็กไปยังหน้าโปรไฟล์เมื่อเข้าสู่ระบบสำเร็จ
      router.push("/");
    }
  }, [session, status, router]);

  return (
    <Container className="py-5">
      <SignINform/>
    </Container>
  );
};

export default SignIn;