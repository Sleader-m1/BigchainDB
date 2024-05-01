const express = require("express");
const multer = require('multer');  // Добавляем multer
const upload = multer({ storage: multer.memoryStorage() });  // Конфигурируем multer

const router = express.Router();
const { createNewStudent, getStudentDetails, updateStudent, deleteStudent, genKeyPairController } = require("../controllers/studentController");
const { uploadFile, getUploadedFiles } = require("../controllers/bigcheinController");


router.get('/files', getUploadedFiles);
// Обновляем маршрут для использования multer и передачи данных в функцию контроллера
router.post('/upload_file', upload.single('file'), async (req, res) => {
    try {
        // Проверяем наличие необходимых полей
        if (!req.body.privateKey) {
            return res.status(400).send('Private key is required');
        }
        if (!req.file) {
            return res.status(400).send('File is required');
        }

        // Вызываем функцию контроллера и передаем нужные параметры
        const result = await uploadFile(req.file.buffer, req.file.originalname, req.body.privateKey);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to process upload');
    }
});

router.route("/").post(createNewStudent);
router.route("/gen_key_pair").get(genKeyPairController);
router.route("/:nic").get(getStudentDetails).patch(updateStudent).delete(deleteStudent);

module.exports = router;