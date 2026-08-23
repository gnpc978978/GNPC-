import multer from "multer";

const storage = multer.memoryStorage();

const imageFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return callback(null, true);
  callback(new Error("Only JPG, PNG, and WebP images are allowed."));
};

const galleryUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFilter,
});

export const membersImportUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (/\.(xlsx|xls)$/i.test(file.originalname)) {
      callback(null, true);
      return;
    }
    callback(new Error("Only .xlsx and .xls files are allowed"));
  },
});

export const memberImportUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (/\.(xlsx|xls|csv)$/i.test(file.originalname)) return callback(null, true);
    callback(new Error("Only .xlsx, .xls, and .csv files are allowed"));
  },
});

export default galleryUpload;
