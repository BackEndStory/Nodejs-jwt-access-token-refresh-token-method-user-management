const bcrypt = require('bcrypt');
const a = "cn37rqww@@";

async function pass(a){
    const hash =  await bcrypt.hash(a,12);
    console.log(hash);
}

pass(a);