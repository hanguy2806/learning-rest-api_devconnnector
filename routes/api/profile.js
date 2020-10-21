const express = require('express');
const router = express.Router();

//@Route GET api/profile/test
router.get('/test', (req, res) => res.json({ msg: "Profile work" }));
module.exports = router;