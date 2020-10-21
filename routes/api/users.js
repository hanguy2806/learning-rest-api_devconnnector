const express = require('express');
const router = express.Router();

//@Route    GET api/users/test
//@desc     Test user route
//@access   Public
router.get('/test', (req, res) => res.json({ msg: "Users work" }));
module.exports = router;