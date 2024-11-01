import { useState, useEffect } from "react";

export const getBooking = (session) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (session) {
            const fetchBookings = async () => {
                try {
                    const response = await fetch('/api/getBookings'); // Adjust the endpoint as needed
                    if (!response.ok) {
                        throw new Error('Failed to fetch bookings');
                    }
                    const data = await response.json();
                    setBookings(data); // Assuming the API returns an array of bookings
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                }
            };
            fetchBookings();
        }
    }, [session]);

    return bookings;
};
