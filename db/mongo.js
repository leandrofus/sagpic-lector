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
            const cursor = coll.find(data).sort({name:1});
            for await (const doc of cursor){
                result.push(doc)

            }
        } finally {
            client.close();
            return result
        }
    }

module.exports = {
    getDb
}