var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');
const menuFill = require('./init').init()

router.get('/', async function (req, res, next) {
  res.render('layouts/index',
    {
      title: 'Sagpic',
      loggedIn: req.session.user,
      menu:await menuFill,
    },
  );
});

router.get('/profile/me', async function (req, res, _next) {
  if (req.session.user) {
    var me = await db.getDb('sagpic_lector', 'users', { _id: new ObjectId(req.session.user.user) })
    var ids = []
    me[0].lastHistories.forEach(e=>{
       ids.push(e._id)
    })
    obj_ids = ids.map(function(id) { return new ObjectId(id); });
    let stories = await db.getDb('sagpic_lector','stories',{_id:{$in: obj_ids}})
    stories.forEach((e,i)=>{
      me[0].lastHistories[i].more = e
    })
    console.log(me[0].lastHistories[0]);
    res.render('layouts/profile',
      {
        title: 'Sagpic - Perfil',
        loggedIn:req.session.user,
        menu:await menuFill,
        user: me,
        profile:true,
        me:true,
        der: me[0].lastHistories
      },
    );
  } else {
    res.redirect('/')
  }
});


router.get('/profile/:user', async function (req, res, _next) {
  if (req.session.user) {
    user = await db.getDb('sagpic_lector','users',{_id: new ObjectId(req.params.user)})
    await db.addVisit('sagpic_lector','users',{_id: new ObjectId(req.params.user)})
    res.render('layouts/profile',
      {
        title: 'Sagpic - Perfil',
        loggedIn:req.session.user,
        menu:await menuFill,
        user: user,
      },
    );
  } else {
    res.redirect('/')
  }
});

router.get('/profile/me/1', async function (req, res, _next) {
  await db.addFollower('sagpic_lector','users',{_id:new ObjectId('6465e7deee97d417a94c09a9'),user:req.session.user.user})
  res.send('ok')

});
module.exports = router;