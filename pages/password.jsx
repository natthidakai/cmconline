import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';

import { useSession } from "next-auth/react";
import ForgotPassword from './components/forgotpass';
import ChangePass from './components/changepass';

const ChangePassword = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <Container className="py-5">
            {status === "authenticated" ? (
                <ChangePass/>
            ) : (
                <ForgotPassword />
            )}
        </Container>
    );
};

export default ChangePassword;
