import crypto from 'crypto'
import axios from 'axios'
import FormData from 'form-data'

export const imageUploaderV2 = async (file: any[]) => {
	const toReturn: any[] = []
	try {
		const dmsUrl = process.env.DMS_UPLOAD || ''

		await Promise.all(
			file.map(async (item: any) => {
				// const fileData = fs.readFileSync(item?.path)

				const hashed = crypto.createHash('SHA256').update(item?.buffer).digest('hex')

				const formData = new FormData()
				formData.append('file', item?.buffer, item?.mimetype)
				formData.append('tags', item?.originalname.substring(0, 7))

				const headers = {
					'x-digest': hashed,
					token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
					folderPathId: 1,
					...formData.getHeaders(),
				}

				await axios
					.post(process.env.DMS_UPLOAD || '', formData, { headers })
					.then(async response => {
						// console.log(response?.data?.data, 'res')

						await axios
							.post(process.env.DMS_GET || '', { referenceNo: response?.data?.data?.ReferenceNo }, { headers })
							.then(response => {
								// console.log(response?.data?.data, 'res')
								// img.imageUrl = response?.data?.data?.fullPath
								toReturn.push(response?.data?.data?.fullPath)
							})
							.catch(err => {
								// console.log(err?.data?.data, 'err')
								// toReturn.push(err?.data?.data)
								throw err
							})

						// toReturn.push(response?.data?.data)
					})
					.catch(err => {
						// console.log(err?.data?.data, 'err')
						// toReturn.push(err?.data?.data)
						throw err
					})
			})
		)
	} catch (err) {
		throw err
	}
	// console.log(toReturn, 'toReturn')
	return toReturn
}

// $dmsUrl = Config::get('constants.DMS_URL');
//             $file = $request->document;
//             $filePath = $file->getPathname();
//             $hashedFile = hash_file('sha256', $filePath);
//             $filename = ($request->document)->getClientOriginalName();
//             $api = "$dmsUrl/backend/document/upload";
//             $transfer = [
//                 "file" => $request->document,
//                 "tags" => $filename,
//                 // "reference" => 425
//             ];
//             $returnData = Http::withHeaders([
//                 "x-digest"      => "$hashedFile",
//                 "token"         => "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0",
//                 "folderPathId"  => 1
//             ])->attach([
//                 [
//                     'file',
//                     file_get_contents($filePath),
//                     $filename
//                 ]
//             ])->post("$api", $transfer);
//             if ($returnData->successful()) {
//                 return (json_decode($returnData->body(), true));
//             }
