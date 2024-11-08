// components/BackToTop.jsx
import React, { useState, useEffect } from 'react';
import { Button, Col } from 'react-bootstrap';
import { SlArrowUp } from "react-icons/sl";

const BackToTop = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) { // Show button after scrolling down 300px
                setShow(true);
            } else {
                setShow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        show && (
            <Col
                className="back-to-top"
                onClick={scrollToTop}
                variant="primary"
            >
                <SlArrowUp />
            </Col>
        )
    );
};

export default BackToTop;
