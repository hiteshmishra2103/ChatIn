import User from "../models/user.model.js";

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username');
        return res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

const getUserProfile = async (req, res) => {
    try {
        console.log("getUserProfile");
        console.log(req.user);
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ username: user.username });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export { getUsers, getUserProfile };