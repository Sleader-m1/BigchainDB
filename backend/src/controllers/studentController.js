const {db} = require("../models");
const {StatusCodes} = require("http-status-codes");
const {ConflictError, BadRequestError} = require("../errors/errors");

const Student = db.students;
const sequelize = db.sequelize;

const createNewStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const availability = await Student.findByPk(req.body.nic);
        if (!availability) {
            const createdStudent = await Student.create(req.body, {transaction: t});
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

module.exports = {createNewStudent,getStudentDetails,updateStudent,deleteStudent}