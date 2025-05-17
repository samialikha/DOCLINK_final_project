import User from '../models/userModel.js';
import jwt from "jsonwebtoken";
import { sendEmail } from '../services/sendMail.js';
import bcrypt from 'bcrypt';

// LOGIN HANDLER
async function handlerUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.render('home', { content: 'Invalid email', flag: 1 });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.render('home', { content: 'Invalid password', flag: 1 });

        const payload = { user };
        const token = jwt.sign(payload, "secretKey");

        res.cookie("userToken", token, { httpOnly: true });
        console.log("userToken", token);

        return res.redirect('/user/dashboard');
    } catch (error) {
        console.error("Login error:", error);
        return res.render('home', { content: 'Something went wrong. Please try again.', flag: 1 });
    }
}

// SIGNUP HANDLER
async function handlerUserSignup(req, res) {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('home', { content: 'User already exists, try a new email.', flag: 1 });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        console.log("Created new user:", newUser.email);

        // Set cookies for notification
        res.cookie('flag', 1, { maxAge: 5000 });
        res.cookie('content', "Successfully Registered!", { maxAge: 5000 });

        // Send email (in try-catch to prevent crash)
        try {
            await sendEmail(
                `${email}, heyyynkit@gmail.com`,
                "You are Signed In",
                `You have successfully registered your account on ${new Date().toLocaleString()}.`
            );
        } catch (emailErr) {
            console.error("❌ Error sending email:", emailErr.message);
        }

        return res.redirect('/');
    } catch (error) {
        console.error("Signup error:", error);
        return res.render('home', { content: 'Signup failed. Please try again.', flag: 1 });
    }
}

export { handlerUserLogin, handlerUserSignup };
