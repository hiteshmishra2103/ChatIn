import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import generateJWTTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username.toLowerCase();
        if (username.trim().length === 0 || password.trim().length < 8) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const foundUser = await User.findOne({ username });
        if (foundUser) {
            return res.status(201).json({ message: "Username already exists" });
        } else {
            const user = new User({ username: username, password: hashedPassword });
            generateJWTTokenAndSetCookie(user._id, res);
            await user.save();
            return res.status(201).json({ message: "User registered!" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "User reg failed!" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        username = username.toLowerCase();
        if (username.trim().length === 0 || password.trim().length < 8) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(401).json({ message: "Auth failed" });
        } else {
            const passwordMatch = await bcrypt.compare(password, foundUser?.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Auth failed" });
            }
            generateJWTTokenAndSetCookie(foundUser._id, res);
            return res.status(201).json({ _id: foundUser._id, username: foundUser.username });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Login failed!" });
    }
}

export const logout = async (req, res) => {
    try {
        console.log('logout');
        res.clearCookie('jwt', { path: '/' });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default signup;