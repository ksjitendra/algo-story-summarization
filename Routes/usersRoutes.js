const { handleDocuments } = require('../Controllers/manageUploadData')
const getResults = require("../Controllers/managePrompts")
const express = require('express');
const router = express.Router();

router.get('/save/docs', handleDocuments);
router.post("/ask/prompt", getResults);


module.exports = router