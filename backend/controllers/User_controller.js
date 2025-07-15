const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/User_model");

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDoc = {
      email,
      password: hashedPassword,
      lastPlayedSong: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await createUser(userDoc);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};
