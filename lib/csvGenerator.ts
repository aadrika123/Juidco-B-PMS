import { json2csv } from 'json-2-csv'
import fs from 'fs'

const csvGenerator = (jsonData: any) => {
    try {
        const csvData = json2csv(jsonData)
        // fs.writeFileSync('test.csv', csvData)
        return csvData
    } catch (err) {

    }
}

export default csvGenerator