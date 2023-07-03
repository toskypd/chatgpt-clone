const express = require('express');
const router = express.Router();
const apiCtrl = require('../controllers/api')
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `uploads`;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: (req, file, cb) => {
        console.log(file, "file mutler 1")
        let mainpath = file.fieldname + '_' + Date.now()
            + file.originalname.replace(/ /g, "");
        req.body.image = mainpath
        cb(null, mainpath)
    }
});
const upload = multer({ storage: storage });


router.post('/register' , apiCtrl.register)
router.post('/login' , apiCtrl.login)
router.get('/chat',  apiCtrl.chat);
router.post('/voice',upload.single('file'),  apiCtrl.voice);
router.get('/image',  apiCtrl.image);



module.exports = router;