var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const session = require('express-session');
const { ObjectId } = require('mongodb');

var genres 
var featuredAutors 
async function init() {
  async function getGenres() {
  await db.getDb('sagpic_lector', 'users', { featured: true }).then((a)=>{
      featuredAutors = a
    })
  }
  async function getFeaturedAuthors() {
    await db.getDb('sagpic_lector', 'genres').then((b)=>{
      genres = b
    })
    
  }
  await getFeaturedAuthors()
  await getGenres()
}
init().then()


router.get('/', async function (req, res, next) {
  res.render('layouts/index',
    {
      title: 'Sagpic',
      loggedIn: req.session.user,
      genresMenu: genres,
      featuredAutors: featuredAutors,

    },
  );
});

router.post('/register', async function (req, res, _next) {
  if (req.body.psw1 === req.body.psw2) {
    await db.postDb('sagpic_lector', 'users', req.body)
    return res.send('ok')
  } else {
    return res.send('las contraseñas no coinciden')
  }
});

router.post('/login', async function (req, res, _next) {
  console.log(req.body);
  var auth = await db.getDb('sagpic_lector', 'users', req.body)
  console.log(auth);
  if (auth.length > 0){
    let user = {
      user: auth[0]._id.toString(),
      profile_photo:auth[0].profile_photo,
      type:auth[0].type,

    }
    req.session.user = user
    console.log(req.session);
    res.send('http://localhost:3000/profile/')

  } else {
    res.send('Credenciales no validas')
  }
});

router.get('/logout', async function (req, res, _next) {
  req.session.destroy()
  res.redirect('/')
})
router.get('/profile/', async function (req, res, _next) {
  if (req.session.user) {
    var users = await db.getDb('sagpic_lector', 'users', { _id: new ObjectId(req.session.user.user) })
    console.log(users);
    res.render('layouts/profile',
      {
        title: 'Sagpic - Perfil',
        loggedIn:req.session.user,
        genresMenu:genres,
        featuredAutors:featuredAutors,
        user: users,
      },
    );
  } else {
    res.redirect('/')
  }
});
router.get('/g/', async function (req, res, _next) {
  res.render('layouts/genres',
    {
      title: 'Sagpic - Buffet de novelas',
      loggedIn:req.session.user,
      genresMenu: genres,
      featuredAutors: featuredAutors,

    },
  );
});

router.get('/g/:genre', async function (req, res, _next) {
  try {

    var genero = req.params.genre
    var stories = await db.getDb('sagpic_lector', 'stories', { genre: genero })
    if (stories.lenght > 0) {
      var chapters = Array(stories[0].chapters).length;

    }
  } catch (error) {
    console.log(error);
    return res.redirect('/')
  }
  res.render('layouts/stories',
    {
      title: 'Sagpic - ' + genero,
      genresMenu: genres,
      featuredAutors: featuredAutors,
      stories: stories,
      genero: genero,
      loggedIn: req.session.user,
      chapters: chapters,
    },
  );
});

router.get('/authors', async function (req, res, _next) {
  let genero = req.params.author
  if (genero == undefined) {
    genero = 'Autores'
  }
  var users = await db.getDb('sagpic_lector', 'users', { type: 'author' })
  console.log(users);
  res.render('layouts/authors',
    {
      title: 'Sagpic - ' + genero,
      galery: true,
      author: genero,
      loggedIn: req.session.user,
      genresMenu: genres,
      featuredAutors: featuredAutors,
      genero: genero,
      user: users,
    },
  );
});

router.get('/author/:author', async function (req, res, _next) {
  let author = req.params.author
  let authorRegex = new RegExp(["^", author, "$"].join(""), "i");
  var stories = await db.getDb('sagpic_lector', 'stories', { author: { $regex: authorRegex } })
  var authorStories = await db.getDb('sagpic_lector', 'users', { author: { $regex: authorRegex } })
  console.log(stories);
  res.render('layouts/authors',
    {
      title: 'Sagpic - ' + author,
      loggedIn: req.session.user,
      genresMenu: genres,
      featuredAutors: featuredAutors,
      stories: stories,
      author: author,
      user: authorStories,

    },
  );
});

module.exports = router;