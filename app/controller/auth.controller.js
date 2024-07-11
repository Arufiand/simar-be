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
        console.log(`division ${division}`);
        console.log(`division body ${req.body.division}`);
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
        res.send({ message: "User was registered successfully!" });
    } catch (error) {
        await t.rollback();
        console.error('Error occurred:', error);
        res.status(500).send({ message: error.message });
    }
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id },
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400, // 24 hours
                });

            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
