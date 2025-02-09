import Event from "../model/event.model.js";
import User from "../model/user.model.js";

export const listingEvent = async (req, res) => {
  try {
    const user = req.user;
    if (user.guest) {
      return res.status(403).json({
        message: "Guest account is not permitted for this action",
        success: false
      })
    }

    const loggedInUser = await User.findById(user.id);
    if (!loggedInUser) {
      return res.status(400).json({
        message: "Invalid user",
        success: false
      })
    }

    const { eventName, eventDescription, startTime, endTime, category, bannerImage } = req.body
    if (!eventName || !eventDescription || !startTime || !endTime || !category) {
      return res.status(400).json({
        message: "Missing event details",
        success: false
      })
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        message: "End time must be after start time",
        success: false
      });
    }

    await Event.create({
      eventName,
      eventDescription,
      startTime,
      endTime,
      category,
      bannerImage,
      host: user.id
    })

    return res.status(200).json({
      message: "Event created",
      success: true
    })
  } catch (e) {
    console.error("Event Creation Error:", e);
    return res.status(500).json({
      message: "Internal server issue",
      success: false,
    });
  }
}


export const updateEvent = async (req, res) => {
  try {
    const user = req.user;
    const eventId = req.params.id
    if (user.guest) {
      return res.status(403).json({
        message: "Guest account is not permitted for this action",
        success: false
      })
    }

    const loggedInUser = await User.findById(user.id);
    if (!loggedInUser) {
      return res.status(400).json({
        message: "Invalid user",
        success: false
      })
    }

    let event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
        success: false
      });
    }
    if (event.host.toString() !== user.id) {
      return res.status(400).json({
        message: "Only host can update",
        success: false
      })
    }
    const { eventName, eventDescription, startTime, endTime, category, bannerImage } = req.body
    event.eventName = eventName
    event.eventDescription = eventDescription
    event.startTime = startTime
    event.endTime = endTime
    event.category = category
    event.bannerImage = bannerImage

    await event.save()
    return res.status(200).json({
      message: "Event updated",
      success: true
    })

  } catch (e) {
    console.error("Event Update Error:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}


export const cancelEvent = async (req, res) => {
  try {
    const eventId = req.params.id
    const user = req.user

    //guest restriction action
    if (user.guest) {
      return res.status(403).json({
        message: "Guest account is not permitted for this action",
        success: false
      })
    }
    //finding and validating user
    const loggedInUser = await User.findById(user.id);
    if (!loggedInUser) {
      return res.status(400).json({
        message: "Invalid user",
        success: false
      })
    }
    //finding and validating event

    let event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Invalid event",
        success: false
      });
    }

    //validating host
    if (event.host.toString() !== user.id) {
      return res.status(403).json({
        message: "Only host can cancel",
        success: false
      })
    }

    if (event.status === "finished") {
      return res.status(400).json({
        message: "Finished events cannot be cancelled",
        success: false
      });
    }
    //cancelling the event
    event.status = "cancelled";
    await event.save();
    return res.status(200).json({
      message: "Event cancelled",
      success: true
    })
  } catch (e) {
    console.error("Event cancellation Error:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}


export const attendEvent = async (req, res) => {
  try {
    const eventId = req.params.id
    const user = req.user

    let event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Invalid event",
        success: false
      });
    }

    if (event.status === "finished") {
      return res.status(400).json({
        message: "Finished event",
        success: false
      });
    }

    if (event.status === "cancelled") {
      return res.status(400).json({
        message: "This event has been cancelled",
        success: false
      });
    }

    if (user.guest) {
      if (!event.guestCount) {
        event.guestCount = 0;
      }
      event.guestCount += 1;
      await event.save();
      return res.status(200).json({
        message: "Enlisted guest user",
        success: true
      })
    }


    const loggedInUser = await User.findById(user.id);
    if (!loggedInUser) {
      return res.status(400).json({
        message: "Invalid user",
        success: false
      })
    }

    if (event.attendees.includes(user.id)) {
      return res.status(400).json({
        message: "User already enlisted",
        success: false
      });
    }

    event.attendees.push(user.id);
    await event.save();
    return res.status(200).json({
      message: "Enlisted user",
      success: false
    })



  }


  catch (e) {
    console.error("Event attendee enlist Error:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    return res.status(200).json({
      events
    });
  }
  catch (e) {
    console.error("Event gathering Error:", e);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}