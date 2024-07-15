const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const UserDetail = db.user_detail;
const Role = db.role;
const Division = db.division;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        // Check for roles and division first
        const roles = req.body.roles ? await Role.findAll({
            where: {
                name: {
                    [Op.or]: req.body.roles
                }
            },
            transaction: t
        }) : null;

        const division = await Division.findOne({ where: { id: req.body.division }, transaction: t });
        if (!division) {
            throw new Error('Division not found!');
        }

        // Save User to Database
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }, { transaction: t });

        if (roles) {
            await user.setRoles(roles, { transaction: t });
        } else {
            await user.setRoles([1], { transaction: t });
        }

        await UserDetail.create({
            userId: user.id,
            fullName: req.body.fullName,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            divisionID: division.id
        }, { transaction: t });

        await t.commit();
        res.status(201).send({ status: "success", message: "User was registered successfully!" });
    } catch (error) {
        await t.rollback();
        console.error('Error occurred:', error);
        res.status(500).send({ status: "failed",  message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(404).send({status: "failed", message: "User Not found." });
        }

        const user_detail = await UserDetail.findOne({
            where: {
                userId: user.id
            }
        });

        const division_data = await Division.findOne({
            where: {
                id : user_detail.divisionID
            }
        })

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                status: "failed",
                message: "Invalid Password!",
                accessToken: null,
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400 // 24 hours
        });

        const roles = await user.getRoles();
        const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

        res.status(200).send({
            status: "success",
            message : "Login Successfully",
            data : {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user_detail ? user_detail.fullName : null,
                division: user_detail ? division_data.name : null,
                roles: authorities,
                accessToken: token
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

