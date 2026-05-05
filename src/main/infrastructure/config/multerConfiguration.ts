import multer from "multer";

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
      return cb(new Error("Only can images jpg, jpeg or png"));
    }
    cb(null, true);
  },
});

export default upload;
