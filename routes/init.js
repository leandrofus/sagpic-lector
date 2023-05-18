var db = require('../db/mongo');
const { ObjectId } = require('mongodb');


async function init() {
    var menuFill = {
        genres:'',
        featuredAutors:'', 
      }
    async function getGenres() {
    await db.getDb('sagpic_lector', 'users', { featured: true }).then((result)=>{
        menuFill.featuredAutors = result
        })
    }
    async function getFeaturedAuthors() {
        await db.getDb('sagpic_lector', 'genres').then((result)=>{
        menuFill.genres = result
        })
        
    }
    await getFeaturedAuthors()
    await getGenres()
    return menuFill
}
module.exports = {init}


  
  