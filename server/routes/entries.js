const express = require('express');
const router = express.Router();

// Placeholder for entry-related routes
router.get('/', (req, res) => {
  res.json({ message: 'Entries endpoint' });
});

module.exports = router;
