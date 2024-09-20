import { useState } from 'react';
import { useRouter } from 'next/router';

export default function BookingForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const router = useRouter(); // ใช้เพื่อทำการเปลี่ยนหน้า

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                }),
            });
    
            if (response.ok) {
                // ถ้าส่งสำเร็จ
                router.push('/');
            } else {
                console.error('Failed to book');
            }
        } catch (error) {
            console.error('Error submitting form', error);
        }

        console.log(formData);
    };

    return (
        <div>
            <h1>Booking Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="phone">Phone:</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                /><br /><br />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
