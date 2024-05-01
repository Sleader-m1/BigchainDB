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
        email: {
            type: DataType.STRING(150),
            allowNull: false,
            field: "email",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Email cannot be empty"
                },
                notNull: {
                    args: true,
                    msg: "Email cannot be null"
                },
                is: {
                    args: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
                    msg: "Invalid student email"
                }
            }
        },

        pub_key: {
            type: DataType.STRING(500),
            allowNull: false,
            field: "pub_key",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "pub_key cannot be empty"
                },
                notNull: {
                    args: true,
                    msg: "pub_key cannot be null"
                },
            }
        },


        priv_key: {
            type: DataType.STRING(500),
            allowNull: false,
            field: "priv_key",
            validate: {
                notEmpty: {
                    args: true,
                    msg: "priv_key cannot be empty"
                },
                notNull: {
                    args: true,
                    msg: "priv_key cannot be null"
                },
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