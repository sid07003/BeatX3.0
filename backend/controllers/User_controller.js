const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

    const result = await createUser(userDoc);
    const userId = result.insertedId;

    // Generate JWT token
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token in HTTP-only cookie
    res.cookie("access_token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/"
    });

    res.status(201).json({ message: "User created and logged in successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout failed" });
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/",
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};