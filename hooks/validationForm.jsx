export const validationForm = () => {

    const handleEmailKeyPress = (event) => {
        if (/[\u0E00-\u0E7F]/.test(event.key)) {
            event.preventDefault();
        }
    };

    const handleNumberKeyPress = (event) => {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    };

    return {
        handleEmailKeyPress,
        handleNumberKeyPress
    }
}