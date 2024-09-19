import React, { useState } from 'react';

const Step4 = () => {
    const [id, setId] = useState('');
    const [newValue, setNewValue] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, newValue }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('ข้อมูลถูกอัปเดตแล้ว');
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="id">ID:</label>
            <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />

            <label htmlFor="newValue">New Value:</label>
            <input
                type="text"
                id="newValue"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
            />

            <button type="submit">อัปเดตข้อมูล</button>
        </form>
    );
};

export default Step4;
