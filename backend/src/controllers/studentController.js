const {db} = require("../models");
const {StatusCodes} = require("http-status-codes");
const {ConflictError, BadRequestError} = require("../errors/errors");
const { generateEd25519KeyPair } = require ('./gen_key_pair');
const Student = db.students;
const sequelize = db.sequelize;


const createNewStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const availability = await Student.findByPk(req.body.nic);
        const ed25519Keys = generateEd25519KeyPair();
        b = {
            nic: req.body.nic, 
            name: req.body.name, 
            email: req.body.email, 
            contact: req.body.contact,
            priv_key: ed25519Keys.privateKey,
            pub_key: ed25519Keys.publicKey
        }

        if (!availability) {
            const createdStudent = await Student.create(b, {transaction: t});
            await t.commit();
            return res.status(StatusCodes.CREATED).json(createdStudent);
        }
        throw new ConflictError("Student already exist in the database");
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

const getStudentDetails = async (req, res) => {
    const id = req.params.nic;
    const student = await Student.findByPk(id);
    if (student) return res.status(StatusCodes.OK).json(student);
    throw new BadRequestError("Student doesn't exist");
}

const updateStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.nic;
        const student = await Student.findByPk(id);
        if (student) {
            await Student.update(req.body, {where: {nic: id}, transaction: t});
            await t.commit();
            return res.status(StatusCodes.CREATED).json(req.body);
        }
        throw new BadRequestError("Student doesn't exist");
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

const deleteStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.nic;
        const student = await Student.findByPk(id);
        if (student) {
            await Student.destroy({where: {nic: id}, transaction: t});
            await t.commit();
            return res.status(StatusCodes.NO_CONTENT).json({});
        }
        throw new BadRequestError("Student doesn't exist");
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

function genKeyPairController(req, res) {
        try {
            const ed25519Keys = generateEd25519KeyPair();

            res.status(200).json({
                success: true,
                message: 'Ed25519 key pair generated successfully.',
                keys: {
                    publicKey: ed25519Keys.publicKey,
                    privateKey: ed25519Keys.privateKey
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error generating Ed25519 key pair.',
                error: error.message
            });
        }
}

module.exports = {createNewStudent,getStudentDetails,updateStudent,deleteStudent, genKeyPairController}