import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  eventEnlisted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }]
}, { timestamps: true })

userSchema.index({ email: 1 }, {unique: true});

const User = mongoose.model("User", userSchema)
export default User