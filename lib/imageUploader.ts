
const imageUploader = (file: any) => {

    // $dmsUrl = Config::get('constants.DMS_URL');
    //         $file = $request->document;
    //         $filePath = $file->getPathname();
    //         $hashedFile = hash_file('sha256', $filePath);
    //         $filename = ($request->document)->getClientOriginalName();
    //         $api = "$dmsUrl/backend/document/upload";
    //         $transfer = [
    //             "file" => $request->document,
    //             "tags" => $filename,
    //             // "reference" => 425
    //         ];
    //         $returnData = Http::withHeaders([
    //             "x-digest"      => "$hashedFile",
    //             "token"         => "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0",
    //             "folderPathId"  => 1
    //         ])->attach([
    //             [
    //                 'file',
    //                 file_get_contents($filePath),
    //                 $filename
    //             ]
    //         ])->post("$api", $transfer);
    //         if ($returnData->successful()) {
    //             return (json_decode($returnData->body(), true));
    //         }

    const dmsUrl = process.env.DMS_URL_UPLOAD
    

}

export default imageUploader