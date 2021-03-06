const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (erro, hash) => {
                if(erro) {
                    cb(erro);
                }
                else {
                    file.key = `${hash.toString('hex')}-${file.originalname}`;
                    cb(null, file.key);
                }
            })
        }
    }),
    s3: multerS3({
        s3: new aws.S3({
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            region: process.env.AWS_DEFAULT_REGION
        }),
        bucket: 'uploadimageleonardocrestani',
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (erro, hash) => {
                if(erro) {
                    cb(erro);
                }
                else {
                    const fileName = `${hash.toString('hex')}-${file.originalname}`;
                    cb(null, fileName);
                }
            });
        },
    })
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'iamge/pjpeg',
            'image/png',
            'image/gif'
        ];
        if(allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    }
}