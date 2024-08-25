import axios from 'axios'

export const getImage = async (ReferenceNo: string) => {
    let dataToReturn: string = ''
    try {
        const headers = {
            token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
        }
        await axios
            .post(process.env.DMS_GET || '', { referenceNo: ReferenceNo }, { headers })
            .then(response => {
                dataToReturn = response?.data?.data?.fullPath
            })
            .catch(err => {
                throw err
            })

        return dataToReturn
    } catch (err) {
        throw err
    }

}



