var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');

router.post('/register', async function (req, res, _next) {
    if (req.body.psw1 === req.body.psw2) {
      let a = await db.getDb('sagpic_lector', 'users', {email:req.body.email})
      if (a.length==0) {
        await db.postDb('sagpic_lector', 'users', req.body)
        var auth = await db.getDb('sagpic_lector', 'users', {email:req.body.email,password:req.body.psw1})
        let user = {
          user: auth[0]._id.toString(),
          profile_photo:auth[0].profile_photo,
          name:auth[0].name,
          type:auth[0].type,
          
        }
        req.session.user = user
        return res.redirect('/profile/me')
      }else{
        return res.send('ya existe');
      }
    } else {
      return res.send('las contraseñas no coinciden')
    }
  });
  
  router.post('/login', async function (req, res, _next) {
    var auth = await db.getDb('sagpic_lector', 'users', req.body)
    if (auth.length > 0){
      let user = {
        user: auth[0]._id.toString(),
        profile_photo:auth[0].profile_photo,
        name:auth[0].name,
        type:auth[0].type,
        
      }
      req.session.user = user
      res.send('http://localhost:3000/profile/me')
  
    } else {
      res.send('Credenciales no validas')
    }
  });
  
  router.get('/logout', async function (req, res, _next) {
    req.session.destroy()
    res.redirect('/')
  })

module.exports = router