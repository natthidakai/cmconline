import React from "react";
import { Container } from "react-bootstrap";
import UnitDetailsBooking from './UnitDetailsBooking';
import UnitDetails from './UnitDetails';

const Step2 = () => {

    return (
        <Container className='py-5'>
            <UnitDetailsBooking />
            <hr className="my-5" />
            <UnitDetails />
        </Container>
    );
};

export default Step2;
