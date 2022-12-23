const multer = require('multer');
const { update } = require('../models/user');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/storage/img')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = upload