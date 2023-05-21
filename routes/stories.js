var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');
const menuFill = require('./init')().then((res)=>{
    return res
  });
  router.get('/s/:story', async function (req, res, _next) {
    let a = await db.getDb('sagpic_lector','stories',{_id:new ObjectId(req.params.story)})
    console.log(a);
res.send(a)
});

router.get('/s/publish/new', async function (req, res, _next) {
  let a = await db.getDb('sagpic_lector','stories')
  res.render('layouts/profile',
  {
    title: 'Sagpic - Perfil',
    loggedIn:req.session.user,
    menu:await menuFill,
    publish:true,
    
    //user: me,
    //profile:true,
    //me:true,
    //storyMeta: storyMeta,
  },
);
});

module.exports = router