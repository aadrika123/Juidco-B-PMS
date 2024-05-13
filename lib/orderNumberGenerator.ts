function generateOrderNumber() {
    // Get current date
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const prefix = process.env.ORDER_NUMBER_PREFIX || 'ORD'

    // Generate random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    // Concatenate prefix, date, and random number
    const orderNumber = `${prefix}${year}${month}${day}${randomNumber}`;

    return orderNumber;
}


export default generateOrderNumber