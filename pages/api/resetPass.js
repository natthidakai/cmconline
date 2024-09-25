import Mysql from '../../connect/mysql';
export const sendResetPasswordEmail = async (email) => {
    const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Failed to send reset password email');
    }
};