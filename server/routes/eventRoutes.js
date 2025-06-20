const express = require('express');

const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../utils/eventImageUpload');
// Event routes
router.post('/', upload.single('cover'), eventController.createEvent);

router.post('/upload-cover', upload.single('cover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  res.json({
    success: true,
    url: `/uploads/events/${req.file.filename}`,
    filename: req.file.filename
  });
});
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);
router.put('/:id', upload.single('cover'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
