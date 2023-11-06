const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../utils/s3');

const folderName = process.env.AWS_PUBLIC_FOLDER;

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'tixarfs',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            console.log("Processing file:", file.originalname);
            cb(null, `${folderName}/` + Date.now().toString() + '-' + file.originalname)
        }
    })
});

module.exports = upload;
