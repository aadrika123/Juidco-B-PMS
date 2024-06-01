import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.memoryStorage()

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    // if (path.extname(file.originalname) !== '.pdf') {
    //     return cb(new Error('Only pdfs are allowed'))
    // }
    // cb(null, true)
    const filetypes = /jpeg|jpg|png|gif|pdf|csv|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Error: Only images (JPEG, JPG, PNG, GIF) and documents(PDF, CSV, xlsx) are allowed!'));
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

export const receivingUpload = multer({ dest: 'upload/receivedInventory/receivings' })