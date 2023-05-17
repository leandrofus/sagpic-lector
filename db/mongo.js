const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lfuscosagpiccomar:BeJnhERbPcKasHd9@cluster0.k59l0tc.mongodb.net/?retryWrites=true&w=majority";
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
        const cursor = coll.find(data).sort({ name: 1 });
        for await (const doc of cursor) {
            console.log(doc);
            result.push(doc)

        }
    } finally {
        client.close();
        return result
    }
}
async function postDb(db, collection, data) {
    try {
        await client.connect();
        var Db = client.db(db);
        await Db.collection('users').insertOne(
            {
                "name": data.name,
                "email": data.email, 
                "password": data.psw1, 
                "social": [{ "facebook": "", 
                            "instagram": "", 
                            "youtube": "", 
                            "soundcloud": "", 
                            "pinterest": "" ,
                        }], 
                "age":data.age,
                "country": "", 
                "city": "", 
                "type": "viewer", 
                "profile_photo": "",
                "bio": "",
                "books":0, 
                "likes": 0,
                "readers": 0 , 
                "readed": 0 , 
                "following":0,
                "followers":0,
                "featured": false,
            })
    } finally {
        client.close();
    }
}

module.exports = {
    getDb, postDb
}