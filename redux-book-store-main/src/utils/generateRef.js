const express = require('express');
const router = express.Router();
const {
  submitNotice,
  getNoticeByRef,
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitNotice);
router.get('/status/:ref', getNoticeByRef); // public view

module.exports = router;
