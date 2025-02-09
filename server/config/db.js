import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({})

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log("DB connected"))
      .catch(err => console.log(err))
  }
  catch (e) {
    console.log(e.data.response.message);
    return
  }
}

export default connectToDb;