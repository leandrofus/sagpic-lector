const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const schema = require('./schema')

const uri = `mongodb+srv://${process.env['MONGO_USR']}:${process.env['MONGO_PSW']}@${process.env['MONGO_URI']}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function getDb(db, collection, data) {
    var result = []
    try {
        await client.connect();
        const Db = client.db(db);
        const coll = Db.collection(collection);
        const cursor = coll.find(data).sort({ name: 1, author:1, title:1,email:1 });
        for await (const doc of cursor) {
            result.push(doc)

        }
        //await client.close();
        return result
    }
        catch(err){
            console.log(err);
        }
     finally {
    }
}
async function postDb(db, collection, data) {
    try {
        await client.connect();
        var Db = client.db(db);
        switch (collection) {
            case 'users':
                console.log('users');
                await Db.collection(collection).insertOne(
                    {
                        name: data.name,
                        email: data.email, 
                        password: data.psw1, 
                        social: [{ facebook: data.facebook || '', 
                                    instagram: data.instagram || '', 
                                    youtube: data.youtube || '', 
                                    soundcloud: data.soundcloud || '', 
                                    pinterest: data.pinterest  || '',
                                }], 
                        age:data.age,
                        country: data.country || '', 
                        city: data.city || '', 
                        type: data.type || '', 
                        profile_photo: 'https://soe.ukzn.ac.za/wp-content/uploads/2018/04/profile-placeholder.png',
                        bio: data.bio || '',
                        // books:Array(data.book), 
                        // likes: Array(data.links),
                        // readers: Array(data.readers) , 
                        // readed: Array(data.readed) , 
                        // following:Array(data.following),
                        // followers:Array(data.followers),
                        views:Number()||0,
                        featured: Boolean(data.featured) || false,
                    })
                
                break;
        
            default:
                break;
        }
    } finally {
        client.close();
    }
    return
}
async function addFollower(db, collection, data) {
    var result = []
    try {
        await client.connect();
        const Db = client.db(db);
        const coll = Db.collection(collection);
        await Db.collection(collection).updateOne(
            { _id: new ObjectId(data._id) },
            {
                $push:{followers: data.user}
            }
         )
    }catch(err){
        console.log(err);
    } 
    finally {
        console.log(result);
        client.close();
        return result
    }
}
async function addVisit(db, collection, data) {
    var result = []
    try {
        await client.connect();
        const Db = client.db(db);
        const coll = Db.collection(collection);
        await Db.collection(collection).updateOne(
            { _id: new ObjectId(data._id) },
            {
                $inc:{views: 1}
            }
         )
    }catch(err){
        console.log(err);
    } 
    finally {
        client.close();
        return result
    }
}

module.exports = {
    getDb, postDb,addFollower,addVisit,
}