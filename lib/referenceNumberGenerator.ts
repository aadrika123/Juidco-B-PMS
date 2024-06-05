function generateReferenceNumber(ulb_id: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedUlbId = ulb_id.toString().padStart(2, '0');

    // Generate random number between 100 and 999
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    const receivingNumber = `REF${formattedUlbId}${day}${month}${year}${randomNumber}`;

    return receivingNumber;
}


export default generateReferenceNumber