const { ObjectId } = require("mongodb");

class users {
    constructor(obj) {
        this._id = new ObjectId(obj._id);
        this.name = String(obj.name);
        this.email = String(obj.email);
        this.password = String(obj.password),
        this.social = Array(obj.social)
        this.country = String(obj.country);
        this.city = String(obj.city);
        this.type = String(obj.type);
        this.author = String(obj.author);
        this.profile_photo = String(obj.profile_photo);
        this.bio = String(obj.bio);
        this.books = Number(obj.books);
        this.likes = Number(obj.likes);
        this.readers = Number(obj.readers);
        this.featured = Boolean(obj.featured);
    }

}
class stories {
    constructor(obj) {
        this._id=new ObjectId(obj._id);
        this.title= String(obj.title);
        this.chapters= Array(obj.chapters);
        this.desc=String(obj.desc);
        this.first_pub_at= Date(obj.first_pub_at); 
        this.status= String(obj.status);
        this.img = String(obj.img); 
        this.author= String(obj.author);
        this.genre = String(obj.genre);
        this.likes = Number(obj.likes);
        this.readers=Number(obj.readers) 
        }
    }
class genres{
    constructor(obj){
        this._id = new ObjectId(obj._id),
        this.name = String(obj.name);
        this.description = String(obj.description);
        this.icon = String(obj.icon);
        this.poster = String(obj.poster);
        this.likes = Number(obj.likes);
        this.views = Number(obj.views);
        this.books = Number(obj.books)
    }
}

module.exports = {
    genres,stories,users

}