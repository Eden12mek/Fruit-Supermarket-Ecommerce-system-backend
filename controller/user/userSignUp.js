const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, firstName, lastName, phoneNumber, role = "GENERAL" } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            throw new Error("User already exists.");
        }

        if (!email || !password || !firstName || !lastName || !phoneNumber) {
            throw new Error("Please provide all required fields");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something went wrong with password hashing");
        }

        // Use role from request or default to GENERAL
        // For employee signup, we'll force ADMIN role
        const payload = {
            ...req.body,
            role: req.body.role || "GENERAL", // Use provided role or default
            password: hashPassword
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created successfully!"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// Separate function for admin employee creation
async function addAdminEmployeeController(req, res) {
    try {
        const { email, password, firstName, lastName, phoneNumber, role } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            throw new Error("User already exists.");
        }

        if (!email || !password || !firstName || !lastName || !phoneNumber) {
            throw new Error("Please provide all required fields");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        const payload = {
            ...req.body,
            role: "GENERAL", // Force ADMIN role
            password: hashPassword
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "Admin employee created successfully!"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = {
    userSignUpController,
    addAdminEmployeeController
};