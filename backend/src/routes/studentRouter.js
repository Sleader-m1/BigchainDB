const express = require("express");
const router = express.Router();
const {createNewStudent,getStudentDetails,updateStudent,deleteStudent, genKeyPairController} = require("../controllers/studentController");

const {uploadFile} = require("../controllers/bigcheinController")

router.route('/upload_file/').post(uploadFile);
router.route("/").post(createNewStudent);
router.route("/gen_key_pair").get(genKeyPairController);
router.route("/:nic").get(getStudentDetails).patch(updateStudent).delete(deleteStudent);


module.exports = router;