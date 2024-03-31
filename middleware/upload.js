import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB for example
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 },
  { name: 'audios', maxCount: 5 },
  { name: 'documents', maxCount: 5 },
]); // Adjust 'maxCount' as needed

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4|avi|mpeg|mp3|wav|pdf|doc|docx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Files Only!');
  }
}
