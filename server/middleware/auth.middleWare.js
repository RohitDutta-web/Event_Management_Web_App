import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({})

export const authMiddleWare = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "Please log in",
        success: false
      })
    }

    const verified = jwt.verify(token, process.env.SECRET_KEY)
    req.user = verified
    next()

  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}