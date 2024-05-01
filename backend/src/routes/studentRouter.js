const express = require("express");
const router = express.Router();
const {createNewStudent,getStudentDetails,updateStudent,deleteStudent, genKeyPairController} = require("../controllers/studentController");

const {UploadController} = require("../controllers/bigcheinController")

router.route('/upload_file').post(UploadController);
router.route("/").post(createNewStudent);
router.route("/gen_key_pair").get(genKeyPairController);
router.route("/:nic").get(getStudentDetails).patch(updateStudent).delete(deleteStudent);


module.exports = router;