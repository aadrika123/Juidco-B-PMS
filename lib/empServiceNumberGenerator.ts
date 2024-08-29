function generateEmpServiceNumber(ulb_id: string) {
	// Get current date
	const currentDate = new Date()
	const year = currentDate.getFullYear().toString().slice(-2)
	const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
	const day = currentDate.getDate().toString().padStart(2, '0')
	const formattedUlbId = ulb_id.toString().padStart(2, '0')

	const prefix = 'EMPS'

	// Generate random number between 1000 and 9999
	const randomNumber = Math.floor(Math.random() * 900) + 100

	// Concatenate prefix, date, and random number
	const stockHandoverNumber = `${prefix}${formattedUlbId}${year}${month}${day}${randomNumber}`

	return stockHandoverNumber
}

export default generateEmpServiceNumber
