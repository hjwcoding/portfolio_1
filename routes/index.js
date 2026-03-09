const express = require('express');
const router = express.Router();

// 헬스 체크
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
