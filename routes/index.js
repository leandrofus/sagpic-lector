var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');
const menuFill = require('./init')().then((res)=>{
  return res
});
router.get('/', async function (req, res, next) {
  res.setHeader('Referrer-Policy',"No-referrer-when-downgrade")
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
    try {
      me[0].books.forEach(e=>{
         ids.push(e)
      })
        var obj_ids = ids.map(function(id) { return new ObjectId(id); });
        console.log(obj_ids);
        var storyMeta = await db.getDb('sagpic_lector','stories',{_id:{$in: obj_ids}})
  
        me[0].lastHistories.forEach((e,i)=>{
          storyMeta[i].progress = {actual:e.actual,total:e.total}
        })
      
        return res.render('layouts/profile',
        {
          title: 'Sagpic - Perfil',
          loggedIn:req.session.user,
          menu:await menuFill,
          user: me,
          profile:true,
          me:true,
          storyMeta: storyMeta,
        },
      );      
    } catch (error) {
    }
    
    res.render('layouts/profile',
      {
        title: 'Sagpic - Perfil',
        loggedIn:req.session.user,
        menu:await menuFill,
        user: me,
        profile:true,
        me:true,
        storyMeta: storyMeta,
      },
    );
  } else {
    return res.redirect('/')
  }
});


router.get('/profile/:user', async function (req, res, _next) {
  if (req.session.user) {
    var user = await db.getDb('sagpic_lector','users',{_id: new ObjectId(req.params.user)})
    if (user.length==0) {
      return res.send('no existe')
    }else{

      await db.addVisit('sagpic_lector','users',{_id: new ObjectId(req.params.user)})
      return res.render('layouts/profile',
      {
        title: 'Sagpic - Perfil',
        loggedIn:req.session.user,
        menu:await menuFill,
        user: user,
      },
      );
    }
  } else {
    return res.redirect('/')
  }
});

router.get('/profile/me/1', async function (req, res, _next) {
  await db.addFollower('sagpic_lector','users',{_id:new ObjectId('6465e7deee97d417a94c09a9'),user:req.session.user.user})
  res.send('ok')

});
module.exports = router;