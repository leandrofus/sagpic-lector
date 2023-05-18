var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');
const menuFill = require('./init').init()


  
router.get('/s/:story', async function (req, res, _next) {
    let a = await db.getDb('sagpic_lector','stories',{_id:new ObjectId(req.params.story)})
    console.log(a);
res.send(a)
});

module.exports = router