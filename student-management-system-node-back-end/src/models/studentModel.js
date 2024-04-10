const studentModel = (sequelize, DataType) => {
    return sequelize.define("student", {
        nic: {
            type: DataType.STRING(10),
            allowNull: false,
            primaryKey: true,
            validate: {
                is: {
                    args: /^\d{9}[Vv]$/,
                    msg: "Invalid student nic number"
                }
            }
        },
        name: {
            type: DataType.STRING(100),
            allowNull: false,
            field: "name",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Name cannot be empty"
                },
                notNull: {
                    args: true,
                    msg: "Name cannot be null"
                },
                is: {
                    args: /^[A-Za-z][A-Za-z ]+$/,
                    msg: "Invalid student name"
                }
            }
        },
        address: {
            type: DataType.STRING(150),
            allowNull: false,
            field: "address",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Address cannot be empty"
                },
                notNull: {
                    args: true,
                    msg: "Address cannot be null"
                },
                is: {
                    args: /[A-Za-z\d][A-Za-z\d-|/# ,.:;\\]+$/,
                    msg: "Invalid student address"
                }
            }
        },
        contact: {
            type: DataType.STRING(11),
            allowNull: false,
            field: "contact",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Contact cannot be empty"
                },
                notNull: {
                    args: true,
                    msg: "Contact cannot be null"
                },
                is: {
                    args: /^\d{3}-\d{7}$/,
                    msg: "Invalid student contact number"
                }
            }
        }
    },{
        timestamps: false
    })
}

module.exports = studentModel;