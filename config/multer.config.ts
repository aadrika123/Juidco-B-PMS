import multer from 'multer';

const storage = multer.memoryStorage()

export const upload = multer({ storage: storage });

export const receivingUpload = multer({dest:'upload/receivedInventory/receivings'})