const jwt = require('jsonwebtoken')
const secketKey = 'sss'
const payload = {
    userId:11,
    title:'Cinema 1 ',
}
const token = jwt.sign(payload,secketKey,{
    expiresIn: '1h',
})

// console.log('token',token);

try{
    const decoded = jwt.verify(token,secketKey)
    // console.log('copleted if secret key found');
    // console.log(decoded);
}
catch(error){
    console.log('error!!!',error);
}

const decodeWithoutVerify = jwt.decode(token)
console.log(decodeWithoutVerify);
