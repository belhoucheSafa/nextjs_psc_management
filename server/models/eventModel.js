const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    required: [true, 'Event type is required']
  },
  isMandatory: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  cover: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);
