var db = require('../db/mongo');
const { ObjectId } = require('mongodb');


var menuFill = {
    genres:'',
    featuredAutors:'', 
  }
module.exports = async function init() {
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
    let a=await getFeaturedAuthors()
    let b =await getGenres()
    return menuFill
}




  
  