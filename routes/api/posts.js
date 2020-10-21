const express = require('express');
const router = express.Router();

//@Route GET api/posts/test
router.get('/test', (req, res) => res.json({ msg: "Post work" }));
module.exports = router;