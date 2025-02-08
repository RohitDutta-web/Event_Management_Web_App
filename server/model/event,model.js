import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  category: {
    type: String,
    enum: ["Workshop", "Conference", "Meetup", "Concert", "Webinar"],
    required: true
  },
  bannerImage: {
    type: String
  }
}, { timestamps: true })

eventSchema.index({ eventName: 1 })

const Event = mongoose.model("Event", eventSchema)

export default Event

