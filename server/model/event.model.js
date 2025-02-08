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
    ref: "User"
  }],
  category: {
    type: String,
    enum: ["Workshop", "Conference", "Meetup", "Concert", "Webinar"],
    required: true
  },
  bannerImage: {
    type: String
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "cancelled", "finished"],
    default: "upcoming"
  }
}, { timestamps: true })

eventSchema.index({ eventName: 1 })
eventSchema.pre("save", function (next) {
  const now = new Date();

  if (this.status !== "cancelled") {
    if (now < this.startTime) {
      this.status = "upcoming";
    } else if (now >= this.startTime && now <= this.endTime) {
      this.status = "ongoing";
    } else {
      this.status = "finished";
    }
  }

  next();
});

const Event = mongoose.model("Event", eventSchema)

export default Event

