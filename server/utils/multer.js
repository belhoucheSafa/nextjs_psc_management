const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const typeMap = {
      poster: 'Posters',
      article: 'Articles',
      video: 'Videos'
    };
    const folder = typeMap[req.body.type] || 'Others';
    const uploadPath = path.join('public', 'uploads', 'deliverables', folder);

    fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if missing
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const teamName = req.body.teamName || 'unknown_team';
    const filename = `${req.body.type}_${teamName}${ext}`;
    cb(null, filename);
  }
});

module.exports = multer({ storage });
