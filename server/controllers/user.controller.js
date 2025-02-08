import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signing up users
export const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "Missing credentials",
        success: false
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    return res.status(201).json({
      message: "Account created successfully!",
      success: true
    });

  } catch (e) {
    console.error("Register Error:", e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// User login
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing credentials",
        success: false
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
        success: false
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false
      });
    }

    const tokenData = { id: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return res.status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      })
      .json({
        message: "Login successful",
        token,
        user,
        success: true
      });

  } catch (e) {
    console.error("Login Error:", e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// User logout
export const logOut = async (req, res) => {
  try {
    return res.status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({
        message: "Logged out successfully.",
        success: true
      });

  } catch (e) {
    console.error("Logout Error:", e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};


//guest logIn
export const guestLogIn = async (req, res) => {
  try {
    const tokenData = { guest: true }
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res.status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      })
      .json({
        message: "Guest login successful",
        token,
        user: { name: "Guest", email: "guest@example.com" },
        success: true
      });

  }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

