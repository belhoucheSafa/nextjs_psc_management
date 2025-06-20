const Event = require('../models/eventModel');

// Create a new event
// exports.createEvent = async (req, res) => {
//   try {
//     // First handle file upload if it exists
//     let coverPath = null;
//     if (req.file) {
//       coverPath = `/uploads/events/${req.file.filename}`;
//     }

//     // Then handle the rest of the event data
//     const { title, date, location, type, isMandatory, published } = req.body;

//     const event = new Event({
//       title,
//       date: date ? new Date(date) : null,
//       location,
//       type,
//       isMandatory: isMandatory === true || isMandatory === 'true',
//       published: published === true || published === 'true',
//       cover: coverPath // This will be null if no file was uploaded
//     });

//     await event.save();

//     res.status(201).json({
//       success: true,
//       data: event
//     });
//   } catch (err) {
//     console.error('Error creating event:', err);
//     res.status(400).json({
//       success: false,
//       message: err.message || 'Error creating event'
//     });
//   }
// };

exports.createEvent = async (req, res) => {
  try {
    // Multer should have already processed the file and added it to req.file
    // console.log('Uploaded file:', req.file); // Debug log

    const { title, date, location, type, isMandatory, published } = req.body;

    const event = new Event({
      title,
      date: date ? new Date(date) : null,
      location,
      type,
      isMandatory: isMandatory === 'true' || isMandatory === true,
      published: published === 'true' || published === true,
      cover: req.file ? `/uploads/events/${req.file.filename}` : null
    });

    await event.save();

    console.log('Saved event:', event); // Debug log

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Error creating event'
    });
  }
};
// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
