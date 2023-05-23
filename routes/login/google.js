const { OAuth2Client } = require('google-auth-library');
const {Db, getDb} = require('../../db/mongo')

async function success(ticket){
    const payload = await ticket.getPayload();
    console.log(payload);
    const userid = payload['sub'];
    let a = await getDb('sagpic_lector','users',{email:payload['email']}).then(function(res){
        return res
    })
    if (a.length >0) {
        return a
    }        
        return payload
}
async function verify (data) {
    const client = new OAuth2Client(data.clientId);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: data.credential,
            audience: '25742356548-5uidv33d35vkdhms02p8bkp91utf3gmr.apps.googleusercontent.com',
        }, );
        return await success(ticket)
    }

    return  verify().catch(console.error).then(function (res) {
        return res
     })
    
}



module.exports = {
    verify
}